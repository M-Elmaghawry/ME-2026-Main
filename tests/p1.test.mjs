import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
after(() => server.close());
const { preferredLanguage } = await server.ssrLoadModule('/src/lib/language.ts');
const { contactSchema, hasEmailConfiguration, normalizePhone, internationalPhone, emailStorage } = await server.ssrLoadModule('/src/lib/contact.ts');
const { currentPrice, formatPrice } = await server.ssrLoadModule('/src/lib/pricing.ts');
const { coursePricing } = await server.ssrLoadModule('/src/data/coursePricing.ts');
const { pageMetadata, seoPaths, metadataHtml, normalizeSiteUrl } = await server.ssrLoadModule('/src/lib/seo.ts');
const { clients } = await server.ssrLoadModule('/src/data/clients.ts');
const { whatsappLink } = await server.ssrLoadModule('/src/config/site.ts');

test('explicit language wins over saved preference; disabled storage falls back safely', () => {
  assert.equal(preferredLanguage('?lang=ar', { getItem: () => 'en' }), 'ar');
  assert.equal(preferredLanguage('?lang=en', { getItem: () => 'ar' }), 'en');
  assert.equal(preferredLanguage('?lang=invalid', { getItem: () => 'ar' }), 'ar');
  assert.equal(preferredLanguage('', { getItem: () => { throw new Error('Storage denied'); } }), 'en');
  assert.equal(preferredLanguage('?lang=ar&message=hello'), 'ar');
});

test('shared client logos exist and WhatsApp messages retain Arabic and special characters', async () => {
  const { existsSync } = await import('node:fs');
  assert.equal(new Set(clients.map((client) => client.logo)).size, clients.length);
  assert.equal(new Set(clients.map((client) => client.id)).size, clients.length);
  for (const client of clients) assert.ok(existsSync('public' + client.logo), client.logo);
  const message = 'أريد التسجيل & تفاصيل = 100%';
  assert.equal(new URL(whatsappLink(message)).searchParams.get('text'), message);
});

const valid = { name: '  Test User  ', email: ' user@example.com ', countryCode: '+20', phone: '١٠٩ ٦١٨ ٩٨٣٢', company: '', service: 'bim-training', message: '  Please tell me more about your BIM training.  ', website: '' };
test('contact validation accepts and normalizes legitimate multilingual input', () => {
  const result = contactSchema('ar', ['bim-training']).parse(valid);
  assert.equal(result.name, 'Test User');
  assert.equal(result.email, 'user@example.com');
  assert.equal(result.phone, '1096189832');
  assert.equal(normalizePhone('۰۱۲۳۴۵۶۷۸۹'), '0123456789');
  assert.equal(internationalPhone('01096189832', '+20'), '+201096189832');
  assert.equal(internationalPhone('+201096189832', ''), '+201096189832');
  assert.equal(internationalPhone('', '+20'), '');
  assert.ok(contactSchema('en', []).safeParse({ ...valid, phone: '', service: '' }).success);
  assert.ok(contactSchema('en', []).safeParse({ ...valid, countryCode: '', phone: '+20 109 618 9832', service: '' }).success);
});

test('contact validation rejects empty, oversized, malformed, and bot submissions', () => {
  const schema = contactSchema('en', ['bim-training']);
  for (const change of [
    { name: '   ' }, { email: 'invalid' }, { email: 'user@example.com\r\nBcc: other@example.com' },
    { name: 'x'.repeat(101) }, { company: 'x'.repeat(151) }, { message: 'short' },
    { message: 'x'.repeat(5001) }, { phone: '+201096189832' }, { phone: '123456789012345' },
    { phone: '123<script>' }, { service: 'forged-service' }, { website: 'bot.example' }, { countryCode: '+999' },
  ]) assert.equal(schema.safeParse({ ...valid, ...change }).success, false, JSON.stringify(change).slice(0, 80));
  assert.equal(hasEmailConfiguration(['service', 'template', 'public-key']), true);
  assert.equal(hasEmailConfiguration(['your_service_id', 'template', 'key']), false);
  assert.equal(hasEmailConfiguration([undefined, 'template', 'key']), false);
});

test('email throttle retains state when localStorage is blocked', async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage denied'); } });
  try {
    await emailStorage.set('contact-test', '123');
    assert.equal(await emailStorage.get('contact-test'), '123');
    await emailStorage.remove('contact-test');
    assert.equal(await emailStorage.get('contact-test'), undefined);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  }
});

test('scheduled offers use timezone-aware boundaries and restore the official price at expiry', () => {
  const config = { officialPrice: 130, currency: 'USD', offer: { price: 99, startsAt: '2026-11-01T00:00:00+03:00', endsAt: '2026-11-02T00:00:00+03:00' } };
  const start = Date.parse(config.offer.startsAt), end = Date.parse(config.offer.endsAt);
  assert.equal(currentPrice(config, start - 1).price, 130);
  assert.equal(currentPrice(config, start).price, 99);
  assert.equal(currentPrice(config, end - 1).price, 99);
  assert.equal(currentPrice(config, end).price, 130);
  assert.equal(currentPrice(config, end).endsAt, null);
  assert.equal(currentPrice({ ...config, offer: undefined }, start).price, 130);
  for (const offer of [
    { price: 99, endsAt: '2026-11-02T00:00:00' }, { price: 99, endsAt: 'invalid' },
    { price: -1, endsAt: config.offer.endsAt }, { price: 140, endsAt: config.offer.endsAt },
  ]) assert.equal(currentPrice({ ...config, offer }, start).price, 130);
  assert.equal(currentPrice({ officialPrice: 0, currency: 'USD' }).price, 0);
  assert.equal(currentPrice({ officialPrice: null, currency: 'USD' }).price, null);
  assert.equal(formatPrice(null, 'USD', 'en'), 'Contact for pricing');
  assert.equal(formatPrice(0, 'USD', 'ar'), 'مجاني');
});

test('every published route has localized metadata, valid prices, and a local share image', async () => {
  const { existsSync } = await import('node:fs');
  const site = 'https://example.com/ME-2026-Main/';
  for (const path of seoPaths) {
    for (const lang of ['ar', 'en']) {
      const meta = pageMetadata(path, lang, site);
      assert.ok(meta.found, path);
      assert.ok(meta.canonical.startsWith(site));
      const image = decodeURIComponent(new URL(meta.image).pathname.replace('/ME-2026-Main/', ''));
      assert.ok(existsSync(`public/${image}`), meta.image);
      const html = metadataHtml(meta);
      assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
      assert.ok(html.includes('info@elmekawy-bim.com'));
      assert.ok(html.includes('hreflang="ar"'));
    }
  }
  assert.equal(pageMetadata('/courses/not-a-course', 'en').found, false);
  assert.equal(pageMetadata('/portfolio/1/', 'ar').found, true);
  assert.throws(() => normalizeSiteUrl('javascript:alert(1)'));
  assert.throws(() => normalizeSiteUrl('https://user:pass@example.com'));
  for (const [id, config] of Object.entries(coursePricing)) {
    assert.ok(seoPaths.includes(`/courses/${id}`), id);
    assert.ok(config.officialPrice === null || Number.isFinite(config.officialPrice) && config.officialPrice >= 0);
    if (config.offer) {
      assert.ok(config.offer.price < config.officialPrice && config.offer.price >= 0);
      assert.ok(/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(config.offer.endsAt));
      assert.ok(Number.isFinite(Date.parse(config.offer.endsAt)));
      if (config.offer.startsAt) assert.ok(Date.parse(config.offer.startsAt) < Date.parse(config.offer.endsAt));
    }
  }
});
