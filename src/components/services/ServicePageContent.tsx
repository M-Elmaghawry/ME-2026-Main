import type { ServiceSectionProps } from './useServicePage';
import { useServicePage } from './useServicePage';
import ServiceHero from './ServiceHero';
import ServiceTrust from './ServiceTrust';
import ServiceAudience from './ServiceAudience';
import ServiceBenefits from './ServiceBenefits';
import ServiceProcess from './ServiceProcess';
import ServiceTestimonials from './ServiceTestimonials';
import ServiceFinalCTA from './ServiceFinalCTA';
import './service-detail.css';

export default function ServicePageContent(props: ServiceSectionProps) {
  const { direction } = useServicePage();
  return <div className={`service-detail${props.presentation.kind === 'training' ? ' bim-training' : ''}`} dir={direction} data-service={props.service.id}>
    <ServiceHero {...props} />
    <ServiceTrust {...props} />
    <ServiceAudience {...props} />
    <ServiceBenefits {...props} />
    <ServiceProcess {...props} />
    <ServiceTestimonials {...props} />
    <ServiceFinalCTA {...props} />
  </div>;
}
