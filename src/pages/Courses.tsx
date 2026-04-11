import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Clock, BarChart, ArrowLeft, ArrowRight } from 'lucide-react';
import { assetUrl } from '@/lib/utils';

export const courses = [
  {
    id: 'bim-fundamentals',
    title: { ar: 'أساسيات Revit Architecture', en: 'BIM Fundamentals for Civil Engineers' },
    description: {
      ar: 'تعلم أساسيات التصميم المعماري باستخدام برنامج Revit من البداية',
      en: 'Comprehensive introduction to Building Information Modeling',
    },
    fullDescription: {
      ar: 'دورة شاملة تأخذك من الصفر إلى الاحتراف في استخدام برنامج Revit للتصميم المعماري. ستتعلم إنشاء المشاريع، رسم الجدران والأبواب والنوافذ، إنشاء الأسقف والأرضيات، وإخراج اللوحات الهندسية.',
      en: 'Comprehensive introduction to Building Information Modeling concepts, workflows, and best practices. Perfect for engineers transitioning to BIM.',
    },
    level: { ar: 'مبتدئ', en: 'Beginner' },
    duration: { ar: '01 ساعة', en: '01 Hours' },
    image: '/courses/BIM Fundamentals for Civil Engineers.webp',
    udemyLink: 'https://www.udemy.com/course/bim-introduction-free/?referralCode=25EADC46D87F0DCA809A',
    syllabus: [
      { ar: 'مقدمة في برنامج Revit', en: 'Introduction to Revit' },
      { ar: 'إنشاء المشروع والإعدادات', en: 'Project Creation and Settings' },
      { ar: 'رسم الجدران والعناصر الأساسية', en: 'Drawing Walls and Basic Elements' },
      { ar: 'إنشاء الأسقف والأرضيات', en: 'Creating Roofs and Floors' },
      { ar: 'إخراج اللوحات الهندسية', en: 'Producing Engineering Drawings' },
    ],
  },
  {
    id: 'revit-structure-professional-training',
    title: { ar: 'Navisworks للتنسيق وكشف التعارضات', en: 'Revit Structure Professional Training' },
    description: {
      ar: 'احترف استخدام Navisworks لتنسيق النماذج وكشف التعارضات بين التخصصات',
      en: 'Comprehensive introduction to Building Information Modeling and Autodesk Revit for structural engineering. Learn modeling, documentation, and collaboration techniques for efficient project delivery.',
    },
    fullDescription: {
      ar: 'تعلم كيفية استخدام برنامج Navisworks لدمج النماذج من مختلف التخصصات، إجراء اختبارات كشف التعارضات، إنشاء التقارير، وإدارة عملية التنسيق بين الفرق.',
      en: 'Comprehensive introduction to Building Information Modeling and Autodesk Revit for structural engineering. Learn modeling, documentation, and collaboration techniques for efficient project delivery.',
    },
    level: { ar: 'مبتدئ', en: 'Beginner' },
    duration: { ar: '60 ساعة', en: '60 Hours' },
    image: '/courses/Revit Structure Professional Training.webp',
    udemyLink: 'https://www.behance.net/gallery/187155589/_',
    syllabus: [
      { ar: 'مقدمة في Navisworks', en: 'Introduction to Navisworks' },
      { ar: 'دمج النماذج', en: 'Federating Models' },
      { ar: 'كشف التعارضات', en: 'Clash Detection' },
      { ar: 'إنشاء التقارير', en: 'Report Generation' },
    ],
  },
  {
    id: 'revit-structure-workshop-01',
    title: { ar: 'BIM Management متقدم', en: 'Revit Structure Workshop - 01' },
    description: {
      ar: 'دورة متقدمة في إدارة مشاريع BIM وتطبيق أفضل الممارسات العالمية',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques',
    },
    fullDescription: {
      ar: 'دورة متقدمة تغطي جميع جوانب إدارة مشاريع BIM بما في ذلك وضع خطط التنفيذ، إدارة الفرق، ضمان الجودة، والتوافق مع المعايير الدولية مثل ISO 19650.',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques, on Practical Project from start to end',
    },
    level: { ar: 'متوسط', en: 'Intermediate' },
    duration: { ar: '10 ساعة', en: '10 Hours' },
    image: '/courses/Revit Structure Workshop - 01.webp',
    udemyLink: 'https://www.behance.net/gallery/197545865/_',
    syllabus: [
      { ar: 'أساسيات إدارة BIM', en: 'BIM Management Fundamentals' },
      { ar: 'خطة تنفيذ BIM', en: 'BIM Execution Plan' },
      { ar: 'معايير ISO 19650', en: 'ISO 19650 Standards' },
      { ar: 'إدارة الجودة', en: 'Quality Management' },
    ],
  },
  {
    id: 'revit-structure-workshop-02',
    title: { ar: 'BIM Management متقدم', en: 'Revit Structure Workshop - 02' },
    description: {
      ar: 'دورة متقدمة في إدارة مشاريع BIM وتطبيق أفضل الممارسات العالمية',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques',
    },
    fullDescription: {
      ar: 'دورة متقدمة تغطي جميع جوانب إدارة مشاريع BIM بما في ذلك وضع خطط التنفيذ، إدارة الفرق، ضمان الجودة، والتوافق مع المعايير الدولية مثل ISO 19650.',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques, on Practical Project from start to end',
    },
    level: { ar: 'متوسط', en: 'Intermediate' },
    duration: { ar: '10 ساعة', en: '10 Hours' },
    image: '/courses/Revit Structure Workshop - 02.webp',
    udemyLink: 'https://www.behance.net/gallery/186142533/_',
    syllabus: [
      { ar: 'أساسيات إدارة BIM', en: 'BIM Management Fundamentals' },
      { ar: 'خطة تنفيذ BIM', en: 'BIM Execution Plan' },
      { ar: 'معايير ISO 19650', en: 'ISO 19650 Standards' },
      { ar: 'إدارة الجودة', en: 'Quality Management' },
    ],
  },
   {
    id: 'revit-structure-workshop-03',
    title: { ar: 'BIM Management متقدم', en: 'Revit Structure Workshop - 03' },
    description: {
      ar: 'دورة متقدمة في إدارة مشاريع BIM وتطبيق أفضل الممارسات العالمية',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques',
    },
    fullDescription: {
      ar: 'دورة متقدمة تغطي جميع جوانب إدارة مشاريع BIM بما في ذلك وضع خطط التنفيذ، إدارة الفرق، ضمان الجودة، والتوافق مع المعايير الدولية مثل ISO 19650.',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques, on Practical Project from start to end',
    },
    level: { ar: 'متقدم', en: 'Advanced' },
    duration: { ar: '12 ساعة', en: '12 Hours' },
    image: '/courses/Revit Structure Workshop - 03.webp',
    udemyLink: 'https://www.behance.net/gallery/186280023/_',
    syllabus: [
      { ar: 'أساسيات إدارة BIM', en: 'BIM Management Fundamentals' },
      { ar: 'خطة تنفيذ BIM', en: 'BIM Execution Plan' },
      { ar: 'معايير ISO 19650', en: 'ISO 19650 Standards' },
      { ar: 'إدارة الجودة', en: 'Quality Management' },
    ],
  },
];

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
                      <img
                        src={assetUrl(course.image)}
                        alt={language === 'ar' ? course.title.ar : course.title.en}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
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
