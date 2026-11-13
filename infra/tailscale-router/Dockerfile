# Vendored from dotlouis/tailscale-rw; provenance and local security changes are
# documented in UPSTREAM.md. Pins match the reviewed production client version.
# Tailscale subnet-router node for a Railway project.
# Joins the tailnet (userspace networking — Railway has no /dev/net/tun) and
# advertises the environment's private IPv6 network, so tailnet devices reach
# every service at <name>.railway.internal with no public exposure.
FROM debian:bookworm-slim@sha256:734a72b3d6142a71993b4bc580ca01d8ca687f77a2c422d96a961d3376b179bc

ARG TAILSCALE_VERSION=1.104.1
ARG COREDNS_VERSION=1.15.0
ARG TAILSCALE_SHA256=108d1d96ecf410d305571e173516f27038f870919a9b89c914a167c6d33a4528
ARG COREDNS_SHA256=2495c5b8f3fab6d0a336c397f1227b75406d86e6ec7125744a29df9e936ab8cd

# iproute2: start.sh reads the route table to detect the private subnets.
# socat: only used when TS_HTTPS_SERVICES is set (local forwarders for tailscale serve).
# coredns: only used when TS_DNS_ALIAS_SUFFIX is set (DNS suffix aliasing).
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates iproute2 socat \
 && curl -fsSL "https://pkgs.tailscale.com/stable/tailscale_${TAILSCALE_VERSION}_amd64.tgz" -o /tmp/tailscale.tgz \
 && echo "${TAILSCALE_SHA256}  /tmp/tailscale.tgz" | sha256sum -c - \
 && tar -xzf /tmp/tailscale.tgz --strip-components=1 -C /usr/local/bin \
      "tailscale_${TAILSCALE_VERSION}_amd64/tailscale" \
      "tailscale_${TAILSCALE_VERSION}_amd64/tailscaled" \
 && curl -fsSL "https://github.com/coredns/coredns/releases/download/v${COREDNS_VERSION}/coredns_${COREDNS_VERSION}_linux_amd64.tgz" -o /tmp/coredns.tgz \
 && echo "${COREDNS_SHA256}  /tmp/coredns.tgz" | sha256sum -c - \
 && tar -xzf /tmp/coredns.tgz -C /usr/local/bin coredns \
 && rm -rf /var/lib/apt/lists/* /tmp/tailscale.tgz /tmp/coredns.tgz

WORKDIR /app
COPY start.sh https-serve.sh ./
RUN chmod +x start.sh https-serve.sh

CMD ["./start.sh"]
