import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const Terms = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const sections = language === 'ar' ? [
    {
      title: 'قبول الشروط',
      content: 'باستخدامك لهذا الموقع وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.'
    },
    {
      title: 'الخدمات',
      content: 'نقدم خدمات استشارية في مجال BIM والتصميم المعماري والإنشائي، بالإضافة إلى دورات تدريبية في برامج Revit وNavisworks وغيرها. تخضع جميع الخدمات للتوافر والشروط المحددة لكل خدمة.'
    },
    {
      title: 'الدورات التدريبية',
      content: 'عند التسجيل في دوراتنا التدريبية، تلتزم بحضور الجلسات المحددة واحترام حقوق الملكية الفكرية للمحتوى. لا يجوز نسخ أو توزيع أو إعادة بيع أي من المواد التدريبية دون إذن كتابي مسبق.'
    },
    {
      title: 'الدفع والاسترداد',
      content: 'يتم الدفع وفقًا للشروط المحددة لكل خدمة أو دورة. سياسة الاسترداد تعتمد على نوع الخدمة والوقت المتبقي قبل البدء. يرجى التواصل معنا للحصول على تفاصيل محددة.'
    },
    {
      title: 'الملكية الفكرية',
      content: 'جميع المحتويات على هذا الموقع، بما في ذلك النصوص والصور والشعارات والمواد التدريبية، محمية بحقوق الملكية الفكرية ولا يجوز استخدامها دون إذن.'
    },
    {
      title: 'حدود المسؤولية',
      content: 'نسعى لتقديم معلومات دقيقة وخدمات عالية الجودة، لكننا لا نضمن أن الموقع سيكون خاليًا من الأخطاء أو متاحًا بشكل مستمر. لن نكون مسؤولين عن أي أضرار غير مباشرة ناتجة عن استخدام خدماتنا.'
    },
    {
      title: 'التعديلات',
      content: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة، ويعتبر استمرارك في استخدام الموقع موافقة على التعديلات.'
    },
    {
      title: 'القانون الواجب التطبيق',
      content: 'تخضع هذه الشروط للقوانين المعمول بها في جمهورية مصر العربية. أي نزاع ينشأ عن استخدام هذا الموقع يخضع للاختصاص القضائي للمحاكم المصرية.'
    }
  ] : [
    {
      title: 'Acceptance of Terms',
      content: 'By using this website and our services, you agree to be bound by these terms and conditions. If you do not agree to any of these terms, please do not use the site.'
    },
    {
      title: 'Services',
      content: 'We provide consulting services in BIM, architectural, and structural design, as well as training courses in Revit, Navisworks, and other programs. All services are subject to availability and the specific terms of each service.'
    },
    {
      title: 'Training Courses',
      content: 'When registering for our training courses, you commit to attending scheduled sessions and respecting the intellectual property rights of the content. Copying, distributing, or reselling any training materials without prior written permission is prohibited.'
    },
    {
      title: 'Payment and Refunds',
      content: 'Payment is made according to the terms specified for each service or course. The refund policy depends on the type of service and the time remaining before the start. Please contact us for specific details.'
    },
    {
      title: 'Intellectual Property',
      content: 'All content on this website, including text, images, logos, and training materials, is protected by intellectual property rights and may not be used without permission.'
    },
    {
      title: 'Limitation of Liability',
      content: 'We strive to provide accurate information and high-quality services, but we do not guarantee that the site will be error-free or continuously available. We will not be liable for any indirect damages resulting from the use of our services.'
    },
    {
      title: 'Modifications',
      content: 'We reserve the right to modify these terms at any time. Any changes will be posted on this page, and your continued use of the site constitutes acceptance of the modifications.'
    },
    {
      title: 'Governing Law',
      content: 'These terms are governed by the laws applicable in the Arab Republic of Egypt. Any dispute arising from the use of this website is subject to the jurisdiction of the Egyptian courts.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f5f0e8 50%, hsl(var(--blue-grotto)) 100%)' }}>
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="w-10 h-10 text-navy" />
              <h1 className="text-3xl md:text-4xl font-bold text-navy">
                {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </h1>
            </div>
            <p className="text-navy/70 text-lg">
              {language === 'ar' 
                ? 'يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا'
                : 'Please read these terms carefully before using our services'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-container section-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 shadow-lg"
          >
            <p className="text-muted-foreground mb-8">
              {language === 'ar'
                ? `آخر تحديث: ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}`
                : `Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
            </p>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <h2 className="text-xl font-bold text-foreground mb-3">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Terms;
