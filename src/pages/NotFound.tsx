import { useLocation } from "react-router-dom";
import { Link } from '@/components/LanguageLink';
import { useEffect } from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouting } from '@/contexts/RoutingContext';
import { localeBase } from '@/lib/urls';

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const routing = useRouting();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{language === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'}</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          {language === 'ar' ? 'العودة للرئيسية' : 'Return to Home'}
        </Link>
        {routing.fallback404 && <p className="mt-4" lang={language === 'ar' ? 'en' : 'ar'} dir={language === 'ar' ? 'ltr' : 'rtl'}>
          {language === 'ar' ? 'Page not found. ' : 'الصفحة غير موجودة. '}
          <a className="text-primary underline" href={localeBase(routing.base, language === 'ar' ? 'en' : 'ar')}>
            {language === 'ar' ? 'Return to Home' : 'العودة للرئيسية'}
          </a>
        </p>}
      </div>
    </main>
  );
};

export default NotFound;
