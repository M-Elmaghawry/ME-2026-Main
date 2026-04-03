export const projects = [
  {
    id: '1',
    title: { ar: 'مشروع طرق وكباري', en: 'NEOM Shigri Project' },
    category: { ar: 'بنية تحتية', en: 'infrastructure' },
    image: '/projects/01-Shigri-Neom.jpg',
    images: [
      '/projects/01-Shigri-Neom.jpg',
      // أضف صور إضافية إذا وجدت
    ],
    year: '2023',
    location: { ar: 'نيوم، السعودية', en: 'NEOM, Saudi Arabia' },
    client: { ar: 'شركة نيوم', en: 'NEOM Company' },
    description: {
      ar: 'مشروع بنية تحتية ضخم في منطقة نيوم يضم طرق وكباري حديثة.',
      en: 'A major infrastructure project in NEOM area including modern roads and bridges.'
    },
    role: {
      ar: 'مدير المشروع ومسؤول BIM',
      en: 'Project Manager & BIM Lead'
    },
    tools: ['Autodesk Revit', 'Navisworks', 'AutoCAD'],
    deliverables: {
      ar: ['نماذج BIM', 'رسومات تنفيذية', 'تقارير تقدم العمل'],
      en: ['BIM Models', 'Shop Drawings', 'Progress Reports']
    }
  },
  {
    id: '2',
    title: { ar: 'مجمع سكني متكامل', en: 'Swary Project - Egypt' },
    category: { ar: 'سكني', en: 'Administrative' },
    image: '/projects/02-Swary-Egypt.jpg',
    images: [
      '/projects/02-Swary-Egypt.jpg',
    ],
    year: '2022',
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    client: { ar: 'شركة سوارى', en: 'Swary Company' },
    description: {
      ar: 'مجمع سكني متكامل الخدمات في قلب القاهرة.',
      en: 'A fully serviced residential complex in the heart of Cairo.'
    },
    role: {
      ar: 'مهندس تصميم معماري',
      en: 'Architectural Design Engineer'
    },
    tools: ['Revit', 'AutoCAD'],
    deliverables: {
      ar: ['نماذج معمارية', 'رسومات تنفيذية'],
      en: ['Architectural Models', 'Shop Drawings']
    }
  },
  {
    id: '3',
    title: { ar: 'برج سكني', en: 'Elseka Elgedida Project' },
    category: { ar: 'سكني', en: 'Admin/Commercial' },
    image: '/projects/03-Elseka-Elgedida.jpg',
    images: [
      '/projects/03-Elseka-Elgedida.jpg',
    ],
    year: '2021',
    location: { ar: 'الإسكندرية، مصر', en: 'Alexandria, Egypt' },
    client: { ar: 'شركة السكة الجديدة', en: 'Elseka Elgedida Co.' },
    description: {
      ar: 'برج سكني حديث في منطقة حيوية.',
      en: 'A modern residential tower in a vibrant area.'
    },
    role: {
      ar: 'منسق نمذجة معلومات البناء',
      en: 'BIM Coordinator'
    },
    tools: ['Revit', 'Navisworks'],
    deliverables: {
      ar: ['نماذج BIM', 'تقارير تنسيق'],
      en: ['BIM Models', 'Coordination Reports']
    }
  },
  {
    id: '4',
    title: { ar: 'مبنى إداري وتجاري', en: 'General Administration Building - Egypt' },
    category: { ar: 'إداري/تجاري', en: 'Administrative' },
    image: '/projects/04-Admin-Egypt.jpg',
    images: ['/projects/04-Admin-Egypt.jpg'],
    year: '2020',
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    client: { ar: 'شركة الإدارة', en: 'Admin Company' },
    description: {
      ar: 'مبنى إداري وتجاري متعدد الاستخدامات.',
      en: 'A multi-purpose administrative and commercial building.'
    },
    role: {
      ar: 'مهندس تصميم',
      en: 'Design Engineer'
    },
    tools: ['Revit', 'AutoCAD'],
    deliverables: {
      ar: ['رسومات تنفيذية', 'نماذج معمارية'],
      en: ['Shop Drawings', 'Architectural Models']
    }
  },
  {
    id: '5',
    title: { ar: 'أعمال حديد التسليح', en: 'Wastewater Treatment Plant' },
    category: { ar: 'إنشائي', en: 'infrastructure' },
    image: '/projects/05-Wastewater-Treatment-Plant.jpg',
    images: ['/projects/05-Wastewater-Treatment-Plant.jpg'],
    year: '2019',
    location: { ar: 'الجيزة، مصر', en: 'Giza, Egypt' },
    client: { ar: 'شركة المياه', en: 'Water Company' },
    description: {
      ar: 'محطة معالجة مياه الصرف الصحي.',
      en: 'Wastewater treatment plant.'
    },
    role: {
      ar: 'مهندس إنشائي',
      en: 'Structural Engineer'
    },
    tools: ['Revit', 'AutoCAD'],
    deliverables: {
      ar: ['نماذج إنشائية', 'تقارير هندسية'],
      en: ['Structural Models', 'Engineering Reports']
    }
  },
  {
    id: '6',
    title: { ar: 'مسجد ومئذنة', en: 'Mosque & Minaret' },
    category: { ar: 'ديني', en: 'Religious' },
    image: '/projects/06-Tanah-Mosque.jpg',
    images: ['/projects/06-Tanah-Mosque.jpg'],
    year: '2018',
    location: { ar: 'المنيا، مصر', en: 'Minya, Egypt' },
    client: { ar: 'جمعية خيرية', en: 'Charity Association' },
    description: {
      ar: 'تصميم مسجد ومئذنة حديثة.',
      en: 'Design of a modern mosque and minaret.'
    },
    role: {
      ar: 'مهندس معماري',
      en: 'Architectural Engineer'
    },
    tools: ['Revit', 'AutoCAD'],
    deliverables: {
      ar: ['رسومات معمارية', 'نماذج ثلاثية الأبعاد'],
      en: ['Architectural Drawings', '3D Models']
    }
  },
  {
    id: '7',
    title: { ar: 'أعمال حديد التسليح', en: 'Wastewater Treatment Plant' },
    category: { ar: 'إنشائي', en: 'Residential' },
    image: '/projects/07-Multi-Residential.jpg',
    images: ['/projects/07-Multi-Residential.jpg'],
    year: '2017',
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    client: { ar: 'شركة المقاولات', en: 'Contracting Company' },
    description: {
      ar: 'مشروع سكني متعدد الوحدات.',
      en: 'Multi-unit residential project.'
    },
    role: {
      ar: 'مهندس موقع',
      en: 'Site Engineer'
    },
    tools: ['Revit', 'AutoCAD'],
    deliverables: {
      ar: ['نماذج تنفيذية', 'تقارير تقدم'],
      en: ['Execution Models', 'Progress Reports']
    }
  },
  {
    id: '8',
    title: { ar: 'أعمال حديد التسليح', en: 'Student Building' },
    category: { ar: 'إنشائي', en: 'Residential' },
    image: '/projects/08-Student-Building.jpg',
    images: ['/projects/08-Student-Building.jpg'],
    year: '2016',
    location: { ar: 'أسيوط، مصر', en: 'Assiut, Egypt' },
    client: { ar: 'جامعة أسيوط', en: 'Assiut University' },
    description: {
      ar: 'مبنى طلابي حديث.',
      en: 'Modern student building.'
    },
    role: {
      ar: 'مهندس معماري',
      en: 'Architectural Engineer'
    },
    tools: ['Revit', 'AutoCAD'],
    deliverables: {
      ar: ['رسومات تنفيذية', 'نماذج معمارية'],
      en: ['Shop Drawings', 'Architectural Models']
    }
  }
];
