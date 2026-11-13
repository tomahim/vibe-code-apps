"""Exercise the built image's nginx relay in an isolated Docker test network.
No Tailscale credentials or Railway requests. Dynamic DNS test uses Docker's
resolver in place of Railway's, with the same fixed backend hostname.
"""
import json
import subprocess as sp
import tempfile
from pathlib import Path
import time
import uuid
name = 'cultive-proxy-' + uuid.uuid4().hex[:8]
front, back = name + '-front', name + '-back'
def run(*args):
    return sp.check_output(['docker', *args], text=True, stderr=sp.STDOUT)
with tempfile.TemporaryDirectory() as t:
    t = Path(t)
    cfg = (Path(__file__).parent / 'nginx.conf').read_text().replace('[fd12::10]', '127.0.0.11')
    (t / 'nginx.conf').write_text(cfg)
    (t / 'server.py').write_text('''from http.server import BaseHTTPRequestHandler, HTTPServer
import json
class H(BaseHTTPRequestHandler):
 def do_POST(self):
  body=self.rfile.read(int(self.headers.get('Content-Length',0)))
  out=json.dumps({'host':self.headers.get('Host'),'proto':self.headers.get('X-Forwarded-Proto'),'path':self.path,'body':body.decode()}).encode()
  self.send_response(200);self.end_headers();self.wfile.write(out)
HTTPServer(('0.0.0.0',8080),H).serve_forever()
''')
    try:
        run('network', 'create', name)
        run('run', '-d', '--name', back, '--network', name, '--network-alias', 'cultive-dev.railway.internal', '-v', f'{t}/server.py:/server.py:ro', 'python:3.12-alpine', 'python', '/server.py')
        run('run', '-d', '--name', front, '--network', name, '-v', f'{t}/nginx.conf:/etc/nginx/nginx.conf:ro', '--entrypoint', 'nginx', 'cultive-https-test', '-g', 'daemon off;')
        for attempt in range(30):
            try:
                result = json.loads(run('exec', front, 'wget', '-qO-', '--header=Host:cultive.example.ts.net', '--header=X-Forwarded-Proto:http', '--post-data=hello cultive', 'http://127.0.0.1:18080/api/probe?x=1'))
                break
            except (sp.CalledProcessError, json.JSONDecodeError):
                if attempt == 29: raise
                time.sleep(0.2)
        assert result == {'host': 'cultive.example.ts.net', 'proto': 'https', 'path': '/api/probe?x=1', 'body': 'hello cultive'}, result
        print('PASS real nginx relay preserves host/path/body and overwrites untrusted scheme')
    finally:
        for c in [front, back]:
            sp.run(['docker','rm','-f',c], check=False, stdout=sp.PIPE, stderr=sp.STDOUT)
        sp.run(['docker','network','rm',name], check=False, stdout=sp.PIPE, stderr=sp.STDOUT)
