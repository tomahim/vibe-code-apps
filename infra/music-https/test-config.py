"""Static safety assertions, not a live tailnet/ACL/certificate test."""
import json
from pathlib import Path
p = Path(__file__).parent
s = json.loads((p / 'serve.json').read_text())
assert s == {
    'TCP': {'443': {'HTTPS': True}},
    'Web': {'${TS_CERT_DOMAIN}:443': {'Handlers': {'/': {'Proxy': 'http://127.0.0.1:18080'}}}},
    'AllowFunnel': {},
}
n = (p / 'nginx.conf').read_text()
assert 'listen 127.0.0.1:18080;' in n
assert n.count('listen ') == 1
assert 'set $backend http://ui.railway.internal:8080;' in n
assert 'proxy_pass $backend;' in n
assert 'proxy_set_header X-Forwarded-Proto https;' in n
t = (p.parent / 'terraform/music_https.tf').read_text()
assert 'default     = false' in t
assert 'resource "railway_service_domain"' not in t
assert 'import {' not in t
print('PASS fixed private Serve config, localhost-only fixed UI backend, disabled Terraform')
