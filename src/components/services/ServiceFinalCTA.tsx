import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WHATSAPP_LINK } from '@/config/site';
import { useServicePage, serviceSectionId, type ServiceSectionProps } from './useServicePage';

export default function ServiceFinalCTA({ service }: ServiceSectionProps) {
  const { isAr, t, reveal } = useServicePage();
  return (
    <section className="bt-section bt-contact-section" aria-labelledby={serviceSectionId(service, 'contact')}>
      <div className="section-container">
        <motion.div {...reveal} className="bt-contact">
          <div className="bt-contact-primary"><p className="bt-eyebrow">{t(service.title)}</p><h2 id={serviceSectionId(service, 'contact')}>{isAr ? 'تواصل سريع عبر واتساب' : 'Quick WhatsApp Chat'}</h2><p>{isAr ? 'رد سريع خلال دقائق' : 'Quick reply within minutes'}</p><Button variant="whatsapp" size="lg" onClick={() => window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer')}><MessageCircle aria-hidden="true" />{isAr ? 'ابدأ المحادثة' : 'Start Chat'}</Button></div>
          <div className="bt-contact-secondary"><Phone size={25} strokeWidth={1.5} aria-hidden="true" /><h3>{isAr ? 'أرسل طلبك بالتفصيل' : 'Send Your Request in Detail'}</h3><p>{isAr ? 'ملء نموذج التواصل بتفاصيل مشروعك' : 'Fill the contact form with your project details'}</p><Button asChild variant="outline" size="lg"><Link to="/contact">{isAr ? 'صفحة التواصل' : 'Contact Page'}</Link></Button></div>
        </motion.div>
      </div>
    </section>
  );
}
