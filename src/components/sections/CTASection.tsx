import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const CTASection = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const Arrow = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-primary" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -start-20 w-80 h-80 bg-baby-blue/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-20 -end-20 w-96 h-96 bg-blue-grotto/20 rounded-full blur-3xl"
        />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            {t('cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="whatsapp"
              size="xl"
              className="group"
              onClick={() => window.open('https://wa.me/201096189832', '_blank')}
            >
              <MessageCircle className="w-5 h-5" />
              {t('hero.cta.whatsapp')}
            </Button>

            <Button
              variant="hero-outline"
              size="xl"
              className="group border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => window.location.href = '/contact'}
            >
              {t('cta.button')}
              <Arrow className="w-5 h-5 ms-2 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
