export interface Testimonial {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  role: {
    ar: string;
    en: string;
  };
  content: {
    ar: string;
    en: string;
  };
  rating: number;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: { ar: 'م. أحمد محمود', en: 'Eng. Ahmed Mahmoud' },
    role: { ar: 'مدير مشروع - شركة المقاولات العربية', en: 'Project Manager - Arab Contractors' },
    content: {
      ar: 'عملت مع المهندس محمود في عدة مشاريع وكان دائماً يتميز بالدقة والاحترافية. خبرته في BIM ساعدتنا على تجنب الكثير من المشاكل في الموقع.',
      en: 'I worked with Eng. Mahmoud on several projects and he always stood out for his precision and professionalism. His BIM expertise helped us avoid many site issues.',
    },
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
  },
  {
    id: '2',
    name: { ar: 'م. سارة أحمد', en: 'Eng. Sara Ahmed' },
    role: { ar: 'مهندسة معمارية - دار الهندسة', en: 'Architect - Dar Al-Handasah' },
    content: {
      ar: 'الدورات التدريبية التي قدمها المهندس محمود كانت ممتازة. أسلوبه في الشرح واضح ومبسط، واستفدت كثيراً من خبرته العملية.',
      en: 'The training courses provided by Eng. Mahmoud were excellent. His explanation style is clear and simple, and I benefited greatly from his practical experience.',
    },
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  },
  {
    id: '3',
    name: { ar: 'م. خالد العمري', en: 'Eng. Khaled Al-Omari' },
    role: { ar: 'مدير BIM - شركة بن لادن', en: 'BIM Manager - Bin Laden Company' },
    content: {
      ar: 'استشارات BIM التي قدمها لنا المهندس محمود ساعدتنا في تطوير عملياتنا بشكل كبير. نتائج ملموسة وتحسن واضح في جودة المخرجات.',
      en: 'The BIM consulting provided by Eng. Mahmoud helped us significantly improve our processes. Tangible results and clear improvement in output quality.',
    },
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  },
  {
    id: '4',
    name: { ar: 'م. نورا السيد', en: 'Eng. Noura Al-Sayed' },
    role: { ar: 'مهندسة تنسيق - أوراسكوم', en: 'Coordination Engineer - Orascom' },
    content: {
      ar: 'خبرة المهندس محمود في Navisworks وكشف التعارضات لا مثيل لها. وفر علينا الكثير من الوقت والتكاليف في مشاريعنا.',
      en: "Eng. Mahmoud's expertise in Navisworks and clash detection is unmatched. He saved us a lot of time and costs in our projects.",
    },
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
  },
];
