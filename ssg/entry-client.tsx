import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/index.css';
import CandidateApp from './App';
import { createPageI18n } from '@/i18n/createPageI18n';
import { localeBase } from '@/lib/urls';
import { legacyDestination } from '@/lib/legacy';
import { installLocaleHistory } from '@/lib/localeHistory';
import type { Bootstrap } from './types';
import { installStaticRouteAliases } from './route-alias';

async function start() {
  const boot = JSON.parse(document.getElementById('ssg-state')!.textContent!) as Bootstrap;
  const redirect = legacyDestination(window.location.href, boot.base);
  if (redirect) { window.location.replace(redirect); return; }
  installStaticRouteAliases(boot.base);
  // The shared bilingual 404 deliberately boots Arabic for unknown URLs.
  if (!boot.fallback404) installLocaleHistory(boot.base, boot.language);
  const i18n = await createPageI18n(boot.language);
  hydrateRoot(document.getElementById('root')!,
    <BrowserRouter basename={localeBase(boot.base, boot.language)} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CandidateApp boot={boot} i18n={i18n} />
    </BrowserRouter>,
    {
      identifierPrefix: boot.identifierPrefix,
      onRecoverableError(error) {
        window.__SSG_EVIDENCE__.recoverableErrors.push(String(error));
        console.error('SSG hydration error:', error);
      },
    },
  );
}
start().catch(error => { window.__SSG_EVIDENCE__.bootstrapError = String(error); console.error('SSG bootstrap failed:', error); });
