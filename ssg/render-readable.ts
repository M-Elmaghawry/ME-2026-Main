import type { ReactNode } from 'react';
import { renderToReadableStream } from 'react-dom/server.browser';

// Only the build-time candidate uses this Web Streams entry. Node 22+ supplies
// Web Streams, AbortController and TextDecoder; no runtime/polyfill is shipped.
export async function renderReadable(tree: ReactNode, identifierPrefix: string, timeoutMs = 15000): Promise<string> {
  const controller = new AbortController();
  const errors: unknown[] = [];
  const timeout = setTimeout(() => controller.abort(new Error('SSR completion timeout')), timeoutMs);
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  try {
    const stream = await renderToReadableStream(tree, {
      identifierPrefix, signal: controller.signal,
      onError(error) { errors.push(error); },
    });
    // Static files must contain completed Suspense content, never a shell.
    await stream.allReady;
    if (errors.length) throw new AggregateError(errors, 'SSR rendering failed');
    reader = stream.getReader();
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const parts: string[] = [];
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value.includes(0)) throw new Error('NUL byte emitted by SSR renderer');
      parts.push(decoder.decode(value, { stream: true }));
    }
    parts.push(decoder.decode());
    if (errors.length) throw new AggregateError(errors, 'SSR rendering failed');
    if (controller.signal.aborted) throw controller.signal.reason;
    return parts.join('');
  } catch (error) {
    // Abort unfinished work. Preserve the failure; never publish partial HTML.
    controller.abort(error);
    if (reader) await reader.cancel(error).catch(() => {});
    throw error;
  } finally { clearTimeout(timeout); reader?.releaseLock(); }
}
