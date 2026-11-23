import { useCallback } from 'react';
import { useLocation, useNavigate as useRouterNavigate, type NavigateFunction, type NavigateOptions, type To } from 'react-router-dom';
import { localizedDestination } from '@/lib/navigation';

export function useLocalizedTo(to: To): To {
  return localizedDestination(to, useLocation());
}

export function useNavigate(): NavigateFunction {
  const navigate = useRouterNavigate();
  const location = useLocation();
  return useCallback((to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'number') navigate(to);
    else navigate(localizedDestination(to, location), options);
  }, [navigate, location]);
}
