import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { courses } from './Courses';
import { testimonials } from '@/data/testimonials';
import { assetUrl } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Play,
  Star,
  Users,
  Clock,
  Award,
  CheckCircle2,
  Shield,
  MessageCircle,
  ChevronRight,
  BookOpen,
  Video,
  Infinity,
  ArrowRight,
} from 'lucide-react';

// ─── Countdown hook ────────────────────────────────────────────────────────────
function useCountdown() {
  const KEY = 'course-offer-end';
  const getEnd = () => {
    try {
      const stored = sessionStorage.getItem(KEY);
      if (stored) return parseInt(stored);
    } catch { /* noop */ }
    const end = Date.now() + 24 * 3600 * 1000;
    try { sessionStorage.setItem(KEY, end.toString()); } catch { /* noop */ }
    return end;
  };

  const calcRemaining = () => Math.max(0, Math.floor((getEnd() - Date.now()) / 1000));
  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// ─── Supplementary per-course data ────────────────────────────────────────────
interface CourseExtras {
  price: { ar: string; en: string };
  originalPrice: { ar: string; en: string };
  discountLabel: string;
  rating: number;
  ratingCount: number;
  studentsCount: number;
  hoursContent: number;
  tags: string[];
  learningOutcomes: { ar: string[]; en: string[] };
  requirements: { ar: string[]; en: string[] };
  whatIsIncluded: { ar: string[]; en: string[] };
  faq: { ar: { q: string; a: string }[]; en: { q: string; a: string }[] };
}

const COURSE_EXTRAS: Record<string, CourseExtras> = {
  'revit-structure-professional-training': {
    price: { ar: '297 ر.س', en: 'SAR 297' },
    originalPrice: { ar: '497 ر.س', en: 'SAR 497' },
    discountLabel: '40%',
    rating: 4.9,
    ratingCount: 1200,
    studentsCount: 1200,
    hoursContent: 42,
    tags: ['Rebar Modeling', 'Shop Drawings', 'IFC Export', 'ISO 19650', 'BIM LOD 200-400', 'Revit 2024-2025'],
    learningOutcomes: {
      ar: [
        'إنشاء نماذج Revit Structure من الصفر للمباني الإنشائية',
        'إنتاج رسومات Shop Drawings بمعايير احترافية',
        'تطبيق معيار ISO 19650 في بيئات العمل الكبرى',
        'استخدام Dynamo لأتمتة المهام المتكررة وتوفير الوقت',
        'ربط النماذج وكشف التعارضات عبر Navisworks Elem Detection',
        'تصدير ملفات IFC للعمل التشاركي مع الفرق المتعددة',
      ],
      en: [
        'Create Revit Structure models from scratch for structural buildings',
        'Produce professional Shop Drawings to industry standards',
        'Apply ISO 19650 standards in large project environments',
        'Use Dynamo to automate repetitive tasks and save time',
        'Link models and detect clashes via Navisworks Elem Detection',
        'Export IFC files for collaborative multi-discipline workflows',
      ],
    },
    requirements: {
      ar: [
        'كمبيوتر يعمل بنظام Windows بمواصفات مناسبة (64-bit، RAM 16GB+)',
        'نسخة Revit 2022 فأحدث — يمكن تحميلها مجانًا للطلاب',
        'لا يشترط خبرة سابقة في Revit — الكورس يبدأ من الصفر',
        'خلفية دراسية في الهندسة المدنية أو المعمارية أو ما يعادلها',
      ],
      en: [
        'A Windows computer with appropriate specs (64-bit, 16GB+ RAM)',
        'Revit 2022 or later — free student download available',
        'No prior Revit experience required — we start from scratch',
        'Educational background in Civil or Architectural Engineering (or equivalent)',
      ],
    },
    whatIsIncluded: {
      ar: [
        'مدة الدورة: 42+ ساعة فيديو',
        'وصول مدى الحياة لجميع المحتويات',
        'التطبيق على مشاريع حقيقية متعددة',
        'شهادة إتمام معتمدة',
        'دخول محادثة Telegram خاصة',
        'دعم متواصل من المدرب',
      ],
      en: [
        'Course duration: 42+ hours of video',
        'Lifetime access to all content',
        'Application on multiple real-world projects',
        'Accredited completion certificate',
        'Private Telegram group access',
        'Ongoing instructor support',
      ],
    },
    faq: {
      ar: [
        {
          q: 'من الكورس مناسب للمبتدئين؟',
          a: 'نعم، الكورس مصمم ليناسب الجميع. حتى لو لم يكن عندك أي خبرة سابقة في Revit سنبدأ معك من الصفر خطوة بخطوة.',
        },
        {
          q: 'من المصمم للمتخصصين الصغار؟',
          a: 'الكورس مثالي للمهندسين المدنيين والمعماريين الراغبين في الانتقال من التصميم التقليدي 2D إلى BIM.',
        },
        {
          q: 'ما هو نوع الشهادة الممنوحة؟',
          a: 'شهادة إتمام معتمدة من ACI (Autodesk Certified Instructor) تُمنح من أكاديمية مهندس مصر.',
        },
        {
          q: 'كيف أتواصل مع المدرب بعد التسجيل؟',
          a: 'يتم إضافتك فور التسجيل إلى مجموعة Telegram خاصة حيث يمكنك التواصل مع المدرب وزملائك في أي وقت.',
        },
        {
          q: 'هل يمكنني الوصول للمحتوى بعد انتهاء الكورس؟',
          a: 'نعم، لديك وصول مدى الحياة لجميع محتويات الكورس والتحديثات المستقبلية دون أي رسوم إضافية.',
        },
      ],
      en: [
        {
          q: 'Is the course suitable for beginners?',
          a: "Yes, the course is designed for everyone. Even with no prior Revit experience, we start from scratch step by step.",
        },
        {
          q: 'Who is this course designed for?',
          a: "It's ideal for civil and architectural engineers looking to transition from traditional 2D design to BIM.",
        },
        {
          q: 'What type of certificate is granted?',
          a: 'An accredited completion certificate from ACI (Autodesk Certified Instructor) issued by Muhandis Masr Academy.',
        },
        {
          q: 'How can I contact the instructor after enrolling?',
          a: "Upon enrollment, you'll be added to a private Telegram group where you can reach the instructor and fellow students anytime.",
        },
        {
          q: 'Can I access content after the course ends?',
          a: 'Yes, you have lifetime access to all course content and future updates at no extra cost.',
        },
      ],
    },
  },
};

// Defaults for courses without specific extras data
const DEFAULT_EXTRAS: CourseExtras = {
  price: { ar: 'تواصل معنا', en: 'Contact Us' },
  originalPrice: { ar: '', en: '' },
  discountLabel: '',
  rating: 4.8,
  ratingCount: 300,
  studentsCount: 300,
  hoursContent: 10,
  tags: ['BIM', 'Revit', 'Engineering'],
  learningOutcomes: {
    ar: [
      'إتقان المهارات الأساسية للبرنامج',
      'التطبيق العملي على مشاريع حقيقية',
      'الحصول على شهادة إتمام معتمدة',
      'دعم متواصل من المدرب',
    ],
    en: [
      'Master core software skills',
      'Practical application on real projects',
      'Obtain an accredited completion certificate',
      'Ongoing instructor support',
    ],
  },
  requirements: {
    ar: [
      'كمبيوتر يعمل بنظام Windows',
      'خلفية هندسية أساسية',
    ],
    en: [
      'A Windows computer',
      'Basic engineering background',
    ],
  },
  whatIsIncluded: {
    ar: ['ساعات فيديو', 'وصول مدى الحياة', 'شهادة إتمام', 'دعم من المدرب'],
    en: ['Video hours', 'Lifetime access', 'Completion certificate', 'Instructor support'],
  },
  faq: {
    ar: [
      {
        q: 'من الكورس مناسب له؟',
        a: 'الكورس مناسب للمهندسين والطلاب الذين يريدون تطوير مهاراتهم في BIM.',
      },
      {
        q: 'كيف أتواصل مع المدرب؟',
        a: 'يتم إضافتك إلى مجموعة Telegram خاصة للتواصل والدعم.',
      },
    ],
    en: [
      {
        q: 'Who is the course suitable for?',
        a: 'The course is suitable for engineers and students who want to develop their BIM skills.',
      },
      {
        q: 'How can I contact the instructor?',
        a: 'You will be added to a private Telegram group for communication and support.',
      },
    ],
  },
};

// ─── Shared instructor data ────────────────────────────────────────────────────
const INSTRUCTOR = {
  initials: 'م.م',
  name: { ar: 'م. محمود المكاوي', en: 'Eng. Mahmoud Elmakawy' },
  title: {
    ar: 'ACI Certified Instructor (NEOM) | مؤسس أكاديمية مهندس مصر',
    en: 'ACI Certified Instructor (NEOM) | Founder of Muhandis Masr Academy',
  },
  certifications: ['ISO 19650', 'Revit Architecture Certified', 'Revit Structure of Certified', 'Saudi Council of Engineers'],
  bio: {
    ar: 'مهندس خبرة +13 سنة في مجال البناء الإنشائي وتطبيقات BIM. حاصل على شهادة ACI Certified Instructor من Autodesk، ويعمل حاليًا BIM Coordinator في مشاريع NEOM السعودية. درّب أكثر من 1,200 مهندس من مصر والسعودية والإمارات وأكثر من 15 دولة.',
    en: 'Engineer with 13+ years of experience in structural construction and BIM applications. Holds ACI Certified Instructor certification from Autodesk, currently working as BIM Coordinator on NEOM projects. Trained over 1,200 engineers from Egypt, Saudi Arabia, UAE, and 15+ countries.',
  },
  rating: 4.9,
  studentsCount: 1200,
  coursesCount: 8,
};

// ─── Included icons order ──────────────────────────────────────────────────────
const INCLUDED_ICONS = [Video, Infinity, BookOpen, Award, MessageCircle, Shield];

// ─── Star rating helper ────────────────────────────────────────────────────────
const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'} ${
          i <= Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'text-amber-300/40'
        }`}
      />
    ))}
  </div>
);

// ─── Enrollment sidebar card ───────────────────────────────────────────────────
interface EnrollmentCardProps {
  courseImage: string;
  courseTitle: string;
  price: string;
  originalPrice: string;
  discountLabel: string;
  countdown: string;
  included: string[];
  isAr: boolean;
  whatsappUrl: string;
}

const EnrollmentCard = ({
  courseImage,
  courseTitle,
  price,
  originalPrice,
  discountLabel,
  countdown,
  included,
  isAr,
  whatsappUrl,
}: EnrollmentCardProps) => (
  <div className="bg-white dark:bg-card rounded-2xl shadow-2xl overflow-hidden text-foreground border border-border/40">
    {/* Thumbnail + play button */}
    <div className="relative aspect-video cursor-pointer group">
      <img
        src={assetUrl(courseImage)}
        alt={courseTitle}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-[hsl(var(--navy))] fill-[hsl(var(--navy))] ms-0.5" />
        </div>
      </div>
      <span className="absolute bottom-2 start-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-medium">
        {isAr ? 'معاينة مجانية' : 'Free preview'}
      </span>
    </div>

    {/* Card body */}
    <div className="p-5 space-y-4">
      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-extrabold text-[hsl(var(--navy))]">{price}</span>
        {originalPrice && (
          <span className="text-muted-foreground line-through text-base">{originalPrice}</span>
        )}
        {discountLabel && (
          <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
            {isAr ? `خصم ${discountLabel}` : `${discountLabel} OFF`}
          </span>
        )}
      </div>

      {/* Countdown */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-3 text-center">
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
          {isAr ? '⏰ ينتهي العرض خلال' : '⏰ Offer ends in'}
        </p>
        <p className="text-2xl font-mono font-extrabold text-amber-600 dark:text-amber-400 tracking-widest">
          {countdown}
        </p>
      </div>

      {/* Enroll button */}
      <button
        onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
        className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-extrabold py-3.5 rounded-xl text-lg transition-colors shadow-md"
      >
        {isAr ? 'سجل الآن فوراً' : 'Enroll Now Instantly'}
      </button>

      {/* WhatsApp consultation */}
      <button
        onClick={() => window.open('https://wa.me/201096189832', '_blank', 'noopener,noreferrer')}
        className="w-full flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        <MessageCircle className="w-4 h-4" />
        {isAr ? '📞 استشارة مجانية 15 دقيقة' : '📞 Free 15-min Consultation'}
      </button>

      {/* Guarantee */}
      <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
        {isAr ? 'ضمان استعادة الأموال خلال 30 يوم' : '30-day money-back guarantee'}
      </p>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* What's included list */}
      <div>
        <p className="font-bold text-sm mb-3">{isAr ? 'ما يشمله الكورس:' : 'This course includes:'}</p>
        <ul className="space-y-2.5">
          {included.map((item, i) => {
            const Icon = INCLUDED_ICONS[i] ?? CheckCircle2;
            return (
              <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Icon className="w-4 h-4 text-[hsl(var(--blue-grotto))] flex-shrink-0" />
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  </div>
);

// ─── Main page component ───────────────────────────────────────────────────────
const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language, direction } = useLanguage();
  const countdown = useCountdown();
  const isAr = language === 'ar';

  const course = courses.find((c) => c.id === id);
  const extras: CourseExtras = id && COURSE_EXTRAS[id] ? COURSE_EXTRAS[id] : DEFAULT_EXTRAS;

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {isAr ? 'الدورة غير موجودة' : 'Course not found'}
          </h1>
          <Link to="/courses" className="text-[hsl(var(--blue-grotto))] hover:underline">
            {isAr ? '← العودة للدورات' : '← Back to Courses'}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Derived values
  const title         = isAr ? course.title.ar        : course.title.en;
  const description   = isAr ? course.description.ar  : course.description.en;
  const level         = isAr ? course.level.ar         : course.level.en;
  const duration      = isAr ? course.duration.ar      : course.duration.en;
  const price         = isAr ? extras.price.ar         : extras.price.en;
  const originalPrice = isAr ? extras.originalPrice.ar : extras.originalPrice.en;
  const outcomes      = isAr ? extras.learningOutcomes.ar : extras.learningOutcomes.en;
  const requirements  = isAr ? extras.requirements.ar  : extras.requirements.en;
  const included      = isAr ? extras.whatIsIncluded.ar : extras.whatIsIncluded.en;
  const faqs          = isAr ? extras.faq.ar           : extras.faq.en;
  const instructorName  = isAr ? INSTRUCTOR.name.ar    : INSTRUCTOR.name.en;
  const instructorTitle = isAr ? INSTRUCTOR.title.ar   : INSTRUCTOR.title.en;
  const instructorBio   = isAr ? INSTRUCTOR.bio.ar     : INSTRUCTOR.bio.en;

  const whatsappUrl = `https://wa.me/201096189832?text=${encodeURIComponent(
    isAr
      ? `أريد التسجيل في كورس: ${title}`
      : `I want to enroll in: ${title}`
  )}`;

  const courseTestimonials = testimonials.slice(0, 4);

  const STATS = [
    { value: '+1,200',                    label: isAr ? 'طالب'        : 'Students'        },
    { value: '★ 4.9',                     label: isAr ? 'تقييم'       : 'Rating'          },
    { value: `${extras.hoursContent}h`,   label: isAr ? 'ساعة تدريب'  : 'Training Hours'  },
    { value: isAr ? '13 سنة' : '13 yrs', label: isAr ? 'خبرة'        : 'Experience'      },
  ];

  return (
    <div dir={direction} className="min-h-screen bg-background">
      <Header />

      <main>
        {/*
         * Layout strategy:
         *   A CSS linear-gradient on this wrapper provides the dark-navy hero
         *   background for roughly the top 620 px, then transitions to the page
         *   background colour. Both the hero info and the sidebar share ONE
         *   grid, so the sidebar card is naturally sticky throughout the entire
         *   content area.
         */}
        <div
          className="relative"
          style={{
            background:
              'linear-gradient(to bottom, hsl(209,100%,19%) 0px, hsl(209,100%,19%) 620px, hsl(210,20%,98%) 620px)',
          }}
        >
          {/* ── PAGE CONTAINER (hero + content share this grid) ─────────── */}
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">

              {/* ══ MAIN CONTENT COLUMN ══════════════════════════════════ */}
              <div>
                {/* ── Hero: breadcrumb, title, meta ───────────────────── */}
                <div className="text-white pt-6 pb-8">
                  {/* Breadcrumb */}
                  <nav className="flex items-center gap-1.5 text-white/60 text-sm mb-5 flex-wrap">
                    <Link to="/" className="hover:text-white transition-colors">
                      {isAr ? 'الرئيسية' : 'Home'}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 flex-shrink-0" />
                    <Link to="/courses" className="hover:text-white transition-colors">
                      {isAr ? 'الدورات' : 'Courses'}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 flex-shrink-0" />
                    <span className="text-white/85 truncate max-w-[180px] sm:max-w-none">
                      {title}
                    </span>
                  </nav>

                  {/* Badges row */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 rounded-full px-3 py-1 text-xs font-semibold">
                      {level}
                    </span>
                    <span className="bg-white/10 border border-white/20 text-white/80 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {duration}
                    </span>
                    <span className="bg-white/10 border border-white/20 text-white/80 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5">
                      <Award className="w-3 h-3" />
                      {isAr ? 'شهادة معتمدة' : 'Certified'}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold mb-4 leading-tight">
                    {title}
                  </h1>

                  {/* Description */}
                  <p className="text-white/80 text-base md:text-lg leading-relaxed mb-5 max-w-2xl">
                    {description}
                  </p>

                  {/* Rating row */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                    <span className="text-amber-400 font-extrabold text-base">
                      {extras.rating}
                    </span>
                    <StarRating rating={extras.rating} size="sm" />
                    <span className="text-white/55">
                      ({extras.ratingCount.toLocaleString()}{' '}
                      {isAr ? 'تقييم' : 'ratings'})
                    </span>
                    <span className="text-white/40 select-none">•</span>
                    <span className="text-white/75 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {extras.studentsCount.toLocaleString()}+{' '}
                      {isAr ? 'طالب' : 'students'}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {extras.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white/85 hover:bg-white/20 transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Instructor line */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-full bg-[hsl(var(--blue-grotto))] flex items-center justify-center font-bold text-white text-xs flex-shrink-0 shadow-md">
                      {INSTRUCTOR.initials}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-white/60">
                        {isAr ? 'المدرب:' : 'Instructor:'}
                      </span>
                      <span className="font-semibold text-white">{instructorName}</span>
                      <span className="text-white/40 select-none">•</span>
                      <span className="text-white/55 text-xs">ACI Certified (NEOM)</span>
                    </div>
                  </div>
                </div>

                {/* ── Below-hero content sections ─────────────────────── */}
                <div className="space-y-6 pb-20">

                  {/* Stats bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[hsl(var(--navy))] rounded-2xl p-5 text-white"
                  >
                    {STATS.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-2xl md:text-3xl font-extrabold text-[hsl(var(--baby-blue))]">
                          {stat.value}
                        </div>
                        <div className="text-white/65 text-sm mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Learning outcomes */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-card rounded-2xl border border-border p-6 shadow-sm"
                  >
                    <h2 className="text-xl md:text-2xl font-extrabold mb-5">
                      {isAr ? 'ماذا ستتعلم في هذه الدورة؟' : "What You'll Learn in This Course"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground leading-relaxed">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Course content accordion */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-card rounded-2xl border border-border p-6 shadow-sm"
                  >
                    <h2 className="text-xl md:text-2xl font-extrabold mb-1">
                      {isAr ? 'محتوى الدورة' : 'Course Content'}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-5">
                      {course.syllabus.length}{' '}
                      {isAr ? 'وحدات' : 'sections'} •{' '}
                      {extras.hoursContent}{' '}
                      {isAr ? 'ساعة إجمالي' : 'hours total'}
                    </p>
                    <Accordion type="single" collapsible className="space-y-2">
                      {course.syllabus.map((item, i) => (
                        <AccordionItem
                          key={i}
                          value={`section-${i}`}
                          className="border border-border rounded-xl px-4 data-[state=open]:bg-muted/30"
                        >
                          <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3.5">
                            <div className="flex items-center gap-3 text-start">
                              <span className="w-7 h-7 rounded-full bg-[hsl(var(--navy))] text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <span>{isAr ? item.ar : item.en}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm pb-3 ps-10">
                            {isAr
                              ? 'محاضرات تفاعلية مع تطبيق عملي مباشر على مشاريع حقيقية'
                              : 'Interactive lectures with hands-on practice on real-world projects'}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>

                  {/* Requirements */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-card rounded-2xl border border-border p-6 shadow-sm"
                  >
                    <h2 className="text-xl md:text-2xl font-extrabold mb-4">
                      {isAr ? 'متطلبات الدورة' : 'Course Requirements'}
                    </h2>
                    <ul className="space-y-3">
                      {requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-[hsl(var(--blue-grotto))] flex-shrink-0 mt-2" />
                          <span className="text-sm text-foreground leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* About instructor */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-card rounded-2xl border border-border p-6 shadow-sm"
                  >
                    <h2 className="text-xl md:text-2xl font-extrabold mb-5">
                      {isAr ? 'عن المدرب' : 'About the Instructor'}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-[hsl(var(--navy))] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                          {INSTRUCTOR.initials}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-bold mb-1">{instructorName}</h3>
                        <p className="text-[hsl(var(--blue-grotto))] text-sm font-medium mb-3 leading-relaxed">
                          {instructorTitle}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {INSTRUCTOR.certifications.map((cert) => (
                            <span
                              key={cert}
                              className="px-2.5 py-1 bg-muted rounded-lg text-xs font-medium text-muted-foreground border border-border"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {instructorBio}
                        </p>
                        <div className="flex flex-wrap gap-5 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold">{INSTRUCTOR.rating}</span>
                            <span className="text-muted-foreground">
                              {isAr ? 'تقييم' : 'Rating'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span className="font-bold text-foreground">
                              {INSTRUCTOR.studentsCount.toLocaleString()}+
                            </span>
                            <span>{isAr ? 'طالب' : 'Students'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <BookOpen className="w-4 h-4" />
                            <span className="font-bold text-foreground">{INSTRUCTOR.coursesCount}</span>
                            <span>{isAr ? 'دورات' : 'Courses'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Testimonials */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-xl md:text-2xl font-extrabold mb-5">
                      {isAr ? 'ماذا قال خريجو الدورة؟' : 'What Graduates Say'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courseTestimonials.map((t) => (
                        <div
                          key={t.id}
                          className="bg-white dark:bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-3"
                        >
                          <StarRating rating={5} size="sm" />
                          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                            &ldquo;{isAr ? t.textAr : t.text}&rdquo;
                          </p>
                          <div className="flex items-center gap-3 border-t border-border pt-3">
                            <div className="w-9 h-9 rounded-full bg-[hsl(var(--navy))] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {t.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{t.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {t.role} • {t.company}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* FAQ */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-xl md:text-2xl font-extrabold mb-5">
                      {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-2">
                      {faqs.map((faq, i) => (
                        <AccordionItem
                          key={i}
                          value={`faq-${i}`}
                          className="border border-border rounded-xl px-4 bg-white dark:bg-card"
                        >
                          <AccordionTrigger className="text-sm font-semibold hover:no-underline text-start py-4">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm pb-4 leading-relaxed">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>

                </div>
              </div>

              {/* ══ SIDEBAR COLUMN ════════════════════════════════════════ */}
              <div className="hidden lg:block pt-6">
                <div className="sticky top-24">
                  <EnrollmentCard
                    courseImage={course.image}
                    courseTitle={title}
                    price={price}
                    originalPrice={originalPrice}
                    discountLabel={extras.discountLabel}
                    countdown={countdown}
                    included={included}
                    isAr={isAr}
                    whatsappUrl={whatsappUrl}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── MOBILE: sticky bottom enroll bar ─────────────────────────────── */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[hsl(var(--navy))] border-t border-white/10 px-4 py-3 shadow-2xl">
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <div>
              <div className="text-xl font-extrabold text-white">{price}</div>
              {originalPrice && (
                <div className="text-white/50 text-xs line-through">{originalPrice}</div>
              )}
            </div>
            <button
              onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
              className="bg-amber-500 hover:bg-amber-400 text-white font-extrabold px-6 py-3 rounded-xl transition-colors text-sm flex-shrink-0"
            >
              {isAr ? 'سجل الآن' : 'Enroll Now'}
            </button>
          </div>
        </div>

        {/* ── CTA section ──────────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--navy))] text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-4xl mb-3">🎯</p>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                {isAr
                  ? 'استثمر في مسيرتك الهندسية اليوم'
                  : 'Invest in Your Engineering Career Today'}
              </h2>
              <p className="text-white/70 mt-2 mb-8 text-lg max-w-xl mx-auto">
                {isAr
                  ? `انضم لأكثر من ${extras.studentsCount.toLocaleString()} مهندس من خريجي الأكاديمية`
                  : `Join over ${extras.studentsCount.toLocaleString()} engineers from our academy`}
              </p>
              <button
                onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
                className="bg-amber-500 hover:bg-amber-400 text-white font-extrabold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg inline-flex items-center gap-2"
              >
                {isAr ? `سجل من ${price} فقط` : `Enroll for ${price} only`}
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </button>
              <p className="text-white/50 text-sm mt-4">
                ⏰{' '}
                {isAr ? 'ينتهي العرض خلال ' : 'Offer ends in '}
                <span className="font-mono font-bold text-white/70">{countdown}</span>
              </p>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CourseDetail;
