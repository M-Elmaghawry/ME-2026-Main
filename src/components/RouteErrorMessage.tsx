import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RouteErrorMessage() {
  const { language } = useLanguage();
  return <main className="min-h-screen flex flex-col gap-5 items-center justify-center bg-background p-6 text-center">
    <h1 className="text-2xl font-bold">{language === 'ar' ? 'تعذّر تحميل الصفحة' : 'Unable to load this page'}</h1>
    <p>{language === 'ar' ? 'تحقق من الاتصال ثم أعد المحاولة.' : 'Check your connection and try again.'}</p>
    <button type="button" className="rounded-md bg-primary px-5 py-3 text-primary-foreground" onClick={() => window.location.reload()}>
      {language === 'ar' ? 'إعادة المحاولة' : 'Try again'}
    </button>
    <Link to="/" className="underline">{language === 'ar' ? 'العودة للرئيسية' : 'Return home'}</Link>
  </main>;
}

