import { Building2, GraduationCap, HardHat, Layers, UserCheck, type LucideIcon } from 'lucide-react';
import type { BilingualText } from './services';

export type ServiceId = 'bim-training' | 'bim-coordination' | 'autoCAD-to-revit' | 'infrastructure-bim' | 'structural-shop-drawings' | 'structural-quantity-takeoffs';
interface Heading { main: string; qualifier?: string }
interface ServiceMedia { src: string; alt: BilingualText }
export interface ServicePresentation {
  kind: 'training' | 'engineering';
  hero: ServiceMedia & {
    eyebrow: BilingualText;
    headings?: { ar: Heading; en: Heading };
    note?: BilingualText;
  };
  trustIntro: BilingualText;
  audienceIcons: readonly LucideIcon[];
  benefits: { variant: 'with-media'; media: ServiceMedia } | { variant: 'list-only' };
  testimonialIds: readonly string[];
}

const engineering = {
  kind: 'engineering' as const,
  trustIntro: { ar: 'الخبرة المهنية', en: 'Professional background' },
  audienceIcons: [Building2, HardHat, Layers, UserCheck],
  benefits: { variant: 'list-only' as const },
  testimonialIds: [],
};
const engineeringEyebrow = { ar: 'خدمات BIM الهندسية', en: 'BIM engineering services' };

// Exact public URLs: keep presentation separate from business data and SEO image selection.
export const servicePresentation: Record<ServiceId, ServicePresentation> = {
  'bim-training': {
    kind: 'training',
    hero: {
      src: '/services/01-BIM-Training.jpg',
      alt: { ar: 'نموذج هيكلي ثلاثي الأبعاد ورسومات هندسية للتدريب على نمذجة معلومات المباني', en: 'Structural BIM model and engineering drawings for practical BIM training' },
      eyebrow: { ar: 'تدريب عملي للأفراد والشركات', en: 'Practical training for individuals & teams' },
      headings: {
        ar: { main: 'التدريب الاحترافي على نمذجة معلومات المباني ', qualifier: '(للأفراد والشركات)' },
        en: { main: 'Professional BIM Training ', qualifier: '(Individuals & Corporate)' },
      },
      note: { ar: 'جداول مرنة: حضوري وأونلاين', en: 'Flexible schedules: in-person and online' },
    },
    trustIntro: { ar: 'الخبرة التي تدعم تدريبك', en: 'Experience behind your training' },
    audienceIcons: [HardHat, Building2, Layers, GraduationCap],
    benefits: {
      variant: 'with-media',
      media: { src: '/training-courses/01-Dar-Wa-Emaar.jpg', alt: { ar: 'محمود المكاوي يقدم تدريباً عملياً على BIM لفريق دار وإعمار', en: 'Mahmoud Elmekawy delivering practical BIM training for the Dar Wa Emaar team' } },
    },
    testimonialIds: ['1', '2', '3'],
  },
  'bim-coordination': {
    ...engineering,
    hero: {
      src: '/services/02-BIM-Coordination.jpg', eyebrow: engineeringEyebrow,
      alt: { ar: 'نموذج BIM يجمع الهيكل والأنظمة الميكانيكية والكهربائية لكشف التداخلات', en: 'Federated structural and MEP BIM model illustrating coordination and clash detection' },
      // The Arabic (BIM) is part of the title, not a subtitle delimiter.
    },
  },
  'autoCAD-to-revit': {
    ...engineering,
    hero: {
      src: '/services/03-Autocad-to-Revit.jpg', eyebrow: engineeringEyebrow,
      alt: { ar: 'رسومات AutoCAD ثنائية الأبعاد بجوار نموذج Revit إنشائي ثلاثي الأبعاد', en: '2D AutoCAD drawings alongside a three-dimensional structural Revit model' },
      headings: { ar: { main: 'تحويل ملفات AutoCAD إلى Revit' }, en: { main: 'AutoCAD to Revit Conversion ', qualifier: '(Structural & Architectural)' } },
    },
  },
  'infrastructure-bim': {
    ...engineering,
    hero: {
      src: '/services/04-Infrastructure.jpg', eyebrow: engineeringEyebrow,
      alt: { ar: 'نموذج BIM لطرق وجسر وشبكات مرافق تحت الأرض', en: 'Infrastructure BIM model showing roads, a bridge and underground utility networks' },
      headings: {
        ar: { main: 'نمذجة معلومات المباني للبنية التحتية ', qualifier: '(الطرق وشبكات المرافق)' },
        en: { main: 'Infrastructure BIM Modeling ', qualifier: '(Roads & Utility Networks)' },
      },
    },
  },
  'structural-shop-drawings': {
    ...engineering,
    hero: {
      src: '/services/05-STR-ShopDrawing.jpg', eyebrow: engineeringEyebrow,
      alt: { ar: 'نموذج إنشائي وتفاصيل حديد التسليح ورسومات تنفيذية', en: 'Structural model, reinforcement details and structural shop drawing sheets' },
      headings: {
        ar: { main: 'الرسومات التنفيذية الإنشائية ', qualifier: '(الخرسانة وحديد التسليح)' },
        en: { main: 'Structural Shop Drawings ', qualifier: '(Concrete & Rebar)' },
      },
    },
  },
  'structural-quantity-takeoffs': {
    ...engineering,
    hero: {
      src: '/services/06-BOQ.jpg', eyebrow: engineeringEyebrow,
      alt: { ar: 'نموذج إنشائي ثلاثي الأبعاد مع جدول حصر الكميات والوحدات', en: 'Three-dimensional structural model with a quantity takeoff table and units' },
    },
  },
};

export function getServicePresentation(id: string): ServicePresentation {
  if (!Object.prototype.hasOwnProperty.call(servicePresentation, id)) {
    throw new Error(`Missing service presentation and image mapping: ${id}`);
  }
  return servicePresentation[id as ServiceId];
}
