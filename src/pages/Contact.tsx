import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE, CONTACT_PHONE_DISPLAY, WHATSAPP_LINK } from '@/config/site';

const Contact = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const contactInfo = [
    {
      icon: Phone,
      label: { ar: 'الهاتف', en: 'Phone' },
      value: CONTACT_PHONE_DISPLAY,
      href: `tel:${CONTACT_PHONE}`,
    },
    {
      icon: Mail,
      label: { ar: 'البريد الإلكتروني', en: 'Email' },
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: MapPin,
      label: { ar: 'الموقع', en: 'Location' },
      value: CONTACT_LOCATION[language],
      href: '#locations',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="neu-card p-8">
                <h2 className="text-2xl font-bold mb-6">
                  {language === 'ar' ? 'أرسل رسالة' : 'Send a Message'}
                </h2>
                <ContactForm />
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="neu-card p-8">
                <h2 className="text-2xl font-bold mb-6">
                  {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={index}
                        href={item.href}
                        className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-navy to-blue rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar' ? item.label.ar : item.label.en}
                          </p>
                          <p className="font-medium">{item.value}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="neu-card p-8">
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'ar' ? 'تواصل مباشر' : 'Direct Contact'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'ar' 
                    ? 'للرد السريع، تواصل معنا عبر واتساب'
                    : 'For quick response, contact us via WhatsApp'
                  }
                </p>
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                  onClick={() => window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer')}
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('hero.cta.whatsapp')}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Locations Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            id="locations" className="mt-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              {language === 'ar' ? 'مواقعنا' : 'Our Locations'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mansoura, Egypt */}
              <div className="neu-card overflow-hidden">
                <div className="h-64 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109252.13508684684!2d31.31634895!3d31.0409483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f79db7a9053547%3A0xf8dab3bbed926672!2sMansoura%2C%20Dakahlia%20Governorate%2C%20Egypt!5e0!3m2!1sen!2s!4v1703000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={language === 'ar' ? 'موقع المنصورة' : 'Mansoura Location'}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-navy to-blue rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {language === 'ar' ? 'المنصورة، مصر' : 'Mansoura, Egypt'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'المقر الرئيسي' : 'Headquarters'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Riyadh, Saudi Arabia */}
              <div className="neu-card overflow-hidden">
                <div className="h-64 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463878.2906578517!2d46.54234005!3d24.7249316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1703000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={language === 'ar' ? 'موقع الرياض' : 'Riyadh Location'}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-navy to-blue rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {language === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'المكتب الإقليمي' : 'Regional Office'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
