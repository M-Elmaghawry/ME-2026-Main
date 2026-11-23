import { lazy, Suspense, useEffect, useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import type { i18n } from 'i18next';
import { MotionConfig } from 'framer-motion';
import ScrollToTop from '@/components/ScrollToTop';
import { LanguageProvider } from './LanguageContext';
import RenderPhaseProvider from './RenderPhaseProvider';
import { RenderPhase } from './render-phase';
import { pages, headHtml, type Bootstrap } from './routes';

const components = new Map(pages.map(page => [page.id, lazy(page.load)]));

function HydrationComplete() {
  const { complete } = useContext(RenderPhase);
  useEffect(complete, [complete]);
  return null;
}

function Head({ boot }: { boot: Bootstrap }) {
  const { pathname } = useLocation();
  useEffect(() => {
    const key = `${boot.language}:${pathname}`;
    if (document.head.dataset.pocPage === key) return;
    const template = document.createElement('template');
    template.innerHTML = headHtml(pathname, boot.language, boot.siteUrl);
    document.head.querySelectorAll('[data-page-seo]').forEach(element => element.remove());
    document.head.append(template.content);
    document.head.dataset.pocPage = key;
  }, [pathname, boot]);
  return null;
}

export default function PrototypeApp({ boot, i18n }: { boot: Bootstrap; i18n: i18n }) {
  return <MotionConfig reducedMotion="user"><I18nextProvider i18n={i18n}><RenderPhaseProvider>
    <LanguageProvider language={boot.language} base={boot.base}>
      <ScrollToTop /><Head boot={boot} />
      <Suspense fallback={<div data-poc-loading="true" role="status" />}>
        <Routes>{pages.map(page => {
          const Component = components.get(page.id)!;
          return <Route key={page.id} path={page.pattern} element={<Component />} />;
        })}</Routes><HydrationComplete />
      </Suspense>
    </LanguageProvider>
  </RenderPhaseProvider></I18nextProvider></MotionConfig>;
}
