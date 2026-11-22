import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useServicePage, serviceSectionId, type ServiceSectionProps } from './useServicePage';

export default function ServiceProcess({ service }: ServiceSectionProps) {
  const { isAr, t, reveal } = useServicePage();
  return (
    <section className="bt-section" aria-labelledby={serviceSectionId(service, 'process')}>
      <div className="section-container">
        <div className="bt-section-head"><p className="bt-eyebrow">{isAr ? 'منهجية العمل' : 'Our Process'}</p><h2 id={serviceSectionId(service, 'process')}>{isAr ? 'كيف نعمل معك خطوة بخطوة' : 'How We Work With You, Step by Step'}</h2></div>
        <ol className="bt-timeline" style={{ '--service-step-count': service.process.length } as CSSProperties}>{service.process.map((step, i) => <motion.li key={step.title.en} {...reveal} custom={i}><span className="bt-step" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><div><h3>{t(step.title)}</h3><p>{t(step.desc)}</p></div></motion.li>)}</ol>
      </div>
    </section>
  );
}
