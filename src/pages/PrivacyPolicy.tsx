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
      content: 'يرسل نموذج التواصل اسمك وبريدك الإلكتروني ورسالتك، ورقم الهاتف والشركة والخدمة إن أضفتها، عبر EmailJS للرد على طلبك. حقول الهاتف والشركة والخدمة اختيارية.'
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
      content: 'تُعالج بيانات نموذج التواصل عبر EmailJS ومزوّد البريد المرتبط به. تُحمّل خرائط Google في صفحة التواصل والخطوط من Google Fonts، وقد تتلقى هذه الخدمات معلومات المتصفح والاتصال. عند تفعيل reCAPTCHA، يُستخدم تحقق Google لمكافحة الرسائل الآلية. تنقلك روابط واتساب ومنصات الدورات إلى خدمات خارجية بسياساتها الخاصة.'
    },
    {
      title: 'التخزين في المتصفح',
      content: 'نحفظ اختيار اللغة وتوقيت آخر محاولة إرسال في التخزين المحلي للمتصفح. لا يُحفظ نص رسالتك أو بريدك في هذا التخزين. قد تستخدم خدمات Google المضمّنة تقنيات تخزين خاصة بها؛ ويمكن التحكم في التخزين من إعدادات المتصفح.'
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
      content: 'The contact form sends your name, email, and message, plus phone, company, and service if provided, through EmailJS so we can respond. Phone, company, and service are optional.'
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
      content: 'Contact data is processed through EmailJS and its connected email provider. The contact page loads Google Maps, and fonts load from Google Fonts; these services may receive browser and connection information. When enabled, Google reCAPTCHA verifies submissions to reduce spam. WhatsApp and course links take you to external services governed by their own policies.'
    },
    {
      title: 'Browser Storage',
      content: 'We store your language preference and the last send-attempt timestamp in browser local storage. Your message and email address are not saved in that storage. Embedded Google services may use their own storage technologies. You can manage storage through browser settings.'
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
      <section className="pt-32 pb-16" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f5f0e8 50%, hsl(var(--blue-grotto)) 100%)' }}>
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-navy" />
              <h1 className="text-3xl md:text-4xl font-bold text-navy">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </h1>
            </div>
            <p className="text-navy/70 text-lg">
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
