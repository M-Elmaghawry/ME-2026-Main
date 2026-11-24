import { createContext, useContext } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { Language } from '@/lib/language';

export interface RenderSnapshot {
  renderedAt: number;
  year: string;
  dates: Record<Language, string>;
}
export const RenderState = createContext<{ snapshot?: RenderSnapshot; hydrating: boolean; complete: () => void }>({ hydrating: false, complete: () => {} });
export const useRenderState = () => useContext(RenderState);
export function useRenderTime() { return useRenderState().snapshot?.renderedAt ?? Date.now(); }
export function useRenderYear() { return useRenderState().snapshot?.year ?? new Date().getFullYear(); }
export function useRenderDate(language: Language) {
  const { snapshot } = useRenderState();
  return snapshot?.dates[language] ?? new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
export function useHydrationSafeReducedMotion() {
  const { hydrating } = useRenderState();
  const preference = useReducedMotion();
  return hydrating ? null : preference;
}
// History state is browser-only. Adopt it after the server tree has hydrated.
export function useHydrationLocationState<T>() {
  const { state } = useLocation();
  return useRenderState().hydrating ? null : state as T | null;
}
