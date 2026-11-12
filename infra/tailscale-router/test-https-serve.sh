#!/usr/bin/env bash
# Local test of https-serve.sh with a stub tailscale binary (no tailnet needed).
# Run: bash infra/tailscale-router/test-https-serve.sh   (needs socat, python3, curl)
# It proves forwarding, no-op and failure-isolation behavior only. It does not
# prove tailscale serve or certificates work; that needs a live router.
set -u
cd "$(dirname "$0")"
T=$(mktemp -d); fail=0
check() { if [ "$2" = "$3" ]; then echo "ok   $1"; else echo "FAIL $1 (got '$2', want '$3')"; fail=1; fi; }
cat > "$T/ts" <<'STUB'
#!/usr/bin/env bash
echo "$@" >> "$TS_STUB_LOG"
[ "${TS_STUB_MODE:-ok}" = hang ] && sleep 30
[ "${TS_STUB_MODE:-ok}" = fail ] && { echo "Serve is not enabled on your tailnet" >&2; exit 1; }
exit 0
STUB
chmod +x "$T/ts"
mkdir -p "$T/www"; echo hello > "$T/www/index.html"
(cd "$T/www" && python3 -m http.server 18999 --bind 127.0.0.1 >/dev/null 2>&1) & HP=$!
sleep 1
export TS_HTTPS_TAILSCALE_BIN="$T/ts" TS_STUB_LOG="$T/log" TS_HTTPS_SERVE_TIMEOUT=2 TS_HTTPS_LOCAL_BASE_PORT=18700
. ./https-serve.sh

# 1. unset: only a serve reset, no forwarders, no serve listeners
unset TS_HTTPS_SERVICES; : > "$T/log"; https_serve_safe
check "unset only resets serve" "$(cat "$T/log")" "--socket=/var/run/tailscale/tailscaled.sock serve reset"
check "unset starts no forwarder" "$(pgrep -fc 'socat TCP-LISTEN:187')" 0

# 2. two mappings, one invalid
export TS_HTTPS_SERVICES='443=127.0.0.1:18999; 8443=localhost:18999;bogus;x=y:z'
: > "$T/log"; https_serve_safe 2>"$T/err"
check "serve 443"  "$(grep -c -- '--https=443 http://127.0.0.1:18700' "$T/log")" 1
check "serve 8443" "$(grep -c -- '--https=8443 http://127.0.0.1:18701' "$T/log")" 1
check "invalid entries skipped" "$(grep -c 'skipping invalid' "$T/err")" 2
check "no plain http serve / redirect" "$(grep -c -- '--http=' "$T/log")" 0
sleep 1
check "forwarder 1 relays" "$(curl -s http://127.0.0.1:18700/index.html)" hello
check "forwarder 2 relays" "$(curl -s http://127.0.0.1:18701/index.html)" hello
pkill -f 'socat TCP-LISTEN:187' ; sleep 1

# 3. serve fails: function still returns 0
export TS_HTTPS_SERVICES='443=127.0.0.1:18999' TS_STUB_MODE=fail
https_serve_safe 2>/dev/null; check "serve failure is swallowed" "$?" 0
pkill -f 'socat TCP-LISTEN:187' ; sleep 1

# 4. serve hangs: timeout bounds it
export TS_STUB_MODE=hang; s=$(date +%s)
https_serve_safe 2>/dev/null; e=$(( $(date +%s) - s ))
check "hang bounded by timeout (<12s)" "$([ $e -lt 12 ] && echo yes || echo no)" yes
pkill -f 'socat TCP-LISTEN:187'
kill $HP 2>/dev/null; rm -rf "$T"
exit $fail
