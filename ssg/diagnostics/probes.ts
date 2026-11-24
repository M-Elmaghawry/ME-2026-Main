import { Suspense, createElement } from 'react';
import { renderReadable } from '../render-readable';

const never = new Promise<void>(() => {});
function Pending(): JSX.Element { throw never; }
function Broken(): JSX.Element { throw new Error('Expected SSR probe failure'); }
export function probe(kind: string) {
  if (kind === 'error') return renderReadable(createElement(Suspense, { fallback: createElement('p', null, 'Loading') }, createElement(Broken)), 'probe-');
  if (kind === 'timeout') return renderReadable(createElement(Suspense, { fallback: createElement('p', null, 'Loading') }, createElement(Pending)), 'probe-', 30);
  if (kind === 'nul') return renderReadable(createElement('p', null, 'bad\0text'), 'probe-');
  return renderReadable(createElement('p', null, 'العربية — English 🏗️ '.repeat(500)), 'probe-');
}
