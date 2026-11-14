"""Keep secrets out of the bot's log output.

Two layers:

1. httpx logs every request URL at INFO level, and Telegram Bot API URLs
   embed the bot token (https://api.telegram.org/bot<token>/<method>), so
   each long-poll cycle wrote the token into the hosting platform's logs.
   The httpx/httpcore loggers are pinned to WARNING, which silences those
   per-request lines while keeping genuine warnings.

2. A logging filter rewrites any record that still contains a configured
   secret - including rendered exception tracebacks, where an HTTP client
   error can carry its request URL - so a future code path cannot leak the
   token through a different logger.

No third-party imports: the bot's Dockerfile copies this module next to
main.py and the tests run with the standard library alone.
"""

from __future__ import annotations

import logging
import traceback
from collections.abc import Iterable

REDACTED = "***redacted***"


class SecretRedactingFilter(logging.Filter):
    """Rewrite log records so configured secrets never reach the log stream."""

    def __init__(self, secrets: Iterable[str]) -> None:
        super().__init__()
        self._secrets = [secret for secret in secrets if secret]

    def _redact(self, text: str) -> str:
        for secret in self._secrets:
            text = text.replace(secret, REDACTED)
        return text

    def filter(self, record: logging.LogRecord) -> bool:
        message = record.getMessage()
        redacted = self._redact(message)
        if redacted != message:
            record.msg = redacted
            record.args = ()
        if record.exc_info and record.exc_info[1] is not None:
            rendered = "".join(traceback.format_exception(*record.exc_info))
            redacted_exc = self._redact(rendered)
            if redacted_exc != rendered:
                record.exc_text = redacted_exc.rstrip("\n")
                record.exc_info = None
        return True


def install_log_secret_redaction(*secrets: str) -> None:
    """Silence per-request URL logging and redact the given secrets from logs."""
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    redaction = SecretRedactingFilter(secrets)
    for handler in logging.getLogger().handlers:
        handler.addFilter(redaction)
