import { motion, type Easing } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

const easeOut: Easing = [0.4, 0, 0.2, 1];

interface TimelineItem {
  year: string;
  title: {
    ar: string;
    en: string;
  };
  company: {
    ar: string;
    en: string;
  };
  description: {
    ar: string | string[];
    en: string | string[];
  };
}

const timelineData: TimelineItem[] = [
  {
    year: '2025 - Present',
    title: { ar: 'BIM Coordinator', en: 'BIM Coordinator' },
    company: { ar: 'شركة كبرى للمقاولات', en: 'IDS Consulting' },
    description: {
      ar: [
        'قيادة تطبيق وتسليم BIM باستخدام أدوات BIM لمشاريع حكومية وخاصة متنوعة (مشاريع نيوم).',
        'تنسيق نماذج البنية التحتية متعددة التخصصات وفق معيار ISO 19650.',
        'إعداد جداول الكميات والرسومات التصميمية التفصيلية بناءً على نمذجة LOD 300.'
      ],
      en: [
        'Lead BIM Implementation and Delivery using BIM tools for various governmental and private sector projects. (NEOM Projects)',
        'Coordinated Infrastructure multi-disciplinary models in line with ISO 19650 standards.',
        'Deliver BOQs and detailed design drawings based on LOD 300 modeling.'
      ]
    },
  },
  {
    year: '2022',
    title: { ar: 'مهندس BIM', en: 'BIM Engineer' },
    company: { ar: 'شركة استشارات هندسية', en: 'Engineering Consultancy Firm' },
    description: { 
      ar: 'تطوير نماذج BIM وتنسيق التخصصات',
      en: 'Developing BIM models and coordinating disciplines'
    },
  },
  {
    year: '2020',
    title: { ar: 'مهندس معماري', en: 'Architectural Engineer' },
    company: { ar: 'مكتب تصميم معماري', en: 'Architectural Design Office' },
    description: { 
      ar: 'تصميم المباني وإعداد الرسومات التنفيذية',
      en: 'Building design and preparing construction drawings'
    },
  },
  {
    year: '2018',
    title: { ar: 'بداية المسيرة', en: 'Career Start' },
    company: { ar: 'التخرج من كلية الهندسة', en: 'Engineering Faculty Graduation' },
    description: { 
      ar: 'بكالوريوس هندسة معمارية',
      en: 'Bachelor of Architectural Engineering'
    },
  },
];

const ExperienceTimeline = () => {
  const { t } = useTranslation();
  const { language, direction } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: direction === 'rtl' ? 50 : -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  return (
    <section className="section-padding bg-muted/30">
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
            <span className="gradient-text">{t('experience.title')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('experience.subtitle')}
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Timeline Line */}
          <div className={`timeline-line ${direction === 'rtl' ? 'right-4 md:right-1/2 md:translate-x-1/2' : 'left-4 md:left-1/2 md:-translate-x-1/2'}`} />

          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 
                  ? 'md:flex-row' 
                  : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline Dot */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                className={`absolute w-8 h-8 bg-gradient-to-r from-navy to-blue rounded-full flex items-center justify-center z-10 shadow-glow ${
                  direction === 'rtl' 
                    ? 'right-0 md:right-1/2 md:translate-x-1/2' 
                    : 'left-0 md:left-1/2 md:-translate-x-1/2'
                }`}
              >
                <div className="w-3 h-3 bg-white rounded-full" />
              </motion.div>

              {/* Content Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`neu-card p-6 ${
                  direction === 'rtl' ? 'mr-12' : 'ml-12'
                } md:w-5/12 ${
                  index % 2 === 0 
                    ? direction === 'rtl' ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0'
                    : direction === 'rtl' ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'
                }`}
              >
                {/* Year Badge */}
                <span className="inline-block px-3 py-1 bg-blue-grotto/10 text-blue-grotto text-sm font-semibold rounded-full mb-3">
                  {item.year}
                </span>

                <h3 className="text-xl font-bold text-foreground mb-1">
                  {language === 'ar' ? item.title.ar : item.title.en}
                </h3>
                <p className="text-blue-grotto font-medium mb-2">
                  {language === 'ar' ? item.company.ar : item.company.en}
                </p>
                {Array.isArray(item.description.ar) && language === 'ar' ? (
                  <ul className="text-muted-foreground text-sm list-disc ps-5 space-y-1">
                    {item.description.ar.map((point: string, idx: number) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                ) : language === 'ar' ? (
                  <p className="text-muted-foreground text-sm">{item.description.ar}</p>
                ) : Array.isArray(item.description.en) ? (
                  <ul className="text-muted-foreground text-sm list-disc ps-5 space-y-1">
                    {item.description.en.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">{item.description.en}</p>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
