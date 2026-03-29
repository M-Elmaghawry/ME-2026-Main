import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const clients = [
  { name: 'Client 1', logo: '/placeholder.svg' },
  { name: 'Client 2', logo: '/placeholder.svg' },
  { name: 'Client 3', logo: '/placeholder.svg' },
  { name: 'Client 4', logo: '/placeholder.svg' },
  { name: 'Client 5', logo: '/placeholder.svg' },
  { name: 'Client 6', logo: '/placeholder.svg' },
  { name: 'Client 7', logo: '/placeholder.svg' },
  { name: 'Client 8', logo: '/placeholder.svg' },
];

const ClientsSection = () => {
  const { language } = useLanguage();

  // Duplicate clients for infinite scroll effect
  const duplicatedClients = [...clients, ...clients, ...clients];

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

      {/* Single Row - Right to Left */}
      <div className="relative">
        <div className="flex animate-scroll-rtl">
          {duplicatedClients.map((client, index) => (
            <div
              key={`row-${index}`}
              className="flex-shrink-0 mx-6"
            >
              <div className="w-44 h-28 neu-card rounded-xl p-4 flex items-center justify-center">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-w-full max-h-full object-contain opacity-70"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
