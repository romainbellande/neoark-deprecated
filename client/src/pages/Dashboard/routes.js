import React from 'react';

// import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';

import Home from './Home';
import Fleet from './Fleet';
import Planets from './Planets';
import Settings from './Settings';
import Research from './Research';

export const categoryRoutes = [
  {
    id: 'Q.G.',
    icon: <PeopleIcon />,
    active: true,
    slug: 'home',
    path: '/',
    exact: true,
    component: Home,
  },
  {
    id: 'Planets',
    icon: <DnsRoundedIcon />,
    slug: 'planets',
    path: '/planets',
    exact: true,
    component: Planets,
  },
  {
    id: 'Research',
    slug: 'research',
    path: '/research',
    icon: <PublicIcon />,
    exact: true,
    component: Research,
  },
  {
    id: 'Fleet',
    icon: <SettingsEthernetIcon />,
    slug: 'fleet',
    path: '/fleet',
    exact: true,
    component: Fleet,
  },
  {
    id: 'Settings',
    icon: <SettingsInputComponentIcon />,
    to: '/',
    slug: 'settings',
    path: '/settings',
    exact: true,
    component: Settings,
  },
];

const routes = [...categoryRoutes];

export default routes;
