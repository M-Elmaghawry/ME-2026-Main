import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PageSeo() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  useEffect(() => {
    let disposed = false;
    void import('@/lib/seo').then(({ DEFAULT_SITE_URL, metadataHtml, pageMetadata }) => {
      if (disposed) return;
      const siteUrl = import.meta.env.VITE_SITE_URL || new URL(import.meta.env.BASE_URL, DEFAULT_SITE_URL).href;
      const meta = pageMetadata(pathname, language, siteUrl);
      const template = document.createElement('template');
      template.innerHTML = metadataHtml(meta);
      document.head.querySelectorAll('[data-page-seo]').forEach((element) => element.remove());
      document.head.append(template.content);
    }).catch(() => { /* Keep the server-generated metadata when offline. */ });
    return () => { disposed = true; };
  }, [pathname, language]);
  return null;
}
