import { useCallback, useState, type ReactNode } from 'react';
import { RenderPhase } from './render-phase';

export default function RenderPhaseProvider({ children }: { children: ReactNode }) {
  const [hydrating, setHydrating] = useState(true);
  const complete = useCallback(() => {
    setHydrating(false);
    window.__POC_EVIDENCE__.hydrated = true;
  }, []);
  return <RenderPhase.Provider value={{ hydrating, complete }}>{children}</RenderPhase.Provider>;
}
