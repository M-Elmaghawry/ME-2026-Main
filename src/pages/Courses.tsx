import ResponsiveImage from '@/components/ResponsiveImage';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Clock, BarChart, ArrowLeft, ArrowRight } from 'lucide-react';

import { courses } from '@/data/courses';

const getLevelColor = (level: string) => {
  if (level === 'مبتدئ' || level === 'Beginner') return 'bg-green-100 text-green-700';
  if (level === 'متوسط' || level === 'Intermediate') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const Courses = () => {
  const { t } = useTranslation();
  const { language, direction } = useLanguage();
  const Arrow = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t('courses.title')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('courses.subtitle')}
            </p>
          </motion.div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/courses/${course.id}`}>
                  <div className="neu-card h-full overflow-hidden flex flex-col transition-all duration-300 hover:shadow-glow hover:-translate-y-2 group cursor-pointer">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <ResponsiveImage sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
                        src={course.image}
                        alt={language === 'ar' ? course.title.ar : course.title.en}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                      <span className={`absolute top-4 start-4 px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(language === 'ar' ? course.level.ar : course.level.en)}`}>
                        {language === 'ar' ? course.level.ar : course.level.en}
                      </span>
                      {course.id === 'bim-fundamentals' && (
                        <span className="absolute top-4 end-4 px-3 py-1 rounded-full bg-green-500 text-white text-sm font-bold shadow">
                          {language === 'ar' ? 'مجاني' : 'Free'}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {language === 'ar' ? course.title.ar : course.title.en}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                        {language === 'ar' ? course.description.ar : course.description.en}
                      </p>

                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-grotto" />
                          <span>{language === 'ar' ? course.duration.ar : course.duration.en}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart className="w-4 h-4 text-blue-grotto" />
                          <span>{language === 'ar' ? course.level.ar : course.level.en}</span>
                        </div>
                      </div>

                      <Button variant="ghost" className="text-blue-grotto group-hover:text-navy p-0 justify-start">
                        {t('common.viewDetails')}
                        <Arrow className="w-4 h-4 ms-1 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Courses;
