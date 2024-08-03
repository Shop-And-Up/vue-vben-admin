import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const route: AppRouteModule = {
  path: '/widget',
  name: 'Widgets',
  component: LAYOUT,
  redirect: '/widget/index',
  meta: {
    icon: 'ant-design:appstore-twotone',
    title: 'Widgets',
    orderNo: 11,
  },
  children: [
    {
      path: 'index',
      name: 'TemplatePage',
      component: () => import('@/views/wba/widget/index.vue'),
      meta: {
        title: 'Widget',
        hideMenu: true,
        currentActiveMenu: '/widget',
      },
    },
    {
      path: 'manage/:type',
      name: 'WidgetManage',
      component: () => import('@/views/wba/widget/manage.vue'),
      meta: {
        title: 'Manage widget',
        hideMenu: true,
        currentActiveMenu: '/widget',
      },
    },
    {
      path: 'manage/:type/create',
      name: 'WidgetCreate',
      component: () => import('@/views/wba/widget/create.vue'),
      meta: {
        title: 'Create widget',
        hideMenu: true,
        currentActiveMenu: '/widget',
      },
    },
    {
      path: 'manage/:type/:id',
      name: 'WidgetEdit',
      component: () => import('@/views/wba/widget/edit.vue'),
      meta: {
        title: 'Edit widget',
        hideMenu: true,
        currentActiveMenu: '/widget',
      },
    },
  ],
};

export default route;
