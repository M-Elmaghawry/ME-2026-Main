// React 18 exports this documented package subpath, but its installed type
// package only declares the Node-default server entry. Describe the Web API.
declare module 'react-dom/server.browser' {
  import type { ReactNode } from 'react';
  import type { RenderToReadableStreamOptions } from 'react-dom/server';
  export function renderToReadableStream(node: ReactNode, options?: RenderToReadableStreamOptions): Promise<ReadableStream<Uint8Array> & { allReady: Promise<void> }>;
}
