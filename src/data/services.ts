import { Layers, Search, GraduationCap, Route, ReceiptText, FolderKanban } from 'lucide-react';

export interface BilingualText {
  ar: string;
  en: string;
}

export interface ProcessStep {
  title: BilingualText;
  desc: BilingualText;
}

export interface Service {
  id: string;
  icon: React.ElementType;
  title: BilingualText;
  description: BilingualText;
  fullDescription: BilingualText;
  targets: BilingualText[];
  benefits: BilingualText[];
  process: ProcessStep[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = any;

export const services: (Omit<Service, 'icon'> & { icon: IconComponent })[] = [
  {
    id: 'bim-training',
    icon: GraduationCap,
    title: {
      ar: 'التدريب الاحترافي على نمذجة معلومات المباني (للأفراد والشركات)',
      en: 'Professional BIM Training (Individuals & Corporate)',
    },
    description: {
      ar: 'برامج تدريبية مخصصة في مجال BIM مصممة للمهندسين والشركات وفرق المشاريع، مع التركيز على سير العمل الواقعي بدلاً من النظريات.',
      en: 'Customized BIM training programs for engineers, companies, and project teams, focusing on real-world workflows rather than theory.',
    },
    fullDescription: {
      ar: 'نقدم برامج تدريبية مخصصة ومتخصصة في مجال نمذجة معلومات المباني BIM، مصممة خصيصاً للمهندسين والشركات وفرق المشاريع. نركز على التطبيق العملي الفعلي بدلاً من النظريات، ونستخدم مشاريع حقيقية لضمان أن المتدرب يغادر بمهارات قابلة للتطبيق فوراً.',
      en: 'We provide customized BIM training programs specifically designed for engineers, companies, and project teams. We focus on hands-on application using real projects to ensure trainees leave with immediately applicable skills.',
    },
    targets: [
      { ar: 'مهندسون مدنيون ومعماريون يريدون دخول مجال BIM', en: 'Civil & architectural engineers entering the BIM field' },
      { ar: 'شركات مقاولات تريد تبني BIM في مشاريعها', en: 'Contracting companies adopting BIM workflows' },
      { ar: 'فرق التصميم التي تريد رفع كفاءتها التقنية', en: 'Design teams aiming to elevate their technical level' },
      { ar: 'خريجو هندسة يسعون للتوظيف في شركات BIM', en: 'Engineering graduates seeking BIM-focused employment' },
    ],
    benefits: [
      { ar: 'مناهج مبنية على مشاريع حقيقية، لا نظريات فقط', en: 'Curriculum built on real projects, not just theory' },
      { ar: 'مدربون معتمدون بخبرة عملية موثقة', en: 'Certified instructors with documented practical experience' },
      { ar: 'جداول مرنة: حضوري وأونلاين', en: 'Flexible schedules: in-person and online' },
      { ar: 'دعم ومتابعة ما بعد التدريب', en: 'Post-training support and follow-up' },
      { ar: 'شهادة مهنية معتمدة عند الإتمام', en: 'Accredited professional certificate upon completion' },
      { ar: 'تسجيلات الجلسات متاحة للمراجعة في أي وقت', en: 'Session recordings available for review anytime' },
    ],
    process: [
      {
        title: { ar: 'تقييم المستوى', en: 'Level Assessment' },
        desc: { ar: 'نحدد مستواك الحالي ونصمم المسار التدريبي المناسب لك', en: 'We assess your current level and design the right learning path' },
      },
      {
        title: { ar: 'تصميم البرنامج', en: 'Program Design' },
        desc: { ar: 'نخصص المحتوى ليتوافق مع أهدافك ومجال عملك', en: 'We customize content to match your goals and industry' },
      },
      {
        title: { ar: 'التدريب التطبيقي', en: 'Practical Training' },
        desc: { ar: 'جلسات نظرية وعملية مع مهندسين متخصصين', en: 'Theoretical and practical sessions with specialist engineers' },
      },
      {
        title: { ar: 'مشاريع تطبيقية', en: 'Applied Projects' },
        desc: { ar: 'تطبيق المهارات على مشاريع حقيقية لترسيخ التعلم', en: 'Apply skills to real projects to solidify learning' },
      },
      {
        title: { ar: 'شهادة وتقييم نهائي', en: 'Certificate & Final Assessment' },
        desc: { ar: 'تقييم شامل وإصدار شهادة مهنية معتمدة', en: 'Comprehensive assessment and accredited certificate issuance' },
      },
    ],
  },
  {
    id: 'bim-coordination',
    icon: Search,
    title: {
      ar: 'تنسيق نمذجة معلومات المباني (BIM) والكشف عن التداخلات',
      en: 'BIM Coordination & Clash Detection',
    },
    description: {
      ar: 'خدمات تنسيق شاملة ومتعددة التخصصات لتحديد وحل التعارضات بين الأنظمة الهيكلية والمعمارية وأنظمة MEP باستخدام Navisworks.',
      en: 'Comprehensive multidisciplinary BIM coordination services to identify and resolve clashes between structural, architectural, and MEP systems using Navisworks.',
    },
    fullDescription: {
      ar: 'نستخدم برنامج Navisworks لتحليل النماذج المدمجة وكشف التعارضات بين التخصصات المختلفة قبل البدء في التنفيذ. هذا يوفر الوقت والتكاليف ويضمن جودة التنفيذ ويقلل من المشاكل الميدانية.',
      en: 'We use Navisworks to analyze federated models and detect clashes between disciplines before construction begins, saving time and costs while ensuring quality execution.',
    },
    targets: [
      { ar: 'شركات مقاولات تريد تجنب مشاكل التنفيذ', en: 'Contracting companies seeking to avoid construction issues' },
      { ar: 'مديرو مشاريع يريدون ضمان جودة التسليم', en: 'Project managers ensuring quality delivery' },
      { ar: 'مكاتب استشارات هندسية متعددة التخصصات', en: 'Multidisciplinary engineering consultancies' },
      { ar: 'أصحاب المشاريع الذين يريدون حماية استثماراتهم', en: 'Project owners protecting their investments' },
    ],
    benefits: [
      { ar: 'تقليل RFIs في الموقع بنسبة تصل إلى 80%', en: 'Reduce site RFIs by up to 80%' },
      { ar: 'توفير تكاليف التعديلات المكلفة أثناء التنفيذ', en: 'Save costly rework expenses during construction' },
      { ar: 'جداول زمنية أكثر دقة وواقعية', en: 'More accurate and realistic project schedules' },
      { ar: 'توثيق كامل لجميع القرارات والتعارضات المحلولة', en: 'Full documentation of all decisions and resolved clashes' },
      { ar: 'تقارير تعارض واضحة ومرتبة حسب الأولوية', en: 'Clear clash reports prioritized for action' },
    ],
    process: [
      {
        title: { ar: 'استلام النماذج', en: 'Model Reception' },
        desc: { ar: 'نستقبل نماذج BIM من جميع التخصصات وندقق جودتها', en: 'Receive BIM models from all disciplines and verify quality' },
      },
      {
        title: { ar: 'دمج النماذج', en: 'Model Federation' },
        desc: { ar: 'نجمع النماذج في بيئة Navisworks موحدة', en: 'Federate all models into a unified Navisworks environment' },
      },
      {
        title: { ar: 'كشف التداخلات', en: 'Clash Detection' },
        desc: { ar: 'نشغّل اختبارات التداخل الآلية والمراجعة البصرية', en: 'Run automated clash tests and visual reviews' },
      },
      {
        title: { ar: 'تقارير مفصلة', en: 'Detailed Reports' },
        desc: { ar: 'نصدر تقارير واضحة بالأولويات والحلول المقترحة', en: 'Issue clear reports with priorities and proposed solutions' },
      },
      {
        title: { ar: 'متابعة الحل', en: 'Resolution Follow-up' },
        desc: { ar: 'نتابع مع الفرق حتى حل جميع التعارضات وإغلاق التقرير', en: 'Follow up with teams until all clashes are resolved and closed' },
      },
    ],
  },
  {
    id: 'autoCAD-to-revit',
    icon: Layers,
    title: {
      ar: 'تحويل ملفات AutoCAD إلى Revit',
      en: 'AutoCAD to Revit Conversion (Structural & Architectural)',
    },
    description: {
      ar: 'تحويل دقيق لرسومات AutoCAD ثنائية الأبعاد إلى نماذج Revit BIM منسقة بالكامل، مع ضمان صحة الهندسة والمستويات والعائلات وهيكل النموذج.',
      en: 'Accurate conversion of 2D AutoCAD drawings into fully coordinated Revit BIM models, ensuring correct geometry, levels, families, and model structure.',
    },
    fullDescription: {
      ar: 'نحوّل رسوماتك الـ CAD القديمة إلى نماذج BIM ثلاثية الأبعاد بدقة عالية وفق معايير LOD المطلوبة، مما يتيح لك استخراج الكميات والرسومات وإدارة المشروع بكفاءة أعلى.',
      en: 'We convert your legacy CAD drawings into accurate 3D BIM models according to required LOD standards, enabling quantity extraction, drawing generation, and more efficient project management.',
    },
    targets: [
      { ar: 'مكاتب تصميم تريد الانتقال من CAD إلى BIM', en: 'Design offices transitioning from CAD to BIM' },
      { ar: 'مهندسون إنشائيون لديهم رسومات CAD قديمة', en: 'Structural engineers with legacy CAD drawings' },
      { ar: 'شركات مقاولات تحتاج نماذج BIM لمشاريع قائمة', en: 'Contractors needing BIM models for existing projects' },
      { ar: 'مطورون عقاريون يريدون توثيق مبانيهم رقمياً', en: 'Real estate developers seeking digital documentation' },
    ],
    benefits: [
      { ar: 'تحويل دقيق يعكس الرسومات الأصلية بالكامل', en: 'Accurate conversion reflecting original drawings fully' },
      { ar: 'نموذج جاهز لاستخراج الكميات والرسومات التنفيذية', en: 'Model ready for quantity takeoffs and shop drawings' },
      { ar: 'سهولة التعديل والتحديث في المستقبل', en: 'Easy future modifications and updates' },
      { ar: 'توافق كامل مع معايير LOD المطلوبة', en: 'Full compliance with required LOD standards' },
      { ar: 'توفير وقت الفريق في إعادة النمذجة يدوياً', en: 'Save team time on manual remodeling' },
    ],
    process: [
      {
        title: { ar: 'تحليل الملفات', en: 'File Analysis' },
        desc: { ar: 'مراجعة رسومات CAD وتقييم جودتها ومدى اكتمالها', en: 'Review CAD drawings and assess their quality and completeness' },
      },
      {
        title: { ar: 'تنظيف وتصنيف', en: 'Cleanup & Sorting' },
        desc: { ar: 'تنظيف وتصنيف طبقات الرسم وإزالة التكرارات', en: 'Clean and sort drawing layers and remove duplicates' },
      },
      {
        title: { ar: 'بناء النموذج', en: 'Model Building' },
        desc: { ar: 'إنشاء نموذج Revit بدقة عالية وفق المعايير المطلوبة', en: 'Build the Revit model with high precision per required standards' },
      },
      {
        title: { ar: 'مراجعة الجودة', en: 'Quality Review' },
        desc: { ar: 'مقارنة النموذج بالرسومات الأصلية وتدقيق الدقة', en: 'Compare model against original drawings and verify accuracy' },
      },
      {
        title: { ar: 'التسليم النهائي', en: 'Final Delivery' },
        desc: { ar: 'تسليم النموذج مع ملف Template والعائلات المستخدمة', en: 'Deliver model with Template file and all used families' },
      },
    ],
  },
  {
    id: 'infrastructure-bim',
    icon: Route,
    title: {
      ar: 'نمذجة معلومات المباني للبنية التحتية (الطرق وشبكات المرافق)',
      en: 'Infrastructure BIM Modeling (Roads & Utility Networks)',
    },
    description: {
      ar: 'تطوير نماذج BIM دقيقة ومنسقة لمشاريع البنية التحتية، بما في ذلك الطرق وشبكات المياه والصرف الصحي ومحطات الرفع ومرافق المعالجة.',
      en: 'Development of accurate and coordinated BIM models for infrastructure projects, including roads, water supply networks, sanitary and wastewater systems, lift stations, and treatment facilities.',
    },
    fullDescription: {
      ar: 'نقدم خدمات نمذجة BIM متخصصة لمشاريع البنية التحتية باستخدام Civil 3D وRevit، مما يضمن تنسيقاً دقيقاً بين شبكات المرافق المختلفة وتقليل مفاجآت الحفر أثناء التنفيذ.',
      en: 'We provide specialized BIM modeling services for infrastructure projects using Civil 3D and Revit, ensuring precise coordination between utility networks and minimizing excavation surprises during construction.',
    },
    targets: [
      { ar: 'شركات إنشاء الطرق والبنية التحتية', en: 'Road construction and infrastructure companies' },
      { ar: 'الجهات الحكومية ووزارات الإسكان والمرافق', en: 'Government bodies and housing & utilities ministries' },
      { ar: 'شركات الاستشارات الهندسية للمشاريع الكبرى', en: 'Engineering consultancies on large-scale projects' },
      { ar: 'مطورون يعملون على مجمعات متكاملة', en: 'Developers working on integrated mixed-use communities' },
    ],
    benefits: [
      { ar: 'دقة عالية في تمثيل الشبكات الموجودة والمخططة', en: 'High accuracy in representing existing and planned networks' },
      { ar: 'تقليل مفاجآت الحفر والتعديلات الميدانية', en: 'Reduce excavation surprises and field modifications' },
      { ar: 'تخطيط أفضل للمراحل الإنشائية المتتالية', en: 'Better planning of sequential construction phases' },
      { ar: 'توثيق رقمي كامل للبنية التحتية للصيانة المستقبلية', en: 'Full digital documentation for future maintenance' },
      { ar: 'تنسيق محكم بين شبكات المياه والكهرباء والطرق', en: 'Tight coordination between water, power, and road networks' },
    ],
    process: [
      {
        title: { ar: 'استلام البيانات', en: 'Data Reception' },
        desc: { ar: 'مراجعة خرائط المساحة والتصاميم والبيانات الجيوتقنية', en: 'Review survey maps, designs, and geotechnical data' },
      },
      {
        title: { ar: 'بناء نموذج البنية التحتية', en: 'Infrastructure Model Building' },
        desc: { ar: 'إنشاء نماذج Civil 3D / Revit دقيقة للطرق والشبكات', en: 'Build accurate Civil 3D / Revit models for roads and networks' },
      },
      {
        title: { ar: 'تنسيق الشبكات', en: 'Network Coordination' },
        desc: { ar: 'ربط وتنسيق شبكات المرافق المختلفة في نموذج موحد', en: 'Link and coordinate different utility networks in one model' },
      },
      {
        title: { ar: 'كشف التعارضات', en: 'Clash Detection' },
        desc: { ar: 'فحص التداخلات بين الشبكات وإصدار تقارير مفصلة', en: 'Check clashes between networks and issue detailed reports' },
      },
      {
        title: { ar: 'التسليم النهائي', en: 'Final Delivery' },
        desc: { ar: 'نماذج نهائية ورسومات تنفيذية وجداول كميات', en: 'Final models, shop drawings, and quantity schedules' },
      },
    ],
  },
  {
    id: 'structural-shop-drawings',
    icon: FolderKanban,
    title: {
      ar: 'الرسومات التنفيذية الإنشائية (الخرسانة وحديد التسليح)',
      en: 'Structural Shop Drawings (Concrete & Rebar)',
    },
    description: {
      ar: 'إعداد رسومات تفصيلية للهياكل الإنشائية لأعمال الخرسانة المسلحة وحديد التسليح، مستخرجة مباشرة من نماذج BIM الدقيقة.',
      en: 'Preparation of detailed structural shop drawings for reinforced concrete and rebar works, extracted directly from accurate BIM models.',
    },
    fullDescription: {
      ar: 'نعدّ رسومات تنفيذية إنشائية دقيقة ومفصلة مستخرجة من نماذج BIM، توفر للمقاول وضوحاً تاماً في التنفيذ وتقلل من الأخطاء الميدانية وتسرّع وتيرة العمل في الموقع.',
      en: 'We prepare accurate and detailed structural shop drawings extracted from BIM models, providing contractors with full clarity during construction, reducing site errors, and accelerating work pace.',
    },
    targets: [
      { ar: 'شركات مقاولات تحتاج رسومات واضحة للموقع', en: 'Contracting companies needing clear site drawings' },
      { ar: 'مهندسون إنشائيون يريدون تفاصيل دقيقة للتنفيذ', en: 'Structural engineers requiring precise execution details' },
      { ar: 'مشرفو مواقع يحتاجون وضوحاً في التنفيذ', en: 'Site supervisors needing clarity in execution' },
      { ar: 'مديرو مشاريع يريدون توثيقاً إنشائياً محكماً', en: 'Project managers wanting rigorous structural documentation' },
    ],
    benefits: [
      { ar: 'رسومات مستخرجة مباشرة من نموذج BIM الدقيق', en: 'Drawings extracted directly from the accurate BIM model' },
      { ar: 'تفاصيل حديد تسليح واضحة وقابلة للتنفيذ الفوري', en: 'Clear rebar details ready for immediate execution' },
      { ar: 'تقليل ملحوظ لأخطاء الموقع وطلبات التعديل', en: 'Significant reduction in site errors and change requests' },
      { ar: 'توافق مع الكودات الإنشائية المعتمدة', en: 'Compliance with approved structural codes' },
      { ar: 'رسومات جاهزة للطباعة والتقديم والأرشفة', en: 'Drawings ready for printing, submission, and archiving' },
    ],
    process: [
      {
        title: { ar: 'استلام النموذج أو التصميم', en: 'Model / Design Reception' },
        desc: { ar: 'استلام نموذج BIM أو رسومات التصميم الإنشائي', en: 'Receive BIM model or structural design drawings' },
      },
      {
        title: { ar: 'قراءة وفهم التصميم', en: 'Design Review' },
        desc: { ar: 'مراجعة التفاصيل الإنشائية والمواصفات والمعايير المطلوبة', en: 'Review structural details, specifications, and required standards' },
      },
      {
        title: { ar: 'إعداد الرسومات', en: 'Drawing Preparation' },
        desc: { ar: 'إنشاء رسومات تفصيلية للخرسانة والحديد لكل عنصر', en: 'Create detailed drawings for concrete and rebar of each element' },
      },
      {
        title: { ar: 'مراجعة الجودة', en: 'Quality Review' },
        desc: { ar: 'مراجعة الرسومات مع المهندس المصمم والتدقيق في التفاصيل', en: 'Review drawings with the design engineer and verify details' },
      },
      {
        title: { ar: 'التسليم النهائي', en: 'Final Delivery' },
        desc: { ar: 'رسومات جاهزة للطباعة بصيغ DWG و PDF', en: 'Drawings ready for printing in DWG and PDF formats' },
      },
    ],
  },
  {
    id: 'structural-quantity-takeoffs',
    icon: ReceiptText,
    title: {
      ar: 'جداول الكميات الإنشائية',
      en: 'Structural Quantity Takeoffs & BOQs',
    },
    description: {
      ar: 'إنشاء جداول كميات إنشائية دقيقة من نماذج BIM لدعم تقدير التكاليف والمناقصات والتحكم في المشروع.',
      en: 'Precise structural quantity takeoffs generated from BIM models to support cost estimation, tendering, and project control.',
    },
    fullDescription: {
      ar: 'نستخرج الكميات الإنشائية مباشرة من نماذج BIM ثلاثية الأبعاد، مما يضمن دقة أعلى وسرعة أكبر مقارنة بالحصر اليدوي التقليدي، ونسلمها في جداول BOQ منظمة وجاهزة للتسعير.',
      en: 'We extract structural quantities directly from 3D BIM models, ensuring higher accuracy and speed compared to traditional manual takeoffs, delivering them in organized BOQ tables ready for pricing.',
    },
    targets: [
      { ar: 'مهندسو تقدير التكاليف والحصر الكمي', en: 'Cost estimators and quantity surveyors' },
      { ar: 'شركات مقاولات تتقدم للمناقصات', en: 'Contracting companies tendering for projects' },
      { ar: 'مديرو التكاليف الذين يريدون دقة أعلى', en: 'Cost managers seeking higher accuracy' },
      { ar: 'أصحاب مشاريع يريدون ميزانيات واقعية ودقيقة', en: 'Project owners wanting realistic and accurate budgets' },
    ],
    benefits: [
      { ar: 'كميات مستخرجة مباشرة من النموذج ثلاثي الأبعاد', en: 'Quantities extracted directly from the 3D model' },
      { ar: 'سرعة إنجاز أعلى مقارنة بالحصر اليدوي', en: 'Faster turnaround compared to manual takeoff' },
      { ar: 'دقة عالية وتقليل أخطاء التفويت', en: 'High accuracy with minimized omission errors' },
      { ar: 'BOQ منظمة وجاهزة للتسعير والمناقصة', en: 'Organized BOQ ready for pricing and tendering' },
      { ar: 'سهولة تحديث الكميات عند تغيير التصميم', en: 'Easy quantity updates when design changes occur' },
    ],
    process: [
      {
        title: { ar: 'استلام النموذج أو الرسومات', en: 'Model / Drawing Reception' },
        desc: { ar: 'استلام نموذج BIM أو الرسومات الإنشائية للمشروع', en: 'Receive BIM model or structural project drawings' },
      },
      {
        title: { ar: 'ضبط المعايير', en: 'Standards Setup' },
        desc: { ar: 'تحديد معايير القياس والكودات والتصنيفات المطلوبة', en: 'Define measurement standards, codes, and required classifications' },
      },
      {
        title: { ar: 'استخراج الكميات', en: 'Quantity Extraction' },
        desc: { ar: 'استخراج الكميات من النموذج آلياً وتدقيقها يدوياً', en: 'Extract quantities from model automatically and verify manually' },
      },
      {
        title: { ar: 'تنظيم جداول BOQ', en: 'BOQ Organization' },
        desc: { ar: 'تنظيم الكميات في جداول واضحة وشاملة ومفصلة', en: 'Organize quantities into clear, comprehensive, detailed tables' },
      },
      {
        title: { ar: 'التسليم النهائي', en: 'Final Delivery' },
        desc: { ar: 'جداول BOQ نهائية بصيغ Excel و PDF جاهزة للتسعير', en: 'Final BOQ tables in Excel and PDF formats ready for pricing' },
      },
    ],
  },
];
