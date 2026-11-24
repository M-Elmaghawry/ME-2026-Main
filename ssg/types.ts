import type { Language } from '@/lib/language';
import type { PageId } from '@/lib/routes';
import type { RenderSnapshot } from '@/contexts/renderState';

export interface Bootstrap {
  language: Language;
  route: string;
  pageId: PageId;
  base: string;
  siteUrl: string;
  snapshot: RenderSnapshot;
  identifierPrefix: string;
  fallback404: boolean;
}

export interface HydrationEvidence {
  hydrated: boolean;
  recoverableErrors: string[];
  bootstrapError?: string;
  initialMain: Element | null;
  initialH1: Element | null;
  initialIds: string[];
  layoutShifts: { value: number; time: number; recentInput: boolean }[];
}
declare global { interface Window { __SSG_EVIDENCE__: HydrationEvidence } }
