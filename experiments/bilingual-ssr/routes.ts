import { pageMetadata, metadataHtml } from '@/lib/seo';
import type { Language } from '@/lib/language';

export const pages = [
  { id: 'home', module: 'Index', path: '/', pattern: '/', load: () => import('@/pages/Index') },
  { id: 'training', module: 'ServiceDetail', path: '/services/bim-training/', pattern: '/services/:id', load: () => import('@/pages/ServiceDetail') },
  { id: 'course', module: 'CourseDetail', path: '/courses/bim-fundamentals/', pattern: '/courses/:id', load: () => import('@/pages/CourseDetail') },
  { id: 'project', module: 'ProjectDetail', path: '/portfolio/1/', pattern: '/portfolio/:id', load: () => import('@/pages/ProjectDetail') },
  { id: 'contact', module: 'Contact', path: '/contact/', pattern: '/contact', load: () => import('@/pages/Contact') },
] as const;

export interface Bootstrap {
  language: Language;
  route: string;
  pageId: string;
  base: string;
  siteUrl: string;
  renderedAt: number;
  identifierPrefix: string;
}

export function localeBase(base: string, language: Language) {
  return `${base}${language === 'en' ? 'en/' : ''}`;
}

export function pageUrl(siteUrl: string, route: string, language: Language) {
  return new URL(`${language === 'en' ? 'en/' : ''}${route.replace(/^\//, '')}`, siteUrl).href;
}

export function metadata(route: string, language: Language, siteUrl: string) {
  const meta = pageMetadata(route, language, siteUrl);
  return {
    ...meta,
    canonical: pageUrl(siteUrl, route, language),
    alternates: { ar: pageUrl(siteUrl, route, 'ar'), en: pageUrl(siteUrl, route, 'en') },
  };
}

export function headHtml(route: string, language: Language, siteUrl: string) {
  return metadataHtml(metadata(route, language, siteUrl));
}
