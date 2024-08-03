/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access
 */
import { PageEnum } from '@/enums/pageEnum';
import type { AppRouteModule } from '@/router/types';

// test
// http:ip:port/main-out
export const mainOutRoutes: AppRouteModule[] = [
  {
    path: PageEnum.ONBOARD,
    name: 'Onboard',
    component: () => import('@/views/wba/onboard/index.vue'),
    meta: {
      title: 'Onboard',
      ignoreAuth: true,
    },
  },
];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);
