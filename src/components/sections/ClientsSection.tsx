import ResponsiveImage from '@/components/ResponsiveImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

import { clients } from '@/data/clients';

const ClientsSection = () => {
  const { language } = useLanguage();

  // clients used directly (no duplication needed - handled in JSX)

  return (
    <section className="py-28 bg-background overflow-hidden">
      <div className="section-container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'ar' ? 'عملاء وثقوا بنا' : 'Clients Who Trusted Us'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'شركاء نجاح في مشاريع متميزة'
              : 'Success partners in outstanding projects'
            }
          </p>
        </motion.div>
      </div>

      {/* Grid of clients */}
      <div className="section-container">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {clients.map((client) => (
            <div key={client.id} className="neu-card rounded-xl p-4 flex items-center justify-center w-full h-28">
              <ResponsiveImage sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
                src={client.logo}
                alt={client.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
