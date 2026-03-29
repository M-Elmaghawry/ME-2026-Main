import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Briefcase, Wrench, CheckCircle, Images, ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const projects = [
  {
    id: '1',
    title: { ar: 'برج الأعمال الإداري', en: 'Business Tower' },
    category: { ar: 'معماري', en: 'Architectural' },
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',
      'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800&q=80',
      'https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800&q=80',
      'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=800&q=80',
      'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&q=80',
      'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=800&q=80',
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    ],
    year: '2023',
    location: { ar: 'الرياض، السعودية', en: 'Riyadh, Saudi Arabia' },
    client: { ar: 'شركة التطوير العقاري', en: 'Real Estate Development Co.' },
    description: {
      ar: 'مشروع برج إداري متعدد الطوابق يضم مكاتب حديثة ومرافق خدمية متكاملة. تم تنفيذ نمذجة BIM كاملة للمشروع شاملة جميع التخصصات الهندسية.',
      en: 'Multi-story administrative tower project featuring modern offices and integrated service facilities. Complete BIM modeling was implemented for the project covering all engineering disciplines.',
    },
    role: {
      ar: 'مدير BIM - مسؤول عن تنسيق النماذج وكشف التعارضات',
      en: 'BIM Manager - Responsible for model coordination and clash detection',
    },
    tools: ['Autodesk Revit', 'Navisworks', 'BIM 360', 'Dynamo'],
    deliverables: {
      ar: ['نموذج BIM متكامل', 'تقارير كشف التعارضات', 'جداول الكميات', 'رسومات تنفيذية'],
      en: ['Integrated BIM Model', 'Clash Detection Reports', 'Quantity Schedules', 'Shop Drawings'],
    },
  },
  {
    id: '2',
    title: { ar: 'مجمع سكني', en: 'Residential Complex' },
    category: { ar: 'معماري', en: 'Architectural' },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    ],
    year: '2022',
    location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    client: { ar: 'مجموعة الإسكان', en: 'Housing Group' },
    description: {
      ar: 'مجمع سكني فاخر يضم عدة مباني سكنية مع مرافق ترفيهية ومساحات خضراء. تم تطبيق منهجية BIM من مرحلة التصميم حتى التنفيذ.',
      en: 'Luxury residential complex comprising multiple residential buildings with recreational facilities and green spaces. BIM methodology was applied from design through execution.',
    },
    role: {
      ar: 'مهندس BIM - تنفيذ النمذجة المعمارية والتنسيق',
      en: 'BIM Engineer - Architectural modeling and coordination',
    },
    tools: ['Autodesk Revit', 'AutoCAD', 'Navisworks'],
    deliverables: {
      ar: ['نماذج معمارية ثلاثية الأبعاد', 'تنسيق التخصصات', 'رسومات تنفيذية'],
      en: ['3D Architectural Models', 'Discipline Coordination', 'Shop Drawings'],
    },
  },
  {
    id: '3',
    title: { ar: 'مستشفى متخصص', en: 'Specialized Hospital' },
    category: { ar: 'صحي', en: 'Healthcare' },
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80',
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
      'https://images.unsplash.com/photo-1581595220975-4f0e5e4e8e6f?w=800&q=80',
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80',
    ],
    year: '2023',
    location: { ar: 'جدة، السعودية', en: 'Jeddah, Saudi Arabia' },
    client: { ar: 'وزارة الصحة', en: 'Ministry of Health' },
    description: {
      ar: 'مستشفى متخصص بسعة 500 سرير مجهز بأحدث التقنيات الطبية. تم تنفيذ نمذجة BIM متقدمة للأنظمة الميكانيكية والكهربائية.',
      en: 'Specialized hospital with 500-bed capacity equipped with the latest medical technologies. Advanced BIM modeling was implemented for mechanical and electrical systems.',
    },
    role: {
      ar: 'قائد فريق BIM - إدارة النمذجة وضمان الجودة',
      en: 'BIM Team Lead - Modeling management and quality assurance',
    },
    tools: ['Autodesk Revit', 'Navisworks', 'BIM 360', 'Solibri'],
    deliverables: {
      ar: ['نموذج MEP متكامل', 'تحليل التعارضات', 'محاكاة البناء 4D'],
      en: ['Integrated MEP Model', 'Clash Analysis', '4D Construction Simulation'],
    },
  },
  {
    id: '4',
    title: { ar: 'مركز تجاري', en: 'Commercial Center' },
    category: { ar: 'تجاري', en: 'Commercial' },
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
      'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
      'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800&q=80',
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=800&q=80',
      'https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?w=800&q=80',
    ],
    year: '2021',
    location: { ar: 'دبي، الإمارات', en: 'Dubai, UAE' },
    client: { ar: 'شركة التجارة الدولية', en: 'International Trade Company' },
    description: {
      ar: 'مركز تجاري ضخم يضم محلات تجارية ومطاعم ومناطق ترفيهية. تم تطبيق BIM لتحسين كفاءة التصميم والتنفيذ.',
      en: 'Massive commercial center comprising retail stores, restaurants, and entertainment areas. BIM was applied to improve design and execution efficiency.',
    },
    role: {
      ar: 'مهندس BIM أول - النمذجة والتوثيق',
      en: 'Senior BIM Engineer - Modeling and Documentation',
    },
    tools: ['Autodesk Revit', 'AutoCAD', 'Navisworks', 'Dynamo'],
    deliverables: {
      ar: ['نموذج BIM شامل', 'جداول كميات دقيقة', 'تصورات ثلاثية الأبعاد'],
      en: ['Comprehensive BIM Model', 'Accurate Quantity Schedules', '3D Visualizations'],
    },
  },
  {
    id: '5',
    title: { ar: 'مصنع صناعي', en: 'Industrial Factory' },
    category: { ar: 'صناعي', en: 'Industrial' },
    images: [
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
      'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800&q=80',
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=800&q=80',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80',
      'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&q=80',
      'https://images.unsplash.com/photo-1560264280-88b68371db39?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
    year: '2022',
    location: { ar: 'الدمام، السعودية', en: 'Dammam, Saudi Arabia' },
    client: { ar: 'الشركة الصناعية', en: 'Industrial Company' },
    description: {
      ar: 'مصنع صناعي متطور لإنتاج المعدات الثقيلة. تم تنفيذ نمذجة BIM للهيكل الإنشائي والأنظمة الميكانيكية.',
      en: 'Advanced industrial factory for heavy equipment production. BIM modeling was implemented for structural framework and mechanical systems.',
    },
    role: {
      ar: 'مهندس BIM - النمذجة الإنشائية',
      en: 'BIM Engineer - Structural Modeling',
    },
    tools: ['Autodesk Revit', 'Robot Structural', 'Navisworks'],
    deliverables: {
      ar: ['نموذج إنشائي', 'تحليل هيكلي', 'رسومات حديد التسليح'],
      en: ['Structural Model', 'Structural Analysis', 'Rebar Drawings'],
    },
  },
  {
    id: '6',
    title: { ar: 'فندق 5 نجوم', en: '5-Star Hotel' },
    category: { ar: 'ضيافة', en: 'Hospitality' },
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80',
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    ],
    year: '2023',
    location: { ar: 'شرم الشيخ، مصر', en: 'Sharm El Sheikh, Egypt' },
    client: { ar: 'مجموعة الضيافة', en: 'Hospitality Group' },
    description: {
      ar: 'فندق فاخر 5 نجوم مطل على البحر الأحمر يضم 300 غرفة ومرافق سياحية متكاملة.',
      en: 'Luxury 5-star hotel overlooking the Red Sea featuring 300 rooms and integrated tourism facilities.',
    },
    role: {
      ar: 'مدير BIM - التنسيق الشامل للمشروع',
      en: 'BIM Manager - Comprehensive Project Coordination',
    },
    tools: ['Autodesk Revit', 'Navisworks', 'BIM 360', '3ds Max'],
    deliverables: {
      ar: ['نموذج BIM متكامل', 'تصورات واقعية', 'تنسيق MEP'],
      en: ['Integrated BIM Model', 'Realistic Renders', 'MEP Coordination'],
    },
  },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="section-container text-center">
            <h1 className="text-2xl font-bold">
              {language === 'ar' ? 'المشروع غير موجود' : 'Project not found'}
            </h1>
            <Link to="/portfolio">
              <Button variant="default" className="mt-6">
                {language === 'ar' ? 'العودة للأعمال' : 'Back to Portfolio'}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="section-container">
          {/* Back Button */}
          <Link to="/portfolio">
            <Button variant="ghost" className="mb-8 gap-2">
              <BackIcon className="w-4 h-4" />
              {language === 'ar' ? 'العودة للأعمال' : 'Back to Portfolio'}
            </Button>
          </Link>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8"
          >
            <img
              src={project.images[0]}
              alt={language === 'ar' ? project.title.ar : project.title.en}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setSelectedImage(0)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
              <span className="inline-block px-4 py-2 bg-baby-blue/20 text-baby-blue rounded-full text-sm font-medium mb-4">
                {language === 'ar' ? project.category.ar : project.category.en}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {language === 'ar' ? project.title.ar : project.title.en}
              </h1>
            </div>
          </motion.div>

          {/* Project Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-navy to-blue rounded-xl flex items-center justify-center">
                <Images className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">
                {language === 'ar' ? 'معرض الصور' : 'Project Gallery'}
              </h2>
              <span className="text-muted-foreground text-sm">
                ({project.images.length} {language === 'ar' ? 'صورة' : 'images'})
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {project.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${language === 'ar' ? project.title.ar : project.title.en} - ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      {index + 1}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Lightbox */}
          {selectedImage !== null && (
            <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <button
                onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : project.images.length - 1)}
                className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={() => setSelectedImage(selectedImage < project.images.length - 1 ? selectedImage + 1 : 0)}
                className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
              <img
                src={project.images[selectedImage]}
                alt={`${language === 'ar' ? project.title.ar : project.title.en} - ${selectedImage + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-4 text-white/80 text-sm">
                {selectedImage + 1} / {project.images.length}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Description */}
              <div className="neu-card p-8">
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'ar' ? 'وصف المشروع' : 'Project Description'}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {language === 'ar' ? project.description.ar : project.description.en}
                </p>
              </div>

              {/* Role */}
              <div className="neu-card p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-navy to-blue rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {language === 'ar' ? 'دوري في المشروع' : 'My Role'}
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  {language === 'ar' ? project.role.ar : project.role.en}
                </p>
              </div>

              {/* Deliverables */}
              <div className="neu-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-navy to-blue rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {language === 'ar' ? 'المخرجات' : 'Deliverables'}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {(language === 'ar' ? project.deliverables.ar : project.deliverables.en).map(
                    (item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-grotto" />
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Project Info */}
              <div className="neu-card p-6">
                <h3 className="text-lg font-bold mb-4">
                  {language === 'ar' ? 'معلومات المشروع' : 'Project Info'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-grotto" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'السنة' : 'Year'}
                      </p>
                      <p className="font-medium">{project.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-grotto" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'الموقع' : 'Location'}
                      </p>
                      <p className="font-medium">
                        {language === 'ar' ? project.location.ar : project.location.en}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-blue-grotto" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'العميل' : 'Client'}
                      </p>
                      <p className="font-medium">
                        {language === 'ar' ? project.client.ar : project.client.en}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools */}
              <div className="neu-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wrench className="w-5 h-5 text-blue-grotto" />
                  <h3 className="text-lg font-bold">
                    {language === 'ar' ? 'الأدوات المستخدمة' : 'Tools Used'}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>

          {/* Bottom Section - Behance & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 grid md:grid-cols-2 gap-6"
          >
            {/* Behance Link */}
            <div className="neu-card p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#1769ff] to-[#0057ff] rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === 'ar' ? 'شاهد المشروع بجودة أعلى' : 'View Project in Higher Quality'}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {language === 'ar' 
                  ? 'استعرض تفاصيل المشروع والصور بدقة عالية على Behance'
                  : 'Explore project details and high-resolution images on Behance'}
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open('https://www.behance.net/gallery/136557575', '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                {language === 'ar' ? 'فتح على Behance' : 'Open on Behance'}
              </Button>
            </div>

            {/* CTA */}
            <div className="neu-card p-8 bg-gradient-to-br from-navy to-blue text-white flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold mb-2">
                {language === 'ar' ? 'هل لديك مشروع مماثل؟' : 'Have a similar project?'}
              </h3>
              <p className="text-white/80 text-sm mb-4">
                {language === 'ar'
                  ? 'تواصل معنا لمناقشة متطلباتك والحصول على استشارة مجانية'
                  : 'Contact us to discuss your requirements and get a free consultation'}
              </p>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-navy"
                onClick={() => window.open('https://wa.me/201096189832', '_blank')}
              >
                {language === 'ar' ? 'تواصل الآن' : 'Contact Now'}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProjectDetail;
