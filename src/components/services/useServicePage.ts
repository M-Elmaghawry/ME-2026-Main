import { useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import type { BilingualText, Service } from '@/data/services';
import type { ServicePresentation } from '@/data/servicePresentation';

export interface ServiceSectionProps { service: Service; presentation: ServicePresentation }

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export function serviceSectionId(service: Service, section: string) {
  // Preserve the training page's existing anchors.
  return `${service.id === 'bim-training' ? 'training' : service.id}-${section}`;
}

export function useServicePage() {
  const { language, direction } = useLanguage();
  const reducedMotion = useReducedMotion();
  return {
    language, direction, reducedMotion, isAr: language === 'ar',
    t: (text: BilingualText) => text[language],
    reveal: {
      variants: fadeUp,
      initial: reducedMotion ? false as const : 'hidden',
      whileInView: 'visible',
      viewport: { once: true, amount: 0.15 },
    },
  };
}
