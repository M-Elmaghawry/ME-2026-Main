import { useCallback } from 'react';
import { useLocation, useNavigate as useRouterNavigate, type NavigateFunction, type NavigateOptions, type To } from 'react-router-dom';
import { localizedDestination } from '@/lib/navigation';
import { useRouting } from '@/contexts/RoutingContext';

export function useLocalizedTo(to: To): To {
  const { mode } = useRouting();
  return localizedDestination(to, useLocation(), mode === 'path' ? 'ar' : undefined);
}

export function useNavigate(): NavigateFunction {
  const navigate = useRouterNavigate();
  const location = useLocation();
  const { mode } = useRouting();
  return useCallback((to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'number') navigate(to);
    else navigate(localizedDestination(to, location, mode === 'path' ? 'ar' : undefined), options);
  }, [navigate, location, mode]);
}
