import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { I18nextProvider } from 'react-i18next';
import type { i18n } from 'i18next';
import RouteContent from '@/app/RouteContent';
import PageSeo from '@/components/PageSeo';
import ScrollToTop from '@/components/ScrollToTop';
import { LanguageProvider } from '@/contexts/LanguageContext';
import RenderProvider from '@/contexts/RenderProvider';
import { useRenderState } from '@/contexts/renderState';
import { RoutingContext } from '@/contexts/RoutingContext';
import type { Bootstrap } from './types';

function Hydrated() {
  const { complete } = useRenderState();
  useEffect(() => { complete(); window.__SSG_EVIDENCE__.hydrated = true; }, [complete]);
  return null;
}

export default function CandidateApp({ boot, i18n }: { boot: Bootstrap; i18n: i18n }) {
  return <MotionConfig reducedMotion="user"><I18nextProvider i18n={i18n}>
    <RoutingContext.Provider value={{ mode: 'path', base: boot.base, language: boot.language, siteUrl: boot.siteUrl, fallback404: boot.fallback404 }}>
      <RenderProvider snapshot={boot.snapshot}><LanguageProvider>
        <ScrollToTop /><PageSeo />
        <RouteContent fallback404={boot.fallback404}><Hydrated /></RouteContent>
      </LanguageProvider></RenderProvider>
    </RoutingContext.Provider>
  </I18nextProvider></MotionConfig>;
}
