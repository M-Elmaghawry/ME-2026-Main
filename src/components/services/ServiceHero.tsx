import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResponsiveImage from '@/components/ResponsiveImage';
import { WHATSAPP_LINK } from '@/config/site';
import { useServicePage, serviceSectionId, type ServiceSectionProps } from './useServicePage';

export default function ServiceHero({ service, presentation }: ServiceSectionProps) {
  const { isAr, direction, language, t, reveal, reducedMotion } = useServicePage();
  const BackArrow = direction === 'rtl' ? ArrowRight : ArrowLeft;
  const Icon = service.icon;
  const heading = presentation.hero.headings?.[language] ?? { main: t(service.title) };
  return (
    <section className="bt-hero" aria-labelledby={serviceSectionId(service, 'title')}>
      <div className="section-container">
        <motion.div initial={reducedMotion ? false : { opacity: 0, x: direction === 'rtl' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/services" className="bt-back"><BackArrow size={16} aria-hidden="true" />{isAr ? 'العودة للخدمات' : 'Back to Services'}</Link>
        </motion.div>
        <div className="bt-hero-grid">
          <div className="bt-hero-copy">
            <motion.p {...reveal} className="bt-eyebrow"><Icon size={18} aria-hidden="true" />{t(presentation.hero.eyebrow)}</motion.p>
            <motion.h1 {...reveal} custom={1} id={serviceSectionId(service, 'title')}>
              {heading.main}{heading.qualifier && <span className="bt-title-audience">{heading.qualifier}</span>}
            </motion.h1>
            <motion.p {...reveal} custom={2} className="bt-intro">{t(service.fullDescription)}</motion.p>
            <motion.div {...reveal} custom={3} className="bt-actions">
              <Button variant="whatsapp" size="lg" onClick={() => window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer')}>
                <MessageCircle aria-hidden="true" />{isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
              </Button>
              <Button asChild variant="outline" size="lg"><Link to="/contact"><Phone aria-hidden="true" />{isAr ? 'تواصل معنا' : 'Contact Us'}</Link></Button>
            </motion.div>
            {presentation.hero.note && <motion.p {...reveal} custom={4} className="bt-format"><Check size={16} aria-hidden="true" />{t(presentation.hero.note)}</motion.p>}
          </div>
          <motion.div initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="bt-hero-image">
            <ResponsiveImage priority src={presentation.hero.src} sizes="(min-width: 1280px) 590px, (min-width: 1024px) 48vw, (min-width: 640px) 720px, calc(100vw - 32px)" alt={t(presentation.hero.alt)} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
