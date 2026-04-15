export const projects = [
  {
    id: '1',
    title: { ar: 'مشروع طرق وعبارات', en: 'NEOM Shigri Project' },
    category: { ar: 'بنية تحتية', en: 'infrastructure' },
    image: '/projects/01-Shigri-Neom.jpg',
    images: [
      '/projects/01-Shigri-Neom.jpg',
      '/projects/Shigri-Neom-02.jpg',
      '/projects/Shigri-Neom-03.jpg',
      '/projects/Shigri-Neom-04.jpg',
      '/projects/Shigri-Neom-05.jpg',
      '/projects/Shigri-Neom-06.jpg',
      '/projects/Shigri-Neom-07.jpg',
      '/projects/Shigri-Neom-08.jpg',
      '/projects/Shigri-Neom-09.jpg',
      '/projects/Shigri-Neom-10.jpg',
      '/projects/Shigri-Neom-11.jpg',
      // أضف صور إضافية إذا وجدت
    ],
    year: '2025',
    location: { ar: 'نيوم، السعودية', en: 'NEOM, Saudi Arabia' },
    client: { ar: 'شركة نيوم', en: 'NEOM Company' },
    description: {
      ar: 'تنسيق نمذجة معلومات المباني (BIM) للبنية التحتية لمشروع نيوم الضخم. بناء رقمي متقدم وكشف التداخلات لهذا المشروع التطويري المستقبلي.',
      en: 'BIM coordination for NEOM mega project infrastructure. Advanced digital construction and clash detection for this futuristic development.'
    },
    role: {
      ar: 'منسق نمذجة معلومات المباني (BIM) ومهندس نمذجة معلومات المباني الإنشائي',
      en: ' BIM Coordinator & BIM Structural Engineer '
    },
    tools: ['Autodesk Revit', 'Navisworks', 'AutoCAD'],
    deliverables: {
      ar: ['نماذج BIM متعددة التخصصات', 'وثائق المشروع (BEP - MIDP)', 'تقارير التعارضات بين التخصصات المختلفة', 'رسومات التصميم الإنشائي'],
      en: ['BIM Multidisciplinary Models', 'BIM Documents (BEP - MIDP)', 'Clash Reports', 'Structural  Design Drawings']
    },
    behanceUrl: 'https://www.behance.net/gallery/244804189/Shigri-Link-Road-NEOM-BIM-Coordination'
  },
  {
    id: '2',
    title: { ar: 'مجمع إدارى متكامل - صوارى', en: 'Swary Project - Egypt' },
    category: { ar: 'إدارى', en: 'Administrative' },
    image: '/projects/02-Swary-Egypt.jpg',
    images: [
      '/projects/02-Swary-Egypt.jpg',
      '/projects/Swary-Egypt-02.jpg',
      '/projects/Swary-Egypt-03.jpg',
      '/projects/Swary-Egypt-04.jpg',
      '/projects/Swary-Egypt-05.jpg',
      '/projects/Swary-Egypt-06.jpg',
      '/projects/Swary-Egypt-07.jpg',
      '/projects/Swary-Egypt-08.jpg',
      '/projects/Swary-Egypt-09.jpg',
      '/projects/Swary-Egypt-10.jpg',
      '/projects/Swary-Egypt-11.jpg',
      '/projects/Swary-Egypt-12.jpg',
    ],
    year: '2022',
    location: { ar: 'الإسكندرية، مصر', en: 'Alexandria, Egypt' },
    client: { ar: 'شركة صوارى', en: 'Swary Company' },
    description: {
      ar: 'مشروع إداري واسع النطاق في مصر. إدارة شاملة لنمذجة معلومات المباني (BIM) وتنسيق الهندسة الإنشائية.',
      en: 'Large-scale Administrative project in Egypt. Comprehensive BIM management and structural engineering coordination.'
    },
    role: {
      ar: 'مهندس نمذجة معلومات المباني الإنشائي',
      en: 'Structural BIM Engineer'
    },
    tools: ['Autodesk Revit', 'AutoCAD'],
    deliverables: {
      ar: ['وثائق المشروع (BEP - MIDP)', 'تقارير التعارضات بين التخصصات المختلفة', 'رسومات التصميم الإنشائي', 'جداول حصر الكميات'],
      en: ['BIM Documents (BEP - MIDP)', 'Clash Reports', 'Structural  Design Drawings', 'Quantity Take-off']
    },
    behanceUrl: 'https://www.behance.net/gallery/229866433/-Bim#'
  },
  {
    id: '3',
    title: { ar: 'برج الماس - السكة الجديدة', en: 'Elseka Elgedida Project' },
    category: { ar: 'إدارى / سكنى', en: 'Admin/Commercial' },
    image: '/projects/03-Elseka-Elgedida.jpg',
    images: [
      '/projects/Elseka-Elgedida-02.jpg',
      '/projects/03-Elseka-Elgedida.jpg',
      '/projects/Elseka-Elgedida-03.jpg',
      '/projects/Elseka-Elgedida-04.jpg',
      '/projects/Elseka-Elgedida-05.jpg',
      '/projects/Elseka-Elgedida-06.jpg',
      '/projects/Elseka-Elgedida-07.jpg',
      '/projects/Elseka-Elgedida-08.jpg',
      '/projects/Elseka-Elgedida-09.jpg',
      '/projects/Elseka-Elgedida-10.jpg',
      '/projects/Elseka-Elgedida-11.jpg',
    ],
    year: '2021',
    location: { ar: 'المنصورة، مصر', en: 'Mansour, Egypt' },
    client: { ar: 'شركة السكة الجديدة', en: 'Elseka Elgedida Co.' },
    description: {
      ar: 'مشروع تطوير مبنى إداري حديث شاهق الارتفاع مع تطبيق كامل لنمذجة معلومات المباني (BIM). أنظمة معقدة للمسارات والتنسيق.',
      en: 'Modern High Rise Administrative Building development with full BIM implementation. Complex track and coordination systems.'
    },
    role: {
      ar: 'مهندس الـ BIM الإنشائي، مهندس موقع',
      en: 'Structural BIM Engineer, Site Engineer'
    },
    tools: ['Autodesk Revit', 'AutoCAD', 'ETABS'],
    deliverables: {
      ar: ['نماذج BIM', 'رسومات التصميم الإنشائي', 'جداول حصر الكميات'],
      en: ['BIM Models', 'Structural  Design Drawings', 'Quantity Take-off']
    },
    behanceUrl: 'https://www.behance.net/gallery/161438451/-bim#'
  },
  {
    id: '4',
    title: { ar: 'مبنى إداري وتجاري', en: 'General Administration Building - Egypt' },
    category: { ar: 'إداري', en: 'Administrative' },
    image: '/projects/04-Admin-Egypt.jpg',
    images: [
      '/projects/Admin-Egypt-02.jpg',
      '/projects/Admin-Egypt-03.jpg',
      '/projects/Admin-Egypt-04.jpg',
      '/projects/Admin-Egypt-05.jpg',
      '/projects/Admin-Egypt-06.jpg',
      '/projects/Admin-Egypt-07.jpg',
      '/projects/Admin-Egypt-08.jpg',
      '/projects/Admin-Egypt-09.jpg',
      '/projects/Admin-Egypt-10.jpg',
    ],
    year: '2020',
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    client: { ar: 'شركة الإدارة', en: 'Admin Company' },
    description: {
      ar: 'مبنى إداري وتجاري مشروع تطوير مبنى إداري فاخر في مصر. تصميم هيكلي متكامل وتنسيق نمذجة معلومات المباني (BIM) لضمان كفاءة العمليات.متعدد الاستخدامات.',
      en: 'High-end administrative building development in Egypt. Complete structural design and BIM coordination for efficient operations.'
    },
    role: {
      ar: 'مهندس نمذجة معلومات المباني الإنشائي',
      en: 'Structural BIM Engineer'
    },
    tools: ['Autodesk Revit', 'AutoCAD'],
    deliverables: {
      ar: ['نماذج BIM', 'رسومات التصميم الإنشائي', 'جداول حصر الكميات'],
      en: ['BIM Models', 'Structural  Design Drawings', 'Quantity Take-off']
    },
    behanceUrl: 'https://www.behance.net/gallery/162095939/-bim#'
  },
  {
    id: '5',
    title: { ar: 'محطة رفع مياه الصرف الصحي', en: 'Wastewater Treatment Plant' },
    category: { ar: 'إنشائي', en: 'infrastructure' },
    image: '/projects/05-Wastewater-Treatment-Plant.jpg',
    images: [
      '/projects/05-Wastewater-Treatment-Plant.jpg',
      '/projects/Wastewater-Treatment-Plant-02.jpg',
      '/projects/Wastewater-Treatment-Plant-03.jpg',
      '/projects/Wastewater-Treatment-Plant-04.jpg',
    ],
    year: '2019',
    location: { ar: 'المنصورة، مصر', en: 'Mansoura, Egypt' },
    client: { ar: 'شركة المياه', en: 'Water Company' },
    description: {
      ar: 'محطة متطورة لمعالجة مياه الصرف الصحي مزودة بهندسة عمليات متكاملة ونمذجة معلومات المباني (BIM). تنسيق معقد للأنابيب والمعدات.',
      en: 'Advanced wastewater treatment facility with complete process engineering and BIM modeling. Complex piping and equipment coordination.'
    },
    role: {
      ar: 'مهندس إنشائي، مهندس موقع',
      en: 'Structural Engineer, Site Engineer'
    },
    tools: ['Autodesk Revit', 'AutoCAD'],
    deliverables: {
      ar: ['نماذج BIM', 'رسومات التصميم الإنشائي', 'جداول حصر الكميات'],
      en: ['BIM Models', 'Structural  Design Drawings', 'Quantity Take-off']
    },
    behanceUrl: 'https://www.behance.net/gallery/149889053/-bim#'
  },
  {
    id: '6',
    title: { ar: 'مسجد ومئذنة', en: 'Mosque & Minaret' },
    category: { ar: 'ديني', en: 'Religious' },
    image: '/projects/06-Tanah-Mosque.jpg',
    images: [
      '/projects/Tanah-Mosque-02.jpg',
      '/projects/Tanah-Mosque-03.jpg',
      '/projects/Tanah-Mosque-04.jpg',
      '/projects/Tanah-Mosque-05.jpg',
      '/projects/Tanah-Mosque-06.jpg',
      '/projects/Tanah-Mosque-07.jpg',
      '/projects/Tanah-Mosque-08.jpg',
      '/projects/Tanah-Mosque-09.jpg',
      '/projects/Tanah-Mosque-10.jpg',
      '/projects/Tanah-Mosque-11.jpg',
    ],
    year: '2018',
    location: { ar: 'المنصورة، مصر', en: 'Mansoura, Egypt' },
    client: { ar: 'جمعية خيرية', en: 'Charity Association' },
    description: {
      ar: 'تصميم مسجد ومئذنة حديثة.',
      en: 'Design of a modern mosque and minaret.'
    },
    role: {
      ar: 'مهندس نمذجة معلومات المباني الإنشائي',
      en: 'Structural BIM Engineer'
    },
    tools: ['Autodesk Revit', 'AutoCAD'],
    deliverables: {
      ar: ['نماذج BIM', 'رسومات التصميم الإنشائي', 'جداول حصر الكميات'],
      en: ['BIM Models', 'Structural  Design Drawings', 'Quantity Take-off']
    },
    behanceUrl: 'https://www.behance.net/gallery/161398431/-bim-Mosque-Project#'
  },
  {
    id: '7',
    title: { ar: '5 مباني سكنية', en: '5 Residential Buildings' },
    category: { ar: 'إنشائي', en: 'Residential' },
    image: '/projects/07-Multi-Residential.jpg',
    images: [
      '/projects/Multi-Residential-02.jpg',
      '/projects/Multi-Residential-03.jpg', 
      '/projects/Multi-Residential-04.jpg',
      '/projects/Multi-Residential-05.jpg',
      '/projects/Multi-Residential-06.jpg',
      '/projects/Multi-Residential-07.jpg',
      '/projects/Multi-Residential-06.jpg',
      '/projects/Multi-Residential-07.jpg',
      '/projects/Multi-Residential-08.jpg',
      '/projects/Multi-Residential-09.jpg',
      '/projects/Multi-Residential-10.jpg',
      '/projects/Multi-Residential-11.jpg',
      '/projects/Multi-Residential-12.jpg',
    ],
    year: '2017',
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    client: { ar: 'شركة المقاولات', en: 'Contracting Company' },
    description: {
      ar: 'مشروع سكني متعدد الوحدات.',
      en: 'Multi-unit residential project.'
    },
    role: {
      ar: 'مهندس نمذجة معلومات المباني الإنشائي',
      en: 'Structural BIM Engineer'
    },
    tools: ['Autodesk Revit', 'AutoCAD'],
    deliverables: {
       ar: ['نماذج BIM', 'رسومات التصميم الإنشائي', 'جداول حصر الكميات'],
      en: ['BIM Models', 'Structural  Design Drawings', 'Quantity Take-off']
    },
    behanceUrl: 'https://www.behance.net/gallery/229906841/-BIM#'
  },
  
];
