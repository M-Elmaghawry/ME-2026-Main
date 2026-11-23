import { forwardRef } from 'react';
import { Link as RouterLink, Navigate as RouterNavigate, type LinkProps, type NavigateProps } from 'react-router-dom';
import { useLocalizedTo } from './navigation';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...props }, ref) => <RouterLink ref={ref} to={useLocalizedTo(to)} {...props} />);
Link.displayName = 'PrototypeLanguageLink';

export function Navigate({ to, ...props }: NavigateProps) {
  return <RouterNavigate to={useLocalizedTo(to)} {...props} />;
}
