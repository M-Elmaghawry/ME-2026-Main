import { useCallback, useState, type ReactNode } from 'react';
import { RenderState, type RenderSnapshot } from './renderState';

export default function RenderProvider({ snapshot, children }: { snapshot: RenderSnapshot; children: ReactNode }) {
  const [hydrating, setHydrating] = useState(true);
  const complete = useCallback(() => setHydrating(false), []);
  return <RenderState.Provider value={{ snapshot, hydrating, complete }}>{children}</RenderState.Provider>;
}
