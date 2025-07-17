import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Home',
    iconName: 'home',
    route: '/home',
  },
  {
    navCap: 'Banking',
  },
  {
    displayName: 'My Accounts',
    iconName: 'coins',            // пример Tabler иконице
    route: '/my-accounts',
  },
  {
    displayName: 'Payments',
    iconName: 'credit-card',
    route: '/payments',
  },
  {
    displayName: 'Cards',
    iconName: 'wallet',
    route: '/cards',
  },
  {
    displayName: 'Currency Exchange',
    iconName: 'arrows-right-left',
    route: '/currency-exchange',
  },
  {
    displayName: 'Product Catalogue',
    iconName: 'box',
    route: '/product-catalogue',
  },
  {
    navCap: 'PFM',
  },
  {
    displayName: 'PFM Overview',
    iconName: 'chart-bar',
    route: '/pfm',
  },
  {
    navCap: 'Support',
  },
  {
    displayName: 'Self Care',
    iconName: 'settings',
    route: '/self-care',
  },
  {
    displayName: 'Support',
    iconName: 'headset',
    route: '/support',
  },
];
