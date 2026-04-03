import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Briefcase, ExternalLink } from 'lucide-react';
import { projects } from '@/data/projects';

const Portfolio = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Page Header */}
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-navy to-blue rounded-2xl flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="gradient-text">{language === 'ar' ? 'سابقة أعمالنا' : 'Our Portfolio'}</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar' ? 'خبرة عملية في المشاريع المختلفة' : 'Practical experience in various projects'}
            </p>
          </motion.div>
        </div>

        {/* Gradient Divider */}
        <div className="bg-gradient-to-r from-navy via-blue to-blue-grotto h-2 mb-12" />

        <div className="section-container">

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Link to={`/portfolio/${project.id}`} key={project.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-72 rounded-2xl overflow-hidden">
                    <img
                      src={project.image}
                      alt={language === 'ar' ? project.title.ar : project.title.en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <span className="inline-block px-3 py-1 bg-blue text-white rounded-full text-sm font-medium mb-2">
                        {language === 'ar' ? project.category.ar : project.category.en}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {language === 'ar' ? project.title.ar : project.title.en}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Portfolio;
