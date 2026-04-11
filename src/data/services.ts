import { Layers, Search, GraduationCap, Route, ReceiptText, FolderKanban } from 'lucide-react';

export const services = [
  {
    id: 'bim-training',
    icon: GraduationCap,
    title: { ar: 'التدريب الاحترافي على نمذجة معلومات المباني (للأفراد والشركات)', en: 'Professional BIM Training (Individuals & Corporate)' },
    description: {
      ar: 'برامج تدريبية مخصصة في مجال نمذجة معلومات المباني (BIM) مصممة للمهندسين والشركات وفرق المشاريع، مع التركيز على سير العمل الواقعي بدلاً من النظريات.',
      en: 'Customized BIM training programs designed for engineers, companies, and project teams, focusing on real-world workflows rather than theory. ',
    },
    fullDescription: {
      ar: 'نقدم خدمات استشارية شاملة لتطبيق نظام نمذجة معلومات البناء BIM في مشاريعكم. نساعدكم في وضع خطط التنفيذ، واختيار البرمجيات المناسبة، وتدريب الفرق، وضمان التكامل السلس بين جميع التخصصات.',
      en: 'We provide comprehensive consulting services for implementing Building Information Modeling (BIM) in your projects. We help you develop execution plans, select appropriate software, train teams, and ensure seamless integration between all disciplines.',
    },
  },
  {
    id: 'bim-coordination',
    icon: Search,
    title: { ar: 'تنسيق نمذجة معلومات المباني (BIM) والكشف عن التداخلات', en: 'BIM Coordination & Clash Detection' },
    description: {
      ar: 'خدمات تنسيق شاملة ومتعددة التخصصات لنمذجة معلومات المباني (BIM) لتحديد وحل التعارضات بين الأنظمة الهيكلية والمعمارية وأنظمة MEP باستخدام برنامج Navisworks.',
      en: 'Comprehensive multidisciplinary BIM coordination services to identify and resolve clashes between structural, architectural, and MEP systems using Navisworks. ',
    },
    fullDescription: {
      ar: 'نقوم بإنشاء نماذج Revit عالية الجودة والدقة لجميع أنواع المشاريع. يشمل ذلك النمذجة المعمارية، الإنشائية، والميكانيكية والكهربائية. نضمن التوافق مع معايير LOD المطلوبة.',
      en: 'We create high-quality, accurate Revit models for all types of projects. This includes architectural, structural, and MEP modeling. We ensure compliance with required LOD standards.',
    },
  },
  {
    id: 'autoCAD-to-revit',
    icon: Layers,
    title: { ar: 'تحويل ملفات AutoCAD إلى Revit ', en: 'AutoCAD to Revit Conversion (Structural & Architectural)' },
    description: {
      ar: 'تحويل دقيق لرسومات AutoCAD ثنائية الأبعاد إلى نماذج Revit BIM منسقة بالكامل، مما يضمن صحة الهندسة والمستويات والعائلات وهيكل النموذج.',
      en: 'Accurate conversion of 2D AutoCAD drawings into fully coordinated Revit BIM models, ensuring correct geometry, levels, families, and model structure.',
    },
    fullDescription: {
      ar: 'نستخدم برنامج Navisworks لتحليل النماذج المدمجة وكشف التعارضات بين التخصصات المختلفة قبل البدء في التنفيذ. هذا يوفر الوقت والتكاليف ويضمن جودة التنفيذ.',
      en: 'We use Navisworks to analyze federated models and detect clashes between different disciplines before construction begins. This saves time and costs while ensuring quality execution.',
    },
  },
  {
    id: 'infrastructure-bim',
    icon: Route,
    title: { ar: 'نمذجة معلومات المباني للبنية التحتية (الطرق وشبكات المرافق)', en: 'Infrastructure BIM Modeling (Roads & Utility Networks)' },
    description: {
      ar: 'تطوير نماذج BIM دقيقة ومنسقة لمشاريع البنية التحتية، بما في ذلك الطرق وشبكات إمدادات المياه وأنظمة الصرف الصحي ومياه الصرف الصحي ومحطات الرفع ومرافق المعالجة.',
      en: 'Development of accurate and coordinated BIM models for infrastructure projects, including roads, water supply networks, sanitary and wastewater systems, lift stations, and treatment facilities.',
    },
    fullDescription: {
      ar: 'نقدم برامج تدريبية شاملة ومتخصصة في جميع برامج BIM. تشمل دوراتنا Revit، Navisworks، BIM 360، وغيرها. متاحة للأفراد والشركات، حضورياً وأونلاين.',
      en: 'We offer comprehensive and specialized training programs in all BIM software. Our courses include Revit, Navisworks, BIM 360, and more. Available for individuals and companies, in-person and online.',
    },
  },
  {
    id: 'structural-shop-drawings',
    icon: FolderKanban,
    title: { ar: 'الرسومات التنفيذية الإنشائية (الخرسانة وحديد التسليح)', en: 'Structural Shop Drawings (Concrete & Rebar)' },
    description: {
      ar: 'إعداد رسومات تفصيلية للهياكل الإنشائية لأعمال الخرسانة المسلحة وحديد التسليح، مستخرجة مباشرة من نماذج BIM الدقيقة.',
      en: 'Preparation of detailed structural shop drawings for reinforced concrete and rebar works, extracted directly from accurate BIM models. ',
    },
    fullDescription: {
      ar: 'نقدم برامج تدريبية شاملة ومتخصصة في جميع برامج BIM. تشمل دوراتنا Revit، Navisworks، BIM 360، وغيرها. متاحة للأفراد والشركات، حضورياً وأونلاين.',
      en: 'We offer comprehensive and specialized training programs in all BIM software. Our courses include Revit, Navisworks, BIM 360, and more. Available for individuals and companies, in-person and online.',
    },
  },
  {
    id: 'structural-quantity-takeoffs',
    icon: ReceiptText,
    title: { ar: 'جداول الكميات الإنشائية', en: 'Structural Quantity Takeoffs & BOQs' },
    description: {
      ar: 'يتم إنشاء جداول كميات هيكلية دقيقة من نماذج BIM لدعم تقدير التكاليف، والمناقصات، والتحكم في المشروع.',
      en: 'Precise structural quantity takeoffs generated from BIM models to support cost estimation, tendering, and project control.',
    },
    fullDescription: {
      ar: 'نقدم برامج تدريبية شاملة ومتخصصة في جميع برامج BIM. تشمل دوراتنا Revit، Navisworks، BIM 360، وغيرها. متاحة للأفراد والشركات، حضورياً وأونلاين.',
      en: 'We offer comprehensive and specialized training programs in all BIM software. Our courses include Revit, Navisworks, BIM 360, and more. Available for individuals and companies, in-person and online.',
    },
  },
];
