// The single route definition used by both browser builds and prerendering.
// Content collections supply their existing IDs; no translated slugs are invented.
export const routeRegistry = [
  { id: 'Index', path: '/', indexable: true },
  { id: 'About', path: '/about', indexable: true },
  { id: 'Services', path: '/services', indexable: true },
  { id: 'ServiceDetail', path: '/services/:id', indexable: true, collection: 'services' },
  { id: 'Courses', path: '/courses', indexable: true },
  { id: 'CourseDetail', path: '/courses/:id', indexable: true, collection: 'courses' },
  { id: 'Portfolio', path: '/portfolio', indexable: true },
  { id: 'ProjectDetail', path: '/portfolio/:id', indexable: true, collection: 'projects' },
  { id: 'Contact', path: '/contact', indexable: true },
  { id: 'ContactResult', path: '/thank-you', indexable: false },
  { id: 'PrivacyPolicy', path: '/privacy-policy', indexable: true },
  { id: 'Terms', path: '/terms', indexable: true },
  { id: 'NotFound', path: '*', indexable: false },
] as const;

export type PageId = typeof routeRegistry[number]['id'];
