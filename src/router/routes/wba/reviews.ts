import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const route: AppRouteModule = {
  path: '/reviews',
  name: 'reviews',
  component: LAYOUT,
  redirect: '/reviews/index',
  meta: {
    icon: 'clarity:star-solid',
    title: 'Reviews',
    orderNo: 12,
  },
  children: [
    {
      path: 'index',
      name: 'ReviewPage',
      component: () => import('@/views/wba/reviews/list.vue'),
      meta: {
        title: 'Review',
        hideMenu: true,
        currentActiveMenu: '/reviews',
      },
    },
  ],
};

export default route;
