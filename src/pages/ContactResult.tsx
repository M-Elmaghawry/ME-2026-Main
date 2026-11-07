import { Link, Navigate, useLocation } from 'react-router-dom';
import { CheckCircle2, CircleX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import type { ContactResultState } from '@/types/contact';

const ContactResult = () => {
  const { language, direction } = useLanguage();
  const { state } = useLocation();
  const result = state as ContactResultState | null;

  if (!result || (result.status !== 'success' && result.status !== 'error')) {
    return <Navigate to="/contact" replace />;
  }

  const success = result.status === 'success';
  const Icon = success ? CheckCircle2 : CircleX;
  const copy = language === 'ar'
    ? {
        title: success ? 'شكرًا لتواصلك معنا!' : 'فشل إرسال الرسالة',
        message: success
          ? 'تم إرسال رسالتك بنجاح وسيتم التواصل معك في أقرب وقت ممكن.'
          : 'تعذّر إرسال رسالتك. يرجى المحاولة مرة أخرى.',
        action: success ? 'العودة إلى الصفحة الرئيسية' : 'حاول مرة أخرى',
      }
    : {
        title: success ? 'Thank you for contacting us!' : 'Message could not be sent',
        message: success
          ? 'Your message has been sent successfully. We will get in touch with you as soon as possible.'
          : 'We could not send your message. Please try again.',
        action: success ? 'Back to home' : 'Try again',
      };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir={direction}>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 pt-32 pb-20">
        <div className="neu-card w-full max-w-xl p-8 sm:p-12 text-center" role={success ? 'status' : 'alert'}>
          <Icon
            className={`mx-auto mb-6 h-16 w-16 ${success ? 'text-green-600' : 'text-destructive'}`}
            aria-hidden="true"
          />
          <h1 className="mb-4 text-2xl sm:text-3xl font-bold">{copy.title}</h1>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{copy.message}</p>
          <Button asChild variant="hero" size="lg">
            <Link
              to={success ? '/' : '/contact'}
              replace
              state={result.status === 'error' ? { draft: result.draft } : undefined}
            >
              {copy.action}
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactResult;
