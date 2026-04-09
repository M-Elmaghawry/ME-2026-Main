import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface Title {
  ar: string;
  en: string;
}

const titles: Title[] = [
  { ar: 'مهندس BIM محترف', en: 'Senior BIM Engineer' },
  { ar: 'مهندس BIM إنشائى', en: 'Structural BIM Engineer' },
  { ar: 'مهندس BIM بنية تحتية', en: 'Infrastructure BIM Engineer' },
  { ar: 'منسق BIM محترف', en: 'BIM Coordinator' },
  { ar: 'مهندس محترف - الهيئة السعودية للمهندسين', en: 'Certified Professional by Saudi Council of Engineers ' },
  { ar: 'محاضر معتمد من شركة أتوديسك', en: 'Autodesk Certified Instructor' },
  { ar: 'مصنف محترف فى برنامج الريفيت الإنشائى', en: 'Revit Structure Certified Professional' },
  { ar: 'مصنف محترف فى برنامج الريفيت المعمارى', en: 'Revit Architecture Certified Professional' },
];

const TypewriterEffect = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 md:h-10 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.4, 0, 0.2, 1]
          }}
          className="absolute inset-0 flex items-center justify-center text-blue-grotto font-semibold text-lg md:text-xl"
        >
          {language === 'ar' ? titles[currentIndex].ar : titles[currentIndex].en}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default TypewriterEffect;
