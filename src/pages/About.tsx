import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CTASection from '@/components/sections/CTASection';
import ClientsSection from '@/components/sections/ClientsSection';
import MarqueeBar from '@/components/sections/MarqueeBar';
import ExperienceTimeline from '@/components/sections/ExperienceTimeline';
import { Award, Briefcase, GraduationCap, CheckCircle, Star, Quote, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projects } from '@/data/projects';
import { testimonials } from '@/data/testimonials';
import { assetUrl } from '@/lib/utils';

const About = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentCertImage, setCurrentCertImage] = useState(0);
  const [currentTrainingImage, setCurrentTrainingImage] = useState(0);
  const [currentProjectImage, setCurrentProjectImage] = useState(0);

  const trainingPrograms = [
    {
      name: { ar: 'دورة Revit المتقدمة', en: 'Advanced Revit Course' },
      location: { ar: 'الرياض، السعودية', en: 'Riyadh, Saudi Arabia' },
      year: '2023',
      image: '/placeholder.svg',
    },
    {
      name: { ar: 'ورشة عمل BIM 360', en: 'BIM 360 Workshop' },
      location: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
      year: '2022',
    image: '/placeholder.svg',
    },
    {
      name: { ar: 'دورة Navisworks', en: 'Navisworks Training' },
      location: { ar: 'دبي، الإمارات', en: 'Dubai, UAE' },
      year: '2021',
      image: '/placeholder.svg',
    },
  ];

  const skills = [
    'Revit Structure',
    'AutoCAD',
    'Civil 3D',
    'Navisworks',
    'ACC',
    'Dynamo',
    'Infraworks',
    'Revit Architecture',
    'Solibri',
    'Power BI',
    'Microsoft Project',
    'Primavera P6',
  ];

  const certifications = [
    {
      title: { ar: 'مهندس مصنف محترف من الهيئة السعودية للمهندسين', en: 'Professional Classified Engineer - Saudi Council of Engineers' },
      year: '2022',
      image: '/certificates/01-ME-Saudi-Professional.jpg',
      featured: true,
    },
    {
      title: { ar: 'محاضر معتمد من شركة أتوديسك', en: 'Autodesk Certified Instructor' },
      year: '2021',
      image: '/certificates/02-ME-Autodesk-Certified-Instuctor.jpg',
      featured: true,
    },
    {
      title: { ar: 'محترف معتمد فى برنامج الريفيت الإنشائى', en: 'Revit Structure Certified Professional' },
      year: '2017',
      image: '/certificates/03-ME-Revit-Structure-Certified-Professional.jpg',
      featured: false,
    },
    {
      title: { ar: 'محترف معتمد فى برنامج الريفيت المعمارى', en: 'Revit Architecture Certified Professional' },
      year: '2020',
      image: '/certificates/04-ME-Revit-Architecture-Certified-Professional',
      featured: false,
    },
  ];

  // Duplicate skills for infinite scroll
  const duplicatedSkills = [...skills, ...skills, ...skills];

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate certificate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCertImage((prev) => (prev + 1) % certifications.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate training images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrainingImage((prev) => (prev + 1) % trainingPrograms.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate project images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectImage((prev) => (prev + 1) % projects.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section with same background as homepage */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20">
          {/* Background Decorations - same as homepage */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              className="absolute top-20 start-10 w-72 h-72 bg-baby-blue/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 8, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              className="absolute bottom-20 end-10 w-96 h-96 bg-blue-grotto/15 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [-5, 15, -5] }}
              transition={{ duration: 7, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              className="absolute top-1/2 start-1/3 w-64 h-64 bg-navy/10 rounded-full blur-3xl"
            />
            
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--navy)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--navy)) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              {/* Image Column */}
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-2xl neu-card p-2">
                  <img
                    src={assetUrl('/hero/Mahmoud Elmekawy.jpg')}
                    alt={language === 'ar' ? 'م. محمود المكاوى' : 'Eng. Mahmoud Elmekawy'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -start-4 w-24 h-24 bg-gradient-to-br from-navy to-blue rounded-2xl -z-10 opacity-20" />
                <div className="absolute -bottom-4 -end-4 w-32 h-32 bg-gradient-to-br from-blue-grotto to-baby-blue rounded-2xl -z-10 opacity-20" />
              </div>

              {/* Info Column */}
              <div className="text-center md:text-start space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {language === 'ar' ? 'م. محمود المكاوى' : 'Eng. Mahmoud Elmekawy'}
                </h1>
                <p className="text-xl md:text-2xl text-blue-grotto font-medium">
                  {language === 'ar' ? 'مهندس BIM محترف' : 'Professional BIM Engineer'}
                </p>
                <p className="text-muted-foreground">
                  {language === 'ar' 
                    ? 'خبير في نمذجة معلومات البناء | Revit | Navisworks | إدارة المشاريع'
                    : 'BIM Expert | Revit | Navisworks | Project Management'
                  }
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Clients Section */}
        <ClientsSection />
        <MarqueeBar />

        {/* About Me Section - 3 Parts - Same background as Hero */}
        <section className="relative min-h-screen py-16 overflow-hidden bg-gradient-hero flex items-center">
          {/* Background Decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              className="absolute top-20 start-10 w-72 h-72 bg-baby-blue/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 8, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              className="absolute bottom-20 end-10 w-96 h-96 bg-blue-grotto/15 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [-5, 15, -5] }}
              transition={{ duration: 7, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              className="absolute top-1/2 start-1/3 w-64 h-64 bg-navy/10 rounded-full blur-3xl"
            />
            
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--navy)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--navy)) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
          </div>
          <div className="section-container relative z-10">
            {/* Section Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">{language === 'ar' ? 'نبذة عني' : 'About Me'}</span>
              </h2>
            </motion.div>

            {/* Part 1: Info + Photo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8 items-center mb-16"
            >
              {/* Info Column */}
              <div className="neu-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-navy to-blue rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">{language === 'ar' ? 'معلومات عني' : 'About Me'}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  {language === 'ar' 
                    ? 'مهندس BIM محترف بخبرة تزيد عن 10 سنوات في مجال التصميم والتنسيق المعماري. متخصص في تطبيق تقنيات نمذجة معلومات البناء لتحسين جودة المشاريع وتقليل التكاليف.'
                    : 'Professional BIM Engineer with over 10 years of experience in architectural design and coordination. Specialized in implementing Building Information Modeling technologies to improve project quality and reduce costs.'
                  }
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-blue-grotto" />
                    <span>{language === 'ar' ? 'خبرة +10 سنوات' : '10+ Years Experience'}</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-blue-grotto" />
                    <span>{language === 'ar' ? '+100 مشروع منجز' : '100+ Projects Completed'}</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-blue-grotto" />
                    <span>{language === 'ar' ? 'شهادات معتمدة دولياً' : 'Internationally Certified'}</span>
                  </li>
                </ul>
              </div>

              {/* Photo Column - Same size as Hero */}
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-2xl neu-card p-2">
                  <img
                    src="/placeholder.svg"
                    alt={language === 'ar' ? 'م. محمود المكاوى' : 'Eng. Mahmoud Elmekawy'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -start-4 w-24 h-24 bg-gradient-to-br from-navy to-blue rounded-2xl -z-10 opacity-20" />
                <div className="absolute -bottom-4 -end-4 w-32 h-32 bg-gradient-to-br from-blue-grotto to-baby-blue rounded-2xl -z-10 opacity-20" />
              </div>
            </motion.div>

            {/* Part 2: Experience Timeline */}
            <div className="mb-16">
              <ExperienceTimeline />
            </div>
          </div>
        </section>

        {/* Projects Gallery Section - Full Width - Same design as Training Programs */}
        <section className="relative w-full min-h-screen flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 overflow-hidden">
              {/* Small Column - Info */}
              <div className="md:col-span-1 bg-white border-b md:border-b-0 md:border-e border-border/30">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProjectImage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className="p-8 md:p-10 h-full flex flex-col justify-center min-h-[350px] md:min-h-[450px]"
                  >
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {language === 'ar' ? projects[currentProjectImage].title.ar : projects[currentProjectImage].title.en}
                    </h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-grotto"></span>
                        {language === 'ar' ? projects[currentProjectImage].location.ar : projects[currentProjectImage].location.en}
                      </p>
                      <p className="text-blue-grotto font-bold text-xl">
                        {projects[currentProjectImage].year}
                      </p>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex gap-2 mt-8">
                      {projects.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentProjectImage(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentProjectImage 
                              ? 'bg-blue-grotto w-8' 
                              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Large Column - Full Image */}
              <div className="md:col-span-3 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProjectImage}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                  >
                    <img
                      src={assetUrl(projects[currentProjectImage].image)}
                      alt={language === 'ar' ? projects[currentProjectImage].title.ar : projects[currentProjectImage].title.en}
                      className="w-full h-[350px] md:h-[450px] object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Education Section - Moved here after Projects */}
        <section className="relative py-16 overflow-hidden bg-gradient-hero">
          {/* Background Decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              className="absolute top-20 start-10 w-72 h-72 bg-baby-blue/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 8, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              className="absolute bottom-20 end-10 w-96 h-96 bg-blue-grotto/15 rounded-full blur-3xl"
            />
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--navy)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--navy)) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
          </div>
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-8 justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-navy to-blue rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold">{language === 'ar' ? 'التعليم' : 'Education'}</h3>
              </div>

              <div className="neu-card p-8">
                <div className="p-4 bg-muted rounded-xl">
                  <p className="font-medium text-lg">
                    {language === 'ar' ? 'بكالوريوس هندسة معمارية' : 'Bachelor of Architecture'}
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'جامعة القاهرة - 2012' : 'Cairo University - 2012'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Certifications Section */}
        <section className="py-16 bg-muted/30">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-8 justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-navy to-blue rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">{language === 'ar' ? 'الشهادات' : 'Certifications'}</h2>
              </div>

              {/* Certificate Names */}
              <div className="flex flex-col items-center space-y-4 mb-10">
                {/* Featured Certifications - Each in its own row with icon */}
                {certifications.filter(c => c.featured).map((cert, index) => (
                  <div key={index} className="inline-flex items-center gap-3 neu-card p-4">
                    <Award className="w-5 h-5 text-blue-grotto flex-shrink-0" />
                    <span className="font-medium text-lg">{language === 'ar' ? cert.title.ar : cert.title.en}</span>
                    <span className="text-blue-grotto font-bold">{cert.year}</span>
                  </div>
                ))}
                
                {/* Other Certifications - Grid layout */}
                <div className="grid md:grid-cols-3 gap-4 w-full max-w-4xl">
                  {certifications.filter(c => !c.featured).map((cert, index) => (
                    <div key={index} className="neu-card p-4 flex items-center justify-between">
                      <span className="font-medium">{language === 'ar' ? cert.title.ar : cert.title.en}</span>
                      <span className="text-blue-grotto font-bold">{cert.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate Images Slider */}
              <div className="relative max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCertImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="neu-card p-4"
                  >
                    <img
                      src={assetUrl(certifications[currentCertImage].image)}
                      alt={language === 'ar' ? certifications[currentCertImage].title.ar : certifications[currentCertImage].title.en}
                      className="w-full h-64 object-contain rounded-lg"
                    />
                    <p className="text-center mt-4 font-medium text-muted-foreground">
                      {language === 'ar' ? certifications[currentCertImage].title.ar : certifications[currentCertImage].title.en}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-4">
                  {certifications.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCertImage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentCertImage 
                          ? 'bg-blue-grotto w-8' 
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Training Programs Section - Full Width */}
        <section className="relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 overflow-hidden">
              {/* Small Column - Info */}
              <div className="md:col-span-1 bg-white border-b md:border-b-0 md:border-e border-border/30">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTrainingImage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className="p-8 md:p-10 h-full flex flex-col justify-center min-h-[350px] md:min-h-[450px]"
                  >
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {language === 'ar' ? trainingPrograms[currentTrainingImage].name.ar : trainingPrograms[currentTrainingImage].name.en}
                    </h3>
                    <div className="space-y-4">
                      <p className="text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-grotto"></span>
                        {language === 'ar' ? trainingPrograms[currentTrainingImage].location.ar : trainingPrograms[currentTrainingImage].location.en}
                      </p>
                      <p className="text-blue-grotto font-bold text-xl">
                        {trainingPrograms[currentTrainingImage].year}
                      </p>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex gap-2 mt-8">
                      {trainingPrograms.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTrainingImage(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentTrainingImage 
                              ? 'bg-blue-grotto w-8' 
                              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Large Column - Images */}
              <div className="md:col-span-3 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTrainingImage}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                  >
                    <img
                      src={assetUrl(trainingPrograms[currentTrainingImage].image)}
                      alt={language === 'ar' ? trainingPrograms[currentTrainingImage].name.ar : trainingPrograms[currentTrainingImage].name.en}
                      className="w-full h-[350px] md:h-[450px] object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section className="py-16">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-8 justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-navy to-blue rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">{language === 'ar' ? 'المهارات' : 'Skills'}</h2>
              </div>

              {/* Skill Names */}
              <div className="flex flex-wrap gap-3 justify-center mb-10">
                {skills.map((skill, idx) => (
                  <span key={idx} className="neu-card px-4 py-2 text-base font-medium text-foreground">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Skills Logo Slider - تم إلغاء عرض اللوجو */}
            </motion.div>
          </div>
        </section>


        {/* Testimonials Section - Same style as homepage */}
        <section className="section-padding">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="gradient-text">
                    {language === 'ar' ? 'آراء العملاء' : 'Client Testimonials'}
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'ماذا يقول عملاؤنا عن تجربتهم معنا' : 'What our clients say about their experience with us'}
                </p>
              </div>

              <div className="relative max-w-3xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="neu-card p-8 md:p-10"
                  >
                    <Quote className="w-12 h-12 text-blue-grotto/30 mb-6" />
                    
                    <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                      "{language === 'ar' 
                        ? testimonials[currentTestimonial].textAr 
                        : testimonials[currentTestimonial].text}"
                    </p>

                    <div className="flex items-center gap-2 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy to-blue-grotto flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{testimonials[currentTestimonial].name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground">
                          {testimonials[currentTestimonial].name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonials[currentTestimonial].role} — {testimonials[currentTestimonial].company}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial 
                          ? 'bg-blue-grotto w-8' 
                          : 'bg-muted hover:bg-muted-foreground/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-16 -mb-16">
          <CTASection />
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;
