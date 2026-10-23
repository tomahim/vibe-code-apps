import hashlib
import json
import time

from django.core.cache import cache
from django.core.exceptions import RequestDataTooBig
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .runner import RunnerError, run_rust

MAX_CODE_BYTES = 16 * 1024
MAX_BODY_BYTES = 32 * 1024


def within_limit(key, limit):
    key = f"rust:rate:{key}:{int(time.time() // 60)}"
    if cache.add(key, 1, timeout=65):
        return True
    try:
        return cache.incr(key) <= limit
    except ValueError:
        return False


# Anonymous, stateless execution: no cookie/session authority. JSON-only, no CORS,
# and cross-site browser requests are rejected. Limits apply even to cached runs.
@csrf_exempt
@require_POST
def run(request):
    if request.headers.get("Sec-Fetch-Site") == "cross-site":
        return JsonResponse({"error": "Run Rust from this app."}, status=403)
    if request.content_type != "application/json":
        return JsonResponse({"error": "Use application/json."}, status=415)
    try:
        if int(request.META.get("CONTENT_LENGTH") or 0) > MAX_BODY_BYTES:
            raise RequestDataTooBig()
        body = request.body
        if len(body) > MAX_BODY_BYTES:
            raise RequestDataTooBig()
        data = json.loads(body)
    except RequestDataTooBig:
        return JsonResponse({"error": "The request is too large (32 KiB maximum)."}, status=413)
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({"error": "Send a valid JSON object."}, status=400)
    if not isinstance(data, dict) or not isinstance(data.get("code"), str) or not data["code"].strip():
        return JsonResponse({"error": "Provide non-empty Rust code."}, status=400)
    try:
        code_bytes = data["code"].encode("utf-8")
    except UnicodeEncodeError:
        return JsonResponse({"error": "Code must be valid UTF-8 text."}, status=400)
    if len(code_bytes) > MAX_CODE_BYTES:
        return JsonResponse({"error": "Code is limited to 16 KiB."}, status=413)
    if data.get("mode") not in ("run", "test"):
        return JsonResponse({"error": "Mode must be run or test."}, status=400)
    # Do not trust caller-supplied X-Forwarded-For. Behind a proxy, its clients
    # share this budget; the global budget remains effective in either case.
    peer = hashlib.sha256(request.META.get("REMOTE_ADDR", "unknown").encode()).hexdigest()
    if not within_limit(peer, 12) or not within_limit("global", 60):
        response = JsonResponse({"error": "Too many runs. Wait a minute before trying again."}, status=429)
        response["Retry-After"] = "60"
        return response
    try:
        return JsonResponse(run_rust(code=data["code"], mode=data["mode"]))
    except RunnerError as exc:
        response = JsonResponse({"error": str(exc)}, status=exc.status)
        if exc.status == 429:
            response["Retry-After"] = "60"
        return response
