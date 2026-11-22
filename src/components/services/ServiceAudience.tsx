import { motion } from 'framer-motion';
import { useServicePage, serviceSectionId, type ServiceSectionProps } from './useServicePage';

export default function ServiceAudience({ service, presentation }: ServiceSectionProps) {
  const { isAr, t, reveal } = useServicePage();
  const audienceIcons = presentation.audienceIcons;
  return (
    <section className="bt-section" aria-labelledby={serviceSectionId(service, 'audience')}>
      <div className="section-container">
        <div className="bt-section-head"><p className="bt-eyebrow">{isAr ? 'لمن هذه الخدمة؟' : 'Who Is This For?'}</p><h2 id={serviceSectionId(service, 'audience')}>{isAr ? 'هذه الخدمة مناسبة لك إذا كنت…' : 'This service is right for you if you are…'}</h2></div>
        <div className="bt-audience-grid">
          {service.targets.map((target, i) => {
            const Icon = audienceIcons[i % audienceIcons.length];
            return <motion.article key={target.en} {...reveal} custom={i} className="bt-audience-card"><div className="bt-icon"><Icon size={25} strokeWidth={1.5} aria-hidden="true" /></div><h3>{t(target)}</h3></motion.article>;
          })}
        </div>
      </div>
    </section>
  );
}
