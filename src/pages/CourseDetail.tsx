import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { courses } from './Courses';
import { ArrowLeft, ArrowRight, Clock, BarChart, ExternalLink, CheckCircle } from 'lucide-react';
import { assetUrl } from '@/lib/utils';

const getLevelColor = (level: string) => {
  if (level === 'مبتدئ' || level === 'Beginner') return 'bg-green-100 text-green-700';
  if (level === 'متوسط' || level === 'Intermediate') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language, direction } = useLanguage();
  const BackArrow = direction === 'rtl' ? ArrowRight : ArrowLeft;

  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 text-center">
          <h1 className="text-2xl">{language === 'ar' ? 'الدورة غير موجودة' : 'Course not found'}</h1>
          <Link to="/courses" className="text-blue-grotto mt-4 inline-block">
            {language === 'ar' ? 'العودة للدورات' : 'Back to Courses'}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

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
            <Link to="/courses">
              <Button variant="ghost" className="mb-8">
                <BackArrow className="w-4 h-4 me-2" />
                {language === 'ar' ? 'العودة للدورات' : 'Back to Courses'}
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
              {/* Course Image */}
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
                <img
                  src={assetUrl(course.image)}
                  alt={language === 'ar' ? course.title.ar : course.title.en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                <span className={`absolute top-4 start-4 px-4 py-2 rounded-full text-sm font-medium ${getLevelColor(language === 'ar' ? course.level.ar : course.level.en)}`}>
                  {language === 'ar' ? course.level.ar : course.level.en}
                </span>
              </div>

              <div className="neu-card p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {language === 'ar' ? course.title.ar : course.title.en}
                </h1>
                
                <div className="flex items-center gap-6 mb-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-grotto" />
                    <span>{language === 'ar' ? course.duration.ar : course.duration.en}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-grotto" />
                    <span>{language === 'ar' ? course.level.ar : course.level.en}</span>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {language === 'ar' ? course.fullDescription.ar : course.fullDescription.en}
                </p>

                <h2 className="text-2xl font-bold mb-4">
                  {language === 'ar' ? 'محتوى الدورة' : 'Course Syllabus'}
                </h2>
                <div className="space-y-3">
                  {course.syllabus.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{language === 'ar' ? item.ar : item.en}</span>
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
                  {language === 'ar' ? 'سجل في هذه الدورة' : 'Enroll in This Course'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === 'ar' 
                    ? 'ابدأ رحلتك التعليمية اليوم'
                    : 'Start your learning journey today'
                  }
                </p>
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full mb-4"
                  onClick={() => window.open(course.udemyLink, '_blank')}
                >
                  <ExternalLink className="w-5 h-5" />
                  {t('courses.enroll')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => window.open('https://wa.me/201096189832', '_blank')}
                >
                  {language === 'ar' ? 'استفسر عن الدورة' : 'Ask About Course'}
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

export default CourseDetail;
