import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { services } from './Services';
import { ArrowLeft, ArrowRight, MessageCircle, CheckCircle } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language, direction } = useLanguage();
  const BackArrow = direction === 'rtl' ? ArrowRight : ArrowLeft;

  const service = services.find(s => s.id === id);

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 text-center">
          <h1 className="text-2xl">{language === 'ar' ? 'الخدمة غير موجودة' : 'Service not found'}</h1>
          <Link to="/services" className="text-blue-grotto mt-4 inline-block">
            {language === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = service.icon;

  const benefits = [
    { ar: 'توفير الوقت والتكاليف', en: 'Save time and costs' },
    { ar: 'تحسين جودة المشروع', en: 'Improve project quality' },
    { ar: 'تقليل الأخطاء والتعارضات', en: 'Reduce errors and clashes' },
    { ar: 'تسريع عملية التنفيذ', en: 'Accelerate execution process' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link to="/services">
              <Button variant="ghost" className="mb-8">
                <BackArrow className="w-4 h-4 me-2" />
                {language === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
              </Button>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="neu-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-navy to-blue rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {language === 'ar' ? service.title.ar : service.title.en}
                  </h1>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {language === 'ar' ? service.fullDescription.ar : service.fullDescription.en}
                </p>

                <h2 className="text-2xl font-bold mb-4">
                  {language === 'ar' ? 'المميزات' : 'Benefits'}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{language === 'ar' ? benefit.ar : benefit.en}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="neu-card p-8 sticky top-24">
                <h3 className="text-xl font-bold mb-4">
                  {language === 'ar' ? 'احصل على هذه الخدمة' : 'Get This Service'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === 'ar' 
                    ? 'تواصل معنا الآن للحصول على استشارة مجانية'
                    : 'Contact us now for a free consultation'
                  }
                </p>
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                  onClick={() => window.open('https://wa.me/201096189832', '_blank')}
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('hero.cta.whatsapp')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ServiceDetail;
