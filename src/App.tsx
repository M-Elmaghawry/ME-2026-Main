import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import ScrollToTop from '@/components/ScrollToTop';
import PageSeo from '@/components/PageSeo';
import { LanguageProvider } from '@/contexts/LanguageContext';
import RouteContent from '@/app/RouteContent';

const App = () => (
  <MotionConfig reducedMotion="user">
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LanguageProvider>
        <ScrollToTop />
        <PageSeo />
        <RouteContent />
      </LanguageProvider>
    </BrowserRouter>
  </MotionConfig>
);
export default App;
