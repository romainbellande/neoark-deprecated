import Dashboard from './pages/Dashboard';

import portalRoutes from './pages/Portal/routes';

export default [
  ...portalRoutes,
  {
    path: '/',
    component: Dashboard,
    slug: 'dashboard',
  },
];
