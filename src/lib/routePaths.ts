import { routeRegistry, type PageId } from './routes';
import { services } from '../data/services';
import { courses } from '../data/courses';
import { projects } from '../data/projects';

const collections = { services, courses, projects };
export const indexablePages = routeRegistry.filter(route => route.indexable).flatMap<{ id: PageId; path: string }>(route =>
  'collection' in route
    ? collections[route.collection].map(item => ({ id: route.id, path: route.path.replace(':id', item.id) }))
    : [{ id: route.id, path: route.path }],
);
export const seoPaths = indexablePages.map(page => page.path);
