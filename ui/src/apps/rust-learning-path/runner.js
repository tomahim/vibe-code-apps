// Keep the UI independent of the compiler provider. Only our API is contacted.
export async function runRust({ code, mode, signal }) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  if (signal?.aborted) controller.abort();
  const timer = setTimeout(cancel, 12000);
  try {
    const response = await fetch('/api/apps/rust/run', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mode }), signal: controller.signal,
    });
    let result;
    try { result = await response.json(); } catch { throw new Error('The Rust runner is unavailable. Please try again.'); }
    if (!response.ok) throw new Error(result.error || 'The Rust runner is unavailable. Please try again.');
    if (typeof result.success !== 'boolean' || typeof result.stdout !== 'string' || typeof result.stderr !== 'string') throw new Error('The runner returned an invalid response. Please try again.');
    return result;
  } catch (error) {
    if (controller.signal.aborted) throw new Error('The run timed out or was cancelled. Your code is still here.');
    if (error instanceof TypeError) throw new Error('Could not reach the runner. Check your connection and try again.');
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}
