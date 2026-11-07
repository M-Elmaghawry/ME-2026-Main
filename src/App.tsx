import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import ScrollToTop from '@/components/ScrollToTop';
import PageSeo from '@/components/PageSeo';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

const Index = lazy(() => import('./pages/Index'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const ContactResult = lazy(() => import('./pages/ContactResult'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteLoading() {
  const { language } = useLanguage();
  return <div role="status" className="min-h-screen flex items-center justify-center bg-background text-foreground">
    {language === 'ar' ? 'جاري تحميل الصفحة…' : 'Loading page…'}
  </div>;
}

function AppRoutes() {
  const { pathname } = useLocation();
  return <RouteErrorBoundary key={pathname}>
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:id" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ContactResult />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </RouteErrorBoundary>;
}

const App = () => (
  <MotionConfig reducedMotion="user">
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LanguageProvider>
        <ScrollToTop />
        <PageSeo />
        <AppRoutes />
      </LanguageProvider>
    </BrowserRouter>
  </MotionConfig>
);

export default App;
