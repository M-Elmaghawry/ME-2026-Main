import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';

// Exercise the real router, language provider, links and metadata effects in a
// local DOM. These tests do not contact production or send contact-form data.
const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><head></head><body><div id="root"></div></body></html>', { url: 'https://example.com/ME-2026-Main/', pretendToBeVisual: true });
const globals = { window: dom.window, document: dom.window.document, navigator: dom.window.navigator, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true };
const originals = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });

const React = await import('react');
const { act, createElement: h } = React;
const { createRoot } = await import('react-dom/client');
const { BrowserRouter, Routes, Route, useLocation, useParams, useNavigate: useRouterNavigate } = await import('react-router-dom');
const { createInstance } = await import('i18next');
const { I18nextProvider } = await import('react-i18next');
const i18n = createInstance();
await i18n.init({ lng: 'ar', showSupportNotice: false, resources: { ar: { translation: {} }, en: { translation: {} } }, interpolation: { escapeValue: false } });
const server = await createServer({ configFile: false, base: '/ME-2026-Main/', resolve: { alias: { '@': path.resolve('src') } }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
server.config.env.VITE_SITE_URL = 'https://example.com/ME-2026-Main/';
const { LanguageProvider, useLanguage } = await server.ssrLoadModule('/src/contexts/LanguageContext.tsx');
const { Link, Navigate } = await server.ssrLoadModule('/src/components/LanguageLink.tsx');
const { NavLink } = await server.ssrLoadModule('/src/components/NavLink.tsx');
const { useNavigate } = await server.ssrLoadModule('/src/hooks/useLocalizedNavigation.ts');
const { default: PageSeo } = await server.ssrLoadModule('/src/components/PageSeo.tsx');
const { seoPaths, metadataHtml, pageMetadata } = await server.ssrLoadModule('/src/lib/seo.ts');
// Read the unchanged route configuration so the test exercises its actual IDs.
const routePatterns = [...readFileSync('src/App.tsx', 'utf8').matchAll(/<Route path="([^"]+)"/g)].map(match => match[1]);

let root;
let controls;
function Screen() {
  const location = useLocation();
  const params = useParams();
  const language = useLanguage();
  const navigate = useNavigate();
  const rawNavigate = useRouterNavigate();
  controls = { location, params, ...language, navigate, rawNavigate };
  return h('main', null,
    h(Link, { id: 'service-link', to: '/services/bim-training?ref=guide#benefits' }, 'Service'),
    h(Link, { id: 'course-link', to: '/courses/bim-fundamentals' }, 'Course'),
    h(Link, { id: 'project-link', to: '/portfolio/1' }, 'Project'),
    h(Link, { id: 'root-link', to: '/' }, 'Home'),
    h(Link, { id: 'parent-link', to: '..' }, 'Parent'),
    h(NavLink, { id: 'nav-course', to: '/courses/bim-fundamentals', activeClassName: 'current' }, 'Course navigation'),
    h(Link, { id: 'external-link', to: 'https://other.example/' }, 'External'),
    h('button', { id: 'switch-language', onClick: language.toggleLanguage }, 'Switch'),
    location.pathname === '/redirect/' ? h(Navigate, { to: '/contact', replace: true, state: { redirected: true } }) : null,
  );
}

async function settle(check = () => true) {
  for (let i = 0; i < 100; i++) {
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 10)); });
    if (check()) return;
  }
  assert.fail('DOM did not reach the expected language, route or metadata state');
}

async function mount(route, base = '/ME-2026-Main/') {
  if (root) await act(async () => root.unmount());
  root = null;
  dom.window.history.replaceState(null, '', `${base}${route.replace(/^\//, '')}`);
  // Match production's initial metadata, then verify effects replace it once.
  dom.window.document.head.innerHTML = metadataHtml(pageMetadata('/', 'ar', 'https://example.com/ME-2026-Main/'));
  await act(async () => {
    root = createRoot(dom.window.document.getElementById('root'));
    root.render(h(BrowserRouter, { basename: base, window: dom.window, future: { v7_startTransition: true, v7_relativeSplatPath: true } },
      h(I18nextProvider, { i18n }, h(LanguageProvider, null, h(PageSeo),
        h(Routes, null, ...routePatterns.map(pattern => h(Route, { key: pattern, path: pattern, element: h(Screen) })))))));
  });
  const language = new URL(dom.window.location.href).searchParams.get('lang') === 'en' ? 'en' : 'ar';
  const expected = pageMetadata(controls.location.pathname, language, 'https://example.com/ME-2026-Main/');
  await settle(() => dom.window.document.title === expected.title);
}

async function click(id) {
  await act(async () => dom.window.document.getElementById(id).dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })));
  await settle();
}

after(async () => {
  if (root) await act(async () => root.unmount());
  await server.close();
  dom.window.close();
  for (const [key, descriptor] of originals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
});

test('every known page loads directly and refreshes in the URL-selected language with one metadata set', async () => {
  assert.equal(routePatterns.length, 13);
  for (const route of seoPaths) {
    const pathname = route === '/' ? '/' : `${route}/`;
    for (const [query, language, direction] of [['', 'ar', 'rtl'], ['?lang=en', 'en', 'ltr'], ['?lang=ar', 'ar', 'rtl']]) {
      await mount(pathname + query);
      const expected = pageMetadata(pathname, language, 'https://example.com/ME-2026-Main/');
      assert.equal(controls.language, language, pathname + query);
      assert.equal(controls.direction, direction);
      assert.equal(document.documentElement.lang, language);
      assert.equal(document.documentElement.dir, direction);
      assert.equal(i18n.language, language);
      assert.equal(document.title, expected.title);
      assert.equal(document.querySelectorAll('title').length, 1);
      assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1);
      assert.equal(document.querySelector('link[rel="canonical"]').href, expected.canonical);
      assert.equal(document.querySelectorAll('meta[name="description"]').length, 1);
      assert.equal(document.querySelector('meta[name="description"]').content, expected.description);
      assert.equal(document.querySelectorAll('script[type="application/ld+json"]').length, 1);
      if (/^\/(services|courses|portfolio)\/.+/.test(pathname)) assert.equal(controls.params.id, route.split('/').at(-1));
      assert.equal(document.getElementById('root-link').getAttribute('href'), `/ME-2026-Main/${language === 'en' ? '?lang=en' : ''}`);
    }
  }
});

test('internal links, programmatic navigation, refresh and history retain English explicitly', async () => {
  await mount('/?lang=en');
  assert.equal(document.getElementById('service-link').getAttribute('href'), '/ME-2026-Main/services/bim-training/?ref=guide&lang=en#benefits');
  assert.equal(document.getElementById('external-link').href, 'https://other.example/');
  await click('service-link');
  assert.equal(controls.location.pathname, '/services/bim-training/');
  assert.equal(controls.language, 'en');
  assert.equal(controls.location.hash, '#benefits');
  assert.equal(document.getElementById('parent-link').getAttribute('href'), '/ME-2026-Main/?lang=en');
  await click('course-link');
  assert.equal(controls.location.pathname, '/courses/bim-fundamentals/');
  assert.equal(document.getElementById('nav-course').getAttribute('href'), '/ME-2026-Main/courses/bim-fundamentals/?lang=en');
  assert.ok(document.getElementById('nav-course').classList.contains('current'));
  await act(async () => controls.navigate('/portfolio/1?ref=case#gallery', { state: { example: true } }));
  await settle();
  assert.equal(controls.location.pathname, '/portfolio/1/');
  assert.equal(controls.location.search, '?ref=case&lang=en');
  assert.equal(controls.location.hash, '#gallery');
  assert.equal(controls.location.state.example, true);
  await act(async () => controls.navigate(-1));
  await settle(() => controls.location.pathname === '/courses/bim-fundamentals/');
  assert.equal(controls.language, 'en');
  await act(async () => controls.navigate(1));
  await settle(() => controls.location.pathname === '/portfolio/1/');
  assert.equal(controls.language, 'en');
  const refresh = controls.location.pathname + controls.location.search + controls.location.hash;
  await mount(refresh);
  assert.equal(controls.language, 'en');
  await settle(() => document.querySelector('link[rel="canonical"]').href.endsWith('/portfolio/1/?lang=en'));
});

test('language switches preserve query, hash and state, while bare URL history entries return to Arabic', async () => {
  await mount('/contact?message=a%26b%3Dc&tag=1&tag=2#form');
  await act(async () => controls.rawNavigate({ pathname: '/contact', search: controls.location.search, hash: '#form' }, { replace: true, state: { draft: 'retained' } }));
  await click('switch-language');
  assert.equal(controls.language, 'en');
  assert.equal(controls.location.pathname, '/contact/');
  assert.equal(new URLSearchParams(controls.location.search).get('message'), 'a&b=c');
  assert.deepEqual(new URLSearchParams(controls.location.search).getAll('tag'), ['1', '2']);
  assert.equal(controls.location.hash, '#form');
  assert.equal(controls.location.state.draft, 'retained');
  await click('switch-language');
  assert.equal(controls.language, 'ar');
  assert.equal(new URLSearchParams(controls.location.search).has('lang'), false);
  await act(async () => controls.navigate(-1));
  await settle(() => controls.language === 'en');
  assert.equal(document.documentElement.dir, 'ltr');
  await act(async () => controls.navigate(-1));
  await settle(() => controls.language === 'ar');
  assert.equal(document.documentElement.dir, 'rtl');
  await act(async () => controls.navigate(1));
  await settle(() => controls.language === 'en');
});

test('legacy Arabic links work without a forced redirect; redirect components preserve English and state', async () => {
  await mount('/services/bim-training?lang=ar#benefits');
  assert.equal(dom.window.location.search, '?lang=ar');
  assert.equal(controls.language, 'ar');
  assert.equal(document.getElementById('course-link').getAttribute('href'), '/ME-2026-Main/courses/bim-fundamentals/');
  await mount('/redirect/?lang=en');
  await settle(() => controls.location.pathname === '/contact/');
  assert.equal(controls.language, 'en');
  assert.equal(controls.location.search, '?lang=en');
  assert.equal(controls.location.state.redirected, true);
});

test('language-aware hrefs also work at a custom-domain root and an arbitrary deployment subpath', async () => {
  for (const base of ['/', '/company/site/']) {
    await mount('/?lang=en', base);
    assert.equal(document.getElementById('course-link').getAttribute('href'), `${base}courses/bim-fundamentals/?lang=en`);
    await click('project-link');
    assert.equal(dom.window.location.pathname, `${base}portfolio/1/`);
    assert.equal(controls.language, 'en');
    await click('switch-language');
    assert.equal(dom.window.location.search, '');
    assert.equal(controls.language, 'ar');
  }
});
