#!/bin/sh
# Start a dedicated endpoint only. No subnet-router discovery or mutation.
set -eu
umask 077
# Reject config that could turn this endpoint into a router/exit node, generic
# forward proxy, public ingress, SSH host, or redirect to another tailnet node.
for key in TS_ROUTES TS_EXTRA_ARGS TS_TAILSCALED_EXTRA_ARGS TS_DEST_IP TS_TAILNET_TARGET_IP TS_TAILNET_TARGET_FQDN TS_OUTBOUND_HTTP_PROXY_LISTEN TS_SOCKS5_SERVER TS_CLIENT_ID TS_CLIENT_SECRET TS_ID_TOKEN TS_AUDIENCE; do
    value=$(printenv "$key" || true)
    [ -z "$value" ] || { echo "Forbidden configuration: $key" >&2; exit 1; }
done
[ "${TS_USERSPACE:-}" = true ] && [ "${TS_AUTH_ONCE:-}" = true ] && \
[ "${TS_STATE_DIR:-}" = /var/lib/tailscale ] && \
[ "${TS_SERVE_CONFIG:-}" = /config/serve.json ] && \
[ "${TS_HOSTNAME:-}" = vibe-music-https ] && \
[ "${TS_ACCEPT_DNS:-}" = false ] || { echo 'Fixed endpoint configuration was changed; refusing startup' >&2; exit 1; }
# Initial registration key is deliberately not tracked in Terraform/state.
# The official TS_AUTH_ONCE client then keeps node credentials in the volume.
[ -n "${TS_AUTHKEY:-}" ] || [ -f /var/lib/tailscale/tailscaled.state ] || {
    echo 'New endpoint needs its own scoped Tailscale auth key in Railway' >&2; exit 1;
}
mkdir -p /var/lib/tailscale /var/run/tailscale
chmod 700 /var/lib/tailscale /var/run/tailscale
nginx -t
nginx -g 'daemon off;' &
proxy_pid=$!
/usr/local/bin/containerboot &
ts_pid=$!
cleanup() {
    kill "$proxy_pid" "$ts_pid" 2>/dev/null || true
    wait "$proxy_pid" 2>/dev/null || true
    wait "$ts_pid" 2>/dev/null || true
}
trap 'cleanup; exit 0' INT TERM
# Fail the endpoint if either child exits. The existing router is separate.
while kill -0 "$proxy_pid" 2>/dev/null && kill -0 "$ts_pid" 2>/dev/null; do sleep 2; done
cleanup
exit 1
