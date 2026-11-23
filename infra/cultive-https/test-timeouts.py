"""Real nginx regression with scaled timeouts and a local upstream only.
Run: python3 test-timeouts.py /path/to/nginx
No live service, credentials or long ten-minute wait.
"""
import http.server
import json
from pathlib import Path
import socket
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request


def port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


class Upstream(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        time.sleep(1.5)
        result = json.dumps({"path": self.path, "host": self.headers.get("Host"),
                             "proto": self.headers.get("X-Forwarded-Proto"),
                             "body": body.decode()}).encode()
        try:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(result)
        except BrokenPipeError:
            pass

    def log_message(self, *args):
        pass


backend = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Upstream)
threading.Thread(target=backend.serve_forever, daemon=True).start()
frontend = port()
nginx = sys.argv[1] if len(sys.argv) > 1 else "nginx"
with tempfile.TemporaryDirectory() as folder:
    root = Path(folder)
    config = (Path(__file__).parent / "nginx.conf").read_text()
    config = config.replace("/run/nginx/nginx.pid", str(root / "nginx.pid"))
    config = config.replace("/dev/stderr", str(root / "error.log"))
    config = config.replace("listen 127.0.0.1:18080;", f"listen 127.0.0.1:{frontend};")
    config = config.replace("http://cultive-dev.railway.internal:8080", f"http://127.0.0.1:{backend.server_port}")
    config = config.replace("proxy_read_timeout 120s;", "proxy_read_timeout 1s;")
    config = config.replace("proxy_read_timeout 600s;", "proxy_read_timeout 3s;")
    config = config.replace("http {", f"http {{\nclient_body_temp_path {root}/body;\nproxy_temp_path {root}/proxy;\nfastcgi_temp_path {root}/fastcgi;\nuwsgi_temp_path {root}/uwsgi;\nscgi_temp_path {root}/scgi;")
    path = root / "nginx.conf"
    path.write_text(config)
    args = [nginx, "-p", folder + "/", "-c", str(path)]
    subprocess.run(args + ["-t"], check=True)
    with open(root / "log", "w") as log:
        process = subprocess.Popen(args + ["-g", "daemon off;"], stdout=log, stderr=log)
        try:
            for _ in range(50):
                try:
                    with socket.create_connection(("127.0.0.1", frontend), timeout=.1):
                        break
                except OSError:
                    time.sleep(.05)
            base = "/api/learning/content-review/change-sets/536bb595-82f0-5a77-88db-1421c75d87d0"
            request = urllib.request.Request(f"http://127.0.0.1:{frontend}{base}/publish-check/?probe=1",
                                            data=b"dry-run", headers={"Host": "cultive.example.ts.net", "X-Forwarded-Proto": "http"})
            with urllib.request.urlopen(request, timeout=5) as response:
                result = json.load(response)
                assert response.status == 200
            assert result == {"path": base + "/publish-check/?probe=1", "body": "dry-run",
                              "host": "cultive.example.ts.net", "proto": "https"}, result
            for route in (base + "/publish/", "/api/auth/me/"):
                try:
                    urllib.request.urlopen(urllib.request.Request(f"http://127.0.0.1:{frontend}{route}", data=b"probe"), timeout=5)
                    raise AssertionError("Normal route unexpectedly used extended timeout")
                except urllib.error.HTTPError as error:
                    assert error.code == 504, error.code
            print("PASS nginx syntax, delayed Publish-check response, preserved forwarding, and unchanged normal-route timeout")
        finally:
            process.terminate()
            process.wait(timeout=5)
            backend.shutdown()
