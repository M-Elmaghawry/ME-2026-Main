import { lazy, Suspense, useRef, type ComponentType, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';
import { useLanguage } from '@/contexts/LanguageContext';
import { routeRegistry, type PageId } from '@/lib/routes';

const pageLoaders: Record<PageId, () => Promise<{ default: ComponentType }>> = {
  Index: () => import('../pages/Index'), About: () => import('../pages/About'),
  Services: () => import('../pages/Services'), ServiceDetail: () => import('../pages/ServiceDetail'),
  Courses: () => import('../pages/Courses'), CourseDetail: () => import('../pages/CourseDetail'),
  Portfolio: () => import('../pages/Portfolio'), ProjectDetail: () => import('../pages/ProjectDetail'),
  Contact: () => import('../pages/Contact'), ContactResult: () => import('../pages/ContactResult'),
  PrivacyPolicy: () => import('../pages/PrivacyPolicy'), Terms: () => import('../pages/Terms'),
  NotFound: () => import('../pages/NotFound'),
};
const components = Object.fromEntries(Object.entries(pageLoaders).map(([id, load]) => [id, lazy(load)]));

function RouteLoading() {
  const { language } = useLanguage();
  return <div data-route-loading role="status" className="min-h-screen flex items-center justify-center bg-background text-foreground">
    {language === 'ar' ? 'جاري تحميل الصفحة…' : 'Loading page…'}
  </div>;
}

export default function RouteContent({ fallback404 = false, children }: { fallback404?: boolean; children?: ReactNode }) {
  const { pathname } = useLocation();
  const initialPath = useRef(pathname);
  const Missing = components.NotFound;
  return <RouteErrorBoundary key={pathname}><Suspense fallback={<RouteLoading />}>
    {fallback404 && pathname === initialPath.current ? <Missing /> : <Routes>
      {routeRegistry.map(route => {
        const Page = components[route.id];
        return <Route key={route.id} path={route.path} element={<Page />} />;
      })}
    </Routes>}
    {children}
  </Suspense></RouteErrorBoundary>;
}
