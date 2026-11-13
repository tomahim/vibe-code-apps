#!/usr/bin/env bash
# Optional private HTTPS for services behind the router. Sourced by start.sh
# after the node is on the tailnet. With TS_HTTPS_SERVICES unset it only clears any leftover serve config.
#
#   TS_HTTPS_SERVICES='443=ui.railway.internal:8080'
#
# For each <https-port>=<host>:<port> entry: a socat forwarder listens on
# 127.0.0.1:<18080+index> and relays to <host>:<port> (tailscale serve can only
# proxy to localhost), and `tailscale serve --https=<https-port>` terminates TLS
# with a daemon-managed certificate in front of it.
#
# Safety rules (the router is shared with the plain-HTTP access path):
#  - This never touches routes, DNS, CoreDNS or the plain-HTTP path on :8080.
#    Serve listens only on the router's own tailnet address.
#  - No HTTP-to-HTTPS redirect is configured.
#  - Every failure is logged and swallowed: it must never stop start.sh, and
#    every tailscale call has a timeout (serve blocks when HTTPS certificates
#    are not enabled in the tailnet admin console yet).
#  - Unset or empty TS_HTTPS_SERVICES: only a bounded `tailscale serve reset`
#    (the state is on a volume, so old serve config would otherwise persist).

https_serve_setup() {
  local spec="${TS_HTTPS_SERVICES:-}"
  local tsbin="${TS_HTTPS_TAILSCALE_BIN:-tailscale}"
  local sock="${TS_HTTPS_SOCKET:-/var/run/tailscale/tailscaled.sock}"
  local serve_timeout="${TS_HTTPS_SERVE_TIMEOUT:-20}"
  if [ -z "$spec" ]; then
    # The tailscaled state lives on the router's volume, so a serve config from
    # an earlier boot would survive. Clearing it makes "unset the variable" a
    # real rollback. Bounded, and a no-op when nothing is configured.
    timeout "$serve_timeout" "$tsbin" --socket="$sock" serve reset >/dev/null 2>&1 || echo "https-serve: WARNING: serve reset failed; verify serve status before treating HTTPS as off" >&2
    return 0
  fi

  local base_port="${TS_HTTPS_LOCAL_BASE_PORT:-18080}"
  local idx=0 entry hport target host port lport

  echo "https-serve: configuring from TS_HTTPS_SERVICES"
  timeout "$serve_timeout" "$tsbin" --socket="$sock" serve reset >/dev/null 2>&1 || echo "https-serve: WARNING: serve reset failed; verify serve status before treating HTTPS as off" >&2

  local IFS=';'
  for entry in $spec; do
    IFS=$' \t\n'
    entry="${entry//[[:space:]]/}"
    [ -n "$entry" ] || { IFS=';'; continue; }
    hport="${entry%%=*}"; target="${entry#*=}"
    host="${target%:*}"; port="${target##*:}"
    if ! [[ "$hport" =~ ^[0-9]+$ && "$port" =~ ^[0-9]+$ && -n "$host" && "$entry" == *=* && "$target" == *:* ]]; then
      echo "https-serve: WARNING: skipping invalid entry '${entry}' (want <https-port>=<host>:<port>)" >&2
      IFS=';'; continue
    fi
    lport=$((base_port + idx)); idx=$((idx + 1))
    # fork: one child per connection, host resolved per connection (Railway
    # private addresses change when services restart or wake). Force IPv4 to match
    # the UI's IPv4-only listener and avoid the known Railway IPv6 body stall.
    socat "TCP-LISTEN:${lport},bind=127.0.0.1,fork,reuseaddr" "TCP4:${host}:${port}" &
    echo "https-serve: 127.0.0.1:${lport} -> ${host}:${port}"
    if timeout "$serve_timeout" "$tsbin" --socket="$sock" serve --yes --bg --https="$hport" "http://127.0.0.1:${lport}" >/tmp/https-serve-${hport}.log 2>&1; then
      echo "https-serve: https :${hport} -> 127.0.0.1:${lport}"
    else
      echo "https-serve: WARNING: serve for :${hport} failed or timed out (are HTTPS certificates enabled for the tailnet?):" >&2
      sed 's/^/  /' "/tmp/https-serve-${hport}.log" >&2 || true
    fi
    IFS=';'
  done
  return 0
}

# A bug here must not take the router down.
https_serve_safe() { https_serve_setup || echo "https-serve: WARNING: setup failed, continuing without HTTPS" >&2; return 0; }
