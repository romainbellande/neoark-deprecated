import Portal from '.';
import Login from './Login';
import Register from './Register';

export default [
  {
    path: '/portal',
    component: Portal,
    routes: [
      {
        path: `/portal/login`,
        component: Login,
        slug: 'login',
      },
      {
        path: '/portal/register',
        component: Register,
        slug: 'register',
      },
    ],
  },
];
