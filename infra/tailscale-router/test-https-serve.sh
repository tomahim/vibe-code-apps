#!/usr/bin/env bash
# Local forwarding/security tests. Stub Tailscale and wrapper socat are PATH-
# isolated here; production code has no configurable binary/socket bypass.
set -eu
cd "$(dirname "$0")"
T=$(mktemp -d)
REAL_SOCAT=$(command -v socat); REAL_TIMEOUT=$(command -v timeout)
export REAL_SOCAT REAL_TIMEOUT TEST_DIR="$T"
mkdir "$T/bin" "$T/www"
stop_children() {
  local pid
  for pid in $(jobs -pr); do
    kill "$pid" 2>/dev/null || true
    wait "$pid" 2>/dev/null || true
  done
}
cleanup() { stop_children; rm -rf "$T"; }
trap cleanup EXIT
cat > "$T/bin/tailscale" <<'STUB'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$TEST_DIR/ts.log"
if [[ "$*" == *'serve reset'* ]]; then
  [ "${TS_TEST_MODE:-ok}" = reset-fail ] && exit 1
else
  [ "${TS_TEST_MODE:-ok}" = serve-fail ] && exit 1
  [ "${TS_TEST_MODE:-ok}" = hang ] && { sleep 30; exit 0; }
fi
exit 0
STUB
cat > "$T/bin/socat" <<'STUB'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$TEST_DIR/socat.log"
[ "$1" = 'TCP-LISTEN:18080,bind=127.0.0.1,fork,reuseaddr' ] || exit 2
[ "$2" = 'TCP4:ui.railway.internal:8080' ] || exit 3
exec "$REAL_SOCAT" "$1" TCP4:127.0.0.1:18999
STUB
cat > "$T/bin/timeout" <<'STUB'
#!/usr/bin/env bash
[ "$1" = 20 ] || exit 2
shift
exec "$REAL_TIMEOUT" 2 "$@"
STUB
chmod +x "$T/bin/"*
export PATH="$T/bin:$PATH"
. ./https-serve.sh
: > "$T/ts.log"; : > "$T/socat.log"
unset TS_HTTPS_SERVICES
https_serve_setup
[ "$(cat "$T/ts.log")" = '--socket=/var/run/tailscale/tailscaled.sock serve reset' ]
[ ! -s "$T/socat.log" ]
echo 'PASS empty config resets only, starts no forwarder'

for bad in '443=api.railway.internal:8000' '443=ui.railway.internal:8080,nodelay' '443=evil.example:8080' '65536=ui.railway.internal:8080' '443=ui.railway.internal:8080;8443=ui.railway.internal:8080' ' 443=ui.railway.internal:8080' '0443=ui.railway.internal:8080' '443=127.0.0.1:8080'; do
  : > "$T/ts.log"; : > "$T/socat.log"
  export TS_HTTPS_SERVICES="$bad"
  if https_serve_setup 2>"$T/err.log"; then echo "FAIL accepted invalid config"; exit 1; fi
  [ ! -s "$T/ts.log" ] && [ ! -s "$T/socat.log" ]
done
echo 'PASS rejected extra backend/host/options/ports/mappings/whitespace before any mutation'

export TS_HTTPS_SERVICES='443=ui.railway.internal:8080' TS_TEST_MODE=reset-fail
: > "$T/ts.log"; : > "$T/socat.log"
if https_serve_setup 2>"$T/err.log"; then echo 'FAIL reset failure accepted'; exit 1; fi
[ ! -s "$T/socat.log" ]
[ "$(wc -l < "$T/ts.log")" = 1 ]
https_serve_safe 2>"$T/err.log"
echo 'PASS reset failure starts no forwarder/listener and does not stop subnet wrapper'

echo hello > "$T/www/index.html"
(cd "$T/www" && exec python3 -m http.server 18999 --bind 127.0.0.1 >"$T/http.log" 2>&1) &
HP=$!
export TS_TEST_MODE=ok
: > "$T/ts.log"; : > "$T/socat.log"
https_serve_setup
for _ in {1..30}; do
  answer=$(curl --max-time 1 -s http://127.0.0.1:18080/index.html || true)
  [ "$answer" = hello ] && break
  sleep 0.1
done
[ "$answer" = hello ]
grep -q -- 'serve --yes --bg --https=443 http://127.0.0.1:18080' "$T/ts.log"
! grep -Eq -- 'funnel|--http=' "$T/ts.log"
[ "$(wc -l < "$T/socat.log")" = 1 ]
echo 'PASS fixed localhost/IPv4 forwarder relays, private HTTPS only, no redirect/Funnel'
stop_children

for mode in serve-fail hang; do
  export TS_TEST_MODE="$mode"
  start=$SECONDS
  if https_serve_setup 2>"$T/err.log"; then echo 'FAIL expected Serve failure'; exit 1; fi
  [ "$((SECONDS - start))" -lt 8 ]
  # The direct function owns and reaps its just-started local forwarder.
  [ -z "$(jobs -pr)" ]
done
echo 'PASS Serve failure and timeout stop/reap the forwarder; both are bounded'
