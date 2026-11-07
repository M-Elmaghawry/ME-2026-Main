import { services } from '../data/services';
import { courses } from '../data/courses';
import { projects } from '../data/projects';
import { CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE } from '../config/site';
import type { Language } from './language';

export const DEFAULT_SITE_URL = 'https://elmekawy-bim.com/';
const brand = { ar: 'محمود المكاوي | BIM', en: 'Mahmoud Elmekawy | BIM' };
const pages = {
  '/': { title: { ar: 'استشارات BIM ودورات Revit', en: 'BIM Consulting & Revit Training' }, description: { ar: 'خدمات نمذجة معلومات البناء والتنسيق الهندسي ودورات Revit مع المهندس محمود المكاوي.', en: 'BIM modeling, engineering coordination, and practical Revit training with Mahmoud Elmekawy.' } },
  '/about': { title: { ar: 'عن المهندس محمود المكاوي', en: 'About Mahmoud Elmekawy' }, description: { ar: 'تعرّف على الخبرات المهنية والشهادات والبرامج التدريبية للمهندس محمود المكاوي.', en: 'Explore Mahmoud Elmekawy’s professional experience, credentials, and training programs.' } },
  '/services': { title: { ar: 'الخدمات الهندسية والتدريب', en: 'Engineering & Training Services' }, description: { ar: 'استعرض خدمات BIM والتنسيق والنمذجة والتدريب للأفراد والشركات.', en: 'Explore BIM coordination, modeling, and training services for individuals and companies.' } },
  '/courses': { title: { ar: 'دورات BIM وRevit', en: 'BIM & Revit Courses' }, description: { ar: 'دورات وورش عمل تطبيقية في نمذجة معلومات البناء وRevit الإنشائي.', en: 'Practical courses and workshops in Building Information Modeling and structural Revit.' } },
  '/portfolio': { title: { ar: 'سابقة الأعمال الهندسية', en: 'Engineering Portfolio' }, description: { ar: 'مشروعات BIM وأعمال النمذجة والتنسيق الهندسي في مصر والسعودية.', en: 'BIM projects, modeling, and engineering coordination work in Egypt and Saudi Arabia.' } },
  '/contact': { title: { ar: 'تواصل معنا', en: 'Contact Us' }, description: { ar: `تواصل مع المهندس محمود المكاوي في ${CONTACT_LOCATION.ar} لطلب خدمة أو دورة تدريبية.`, en: `Contact Mahmoud Elmekawy in ${CONTACT_LOCATION.en} about services or training.` } },
  '/privacy-policy': { title: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' }, description: { ar: 'معلومات جمع بيانات التواصل واستخدامها ومقدمي الخدمات وحقوق المستخدم.', en: 'Information about contact data, its use, service providers, and user rights.' } },
  '/terms': { title: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' }, description: { ar: 'شروط استخدام الموقع والخدمات والدورات التدريبية.', en: 'Terms for using this website, consulting services, and training courses.' } },
};

export const seoPaths = [
  ...Object.keys(pages), ...services.map((item) => `/services/${item.id}`),
  ...courses.map((item) => `/courses/${item.id}`), ...projects.map((item) => `/portfolio/${item.id}`),
];

export function normalizeSiteUrl(value: string): string {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.search || url.hash || url.username || url.password) {
    throw new Error('VITE_SITE_URL must be an HTTP(S) site URL without credentials, query or fragment.');
  }
  return url.href.endsWith('/') ? url.href : `${url.href}/`;
}

export function localizedUrl(siteUrl: string, path: string, language: Language): string {
  const url = new URL(path.replace(/^\//, ''), normalizeSiteUrl(siteUrl));
  if (language === 'ar') url.searchParams.set('lang', 'ar');
  return url.href;
}

export function pageMetadata(pathname: string, language: Language, siteUrl = DEFAULT_SITE_URL) {
  const path = pathname.replace(/\/$/, '') || '/';
  const detail = services.find((item) => path === `/services/${item.id}`)
    ?? courses.find((item) => path === `/courses/${item.id}`)
    ?? projects.find((item) => path === `/portfolio/${item.id}`);
  const page = path === '/thank-you' ? {
    title: { ar: 'نتيجة إرسال الرسالة', en: 'Message status' },
    description: { ar: 'نتيجة إرسال رسالتك إلى فريق المكاوي BIM.', en: 'The status of your message to Elmekawy BIM.' },
  } : pages[path as keyof typeof pages];
  const found = !!(page || detail);
  const title = detail?.title[language] ?? page?.title[language] ?? (language === 'ar' ? 'الصفحة غير موجودة' : 'Page not found');
  const description = (detail?.description[language] ?? page?.description[language] ?? title).replace(/<[^>]*>/g, '').slice(0, 200);
  const imagePath = detail && 'image' in detail ? detail.image : '/hero/Mahmoud Elmekawy.jpg';
  return {
    title: `${title} | ${brand[language]}`, description, language, found,
    canonical: localizedUrl(siteUrl, path, language),
    image: new URL(imagePath.replace(/^\//, ''), normalizeSiteUrl(siteUrl)).href,
    alternates: { ar: localizedUrl(siteUrl, path, 'ar'), en: localizedUrl(siteUrl, path, 'en') },
    schema: {
      '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Elmekawy BIM',
      url: normalizeSiteUrl(siteUrl), email: CONTACT_EMAIL, telephone: CONTACT_PHONE,
      image: new URL('hero/Mahmoud Elmekawy.jpg', normalizeSiteUrl(siteUrl)).href,
      address: { '@type': 'PostalAddress', addressLocality: 'Mansoura', addressCountry: 'EG' },
      areaServed: ['EG', 'SA'],
    },
  };
}

export type PageMetadata = ReturnType<typeof pageMetadata>;
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

export function metadataHtml(meta: PageMetadata): string {
  const attr = 'data-page-seo';
  const tag = (key: 'name' | 'property', name: string, value: string) => `<meta ${attr} ${key}="${name}" content="${escapeHtml(value)}" />`;
  return [
    `<title ${attr}>${escapeHtml(meta.title)}</title>`,
    tag('name', 'description', meta.description), tag('name', 'robots', meta.found ? 'index,follow' : 'noindex,follow'),
    ...Object.entries({ title: meta.title, description: meta.description, type: 'website', url: meta.canonical, image: meta.image, locale: meta.language === 'ar' ? 'ar_EG' : 'en_US' }).map(([key, value]) => tag('property', `og:${key}`, value)),
    tag('name', 'twitter:card', 'summary_large_image'), tag('name', 'twitter:title', meta.title),
    tag('name', 'twitter:description', meta.description), tag('name', 'twitter:image', meta.image),
    `<link ${attr} rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    ...Object.entries({ ...meta.alternates, 'x-default': meta.alternates.en }).map(([lang, url]) => `<link ${attr} rel="alternate" hreflang="${lang}" href="${escapeHtml(url)}" />`),
    `<script ${attr} type="application/ld+json">${JSON.stringify(meta.schema).replace(/</g, '\\u003c')}</script>`,
  ].join('\n');
}

export function sitemapXml(siteUrl: string): string {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + seoPaths.map((path) => {
    const en = escapeHtml(localizedUrl(siteUrl, path, 'en'));
    const ar = escapeHtml(localizedUrl(siteUrl, path, 'ar'));
    return `<url><loc>${en}</loc><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="ar" href="${ar}"/><xhtml:link rel="alternate" hreflang="x-default" href="${en}"/></url>\n` +
      `<url><loc>${ar}</loc><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="ar" href="${ar}"/><xhtml:link rel="alternate" hreflang="x-default" href="${en}"/></url>`;
  }).join('\n') + '\n</urlset>\n';
}
