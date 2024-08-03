import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const route: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/index',
  meta: {
    icon: 'dashicons:dashboard',
    title: 'Dashboard',
    orderNo: 10,
  },
  children: [
    {
      path: 'index',
      name: 'DashboardPage',
      component: () => import('@/views/wba/dashboard/index.vue'),
      meta: {
        title: 'Dashboard',
        hideMenu: true,
        currentActiveMenu: '/dashboard',
      },
    },
  ],
};

export default route;
