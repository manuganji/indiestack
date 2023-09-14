
type MenuItemType = {
  name: string;
  desc?: string;
  path: __next_route_internal_types__.StaticRoutes;
  // icon?: string;
  children?: MenuItemType[];
};
export const ROOT_MENU: Array<MenuItemType> = [
  {
    name: 'Properties',
    path: '/dash/properties',
    desc: 'Manage your properties',
  },
  {
    name: 'Users',
    path: '/dash/users',
  },
];

export const PROPERTY_MENU: Array<MenuItemType> = [
  {
    name: 'Pages',
    path: '/dash/pages'
  },
  {
    name: 'Users',
    path: '/dash/users'
  }
]