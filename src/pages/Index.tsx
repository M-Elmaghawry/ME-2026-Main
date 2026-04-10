import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ExperienceTimeline from '@/components/sections/ExperienceTimeline';
import ClientsSection from '@/components/sections/ClientsSection';
import MarqueeBar from '@/components/sections/MarqueeBar';
import ServicesSection from '@/components/sections/ServicesSection';
import CoursesSection from '@/components/sections/CoursesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        <ExperienceTimeline />
        <MarqueeBar />
        <ClientsSection />
        <ServicesSection />
        <CoursesSection />
        <MarqueeBar />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
