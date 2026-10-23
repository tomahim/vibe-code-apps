"""The only upstream-specific part of the Rust runner. Never execute code locally."""
import hashlib
import json
import time

import requests
from django.core.cache import cache

PLAYGROUND_URL = "https://play.rust-lang.org/execute"
MAX_OUTPUT_BYTES = 256 * 1024


class RunnerError(Exception):
    def __init__(self, message, status=503):
        super().__init__(message)
        self.status = status


def run_rust(*, code, mode):
    payload = {
        "channel": "stable", "edition": "2021", "mode": "debug",
        "crateType": "bin", "tests": mode == "test", "backtrace": False, "code": code,
    }
    key = "rust:result:" + hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    cached = cache.get(key)
    if cached is not None:
        return cached
    # A conservative per-cache concurrency cap also protects the public Playground.
    if not cache.add("rust:running", True, timeout=15):
        raise RunnerError("The Rust runner is busy. Please try again in a few seconds.", 429)
    try:
        started = time.monotonic()
        with requests.post(PLAYGROUND_URL, json=payload, timeout=(2, 8), stream=True) as response:
            if response.status_code == 429:
                raise RunnerError("Rust Playground is busy. Please wait a minute and try again.", 429)
            response.raise_for_status()
            chunks = bytearray()
            for chunk in response.iter_content(chunk_size=8192):
                chunks.extend(chunk)
                if time.monotonic() - started > 10:
                    raise RunnerError("The Rust run timed out. Try a smaller program or check for an endless loop.", 504)
                if len(chunks) > MAX_OUTPUT_BYTES:
                    raise RunnerError("Compiler output was too large. Reduce how much the program prints.", 502)
            result = json.loads(chunks)
        if (not isinstance(result, dict) or type(result.get("success")) is not bool
                or not all(isinstance(result.get(field), str) for field in ("stdout", "stderr"))):
            raise ValueError("Invalid runner result")
        result = {field: result[field] for field in ("success", "stdout", "stderr")}
        cache.set(key, result, timeout=300)
        return result
    except requests.Timeout as exc:
        raise RunnerError("The Rust run timed out. Try again or check for an endless loop.", 504) from exc
    except (requests.RequestException, ValueError) as exc:
        raise RunnerError("Rust Playground is unavailable. Your code is still here; please try again.", 502) from exc
    finally:
        cache.delete("rust:running")
