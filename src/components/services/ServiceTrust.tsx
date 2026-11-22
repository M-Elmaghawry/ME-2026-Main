import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';
import ResponsiveImage from '@/components/ResponsiveImage';
import { serviceClients } from '@/data/clients';
import { serviceTrustStats as trustStats, serviceCredentials as certifications } from '@/data/serviceTrust';
import { useServicePage, serviceSectionId, type ServiceSectionProps } from './useServicePage';

export default function ServiceTrust({ service, presentation }: ServiceSectionProps) {
  const { isAr, t, reveal } = useServicePage();
  return (
    <section className="bt-trust" aria-labelledby={serviceSectionId(service, 'credentials')}>
      <div className="section-container">
        <dl className="bt-stats">
          {trustStats.map((stat, i) => <motion.div key={stat.labelEn} {...reveal} custom={i}>
            <dt>{isAr ? stat.labelAr : stat.labelEn}</dt><dd dir="ltr">{stat.value}</dd>
          </motion.div>)}
        </dl>
        <div className="bt-credentials">
          <div>
            <p className="bt-eyebrow">{t(presentation.trustIntro)}</p>
            <h2 id={serviceSectionId(service, 'credentials')}>{isAr ? 'الشهادات والاعتمادات' : 'Certifications & Credentials'}</h2>
            {presentation.kind === 'training' && <div className="bt-rating"><span className="bt-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={17} />)}</span><p>{isAr ? 'تقييم المتدربين والعملاء على جميع المنصات' : 'Trainees & clients rating across all platforms'}</p></div>}
          </div>
          <ul className="bt-certificate-list">
            {certifications.map(cert => <li key={cert.en}><Award size={20} aria-hidden="true" /><span dir="auto">{t(cert)}</span></li>)}
          </ul>
        </div>
        <div className="bt-clients-heading">
          <h3>{isAr ? 'عملاء وثقوا بنا' : 'Clients Who Trusted Us'}</h3>
        </div>
        <div className="bt-logo-window" dir="ltr">
          <div className="bt-logo-track">
            {[0, 1].map(copy => <div className="bt-logo-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {serviceClients.map(client => <div className="bt-logo" key={client.id}><ResponsiveImage src={client.logo} alt={copy ? '' : client.name} sizes="132px" loading="eager" /></div>)}
            </div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
