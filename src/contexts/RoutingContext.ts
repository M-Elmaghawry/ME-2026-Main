import { createContext, useContext } from 'react';
import type { Language } from '@/lib/language';
import type { UrlMode } from '@/lib/urls';

export const RoutingContext = createContext<{ mode: UrlMode; base: string; language?: Language; siteUrl?: string; fallback404?: boolean }>({ mode: 'query', base: '/' });
export const useRouting = () => useContext(RoutingContext);
