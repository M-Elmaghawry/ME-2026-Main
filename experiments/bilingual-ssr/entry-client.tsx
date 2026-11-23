import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/index.css';
import PrototypeApp from './App';
import { createPageI18n } from './i18n';
import { localeBase, type Bootstrap } from './routes';

async function start() {
  const boot = JSON.parse(document.getElementById('poc-state')!.textContent!) as Bootstrap;
  const instance = await createPageI18n(boot.language);
  hydrateRoot(document.getElementById('root')!,
    <BrowserRouter basename={localeBase(boot.base, boot.language)} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PrototypeApp boot={boot} i18n={instance} />
    </BrowserRouter>,
    {
      identifierPrefix: boot.identifierPrefix,
      onRecoverableError(error) {
        window.__POC_EVIDENCE__.recoverableErrors.push(String(error));
        console.error('Prototype hydration error:', error);
      },
    },
  );
}

start().catch(error => {
  window.__POC_EVIDENCE__.bootstrapError = String(error);
  console.error('Prototype bootstrap failed:', error);
});
