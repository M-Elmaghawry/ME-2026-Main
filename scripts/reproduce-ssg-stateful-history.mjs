import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { serve } from './ssg-browser-utils.mjs';
// Diagnostic only. All form data is synthetic and all external requests are blocked.
// Requires the separately built contact-fixture; does not modify product code.
const args = process.argv.slice(2);
const option = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined;
const audit = path.resolve('dist-ssr/stateful-history-reproduction-' + Date.now());
await mkdir(audit, { recursive: true });
const base = '/ME-2026-Main/';
const fixture = path.resolve('dist-ssr/candidate/contact-fixture/site');
if (!existsSync(path.join(fixture, 'index.html'))) throw new Error('Build the contact-fixture first; see docs/DEVELOPMENT-HANDOVER.md');
const baseline = option('--baseline');
const executablePath = option('--browser') || process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(existsSync);
if (!executablePath || !existsSync(executablePath)) throw new Error('Set CHROME_PATH or --browser to an installed Chromium browser; playwright-core does not download one.');
const csr = baseline ? await serve(path.resolve(baseline), '/') : null;
const ssg = await serve(fixture, base, true);
const browser = await chromium.launch({ executablePath, headless: true, chromiumSandbox: true });
const report={generatedAt:new Date().toISOString(),observations:[],findings:[],errors:[]};
const draft={name:'Synthetic stateful history audit',email:'stateful@example.invalid',phone:'501234567',company:'Audit only',message:'Synthetic local mocked stateful history check.',countryCode:'+966',selectedService:'bim-training'};
function state(){return{url:location.pathname+location.search,lang:document.documentElement.lang,dir:document.documentElement.dir,mainCount:document.querySelectorAll('main').length,h1:document.querySelector('h1')?.textContent,rootLength:document.getElementById('root')?.innerHTML.length,bootLanguage:JSON.parse(document.getElementById('ssg-state')?.textContent||'null')?.language,hasHistoryDraft:!!history.state?.usr?.draft,nameRecovered:document.querySelector('#contact-name')?.value=== 'Synthetic stateful history audit'};}
async function ready(page,kind,language){await page.waitForFunction(({kind,language})=>kind==='ssg'?window.__SSG_EVIDENCE__?.hydrated:document.documentElement.lang===language&&!!document.querySelector('h1'),{kind,language});}
try{
  for(const kind of (csr ? ['csr','ssg'] : ['ssg']))for(const language of ['ar','en']){
    const ctx=await browser.newContext({viewport:{width:1280,height:900}});await ctx.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
    const page=await ctx.newPage(),messages=[];page.on('console',m=>{if(['warning','error'].includes(m.type()))messages.push(m.text());});
    const other=language==='ar'?'en':'ar',origin=kind==='ssg'?ssg.origin:csr.origin;
    const destination=lang=>kind==='ssg'?origin+base+(lang==='en'?'en/':'')+'contact/':origin+'/contact/'+(lang==='en'?'?lang=en':'');
    const row={kind,language};
    try{
      await page.goto(destination(language));await ready(page,kind,language);
      if(kind==='ssg'){
        for(const field of ['name','email','phone','company','message'])await page.locator('#contact-'+field).fill(draft[field]);
        await page.locator('#contact-countryCode').selectOption(draft.countryCode);await page.locator('#contact-service').selectOption(draft.selectedService);
        await page.evaluate(()=>{window.__EMAILJS_TEST__.outcome='error';});await page.locator('form button[type="submit"]').click();
        await page.waitForURL(origin+base+(language==='en'?'en/':'')+'thank-you/');await page.getByRole('link',{name:language==='ar'?'حاول مرة أخرى':'Try again',exact:true}).click();
        await page.waitForURL(destination(language));row.draftSource='Actual mocked failed submission and retry link';
      }else{
        await Promise.all([page.waitForNavigation({waitUntil:'load'}),page.evaluate(draft=>{history.replaceState({...history.state,usr:{draft}},'',location.href);location.reload();},draft)]);
        row.draftSource='Explicit browser-history retry fixture in ordinary CSR';
      }
      await ready(page,kind,language);await page.waitForFunction(name=>document.querySelector('#contact-name')?.value===name,draft.name);
      await page.getByRole('button',{name:language==='ar'?'Switch to English':'التبديل إلى العربية',exact:true}).click();
      await page.waitForURL(destination(other));await ready(page,kind,other);await page.waitForFunction(name=>document.querySelector('#contact-name')?.value===name,draft.name);
      row.afterSwitch=await page.evaluate(state);
      const back=await page.goBack({waitUntil:'load'});await page.waitForURL(destination(language));await page.waitForTimeout(600);
      row.backResponse=back?.status()??null;row.afterBack=await page.evaluate(state);row.consoleMessages=[...messages];
      await page.screenshot({path:path.join(audit,`stateful-${kind}-${language}-back.png`)});
      if(row.afterBack.lang!==language||row.afterBack.mainCount!==1)report.findings.push({kind,language,severity:'release blocker',message:'Back after a state-preserving language switch retains the wrong document locale/basename, producing an empty page or an incorrect 404.',evidence:row.afterBack});
      await page.reload({waitUntil:'load'});await ready(page,kind,language);await page.waitForFunction(name=>document.querySelector('#contact-name')?.value===name,draft.name);
      row.afterRefresh=await page.evaluate(state);
      if(kind==='ssg'){
        await page.getByRole('button',{name:language==='ar'?'Switch to English':'التبديل إلى العربية',exact:true}).click();await page.waitForURL(destination(other));await ready(page,kind,other);await page.waitForFunction(name=>document.querySelector('#contact-name')?.value===name,draft.name);
        await page.evaluate(()=>{window.__EMAILJS_TEST__.outcome='success';});await page.locator('form button[type="submit"]').click();await page.waitForURL(origin+base+(other==='en'?'en/':'')+'thank-you/');
        row.successCurrentEntryHasDraft=await page.evaluate(()=>!!history.state?.usr?.draft);
        await page.goBack({waitUntil:'load'});await page.waitForTimeout(300);row.successBack=await page.evaluate(state);
        await page.reload({waitUntil:'load'});await ready(page,kind,language);await page.locator('#contact-name').waitFor();
        row.successBackRefresh=await page.evaluate(state);
        if(row.successBackRefresh.nameRecovered)report.findings.push({kind,language,severity:'cleanup scope requires review',message:'After a successful mocked retry in the other locale, Back then refresh recovers the older locale draft. Active-entry cleanup does not invalidate historical copies.'});
      }
    }catch(error){row.error=error.message;report.errors.push({kind,language,error:error.message});}
    report.observations.push(row);await ctx.close();await writeFile(path.join(audit,'stateful-history-report.json'),JSON.stringify(report,null,2));
  }
}finally{await browser.close();await csr?.close();await ssg.close();await writeFile(path.join(audit,'stateful-history-report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({ output: audit, observations: report.observations.map(row => ({ kind: row.kind, language: row.language, draftSource: row.draftSource, afterBack: row.afterBack, historicalDraftRecoveredAfterSuccess: row.successBackRefresh?.nameRecovered })), findings: report.findings, errors: report.errors }, null, 2));
// Nonzero means the documented blocker or a harness error remains.
process.exitCode = report.errors.length ? 2 : report.findings.length ? 1 : 0;
