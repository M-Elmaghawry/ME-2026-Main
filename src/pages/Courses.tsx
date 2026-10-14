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
      ar: 'طبّق عمليًا على نمذجة مبنى سكني من 5 أدوار وروف باستخدام Revit، وتعلّم تنظيم المشروع وإعداد اللوحات والجداول وإخراجها.',
      en: 'Put Revit into practice by modeling a five-story residential building with a roof, then organize the project and prepare its schedules, sheets, and deliverables.',
    },
    fullDescription: {
      ar: 'ورشة تطبيقية على مبنى سكني من 5 أدوار وروف، مناسبة لمن لديه معرفة أساسية ببرنامج Revit ويريد تطبيق الأدوات على مشروع واقعي. ستتعلم تقسيم المشروع واختيار ترتيب العمل وأفضل ممارسات النمذجة، مع تطبيق أنواع البلاطات المصمتة والفلات والهولو بلوك، والأساسات المنفصلة والمشتركة واللبشة. تشمل الورشة نمذجة السلالم وتفاصيلها، إعداد البلانات والجداول التصميمية، استخدام الفلاتر لتنسيق اللوحات، وتجهيز اللوحات النهائية والطباعة والتصدير إلى AutoCAD وPDF.',
      en: 'A hands-on workshop built around a five-story residential building with a roof, for learners who already know the basics of Revit and want to apply them to a real project. Learn how to break down the project, plan the modeling sequence, and follow modeling best practices. Practice solid, flat, and hollow-block slabs; isolated, combined, and raft foundations; and stair modeling and detailing. The workshop also covers plans, design schedules, filters and presentation graphics, final sheets, printing, and exporting to AutoCAD and PDF.',
    },
    level: { ar: 'متوسط', en: 'Intermediate' },
    duration: { ar: '8 ساعات', en: '8 Hours' },
    image: '/courses/Revit Structure Workshop - 01.webp',
    udemyLink: 'https://www.behance.net/gallery/197545865/_',
    syllabus: [
      {
        ar: 'تخطيط المشروع وأفضل ممارسات النمذجة',
        en: 'Project Planning and Modeling Best Practices',
        description: {
          ar: 'تعرّف على كيفية تقسيم المشروع، وترتيب البدء في نمذجة عناصره، واختيار أساليب عمل تساعد على إنشاء نموذج سليم والاستفادة من العناصر المنمذجة مسبقًا.',
          en: 'Learn how to break down the project, choose an effective modeling sequence, and reuse previously modeled elements to build a reliable model.',
        },
      },
      {
        ar: 'نمذجة المبنى السكني والعناصر الإنشائية',
        en: 'Modeling the Residential Building and Structural Elements',
        description: {
          ar: 'طبّق على مبنى سكني من 5 أدوار وروف، مع نمذجة البلاطات المصمتة والفلات والهولو بلوك، والأساسات المنفصلة والمشتركة واللبشة.',
          en: 'Model a five-story residential building with a roof, using solid, flat, and hollow-block slabs and isolated, combined, and raft foundations.',
        },
      },
      {
        ar: 'السلالم: الدرجات والقوائم والبسطات والتفاصيل',
        en: 'Stairs: Treads, Risers, Landings, and Details',
        description: {
          ar: 'نمذج السلالم وتعرّف على عناصرها وتفاصيلها، وكيفية التعامل مع المشكلات التي قد تظهر أثناء العمل عليها.',
          en: 'Model stairs, understand their components and details, and work through common issues that arise during modeling.',
        },
      },
      {
        ar: 'إعداد البلانات والربط بين عناصر المشروع',
        en: 'Preparing Plans and Coordinating Project Elements',
        description: {
          ar: 'جهّز بلانات المحاور والأعمدة والأساسات والأسقف، واستفد من ربط العناصر المختلفة داخل نموذج Revit.',
          en: 'Prepare grid and column, foundation, and floor plans, and use Revit relationships to coordinate project elements.',
        },
      },
      {
        ar: 'الفلاتر وتنسيق اللوحات',
        en: 'Filters and Sheet Presentation',
        description: {
          ar: 'استخدم الفلاتر للتحكم في عرض العناصر وتنسيق البلانات، وطبّق أسلوب عرض موحدًا على لوحات المشروع.',
          en: 'Use filters to control how elements appear, format plans, and apply a consistent presentation style across the project sheets.',
        },
      },
      {
        ar: 'الجداول التصميمية والبارامترات',
        en: 'Design Schedules and Parameters',
        description: {
          ar: 'أنشئ جداول للأعمدة والميدات والكمرات الساقطة والمخفية والبلاطات، وتعلّم التحكم في الجداول وبارامترات الفاميلي والمشروع والبارامترات المشتركة.',
          en: 'Create schedules for columns, grade beams, downstand and hidden beams, and slabs. Learn to control schedules and family, project, and shared parameters.',
        },
      },
      {
        ar: 'اللوحات النهائية والطباعة والتصدير',
        en: 'Final Sheets, Printing, and Exporting',
        description: {
          ar: 'جهّز اللوحات النهائية للمشروع، ثم اطبعها وصدّر ملفات المشروع إلى AutoCAD وPDF.',
          en: 'Prepare the project’s final sheets, then print and export the project deliverables to AutoCAD and PDF.',
        },
      },
    ],
  },
  {
    id: 'revit-structure-workshop-02',
    title: { ar: 'ورشة عمل Revit Structure - 02', en: 'Revit Structure Workshop - 02' },
    description: {
      ar: 'طبّق عمليًا على مبنى سكني من دورين وروف وفق الكود السعودي SBC 1101، من تخطيط المشروع والنمذجة إلى الجداول واللوحات والتصدير.',
      en: 'Apply Revit Structure to a two-story residential building with a roof, following Saudi Building Code SBC 1101, from project planning to modeling, schedules, sheets, and export.',
    },
    fullDescription: {
      ar: 'ورشة تطبيقية متكاملة على مبنى سكني من دورين وروف وفق الكود السعودي SBC 1101، وتهدف إلى تحويل معرفة أدوات Revit إلى خطوات عمل عملية وأفضل ممارسات قابلة للتطبيق. ستتعلم تقسيم المشروع وترتيب نمذجة عناصره وإعادة استخدام الأجزاء المنمذجة، ثم تطبيق البلاطات المصمتة والمهبطة والهولو بلوك، والأساسات المنفصلة والميدات الرابطة وقواعد الجار، ونمذجة السلالم ومعالجة مشكلاتها. تشمل الورشة إعداد بلانات المحاور والأعمدة والأساسات والميدات والأسقف والسور، واستخدام الفلاتر لتنسيق اللوحات، وإنشاء الجداول والتحكم في بارامترات الفاميلي والمشروع والبارامترات المشتركة، ثم تجهيز اللوحات النهائية وطباعتها وتصديرها إلى AutoCAD وPDF. مناسبة لمن لديه معرفة أساسية ببرنامج Revit ويريد تطبيقًا عمليًا على مشروع واقعي.',
      en: 'A complete hands-on workshop modeling a two-story residential building with a roof according to Saudi Building Code SBC 1101. Turn your knowledge of Revit tools into a practical workflow: break down the project, plan the modeling sequence, follow best practices, and reuse modeled components. Model solid, depressed, and hollow-block slabs; isolated foundations, tie beams, and boundary foundations; and stairs while resolving common modeling issues. Prepare grid and column, foundation, ground beam, floor, roof, and boundary-wall plans; use filters to create clear presentation sheets; build schedules and manage family, project, and shared parameters; then prepare, print, and export final sheets to AutoCAD and PDF. Designed for learners with basic Revit knowledge who want to apply it to a real project.',
    },
    level: { ar: 'متوسط', en: 'Intermediate' },
    duration: { ar: '10 ساعة', en: '10 Hours' },
    image: '/courses/Revit Structure Workshop - 02.webp',
    udemyLink: 'https://www.behance.net/gallery/186142533/_',
    syllabus: [
      {
        ar: 'تخطيط المشروع وأفضل ممارسات النمذجة',
        en: 'Project Planning and Modeling Best Practices',
        description: {
          ar: 'تعرّف على كيفية تقسيم المشروع، وترتيب البدء في نمذجة عناصره، واختيار أساليب عمل تساعد على إنشاء نموذج سليم والاستفادة من العناصر المنمذجة مسبقًا.',
          en: 'Learn how to break down the project, choose an effective modeling sequence, and reuse previously modeled elements to build a reliable model.',
        },
      },
      {
        ar: 'نمذجة المبنى السكني والبلاطات',
        en: 'Modeling the Residential Building and Slabs',
        description: {
          ar: 'طبّق على مبنى سكني من دورين وروف وفق الكود السعودي SBC 1101، ونمذج البلاطات المصمتة والبلاطات المهبطة للحمامات والمطابخ والهولو بلوك.',
          en: 'Model a two-story residential building with a roof according to SBC 1101, including solid slabs, depressed slabs for bathrooms and kitchens, and hollow-block slabs.',
        },
      },
      {
        ar: 'الأساسات والسلالم وحل مشكلات النمذجة',
        en: 'Foundations, Stairs, and Modeling Workflows',
        description: {
          ar: 'نمذج القواعد المنفصلة للمبنى والسور وقواعد الجار والميدات الرابطة، وتعرّف على تفاصيل السلالم (النائمة والقائمة والبسطة) وكيفية معالجة المشكلات الشائعة وإعادة استخدام العناصر المنمذجة.',
          en: 'Model isolated foundations for the building and boundary wall, boundary foundations, and tie beams. Work through stair treads, risers, and landings, resolve common issues, and reuse previously modeled elements.',
        },
      },
      {
        ar: 'إعداد البلانات وربط عناصر المشروع',
        en: 'Preparing Plans and Coordinating Project Elements',
        description: {
          ar: 'جهّز بلانات المحاور والأعمدة والأساسات والكمرات الأرضية (الميدات) وأسقف الدور الأرضي والأول والسطح والسور، واستفد من ربط العناصر المختلفة داخل نموذج Revit.',
          en: 'Prepare grid and column, foundation, ground beam, ground-floor, first-floor, roof, and boundary-wall plans, and use Revit relationships to coordinate project elements.',
        },
      },
      {
        ar: 'الفلاتر وتنسيق اللوحات',
        en: 'Filters and Sheet Presentation',
        description: {
          ar: 'استخدم الفلاتر للتحكم في إظهار العناصر المختلفة، وجهّز أسلوب العرض والبرزنتيشن الخاص بلوحات المشروع.',
          en: 'Use filters to control the visibility and graphic display of model elements, and develop a consistent presentation style for the project sheets.',
        },
      },
      {
        ar: 'الجداول التصميمية والبارامترات',
        en: 'Design Schedules and Parameters',
        description: {
          ar: 'أنشئ جداول للأعمدة والميدات والكمرات الساقطة والمخفية والبلاطات، وتعلّم التحكم في الجداول وبارامترات الفاميلي والمشروع والبارامترات المشتركة.',
          en: 'Create schedules for columns, tie beams, downstand and hidden beams, and slabs. Learn to control schedules and family, project, and shared parameters.',
        },
      },
      {
        ar: 'تجهيز اللوحات النهائية والطباعة والتصدير',
        en: 'Final Sheets, Printing, and Exporting',
        description: {
          ar: 'جهّز لوحات المحاور والأعمدة والأساسات والميدات والأسقف والسور والموقع العام، ثم اطبع اللوحات وصدّرها إلى AutoCAD وPDF.',
          en: 'Prepare the grid and column, foundation, ground beam, floor, roof, boundary wall, and site plan sheets, then print and export them to AutoCAD and PDF.',
        },
      },
    ],
  },
   {
    id: 'revit-structure-workshop-03',
    title: { ar: 'ورشة عمل Revit Structure - 03', en: 'Revit Structure Workshop - 03' },
    description: {
      ar: 'طبّق على مبنى سكني من دورين وروف وفق الكود السعودي SBC 1101، وتعلّم التعاون بين التخصصات، إعداد القوالب، النمذجة، حصر الكميات وإخراج اللوحات.',
      en: 'Model a two-story residential building with a roof to Saudi Building Code SBC 1101, covering collaboration, templates, structural modeling, quantity takeoff, and documentation.',
    },
    fullDescription: {
      ar: 'ورشة تطبيقية مدتها 12 ساعة على مبنى سكني من دورين وروف وفق الكود السعودي SBC 1101. تعلّم تقسيم المشروع واختيار أفضل ترتيب للنمذجة، والتعاون مع التخصصات الأخرى بربط ملف المعماري والاستفادة من المناسيب والمحاور وحدود البلاطات. تعرّف على طرق بدء المشاريع وإنشاء قالب من مشروع سابق مع الاستفادة من تقسيم الملفات والفاميلي والبارامترات والفلاتر. تشمل الورشة نمذجة البلاطات المصمتة والفلات والمهبطة والهولو بلوك، والأساسات المنفصلة والمشتركة واللبشة والميدات الرابطة، والسلالم. ستجهز البلانات والفلاتر والجداول واللوحات النهائية وتصدرها إلى AutoCAD وPDF، بالإضافة إلى حصر كميات الأساسات والأعمدة والحوائط والكمرات والأسقف. مناسبة لمن لديه معرفة أساسية ببرنامج Revit ويريد تطوير تطبيقه العملي وتجهيز نموذج دقيق خالٍ من المشكلات لمراحل الحصر والرسومات التنفيذية.',
      en: 'A 12-hour practical workshop based on a two-story residential building with a roof, following Saudi Building Code SBC 1101. Learn to break down the project and plan an effective modeling sequence, collaborate with other disciplines by linking the architectural model and using its levels, grids, and slab boundaries, and start new projects efficiently by creating templates from previous projects. Reuse project setup, families, parameters, and filters. Model solid, flat, depressed, and hollow-block slabs; isolated and combined foundations, raft foundations, tie beams, and stairs. Prepare plans, filters, schedules, and final sheets, then export to AutoCAD and PDF. The workshop also covers quantity takeoff for foundations, columns and walls, beams, and slabs. Designed for learners with basic Revit knowledge who want a reliable, practical model ready for quantity takeoff and construction documentation.',
    },
    level: { ar: 'متقدم', en: 'Advanced' },
    duration: { ar: '12 ساعة', en: '12 Hours' },
    image: '/courses/Revit Structure Workshop - 03.webp',
    udemyLink: 'https://www.behance.net/gallery/186280023/_',
    syllabus: [
      {
        ar: 'تخطيط المشروع وأفضل ممارسات النمذجة',
        en: 'Project Planning and Modeling Best Practices',
        description: {
          ar: 'قسّم المشروع وحدد ترتيب نمذجة العناصر، واستفد من العناصر والأجزاء التي تم إعدادها مسبقًا لتسريع العمل وإنشاء نموذج سليم.',
          en: 'Break down the project, plan the modeling sequence, and reuse previously prepared elements to work efficiently and create a reliable model.',
        },
      },
      {
        ar: 'التعاون وربط ملف المعماري',
        en: 'Collaboration and Linking the Architectural Model',
        description: {
          ar: 'تعرّف على طرق التعامل مع ملفات التخصصات الأخرى، وطبّق ربط الملف المعماري والاستفادة من المناسيب والمحاور وحدود البلاطات والبيانات الموجودة فيه.',
          en: 'Learn to work with files from other disciplines. Link the architectural model and use its levels, grids, slab boundaries, and available project data.',
        },
      },
      {
        ar: 'بدء المشاريع وإنشاء القوالب',
        en: 'Starting Projects and Creating Templates',
        description: {
          ar: 'قارن طرق بدء المشاريع، وأنشئ قالبًا بالاستفادة من مشروع سابق، بما يشمل تقسيم الملفات والفاميلي والبارامترات والفلاتر لتقليل الوقت والمجهود.',
          en: 'Explore different ways to start a project and create a template from a previous project, reusing file structure, families, parameters, and filters.',
        },
      },
      {
        ar: 'نمذجة البلاطات والأساسات والسلالم',
        en: 'Modeling Slabs, Foundations, and Stairs',
        description: {
          ar: 'طبّق على مبنى سكني من دورين وروف وفق SBC 1101، مع نمذجة البلاطات المصمتة والفلات والمهبطة والهولو بلوك، والأساسات المنفصلة والمشتركة واللبشة والميدات الرابطة، والسلالم وتفاصيلها.',
          en: 'Model a two-story residential building with a roof to SBC 1101, including solid, flat, depressed, and hollow-block slabs; isolated and combined foundations, raft foundations, tie beams, and detailed stairs.',
        },
      },
      {
        ar: 'البلانات والفلاتر وتنسيق اللوحات',
        en: 'Plans, Filters, and Sheet Presentation',
        description: {
          ar: 'جهّز بلانات المحاور والأعمدة والأساسات والميدات وأسقف الأدوار والسطح والسور، واستخدم الفلاتر لربط العناصر وتنسيق برزنتيشن اللوحات.',
          en: 'Prepare grid and column, foundation, ground beam, floor, roof, and boundary-wall plans. Use filters to coordinate elements and create a consistent sheet presentation.',
        },
      },
      {
        ar: 'الجداول التصميمية والبارامترات',
        en: 'Design Schedules and Parameters',
        description: {
          ar: 'أنشئ جداول الأعمدة والميدات والكمرات الساقطة والمخفية والبلاطات، وتحكم في بارامترات الفاميلي والمشروع والبارامترات المشتركة.',
          en: 'Create schedules for columns, tie beams, downstand and hidden beams, and slabs. Manage family, project, and shared parameters.',
        },
      },
      {
        ar: 'اللوحات النهائية والطباعة والتصدير',
        en: 'Final Sheets, Printing, and Exporting',
        description: {
          ar: 'جهّز لوحات المحاور والأعمدة والأساسات والميدات والأسقف والسور والموقع العام، ثم اطبعها وصدّرها إلى AutoCAD وPDF.',
          en: 'Prepare grid and column, foundation, ground beam, floor, roof, boundary-wall, and site plan sheets, then print and export them to AutoCAD and PDF.',
        },
      },
      {
        ar: 'حصر كميات المشروع',
        en: 'Project Quantity Takeoff',
        description: {
          ar: 'نفّذ حصرًا لكميات الأساسات والأعمدة والحوائط والكمرات والأسقف بالاعتماد على نموذج Revit.',
          en: 'Use the Revit model to take off quantities for foundations, columns and walls, beams, and slabs.',
        },
      },
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
