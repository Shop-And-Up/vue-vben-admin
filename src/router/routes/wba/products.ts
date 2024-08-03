import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const route: AppRouteModule = {
  path: '/products',
  name: 'Products',
  component: LAYOUT,
  redirect: '/products/index',
  meta: {
    icon: 'icon-park-outline:ad-product',
    title: 'Products',
    orderNo: 12.5,
  },
  children: [
    {
      path: 'index',
      name: 'ProductPage',
      component: () => import('@/views/wba/products/list.vue'),
      meta: {
        title: 'Products',
        hideMenu: true,
        currentActiveMenu: '/products',
      },
    },
  ],
};

export default route;
