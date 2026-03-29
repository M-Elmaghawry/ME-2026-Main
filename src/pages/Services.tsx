import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Building2, Layers, Search, GraduationCap, ArrowLeft, ArrowRight } from 'lucide-react';

export const services = [
  {
    id: 'bim-consulting',
    icon: Building2,
    title: { ar: 'استشارات BIM', en: 'BIM Consulting' },
    description: {
      ar: 'تقديم استشارات متخصصة في تطبيق نظام BIM وتطوير خطط التنفيذ',
      en: 'Providing specialized consulting in BIM implementation and execution plan development',
    },
    fullDescription: {
      ar: 'نقدم خدمات استشارية شاملة لتطبيق نظام نمذجة معلومات البناء BIM في مشاريعكم. نساعدكم في وضع خطط التنفيذ، واختيار البرمجيات المناسبة، وتدريب الفرق، وضمان التكامل السلس بين جميع التخصصات.',
      en: 'We provide comprehensive consulting services for implementing Building Information Modeling (BIM) in your projects. We help you develop execution plans, select appropriate software, train teams, and ensure seamless integration between all disciplines.',
    },
  },
  {
    id: 'revit-modeling',
    icon: Layers,
    title: { ar: 'نمذجة Revit', en: 'Revit Modeling' },
    description: {
      ar: 'إنشاء نماذج ثلاثية الأبعاد دقيقة للمشاريع المعمارية والإنشائية',
      en: 'Creating accurate 3D models for architectural and structural projects',
    },
    fullDescription: {
      ar: 'نقوم بإنشاء نماذج Revit عالية الجودة والدقة لجميع أنواع المشاريع. يشمل ذلك النمذجة المعمارية، الإنشائية، والميكانيكية والكهربائية. نضمن التوافق مع معايير LOD المطلوبة.',
      en: 'We create high-quality, accurate Revit models for all types of projects. This includes architectural, structural, and MEP modeling. We ensure compliance with required LOD standards.',
    },
  },
  {
    id: 'clash-detection',
    icon: Search,
    title: { ar: 'كشف التعارضات', en: 'Clash Detection' },
    description: {
      ar: 'تحليل وكشف التعارضات بين الأنظمة المختلفة باستخدام Navisworks',
      en: 'Analyzing and detecting clashes between different systems using Navisworks',
    },
    fullDescription: {
      ar: 'نستخدم برنامج Navisworks لتحليل النماذج المدمجة وكشف التعارضات بين التخصصات المختلفة قبل البدء في التنفيذ. هذا يوفر الوقت والتكاليف ويضمن جودة التنفيذ.',
      en: 'We use Navisworks to analyze federated models and detect clashes between different disciplines before construction begins. This saves time and costs while ensuring quality execution.',
    },
  },
  {
    id: 'training',
    icon: GraduationCap,
    title: { ar: 'التدريب والتأهيل', en: 'Training & Qualification' },
    description: {
      ar: 'برامج تدريبية متخصصة في برامج BIM للأفراد والشركات',
      en: 'Specialized training programs in BIM software for individuals and companies',
    },
    fullDescription: {
      ar: 'نقدم برامج تدريبية شاملة ومتخصصة في جميع برامج BIM. تشمل دوراتنا Revit، Navisworks، BIM 360، وغيرها. متاحة للأفراد والشركات، حضورياً وأونلاين.',
      en: 'We offer comprehensive and specialized training programs in all BIM software. Our courses include Revit, Navisworks, BIM 360, and more. Available for individuals and companies, in-person and online.',
    },
  },
];

const Services = () => {
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
              <span className="gradient-text">{t('services.title')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/services/${service.id}`}>
                    <div className="neu-card h-full p-8 transition-all duration-300 hover:shadow-glow hover:-translate-y-2 group cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-r from-navy to-blue rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {language === 'ar' ? service.title.ar : service.title.en}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {language === 'ar' ? service.description.ar : service.description.en}
                      </p>
                      <Button variant="ghost" className="text-blue-grotto group-hover:text-navy p-0">
                        {t('common.viewDetails')}
                        <Arrow className="w-4 h-4 ms-1 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Services;
