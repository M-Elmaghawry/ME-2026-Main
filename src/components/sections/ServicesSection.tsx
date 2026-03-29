import { motion, type Easing } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building2, 
  Layers, 
  Search, 
  GraduationCap,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const easeOut: Easing = [0.4, 0, 0.2, 1];

interface Service {
  id: string;
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
}

const services: Service[] = [
  {
    id: 'bimConsulting',
    icon: Building2,
    titleKey: 'services.items.bimConsulting.title',
    descriptionKey: 'services.items.bimConsulting.description',
  },
  {
    id: 'revitModeling',
    icon: Layers,
    titleKey: 'services.items.revitModeling.title',
    descriptionKey: 'services.items.revitModeling.description',
  },
  {
    id: 'clashDetection',
    icon: Search,
    titleKey: 'services.items.clashDetection.title',
    descriptionKey: 'services.items.clashDetection.description',
  },
  {
    id: 'training',
    icon: GraduationCap,
    titleKey: 'services.items.training.title',
    descriptionKey: 'services.items.training.description',
  },
];

const ServicesSection = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const Arrow = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden bg-gradient-hero">
      {/* Background Decorations - Same as Hero */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          className="absolute top-20 start-10 w-72 h-72 bg-baby-blue/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          className="absolute bottom-20 end-10 w-96 h-96 bg-blue-grotto/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [-5, 15, -5] }}
          transition={{ duration: 7, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          className="absolute top-1/2 start-1/3 w-64 h-64 bg-navy/10 rounded-full blur-3xl"
        />
        
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--navy)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--navy)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('services.title')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="neu-card h-full p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-glow">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="w-16 h-16 bg-gradient-to-r from-navy to-blue rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t(service.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                    {t(service.descriptionKey)}
                  </p>

                  {/* Link */}
                  <Button
                    variant="ghost"
                    className="mt-4 text-blue-grotto group-hover:text-navy"
                  >
                    {t('common.viewDetails')}
                    <Arrow className="w-4 h-4 ms-1 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => window.location.href = '/services'}
          >
            {t('services.viewAll')}
            <Arrow className="w-5 h-5 ms-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
