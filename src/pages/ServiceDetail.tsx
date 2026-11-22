import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ServicePageContent from '@/components/services/ServicePageContent';
import { services } from '@/data/services';
import { getServicePresentation } from '@/data/servicePresentation';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const service = services.find(item => item.id === id);

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 text-center">
          <h1 className="text-2xl">{isAr ? 'الخدمة غير موجودة' : 'Service not found'}</h1>
          <Link to="/services" className="text-blue-grotto mt-4 inline-block">
            {isAr ? 'العودة للخدمات' : 'Back to Services'}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background service-detail-page">
      <Header />
      <main>
        <ServicePageContent key={service.id} service={service} presentation={getServicePresentation(service.id)} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ServiceDetail;
