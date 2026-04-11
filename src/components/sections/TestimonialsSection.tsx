import { motion, type Easing } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Quote, UserCircle2 } from 'lucide-react';
import { testimonials } from '@/data/testimonials';

const easeOut: Easing = [0.4, 0, 0.2, 1];

type LocalizedText = { ar: string; en: string } | string;

const resolveLocalized = (value: LocalizedText, language: 'ar' | 'en') => {
  if (typeof value === 'string') {
    return value;
  }
  return language === 'ar' ? value.ar : value.en;
};

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section className="section-padding">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('testimonials.title')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            (() => {
              const rating = Number((testimonial as { rating?: number }).rating ?? 5);
              const image = (testimonial as { image?: string }).image ?? '/placeholder.svg';
              const content =
                'content' in testimonial && testimonial.content
                  ? resolveLocalized(testimonial.content as LocalizedText, language)
                  : language === 'ar'
                    ? (testimonial as { textAr?: string; text?: string }).textAr ?? (testimonial as { text?: string }).text ?? ''
                    : (testimonial as { text?: string }).text ?? '';
              const name = resolveLocalized(testimonial.name as LocalizedText, language);
              const role = resolveLocalized(testimonial.role as LocalizedText, language);

              return (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="neu-card h-full p-8 relative flex flex-col">
                {/* Quote Icon */}
                <Quote className="absolute top-6 end-6 w-10 h-10 text-baby-blue/30" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground leading-relaxed relative z-10 flex-1">
                  "{content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border">
                  <div className="w-14 h-14 rounded-full bg-baby-blue/20 flex items-center justify-center shrink-0 ring-2 ring-baby-blue/30">
                    <UserCircle2 className="w-9 h-9 text-blue-grotto" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      {name}
                    </h4>
                    <p className="text-sm text-blue-grotto">
                      {role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
              );
            })()
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
