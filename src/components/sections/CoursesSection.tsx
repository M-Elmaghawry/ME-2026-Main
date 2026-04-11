import { motion, type Easing } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Clock, BarChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { courses as allCourses } from '@/pages/Courses';
import { assetUrl } from '@/lib/utils';

const easeOut: Easing = [0.4, 0, 0.2, 1];

const getLevelColor = (level: string) => {
  if (level === 'مبتدئ' || level === 'Beginner') return 'bg-green-100 text-green-700';
  if (level === 'متوسط' || level === 'Intermediate') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const courses = allCourses.slice(0, 3);

const CoursesSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();

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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <section className="min-h-screen flex items-center py-20 bg-muted/30">
      <div className="section-container w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('courses.title')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('courses.subtitle')}
          </p>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="neu-card h-full overflow-hidden flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={assetUrl(course.image)}
                    alt={language === 'ar' ? course.title.ar : course.title.en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                  
                  {/* Level Badge */}
                  <span className={`absolute top-4 start-4 px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(language === 'ar' ? course.level.ar : course.level.en)}`}>
                    {language === 'ar' ? course.level.ar : course.level.en}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {language === 'ar' ? course.title.ar : course.title.en}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                    {language === 'ar' ? course.description.ar : course.description.en}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-grotto" />
                      <span>{language === 'ar' ? course.duration.ar : course.duration.en}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart className="w-4 h-4 text-blue-grotto" />
                      <span>{t('courses.level')}: {language === 'ar' ? course.level.ar : course.level.en}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="accent"
                    className="w-full group"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    {t('courses.enroll')}
                    <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
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
            variant="outline" 
            size="lg"
            onClick={() => navigate('/courses')}
          >
            {t('courses.viewAll')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;
