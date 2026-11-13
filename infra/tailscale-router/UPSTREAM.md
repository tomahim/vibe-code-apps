# Router provenance and security maintenance

Copied from dotlouis/tailscale-rw. Comparison on 2026-11-13 against upstream
commit [3bb1c89ea08494ec14570f57b7c18cd5d2149364](https://github.com/dotlouis/tailscale-rw/commit/3bb1c89ea08494ec14570f57b7c18cd5d2149364)
showed the same subnet/DNS startup implementation, plus our optional HTTPS
helper. Upstream currently defaults to Tailscale 1.104.2; we retain the verified
production version 1.104.1 for this proposed cutover. This is a compatibility
choice, not a claim that 1.104.1 is the latest or free of vulnerabilities.
Review upstream/Tailscale security advisories before the live switch.

Our changes:
- Fixed vibe-only HTTPS mapping through a localhost IPv4 forwarder.
- Bounded Serve setup/reset, rejection of any other config, no new setup after
  failed reset, and forwarder cleanup on Serve failure.
- Pinned Debian manifest digest, checked SHA256 hashes of Tailscale/CoreDNS
  archives before extraction, and restrictive umask/state directory mode.
- Review-only build/forwarding and real browser music-output tests.

The download hashes in Dockerfile were matched against the vendors' `.sha256`
files and independently calculated from the downloaded bytes on 2026-11-13:
- https://pkgs.tailscale.com/stable/tailscale_1.104.1_amd64.tgz.sha256
- https://github.com/coredns/coredns/releases/download/v1.15.0/coredns_1.15.0_linux_amd64.tgz.sha256

This pins the reviewed bytes; it is not a vendor signature or a guarantee
against a compromise that predates review. A version/build-argument update must
update its reviewed checksum too or the build fails. Debian packages still come
from signed apt repositories; package versions are not frozen. Review changes
and rebuild for security fixes rather than treating pinning as auto-updating.

Switching source stops automatic upstream template updates. Repository
maintainers own reviewing upstream changes, Tailscale/CoreDNS/Debian advisories,
renewing pins, running CI and approving deployment. No automatic update watch is
created here. Decide that ownership before rollout.

The daemon runs as root as in upstream. Serve, the forwarder and subnet routing
share its container and persisted tailnet credentials. New files use umask 077,
and /var/lib/tailscale plus its socket directory use mode 0700, but root processes
in that container can still read the state. Daemon-managed certificates are not
exported by our scripts or written into Terraform; their live cache/file modes
and absence of unintended public/Funnel listeners must be verified during rollout.

Existing upstream traits, not introduced by this helper: root container,
TAILSCALE_AUTHKEY environment/CLI use and broad private route discovery. New
risks from our change: HTTPS parser/forwarder on that gateway, our maintenance
ownership, and a global reset of node Serve/Funnel config. This node must not host
unrelated Serve/Funnel configuration. Reset failure leaves previous rules
uncertain and must be investigated, even though new setup stops.

No app authenticates from Tailscale identity headers in this change. Existing
Django/password/session behavior remains. HTTPS still reaches the whole UI and
its API/admin proxy routes, not only the music page: the TCP443 ACL must be no
broader than the users allowed to access the existing UI. The backend leg remains
HTTP inside Railway's private network, not end-to-end TLS to Django.
