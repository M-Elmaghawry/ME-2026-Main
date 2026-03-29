import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface Title {
  ar: string;
  en: string;
}

const titles: Title[] = [
  { ar: 'مهندس BIM محترف', en: 'Senior BIM Engineer' },
  { ar: 'استشاري هندسي', en: 'Engineering Consultant' },
  { ar: 'مدرب معتمد', en: 'Certified Instructor' },
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
