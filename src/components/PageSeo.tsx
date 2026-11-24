import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouting } from '@/contexts/RoutingContext';

export default function PageSeo() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const routing = useRouting();
  const first = useRef(true);
  useEffect(() => {
    // The candidate's initial head already belongs to the hydrated document.
    if (routing.mode === 'path' && first.current) { first.current = false; return; }
    let disposed = false;
    void import('@/lib/seo').then(({ DEFAULT_SITE_URL, metadataHtml, pageMetadata }) => {
      if (disposed) return;
      const siteUrl = routing.siteUrl || import.meta.env.VITE_SITE_URL || new URL(import.meta.env.BASE_URL, DEFAULT_SITE_URL).href;
      const meta = pageMetadata(pathname, language, siteUrl, routing.mode);
      const template = document.createElement('template');
      template.innerHTML = metadataHtml(meta);
      document.head.querySelectorAll('[data-page-seo]').forEach((element) => element.remove());
      document.head.append(template.content);
    }).catch(() => { /* Keep the server-generated metadata when offline. */ });
    return () => { disposed = true; };
  }, [pathname, language, routing]);
  return null;
}
