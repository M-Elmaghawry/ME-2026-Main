import { motion, type Easing } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import TypewriterEffect from '@/components/TypewriterEffect';

const easeOut: Easing = [0.4, 0, 0.2, 1];
const easeInOut: Easing = [0.4, 0, 0.6, 1];

const HeroSection = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const Arrow = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20 pb-24">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric shapes */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: easeInOut }}
          className="absolute top-20 start-10 w-72 h-72 bg-baby-blue/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: easeInOut }}
          className="absolute bottom-20 end-10 w-96 h-96 bg-blue-grotto/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [-5, 15, -5] }}
          transition={{ duration: 7, repeat: Infinity, ease: easeInOut }}
          className="absolute top-1/2 start-1/3 w-64 h-64 bg-navy/10 rounded-full blur-3xl"
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--navy)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--navy)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Greeting */}
          <motion.p
            variants={itemVariants}
            className="text-blue-grotto font-medium text-lg mb-4"
          >
            {t('hero.greeting')}
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
          >
            <span className="gradient-text">{t('hero.name')}</span>
          </motion.h1>

          {/* Animated Titles */}
          <motion.div variants={itemVariants} className="mb-6">
            <TypewriterEffect />
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium mb-6"
          >
            {t('hero.title')}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="whatsapp"
              size="xl"
              className="group btn-hover-effect btn-hover-blue-white"
              onClick={() => window.open('https://wa.me/201096189832', '_blank')}
            >
              <MessageCircle className="w-5 h-5" />
              {t('hero.cta.whatsapp')}
            </Button>

            <Button 
              variant="hero" 
              size="xl" 
              className="group btn-hover-effect btn-hover-blue-white"
              onClick={() => window.location.href = '/contact'}
            >
              <Calendar className="w-5 h-5" />
              {t('hero.cta.consultation')}
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="group btn-hover-effect btn-hover-blue-white"
              onClick={() => window.location.href = '/services'}
            >
              {t('hero.cta.services')}
              <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: '10+', label: direction === 'rtl' ? 'سنوات خبرة' : 'Years Experience' },
              { value: '50+', label: direction === 'rtl' ? 'مشروع منجز' : 'Projects Completed' },
              { value: '500+', label: direction === 'rtl' ? 'متدرب' : 'Students Trained' },
              { value: '20+', label: direction === 'rtl' ? 'شركة' : 'Companies' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="neu-card p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-blue-grotto rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
