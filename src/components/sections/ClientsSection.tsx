import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { assetUrl } from '@/lib/utils';

const clients = [
  { name: 'دار وإعمار', logo: '/clients/01-شركة-دار-وإعمار.png' },
  { name: 'شركة الصالح للمقاولات', logo: '/clients/02-شركة-الصالح-للمقاولات.png' },
  { name: 'Gulf Consult', logo: '/clients/03-Gulf-Consult.png' },
  { name: 'مكتب فارس الهندسي', logo: '/clients/04-مكتب-فارس-الهندسى.png' },
  { name: 'Saudi Arabia Railways', logo: '/clients/05-خطوط-سكك-الحديد-السعودية-sar.png' },
  { name: 'شركة مياه الشرب والصرف الصحي', logo: '/clients/06-شركة-مياة-الشرب-والصرف-الصحى.png' },
  { name: 'نقابة المهندسين بالدقهلية', logo: '/clients/07-نقابة-المهندسين-بالدقهلية.png' },
  { name: 'IDS Consulting', logo: '/clients/08-IDS-Consulting.png' },
  { name: 'CAD Masters', logo: '/clients/09-Cad-Masters.png' },
  { name: 'شركة الغانم للمقاولات', logo: '/clients/10-شركة-الغانم-للمقاولات.png' },
  { name: 'Niqat', logo: '/clients/11-Niqat.png' },
  { name: 'الأكاديمية الدولية للهندسة وعلوم الإعلام', logo: '/clients/12-الأكاديمية-الدولية-للهندسة-وعلوم-الإعلام.png' },
  { name: 'Kayan Academy', logo: '/clients/13-Kayan-Academy.png' },
  { name: 'Blue Ocean', logo: '/clients/14-Blue-Ocean.png' },
  { name: 'UpSkill Center', logo: '/clients/15-Upskill-Center.png' },
  { name: 'أكاديمية أوميجا للتدريب', logo: '/clients/16-أكاديمية-أوميجا-للتدريب.png' },
];

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
          {clients.map((client, index) => (
            <div key={index} className="neu-card rounded-xl p-4 flex items-center justify-center w-full h-28">
              <img
                src={assetUrl(client.logo)}
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
