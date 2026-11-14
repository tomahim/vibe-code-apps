# Official client/entrypoint, not a fork of the Railway subnet router.
FROM tailscale/tailscale:v1.104.2@sha256:b11583ad2e93e4671128538c88cf11f460444a5d7e449311dd1933a400ab849d
RUN apk add --no-cache nginx && mkdir -p /run/nginx /config
COPY nginx.conf /etc/nginx/nginx.conf
COPY serve.json /config/serve.json
COPY start.sh /app/start.sh
RUN chmod 755 /app/start.sh
ENV TS_USERSPACE=true TS_STATE_DIR=/var/lib/tailscale TS_AUTH_ONCE=true \
    TS_SERVE_CONFIG=/config/serve.json TS_HOSTNAME=vibe-music-https \
    TS_ACCEPT_DNS=false TS_DEBUG_ALWAYS_USE_DERP=true
ENTRYPOINT ["/app/start.sh"]
