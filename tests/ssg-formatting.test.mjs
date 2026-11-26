import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
after(() => server.close());

for (const defaultLocale of ['ar-SA', 'en-US', 'fr-FR']) {
  test(`course counts preserve Western digits/grouping with Intl default ${defaultLocale}`, async () => {
    const OriginalNumberFormat = Intl.NumberFormat;
    const requests = [];
    Intl.NumberFormat = new Proxy(OriginalNumberFormat, {
      construct(target, args) {
        requests.push(args);
        return Reflect.construct(target, [args[0] ?? defaultLocale, args[1]]);
      },
    });
    try {
      const { formatCount } = await server.ssrLoadModule(`/src/lib/formatting.ts?default=${defaultLocale}`);
      assert.equal(formatCount(300), '300');
      assert.equal(formatCount(1200), '1,200');
      assert.equal(formatCount(0), '0');
      assert.deepEqual(requests, [['en-US', { numberingSystem: 'latn', maximumFractionDigits: 0, useGrouping: true }]]);
    } finally { Intl.NumberFormat = OriginalNumberFormat; }
  });
}
