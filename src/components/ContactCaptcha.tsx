import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CaptchaApi {
  render(container: HTMLElement, options: {
    sitekey: string; callback: (token: string) => void;
    'expired-callback': () => void; 'error-callback': () => void;
  }): number;
  reset(id: number): void;
}
declare global {
  interface Window {
    grecaptcha?: CaptchaApi;
    elmekawyCaptchaReady?: () => void;
  }
}

let ready: Promise<CaptchaApi> | undefined;
function loadCaptcha(language: string) {
  if (window.grecaptcha?.render) return Promise.resolve(window.grecaptcha);
  if (!ready) ready = new Promise<CaptchaApi>((resolve, reject) => {
    window.elmekawyCaptchaReady = () => {
      if (window.grecaptcha) resolve(window.grecaptcha);
      delete window.elmekawyCaptchaReady;
    };
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?onload=elmekawyCaptchaReady&render=explicit&hl=${language}`;
    script.async = true;
    script.onerror = () => { ready = undefined; script.remove(); reject(new Error('CAPTCHA unavailable')); };
    document.head.append(script);
  });
  return ready;
}

export default function ContactCaptcha({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const { language } = useLanguage();
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false;
    let widget: number | undefined;
    let api: CaptchaApi | undefined;
    const element = container.current;
    onToken('');
    setFailed(false);
    loadCaptcha(language).then((loaded) => {
      if (disposed || !element) return;
      api = loaded;
      widget = loaded.render(element, {
        sitekey: siteKey, callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': () => { onToken(''); setFailed(true); },
      });
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => {
      disposed = true;
      if (widget !== undefined) api?.reset(widget);
      element?.replaceChildren();
    };
  }, [language, onToken, siteKey]);
  return <div>
    <div ref={container} />
    {failed && <p role="alert" className="text-sm text-destructive">{language === 'ar' ? 'تعذّر تحميل التحقق. حدّث الصفحة أو تواصل عبر واتساب.' : 'Verification could not load. Reload the page or contact us via WhatsApp.'}</p>}
  </div>;
}
