import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const route: AppRouteModule = {
  path: '/review-ai',
  name: 'review-by-ai',
  component: LAYOUT,
  redirect: '/review-ai/index',
  meta: {
    icon: 'icon-park-solid:brain',
    title: 'Reviews & AI',
    orderNo: 12.1,
  },
  children: [
    {
      path: 'index',
      name: 'ReviewAIByNamePage',
      component: () => import('@/views/wba/review-by-ai/list.vue'),
      meta: {
        title: 'Reviews & AI',
        hideMenu: true,
        currentActiveMenu: '/review-ai',
      },
    },
  ],
};

export default route;
