import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export async function serve(directory, base, fallback404 = false) {
  const root = path.resolve(directory);
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      if (!url.pathname.startsWith(base)) { response.writeHead(404).end(); return; }
      let file = path.resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
      if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(400).end(); return; }
      let code = 200;
      try {
        if ((await stat(file)).isDirectory()) {
          if (!url.pathname.endsWith('/')) { response.writeHead(301, { Location: url.pathname + '/' + url.search }).end(); return; }
          file = path.join(file, 'index.html');
        }
        await stat(file);
      } catch {
        if (!fallback404 || /\.[a-z\d]+$/i.test(url.pathname)) { response.writeHead(404).end(); return; }
        code = 404; file = path.join(root, '404.html');
      }
      response.writeHead(code, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(await readFile(file));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

export async function metrics(page) {
  return page.evaluate(() => {
    const evidence = window.__SSG_EVIDENCE__;
    const box = selector => { const r = document.querySelector(selector)?.getBoundingClientRect(); return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null; };
    const shifts = (evidence?.layoutShifts || []).filter(entry => !entry.recentInput);
    let cls = 0, session = 0, start = 0, last = 0;
    for (const entry of shifts) { if (entry.time - last > 1000 || entry.time - start > 5000) { session = 0; start = entry.time; } session += entry.value; cls = Math.max(cls, session); last = entry.time; }
    return {
      lang: document.documentElement.lang, dir: document.documentElement.dir,
      h1: document.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim(), title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      counts: { title: document.querySelectorAll('title').length, description: document.querySelectorAll('meta[name="description"]').length, canonical: document.querySelectorAll('link[rel="canonical"]').length, alternates: document.querySelectorAll('link[hreflang]').length, jsonld: document.querySelectorAll('script[type="application/ld+json"]').length },
      boxes: { h1: box('h1'), main: box('main'), header: box('header') },
      rootPreserved: evidence ? evidence.initialMain === document.querySelector('main') && evidence.initialH1 === document.querySelector('h1') : null,
      idsPreserved: evidence ? evidence.initialIds.every(id => document.getElementById(id)) : null,
      recoverableErrors: evidence?.recoverableErrors || [], bootstrapError: evidence?.bootstrapError,
      cls, shifts, overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
}

export function geometryDifference(a, b) {
  return Math.max(0, ...Object.keys(a).flatMap(selector => a[selector] && b[selector] ? Object.keys(a[selector]).map(key => Math.abs(a[selector][key] - b[selector][key])) : []));
}

export async function normalizeCapture(page, { clocked = false } = {}) {
  // Measure live motion first, then compare the same decorative animation
  // phase in both screenshots. Pausing clocks affects this test page only.
  await page.bringToFront();
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      if (!animation.effect) continue;
      const { endTime } = animation.effect.getComputedTiming();
      animation.pause(); animation.currentTime = Number.isFinite(endTime) ? endTime : 0;
    }
    scrollTo(0, 0);
  });
  const painted = page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  if (clocked) await page.clock.runFor(32);
  await painted;
  await page.waitForTimeout(100);
}

export async function imageDifference(before, after, destination) {
  const a = await sharp(before).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(after).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) throw Error('Screenshot dimensions differ');
  let changed = 0; const diff = Buffer.alloc(a.data.length);
  for (let i = 0; i < a.data.length; i += 4) {
    const delta = Math.max(...[0, 1, 2].map(channel => Math.abs(a.data[i + channel] - b.data[i + channel])));
    if (delta > 20) changed++;
    diff[i] = delta > 20 ? 255 : 255 - delta; diff[i + 1] = diff[i + 2] = delta > 20 ? 0 : 255 - delta; diff[i + 3] = 255;
  }
  await sharp(diff, { raw: a.info }).png().toFile(destination);
  return changed / (a.info.width * a.info.height);
}
