import json
from unittest.mock import MagicMock, patch

import requests
from django.core.cache import cache
from django.test import SimpleTestCase

from .runner import MAX_OUTPUT_BYTES, RunnerError, run_rust


class RunEndpointTests(SimpleTestCase):
    def setUp(self):
        cache.clear()

    def post(self, data=None, **kwargs):
        return self.client.post('/api/apps/rust/run', json.dumps(data if data is not None else {"code": "fn main() {}", "mode": "run"}), content_type='application/json', **kwargs)

    @patch('apps.rust_learning_path.views.run_rust')
    def test_success_and_test_mode(self, runner):
        runner.return_value = {"success": True, "stdout": "ok", "stderr": ""}
        response = self.post({"code": "fn main() {}", "mode": "test", "url": "https://untrusted.invalid"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), runner.return_value)
        runner.assert_called_once_with(code="fn main() {}", mode="test")

    @patch('apps.rust_learning_path.views.run_rust')
    def test_validation_does_not_contact_upstream(self, runner):
        for data in [[], None, {}, {"code": 3, "mode": "run"}, {"code": " ", "mode": "run"}, {"code": "x", "mode": []}, {"code": "x", "mode": "release"}, {"code": "\ud800", "mode": "run"}]:
            response = self.client.post('/api/apps/rust/run', json.dumps(data), content_type='application/json')
            self.assertEqual(response.status_code, 400)
        self.assertEqual(self.client.get('/api/apps/rust/run').status_code, 405)
        self.assertEqual(self.client.post('/api/apps/rust/run', 'code', content_type='text/plain').status_code, 415)
        self.assertEqual(self.client.post('/api/apps/rust/run', '{', content_type='application/json').status_code, 400)
        self.assertEqual(self.post(HTTP_SEC_FETCH_SITE='cross-site').status_code, 403)
        self.assertEqual(self.post({"code": "é" * 8193, "mode": "run"}).status_code, 413)
        self.assertEqual(self.post({"code": "x" * 33000, "mode": "run"}).status_code, 413)
        runner.assert_not_called()

    @patch('apps.rust_learning_path.views.run_rust')
    def test_peer_rate_limit_ignores_forwarded_ip(self, runner):
        runner.return_value = {"success": True, "stdout": "", "stderr": ""}
        for n in range(12):
            self.assertEqual(self.post(HTTP_X_FORWARDED_FOR=f'198.51.100.{n}').status_code, 200)
        response = self.post()
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response['Retry-After'], '60')
        self.assertEqual(runner.call_count, 12)

    @patch('apps.rust_learning_path.views.run_rust')
    def test_global_rate_limit(self, runner):
        runner.return_value = {"success": True, "stdout": "", "stderr": ""}
        for n in range(60):
            self.assertEqual(self.post(REMOTE_ADDR=f'198.51.100.{n}').status_code, 200)
        self.assertEqual(self.post(REMOTE_ADDR='198.51.100.61').status_code, 429)

    @patch('apps.rust_learning_path.views.run_rust', side_effect=RunnerError('Timed out', 504))
    def test_upstream_error_is_json(self, runner):
        response = self.post()
        self.assertEqual(response.status_code, 504)
        self.assertEqual(response.json(), {"error": "Timed out"})


class PlaygroundTests(SimpleTestCase):
    def setUp(self):
        cache.clear()

    def response(self, data=None, status=200):
        response = MagicMock()
        response.__enter__.return_value = response
        response.status_code = status
        response.iter_content.return_value = [json.dumps(data or {"success": True, "stdout": "hello", "stderr": ""}).encode()]
        return response

    @patch('apps.rust_learning_path.runner.requests.post')
    def test_contract_and_cache_keys(self, post):
        post.return_value = self.response()
        first = run_rust(code='fn main() {}', mode='run')
        self.assertEqual(run_rust(code='fn main() {}', mode='run'), first)
        self.assertEqual(post.call_count, 1)
        payload = post.call_args.kwargs['json']
        self.assertEqual((payload['edition'], payload['channel'], payload['mode'], payload['tests']), ('2021', 'stable', 'debug', False))
        self.assertEqual(post.call_args.kwargs['timeout'], (2, 8))
        run_rust(code='fn main() {}', mode='test')
        self.assertTrue(post.call_args.kwargs['json']['tests'])
        self.assertEqual(post.call_count, 2)

    @patch('apps.rust_learning_path.runner.requests.post')
    def test_compiler_failure_is_a_valid_result(self, post):
        post.return_value = self.response({"success": False, "stdout": "", "stderr": "error[E0382]"})
        self.assertFalse(run_rust(code='bad', mode='run')['success'])

    @patch('apps.rust_learning_path.runner.requests.post')
    def test_upstream_failures_and_output_cap_release_lock(self, post):
        for failure, expected in [(requests.Timeout(), 504), (requests.ConnectionError(), 502), (ValueError(), 502)]:
            post.side_effect = failure
            with self.assertRaises(RunnerError) as raised:
                run_rust(code='bad', mode='run')
            self.assertEqual(raised.exception.status, expected)
            self.assertIsNone(cache.get('rust:running'))
        post.side_effect = None
        for data in [{"success": 'yes'}, [1], {"success": True, "stdout": None, "stderr": ''}]:
            post.return_value = self.response(data)
            with self.assertRaises(RunnerError):
                run_rust(code='bad', mode='run')
        post.return_value = self.response(status=429)
        with self.assertRaises(RunnerError) as raised:
            run_rust(code='bad', mode='run')
        self.assertEqual(raised.exception.status, 429)
        post.return_value = self.response()
        post.return_value.iter_content.return_value = [b'x' * (MAX_OUTPUT_BYTES + 1)]
        with self.assertRaises(RunnerError) as raised:
            run_rust(code='bad', mode='run')
        self.assertEqual(raised.exception.status, 502)

    @patch('apps.rust_learning_path.runner.requests.post')
    def test_busy_runner_makes_no_upstream_call(self, post):
        cache.set('rust:running', True)
        with self.assertRaises(RunnerError) as raised:
            run_rust(code='bad', mode='run')
        self.assertEqual(raised.exception.status, 429)
        post.assert_not_called()

    @patch('apps.rust_learning_path.runner.time.monotonic', side_effect=[0, 11])
    @patch('apps.rust_learning_path.runner.requests.post')
    def test_elapsed_timeout_releases_lock(self, post, clock):
        post.return_value = self.response()
        with self.assertRaises(RunnerError) as raised:
            run_rust(code='slow', mode='run')
        self.assertEqual(raised.exception.status, 504)
        self.assertIsNone(cache.get('rust:running'))
