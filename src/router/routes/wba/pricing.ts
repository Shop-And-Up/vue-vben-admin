import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const route: AppRouteModule = {
  path: '/pricing',
  name: 'Pricing',
  component: LAYOUT,
  redirect: '/pricing/index',
  meta: {
    icon: 'healthicons:money-bag',
    title: 'Pricing',
    orderNo: 14.5,
  },
  children: [
    {
      path: 'index',
      name: 'Pricing',
      component: () => import('@/views/wba/pricing/index.vue'),
      meta: {
        title: 'Pricing',
        hideMenu: true,
        currentActiveMenu: '/pricing',
      },
    },
  ],
};

export default route;
