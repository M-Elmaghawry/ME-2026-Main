import { createContext, useContext } from 'react';
import { useReducedMotion } from 'framer-motion';

export const RenderPhase = createContext({ hydrating: true, complete: () => {} });

export function useHydrationSafeReducedMotion() {
  const { hydrating } = useContext(RenderPhase);
  const preference = useReducedMotion();
  // Static HTML cannot know a visitor's media preference. Match the server's
  // first render, then adopt the real preference. CSS covers reduced motion
  // immediately, including before JavaScript executes.
  return hydrating ? null : preference;
}
