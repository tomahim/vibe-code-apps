"""Actual nginx GET negotiation on vendored engine assets. Docker required."""
from pathlib import Path
import gzip, json, subprocess, tempfile, time, urllib.request, urllib.error
root = Path(__file__).resolve().parents[2]
def run(*args):
    return subprocess.check_output(args, text=True).strip()
with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)
    conf = (root / "nginx/default.conf.template").read_text().replace("${PORT}", "8080").replace("${API_UPSTREAM}", "http://127.0.0.1:9000")
    (tmp / "default.conf").write_text(conf)
    asset = root / "public/supersonic/core/wasm/clockwork-scsynth.wasm"
    raw = asset.read_bytes()
    cid = run("docker", "run", "-d", "--rm", "-p", "127.0.0.1::8080", "-v", f"{tmp}/default.conf:/etc/nginx/conf.d/default.conf:ro", "-v", f"{root}/public:/usr/share/nginx/html:ro", "nginx:stable-alpine")
    try:
        port = json.loads(run("docker", "inspect", cid))[0]["NetworkSettings"]["Ports"]["8080/tcp"][0]["HostPort"]
        base = f"http://127.0.0.1:{port}"
        for i in range(60):
            try:
                urllib.request.urlopen(base + "/health/", timeout=1).close()
                break
            except (OSError, urllib.error.URLError):
                time.sleep(.25)
        url = base + "/supersonic/core/wasm/clockwork-scsynth.wasm"
        with urllib.request.urlopen(urllib.request.Request(url, headers={"Accept-Encoding": "gzip"})) as r:
            zipped = r.read()
            assert r.headers["Content-Encoding"] == "gzip", dict(r.headers)
            assert "Accept-Encoding" in r.headers["Vary"]
            assert r.headers["Content-Type"] == "application/wasm"
            assert gzip.decompress(zipped) == raw
            assert len(zipped) < len(raw) * .6
            print(f"PASS real nginx gzip GET: {len(raw)} -> {len(zipped)} bytes, decoded bytes identical")
        for encoding in ["identity", "gzip;q=0"]:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"Accept-Encoding": encoding})) as r:
                assert not r.headers.get("Content-Encoding")
                assert r.read() == raw
        print("PASS identity and gzip-refused clients receive original WASM")
        with urllib.request.urlopen(urllib.request.Request(url, headers={"Range": "bytes=0-3", "Accept-Encoding": "identity"})) as r:
            assert r.status == 206 and r.read() == bytes.fromhex("0061736d")
        try:
            urllib.request.urlopen(base + "/supersonic/not-found.wasm")
            raise AssertionError("missing assets must be404, not SPA fallback")
        except urllib.error.HTTPError as e:
            assert e.code == 404
        with urllib.request.urlopen(urllib.request.Request(base + "/health/", headers={"Accept-Encoding": "gzip"})) as r:
            assert not r.headers.get("Content-Encoding")
            assert json.load(r) == {"status": "ok"}
        print("PASS ranges, missing asset404 and existing health unchanged")
    finally:
        print(run("docker", "logs", cid))
        print(run("docker", "stop", cid))
