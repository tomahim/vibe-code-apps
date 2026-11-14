"""Tests for log secret redaction. Standard library only:

    python -m unittest bot.test_log_redaction

Uses an obviously fake token; no real credentials appear in this repo.
"""

from __future__ import annotations

import io
import logging
import unittest

from log_redaction import REDACTED, install_log_secret_redaction

FAKE_TOKEN = "000000:FAKE-TEST-TOKEN-not-real"
FAKE_SECRET = "fake-test-api-secret"


class LogSecretRedactionTest(unittest.TestCase):
    def setUp(self) -> None:
        self.stream = io.StringIO()
        self.handler = logging.StreamHandler(self.stream)
        root = logging.getLogger()
        self.old_handlers = root.handlers[:]
        self.old_level = root.level
        root.handlers = [self.handler]
        root.setLevel(logging.INFO)
        self.old_httpx_level = logging.getLogger("httpx").level

    def tearDown(self) -> None:
        root = logging.getLogger()
        root.handlers = self.old_handlers
        root.setLevel(self.old_level)
        logging.getLogger("httpx").setLevel(self.old_httpx_level)

    def output(self) -> str:
        self.handler.flush()
        return self.stream.getvalue()

    def test_token_in_telegram_request_url_is_redacted(self) -> None:
        install_log_secret_redaction(FAKE_TOKEN, FAKE_SECRET)
        logging.getLogger("recipe_bot").error(
            "Telegram request failed for https://api.telegram.org/bot%s/getUpdates",
            FAKE_TOKEN,
        )
        output = self.output()
        self.assertNotIn(FAKE_TOKEN, output)
        self.assertIn(f"bot{REDACTED}", output)

    def test_api_secret_is_redacted(self) -> None:
        install_log_secret_redaction(FAKE_TOKEN, FAKE_SECRET)
        logging.getLogger("recipe_bot").error("auth failed with secret %s", FAKE_SECRET)
        self.assertNotIn(FAKE_SECRET, self.output())

    def test_secret_inside_exception_traceback_is_redacted(self) -> None:
        install_log_secret_redaction(FAKE_TOKEN, FAKE_SECRET)
        try:
            raise RuntimeError(f"connect to https://api.telegram.org/bot{FAKE_TOKEN}/sendMessage failed")
        except RuntimeError:
            logging.getLogger("recipe_bot").exception("Recipe API request failed")
        output = self.output()
        self.assertNotIn(FAKE_TOKEN, output)
        self.assertIn(REDACTED, output)
        self.assertIn("RuntimeError", output)

    def test_httpx_info_request_lines_are_silenced(self) -> None:
        install_log_secret_redaction(FAKE_TOKEN, FAKE_SECRET)
        logging.getLogger("httpx").info(
            'HTTP Request: GET https://api.telegram.org/bot%s/getUpdates "HTTP/1.1 200 OK"',
            FAKE_TOKEN,
        )
        self.assertEqual(self.output(), "")

    def test_httpx_warnings_still_log_and_are_redacted(self) -> None:
        install_log_secret_redaction(FAKE_TOKEN, FAKE_SECRET)
        logging.getLogger("httpx").warning(
            "retrying https://api.telegram.org/bot%s/getUpdates", FAKE_TOKEN
        )
        output = self.output()
        self.assertIn("retrying", output)
        self.assertNotIn(FAKE_TOKEN, output)

    def test_unrelated_messages_are_untouched(self) -> None:
        install_log_secret_redaction(FAKE_TOKEN, FAKE_SECRET)
        logging.getLogger("recipe_bot").info("Recipe bot started with %d allowed Telegram user(s)", 1)
        self.assertIn("Recipe bot started with 1 allowed Telegram user(s)", self.output())


if __name__ == "__main__":
    unittest.main()
