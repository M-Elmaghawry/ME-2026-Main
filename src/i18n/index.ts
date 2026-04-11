import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // Navigation
      nav: {
        home: 'الرئيسية',
        about: 'من أنا؟',
        services: 'الخدمات',
        courses: 'الدورات',
        portfolio: 'الأعمال',
        clients: 'العملاء',
        testimonials: 'آراء العملاء',
        contact: 'تواصل معنا',
      },
      // Hero
      hero: {
        greeting: 'مرحباً، أنا',
        name: 'م. محمود المكاوى',
        title: 'مهندس BIM أول | منسق BIM محترف',
        subtitle: 'أساعد الشركات والمهندسين على تحقيق أقصى استفادة من تقنيات ودقة BIM لتنفيذ مشاريع أكثر كفاءة وأقل أخطاء، مع فرق تعرف كيف تستخدم BIM بالطريقة الصحيحة.<br> <strong>بخبرة تزيد عن 13 عاماً</strong> في السعودية ومصر، و<strong>كمهندس محترف (PE)</strong> معتمد من الهيئة السعودية للمهندسين.',
        cta: {
          whatsapp: 'تواصل عبر واتساب',
          consultation: 'احجز استشارة',
          services: 'استعرض الخدمات',
        },
      },
      // Experience
      experience: {
        title: 'مسيرتي المهنية',
        subtitle: 'خبرة تمتد لسنوات في أكبر المشاريع الهندسية',
      },
      // Services
      services: {
        title: 'خدماتي',
        subtitle: 'حلول BIM متكاملة لمشاريعك',
        viewAll: 'عرض كل الخدمات',
        items: {
          bimConsulting: {
            title: 'استشارات BIM',
            description: 'تقديم استشارات متخصصة لتطبيق منهجية BIM في مشاريعك',
          },
          revitModeling: {
            title: 'نمذجة Revit',
            description: 'إنشاء نماذج ثلاثية الأبعاد دقيقة باستخدام Autodesk Revit',
          },
          clashDetection: {
            title: 'كشف التعارضات',
            description: 'تحليل وكشف التعارضات بين التخصصات المختلفة',
          },
          training: {
            title: 'التدريب',
            description: 'دورات تدريبية متخصصة في برامج BIM',
          },
        },
      },
      // Courses
      courses: {
        title: 'الدورات التدريبية',
        subtitle: 'تعلم من خبير واحترف مهارات BIM',
        viewAll: 'عرض كل الدورات',
        level: 'المستوى',
        duration: 'المدة',
        enroll: 'سجل الآن',
      },
      // Testimonials
      testimonials: {
        title: 'ماذا يقول عملاؤنا',
        subtitle: 'آراء من عملوا معنا',
      },
      // CTA
      cta: {
        title: 'هل لديك مشروع؟',
        subtitle: 'دعنا نساعدك في تحقيق رؤيتك الهندسية',
        button: 'ابدأ الآن',
      },
      // Footer
      footer: {
        description: 'خبير في نمذجة معلومات البناء BIM، أساعد الشركات والمهندسين على تنفيذ مشاريع أكثر كفاءة ودقة.<br><br><strong>أتخصص في محورين:</strong><ul style="margin-top:8px;padding-inline-start:16px;list-style:disc"><li><strong>هندسة وتنسيق BIM</strong> — تسليم مشاريع البنية التحتية والإنشاءات باستخدام Revit وNavisworks وCivil 3D طبقا لمعايير الأيزو 19650</li><li><strong>التدريب الهندسى على BIM</strong> — بصفتى محاضر معتمد من شركة أتوديسك أعمل على تصميم وتقديم برامج تدريبية للشركات والمكاتب الهندسية</li></ul>',
        quickLinks: 'روابط سريعة',
        contact: 'تواصل معنا',
        followUs: 'تابعنا',
        rights: 'جميع الحقوق محفوظة',
      },
      // Common
      common: {
        readMore: 'اقرأ المزيد',
        learnMore: 'تعرف على المزيد',
        viewDetails: 'عرض التفاصيل',
        language: 'English',
      },
    },
  },
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        about: 'Who Am I?',
        services: 'Services',
        courses: 'Courses',
        portfolio: 'Portfolio',
        clients: 'Clients',
        testimonials: 'Testimonials',
        contact: 'Contact',
      },
      // Hero
      hero: {
        greeting: 'Hello, I am',
        name: 'Eng. Mahmoud Elmekawy',
        title: 'Senior BIM Engineer | BIM Coordinator',
        subtitle: 'I help engineering firms build better projects — faster, with fewer errors, and teams that actually know how to use BIM the right way.<br> <strong>With +13 years of experience</strong> across Saudi Arabia and Egypt, and <strong>as a Professional Engineer (PE) </strong>certified by the Saudi Council of Engineers.',
        cta: {
          whatsapp: 'Chat on WhatsApp',
          consultation: 'Book Consultation',
          services: 'View Services',
        },
      },
      // Experience
      experience: {
        title: 'My Career Journey',
        subtitle: 'Years of experience in major engineering projects',
      },
      // Services
      services: {
        title: 'My Services',
        subtitle: 'Comprehensive BIM solutions for your projects',
        viewAll: 'View All Services',
        items: {
          bimConsulting: {
            title: 'BIM Consulting',
            description: 'Specialized consulting for implementing BIM methodology in your projects',
          },
          revitModeling: {
            title: 'Revit Modeling',
            description: 'Creating accurate 3D models using Autodesk Revit',
          },
          clashDetection: {
            title: 'Clash Detection',
            description: 'Analysis and detection of clashes between different disciplines',
          },
          training: {
            title: 'Training',
            description: 'Specialized training courses in BIM software',
          },
        },
      },
      // Courses
      courses: {
        title: 'Training Courses',
        subtitle: 'Learn from an expert and master BIM skills',
        viewAll: 'View All Courses',
        level: 'Level',
        duration: 'Duration',
        enroll: 'Enroll Now',
      },
      // Testimonials
      testimonials: {
        title: 'What Our Clients Say',
        subtitle: 'Opinions from those who worked with us',
      },
      // CTA
      cta: {
        title: 'Have a Project?',
        subtitle: 'Let us help you achieve your engineering vision',
        button: 'Start Now',
      },
      // Footer
      footer: {
        description: 'I help engineering firms build better projects — faster, with fewer errors, and teams that actually know how to use BIM the right way.<br><br><strong>I specialize in two areas:</strong><ul style="margin-top:8px;padding-inline-start:16px;list-style:disc"><li><strong>BIM Engineering &amp; Coordination</strong> —  Delivery for infrastructure &amp; structural projects. LOD 300/400, ISO 19650 compliance, clash detection &amp; BOQ .</li><li><strong>Corporate BIM Training</strong> (Autodesk Certified Instructor) — Designing &amp; delivering BIM training for engineering firms. </li></ul>',
        quickLinks: 'Quick Links',
        contact: 'Contact Us',
        followUs: 'Follow Us',
        rights: 'All Rights Reserved',
      },
      // Common
      common: {
        readMore: 'Read More',
        learnMore: 'Learn More',
        viewDetails: 'View Details',
        language: 'العربية',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
