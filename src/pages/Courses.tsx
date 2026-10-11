import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Clock, BarChart, ArrowLeft, ArrowRight } from 'lucide-react';
import { assetUrl } from '@/lib/utils';

interface Course {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  fullDescription: { ar: string; en: string };
  level: { ar: string; en: string };
  duration: { ar: string; en: string };
  image: string;
  udemyLink: string;
  syllabus: {
    ar: string;
    en: string;
    description?: { ar: string; en: string };
  }[];
}

export const courses: Course[] = [
  {
    id: 'bim-fundamentals',
    title: { ar: 'أساسيات BIM', en: 'BIM Fundamentals for Civil Engineers' },
    description: {
      ar: 'مقدمة شاملة لمفاهيم نمذجة معلومات المباني، وسير العمل، وأفضل الممارسات. مثالية للمهندسين الذين ينتقلون إلى استخدام نمذجة معلومات المباني.',
      en: 'Comprehensive introduction to Building Information Modeling concepts, workflows, and best practices. Perfect for engineers transitioning to BIM.',
    },
    fullDescription: {
      ar: 'تعرّف على أساسيات نمذجة معلومات البناء (BIM)، ومستوى التفاصيل وأبعاد البيم، ومستخدميه وبرامجه ومخرجاته.',
      en: 'Learn the fundamentals of Building Information Modeling (BIM), including levels of development, BIM dimensions, users, software, and outputs.',
    },
    level: { ar: 'مبتدئ', en: 'Beginner' },
    duration: { ar: '01 ساعة', en: '01 Hours' },
    image: '/courses/BIM Fundamentals for Civil Engineers.webp',
    udemyLink: 'https://www.udemy.com/course/bim-introduction-free/?referralCode=25EADC46D87F0DCA809A',
    syllabus: [
      {
        ar: 'ما هي البيم',
        en: 'What is BIM',
        description: {
          ar: 'تعرّف على مفهوم نمذجة معلومات البناء وكيفية إنشاء نموذج رقمي غني بالمعلومات يدعم التعاون وإدارة المشروع خلال مراحله المختلفة.',
          en: 'Learn what Building Information Modeling is and how an information-rich digital model supports collaboration and project management throughout the project lifecycle.',
        },
      },
      {
        ar: 'مستوى التفاصيل في البيم (BIM LOD)',
        en: 'BIM Level of Development (LOD)',
        description: {
          ar: 'افهم مستويات LOD وكيف يعبّر كل مستوى عن درجة تطور عناصر النموذج وموثوقية المعلومات المتاحة عنها في مراحل المشروع.',
          en: 'Understand BIM LOD levels and how each level describes the development of model elements and the reliability of their information at different project stages.',
        },
      },
      {
        ar: 'أبعاد البيم',
        en: 'BIM Dimensions',
        description: {
          ar: 'استكشف كيف ترتبط بيانات النموذج بأبعاد المشروع مثل الوقت والتكلفة والاستدامة والتشغيل، لدعم التخطيط واتخاذ القرار.',
          en: 'Explore how model information connects to project dimensions such as time, cost, sustainability, and operations to support planning and decision-making.',
        },
      },
      {
        ar: 'مستخدمو البيم',
        en: 'BIM Users',
        description: {
          ar: 'تعرّف على الأطراف التي تستخدم البيم، مثل المالك والمصممين والمقاولين ومديري المرافق، وكيف تتعاون من خلال معلومات النموذج.',
          en: 'Meet the people who use BIM—including owners, designers, contractors, and facility managers—and learn how they collaborate through model information.',
        },
      },
      {
        ar: 'برامج البيم',
        en: 'BIM Programs',
        description: {
          ar: 'تعرّف على فئات برامج البيم وأدوارها في النمذجة والتنسيق وإدارة المعلومات، وكيفية اختيار الأداة المناسبة لكل مهمة.',
          en: 'Explore BIM software categories and their roles in modeling, coordination, and information management, and learn how tools support different tasks.',
        },
      },
      {
        ar: 'مخرجات البيم',
        en: 'BIM Outputs',
        description: {
          ar: 'استكشف مخرجات عملية البيم، من النماذج والرسومات والجداول والكميات إلى تقارير التنسيق وكشف التعارضات.',
          en: 'Explore BIM deliverables, from models, drawings, schedules, and quantities to coordination and clash detection reports.',
        },
      },
    ],
  },
  {
    id: 'revit-structure-professional-training',
    title: { ar: 'كورس الريفيت الإنشائي والمعماري', en: 'Revit Structure & Architecture Course' },
    description: {
      ar: 'بدايتك الصح في مجال BIM: شرح شامل لبرنامج Revit من الصفر إلى الاحتراف للمهندسين من مختلف التخصصات، مع أمثلة عملية على مشروعات واقعية.',
      en: 'A strong start in BIM: learn Autodesk Revit from beginner to advanced level across structural and architectural workflows, with practical examples from real projects.',
    },
    fullDescription: {
      ar: 'شرح كامل وشامل لبرنامج Revit من الصفر إلى الاحتراف، مناسب لمهندسي التنفيذ والتصميم والمكتب الفني. يتكون من 8 مراحل إنشائية ومرحلة معمارية، مع تطبيقات عملية على مبنى سكني من 5 أدوار، وبرج سكني من 11 دورًا بلبشة وخوازيق، ومسجد، وفيلا على الكود السعودي، وبرج سكني معماري من 11 دورًا.',
      en: 'A comprehensive Revit course from beginner to advanced level for engineers in construction, design, and technical office roles. It covers eight structural stages plus an architectural stage, with hands-on work on a five-story residence, an 11-story tower with raft and piles, a mosque, a villa designed to Saudi code, and an 11-story architectural tower.',
    },
    level: { ar: 'مبتدئ', en: 'Beginner' },
    duration: { ar: '60 ساعة', en: '60 Hours' },
    image: '/courses/Revit Structure Professional Training.webp',
    udemyLink: 'https://www.behance.net/gallery/187155589/_',
    syllabus: [
      {
        ar: 'المرحلة الأولى: النمذجة (Modeling)',
        en: 'Stage 1: Modeling',
        description: {
          ar: 'مقدمة عن تقنية BIM واستخداماتها، والتعرف على Revit وطرق بدء المشروع وأدوات النمذجة الرئيسية. طبّق نمذجة البلاطات والكمرات والأعمدة والأساسات على مشروعات واقعية متعددة.',
          en: 'Get introduced to BIM and its applications, Revit, project setup, and core modeling tools. Practice modeling slabs, beams, columns, and foundations across real-world projects.',
        },
      },
      {
        ar: 'المرحلة الثانية: استخدام ملفات أوتوكاد (Using AutoCAD Files)',
        en: 'Stage 2: Using AutoCAD Files',
        description: {
          ar: 'تعلّم بدء النظام الإنشائي بالاعتماد على ملفات أوتوكاد المعمارية أو تحويل مشروع مرسوم بالكاد إلى Revit. تشمل المرحلة نمذجة السلالم وحل مشكلاتها، وورشة تطبيقية لمشروع كامل من البداية للنهاية.',
          en: 'Learn to develop a structural model from architectural AutoCAD files or convert an existing CAD project to Revit. Model stairs, troubleshoot common issues, and complete an end-to-end project workshop.',
        },
      },
      {
        ar: 'المرحلة الثالثة: المنشآت المعدنية (Steel Structures)',
        en: 'Stage 3: Steel Structures',
        description: {
          ar: 'تعلّم نمذجة المنشآت المعدنية، بما في ذلك الأعمدة والكمرات، وإنشاء تفاصيل الوصلات (Connections).',
          en: 'Learn to model steel structures, including columns and beams, and create their connection details.',
        },
      },
      {
        ar: 'المرحلة الرابعة: حصر الكميات (Quantity Take-Off)',
        en: 'Stage 4: Quantity Take-Off',
        description: {
          ar: 'أنشئ جداول حصر كميات الأساسات والأعمدة والكمرات والعناصر الإنشائية الأخرى، وتعلّم حساب تكاليفها من بيانات المشروع.',
          en: 'Create quantity schedules for foundations, columns, beams, and other structural elements, and learn to calculate their costs from project data.',
        },
      },
      {
        ar: 'المرحلة الخامسة: التسليح (Reinforcement)',
        en: 'Stage 5: Reinforcement',
        description: {
          ar: 'أضف حديد التسليح إلى العناصر الإنشائية يدويًا أو باستخدام إضافة خارجية، وتعرّف على إعدادات التسليح المختلفة.',
          en: 'Add reinforcement to structural elements manually or with an external add-in, and explore the available reinforcement settings.',
        },
      },
      {
        ar: 'المرحلة السادسة: التوثيق (Documentation)',
        en: 'Stage 6: Documentation',
        description: {
          ar: 'جهّز المشروع للتوثيق باستخدام الأبعاد والكتابات والقطاعات والتفاصيل. أنشئ بلانات المحاور والأعمدة والأساسات والكمرات الأرضية والأسقف، واستخدم الفلاتر لتنسيقها وفق معايير المكتب أو الشركة.',
          en: 'Document the project with dimensions, annotations, sections, and details. Prepare grid and column, foundation, grade-beam, and floor plans, using filters to match office or company standards.',
        },
      },
      {
        ar: 'المرحلة السابعة: اللوحات والطباعة (Sheets & Printing)',
        en: 'Stage 7: Sheets & Printing',
        description: {
          ar: 'جهّز اللوحات النهائية للمحاور والأعمدة والأساسات والبلاطات، وتعلّم إخراجها وطباعتها بشكل احترافي.',
          en: 'Prepare final sheets for grids and columns, foundations, and slabs, then learn to present and print them professionally.',
        },
      },
      {
        ar: 'المرحلة الثامنة: النمذجة داخل المشروع (Model in Place)',
        en: 'Stage 8: Model in Place',
        description: {
          ar: 'أنشئ أشكالًا وعناصر معقدة مثل الأعمدة غير المنتظمة والمشطورة، وكمرات السلالم المكسّرة، والقباب. تعلّم أيضًا ربط المشروع بملفات CAD وبرامج التحليل الإنشائي.',
          en: 'Create complex elements such as irregular and split columns, sloped stair beams, and domes. Also learn to connect the project with CAD files and structural analysis software.',
        },
      },
      {
        ar: 'المرحلة التاسعة: الريفيت المعماري',
        en: 'Stage 9: Revit Architecture',
        description: {
          ar: 'تعلّم نمذجة الحوائط والأبواب والشبابيك والأثاث، وربط الملف المعماري للاستفادة منه في المناسيب والمحاور والنظام الإنشائي. تشمل المرحلة حصر كميات الملف المعماري وإعداد عروض تقديمية احترافية معمارية وإنشائية.',
          en: 'Model architectural walls, doors, windows, and furniture. Link architectural files to coordinate levels, grids, and structural systems, take off quantities, and prepare professional architectural and structural presentations.',
        },
      },
    ],
  },
  {
    id: 'revit-structure-workshop-01',
    title: { ar: 'ورشة عمل Revit Structure - 01', en: 'Revit Structure Workshop - 01' },
    description: {
      ar: 'أتقن برنامج Autodesk Revit للمشاريع الإنشائية. تعلّم تقنيات النمذجة المتقدمة، من خلال مشروع عملي متكامل من البداية إلى النهاية.',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques, on Practical Project from start to end',
    },
    fullDescription: {
      ar: 'دورة متقدمة تغطي جميع جوانب إدارة مشاريع BIM بما في ذلك وضع خطط التنفيذ، إدارة الفرق، ضمان الجودة، والتوافق مع المعايير الدولية مثل ISO 19650.',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques, on Practical Project from start to end',
    },
    level: { ar: 'متوسط', en: 'Intermediate' },
    duration: { ar: '10 ساعة', en: '10 Hours' },
    image: '/courses/Revit Structure Workshop - 01.webp',
    udemyLink: 'https://www.behance.net/gallery/197545865/_',
    syllabus: [
      { ar: 'أساسيات إدارة BIM', en: 'BIM Management Fundamentals' },
      { ar: 'خطة تنفيذ BIM', en: 'BIM Execution Plan' },
      { ar: 'معايير ISO 19650', en: 'ISO 19650 Standards' },
      { ar: 'إدارة الجودة', en: 'Quality Management' },
    ],
  },
  {
    id: 'revit-structure-workshop-02',
    title: { ar: 'ورشة عمل Revit Structure - 02', en: 'Revit Structure Workshop - 02' },
    description: {
       ar: 'أتقن برنامج Autodesk Revit للمشاريع الإنشائية. تعلّم تقنيات النمذجة المتقدمة، من خلال مشروع عملي متكامل من البداية إلى النهاية.',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques, on Practical Project from start to end',
    },
    fullDescription: {
      ar: 'دورة متقدمة تغطي جميع جوانب إدارة مشاريع BIM بما في ذلك وضع خطط التنفيذ، إدارة الفرق، ضمان الجودة، والتوافق مع المعايير الدولية مثل ISO 19650.',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques, on Practical Project from start to end',
    },
    level: { ar: 'متوسط', en: 'Intermediate' },
    duration: { ar: '10 ساعة', en: '10 Hours' },
    image: '/courses/Revit Structure Workshop - 02.webp',
    udemyLink: 'https://www.behance.net/gallery/186142533/_',
    syllabus: [
      { ar: 'أساسيات إدارة BIM', en: 'BIM Management Fundamentals' },
      { ar: 'خطة تنفيذ BIM', en: 'BIM Execution Plan' },
      { ar: 'معايير ISO 19650', en: 'ISO 19650 Standards' },
      { ar: 'إدارة الجودة', en: 'Quality Management' },
    ],
  },
   {
    id: 'revit-structure-workshop-03',
    title: { ar: 'ورشة عمل Revit Structure - 03', en: 'Revit Structure Workshop - 03' },
    description: {
       ar: 'أتقن برنامج Autodesk Revit للمشاريع الإنشائية. تعلّم تقنيات النمذجة المتقدمة، من خلال مشروع عملي متكامل من البداية إلى النهاية.',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques, on Practical Project from start to end',
    },
    fullDescription: {
      ar: 'دورة متقدمة تغطي جميع جوانب إدارة مشاريع BIM بما في ذلك وضع خطط التنفيذ، إدارة الفرق، ضمان الجودة، والتوافق مع المعايير الدولية مثل ISO 19650.',
      en: 'Master Autodesk Revit for Structural projects. Learn advanced modeling techniques, on Practical Project from start to end',
    },
    level: { ar: 'متقدم', en: 'Advanced' },
    duration: { ar: '12 ساعة', en: '12 Hours' },
    image: '/courses/Revit Structure Workshop - 03.webp',
    udemyLink: 'https://www.behance.net/gallery/186280023/_',
    syllabus: [
      { ar: 'أساسيات إدارة BIM', en: 'BIM Management Fundamentals' },
      { ar: 'خطة تنفيذ BIM', en: 'BIM Execution Plan' },
      { ar: 'معايير ISO 19650', en: 'ISO 19650 Standards' },
      { ar: 'إدارة الجودة', en: 'Quality Management' },
    ],
  },
];

const getLevelColor = (level: string) => {
  if (level === 'مبتدئ' || level === 'Beginner') return 'bg-green-100 text-green-700';
  if (level === 'متوسط' || level === 'Intermediate') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const Courses = () => {
  const { t } = useTranslation();
  const { language, direction } = useLanguage();
  const Arrow = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t('courses.title')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('courses.subtitle')}
            </p>
          </motion.div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/courses/${course.id}`}>
                  <div className="neu-card h-full overflow-hidden flex flex-col transition-all duration-300 hover:shadow-glow hover:-translate-y-2 group cursor-pointer">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={assetUrl(course.image)}
                        alt={language === 'ar' ? course.title.ar : course.title.en}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                      <span className={`absolute top-4 start-4 px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(language === 'ar' ? course.level.ar : course.level.en)}`}>
                        {language === 'ar' ? course.level.ar : course.level.en}
                      </span>
                      {course.id === 'bim-fundamentals' && (
                        <span className="absolute top-4 end-4 px-3 py-1 rounded-full bg-green-500 text-white text-sm font-bold shadow">
                          {language === 'ar' ? 'مجاني' : 'Free'}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {language === 'ar' ? course.title.ar : course.title.en}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                        {language === 'ar' ? course.description.ar : course.description.en}
                      </p>

                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-grotto" />
                          <span>{language === 'ar' ? course.duration.ar : course.duration.en}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart className="w-4 h-4 text-blue-grotto" />
                          <span>{language === 'ar' ? course.level.ar : course.level.en}</span>
                        </div>
                      </div>

                      <Button variant="ghost" className="text-blue-grotto group-hover:text-navy p-0 justify-start">
                        {t('common.viewDetails')}
                        <Arrow className="w-4 h-4 ms-1 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Courses;
