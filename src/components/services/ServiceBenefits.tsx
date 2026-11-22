import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import ResponsiveImage from '@/components/ResponsiveImage';
import { useServicePage, serviceSectionId, type ServiceSectionProps } from './useServicePage';

export default function ServiceBenefits({ service, presentation }: ServiceSectionProps) {
  const { isAr, t, reveal } = useServicePage();
  const media = presentation.benefits.variant === 'with-media' ? presentation.benefits.media : undefined;
  return (
    <section className="bt-section bt-value" aria-labelledby={serviceSectionId(service, 'benefits')}>
      <div className="section-container">
        <div className="bt-section-head"><p className="bt-eyebrow">{isAr ? 'القيمة التي ستحصل عليها' : 'What You Will Get'}</p><h2 id={serviceSectionId(service, 'benefits')}>{isAr ? 'لماذا تختارنا لهذه الخدمة؟' : 'Why Choose Us for This Service?'}</h2></div>
        <div className={`bt-benefits-grid${media ? '' : ' bt-benefits-grid--list'}`}>
          {media && <motion.div {...reveal} className="bt-session-image"><ResponsiveImage src={media.src} sizes="(min-width: 1024px) 560px, (min-width: 640px) 720px, calc(100vw - 32px)" alt={t(media.alt)} /></motion.div>}
          <ul className="bt-benefits-list">{service.benefits.map((benefit, i) => <motion.li key={benefit.en} {...reveal} custom={i}><span className="bt-check"><Check size={16} aria-hidden="true" /></span><span>{t(benefit)}</span></motion.li>)}</ul>
        </div>
      </div>
    </section>
  );
}
