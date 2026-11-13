#!/usr/bin/env bash
# Optional private HTTPS, sourced after the router joins the tailnet.
# Deliberately allow only the reviewed vibe UI mapping. No generic gateway,
# external host, socat address option, alternate port or Cultive mapping.
# Failure must not stop subnet routing. On reset failure old Serve config may
# remain: stop setup, log the problem and verify state before claiming rollback.

https_serve_setup() {
  local spec="${TS_HTTPS_SERVICES:-}"
  local tsbin=tailscale
  local sock=/var/run/tailscale/tailscaled.sock
  local serve_timeout=20

  # Exact comparison rejects separators, whitespace, extra mappings, invalid
  # ports and socat comma-options before doing anything with the config.
  if [ -n "$spec" ] && [ "$spec" != '443=ui.railway.internal:8080' ]; then
    echo 'https-serve: ERROR: rejected config; only 443=ui.railway.internal:8080 is allowed; existing Serve config was not changed' >&2
    return 1
  fi

  # The daemon stores Serve config on the persistent volume. This node must
  # be dedicated to these mappings: reset clears ALL its Serve/Funnel rules.
  # Preflight ownership/status and rollback verification are runbook gates.
  if ! timeout "$serve_timeout" "$tsbin" --socket="$sock" serve reset; then
    echo 'https-serve: ERROR: reset failed; refusing to start forwarding; old Serve/Funnel rules may remain, inspect status' >&2
    return 1
  fi
  [ -n "$spec" ] || return 0

  # Fixed arguments only. Resolve per connection because Railway addresses
  # change on wake/restart. IPv4 matches the UI listener and tested upload path.
  socat 'TCP-LISTEN:18080,bind=127.0.0.1,fork,reuseaddr' 'TCP4:ui.railway.internal:8080' &
  local forwarder_pid=$!
  if timeout "$serve_timeout" "$tsbin" --socket="$sock" serve --yes --bg --https=443 http://127.0.0.1:18080; then
    echo 'https-serve: private HTTPS :443 -> ui.railway.internal:8080'
  else
    echo 'https-serve: ERROR: Serve failed; stopping local forwarder; inspect Serve/Funnel status before retry' >&2
    kill "$forwarder_pid" 2>/dev/null || true
    wait "$forwarder_pid" 2>/dev/null || true
    return 1
  fi
}

https_serve_safe() {
  https_serve_setup || echo 'https-serve: WARNING: setup not completed; subnet routing continues; verify persisted rules' >&2
  return 0
}
