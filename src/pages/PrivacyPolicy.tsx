import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const sections = language === 'ar' ? [
    {
      title: 'جمع المعلومات',
      content: 'نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند استخدام خدماتنا، بما في ذلك الاسم والبريد الإلكتروني ورقم الهاتف عند التواصل معنا أو التسجيل في دوراتنا التدريبية.'
    },
    {
      title: 'استخدام المعلومات',
      content: 'نستخدم المعلومات التي نجمعها لتقديم خدماتنا وتحسينها، والتواصل معك بشأن الدورات والخدمات، وإرسال التحديثات والعروض ذات الصلة.'
    },
    {
      title: 'حماية المعلومات',
      content: 'نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف.'
    },
    {
      title: 'مشاركة المعلومات',
      content: 'لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط مع مقدمي الخدمات الموثوقين الذين يساعدوننا في تشغيل موقعنا وتقديم خدماتنا.'
    },
    {
      title: 'ملفات تعريف الارتباط',
      content: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.'
    },
    {
      title: 'حقوقك',
      content: 'لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها. يمكنك التواصل معنا في أي وقت لممارسة هذه الحقوق.'
    },
    {
      title: 'التواصل معنا',
      content: 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر البريد الإلكتروني أو الهاتف المتوفر في صفحة التواصل.'
    }
  ] : [
    {
      title: 'Information Collection',
      content: 'We collect information you provide directly to us when using our services, including name, email, and phone number when contacting us or registering for our training courses.'
    },
    {
      title: 'Use of Information',
      content: 'We use the information we collect to provide and improve our services, communicate with you about courses and services, and send relevant updates and offers.'
    },
    {
      title: 'Information Protection',
      content: 'We take appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.'
    },
    {
      title: 'Information Sharing',
      content: 'We do not sell or rent your personal information to third parties. We may only share your information with trusted service providers who help us operate our website and deliver our services.'
    },
    {
      title: 'Cookies',
      content: 'We use cookies to improve your experience on our website. You can control cookie settings through your browser.'
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, correct, or delete your personal information. You can contact us at any time to exercise these rights.'
    },
    {
      title: 'Contact Us',
      content: 'If you have any questions about this privacy policy, please contact us via email or phone available on the contact page.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero pt-32 pb-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </h1>
            </div>
            <p className="text-white/80 text-lg">
              {language === 'ar' 
                ? 'نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية'
                : 'We respect your privacy and are committed to protecting your personal data'}
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

export default PrivacyPolicy;
