import type { AppRouteModule } from '@/router/types';
import { LAYOUT } from '@/router/constant';
import { isShopifyEmbedded } from '@shopify/app-bridge/utilities';

const route: AppRouteModule = {
  path: '/advance',
  name: 'Advance',
  component: LAYOUT,
  redirect: '/advance/scheduler',
  meta: {
    icon: 'icon-park-solid:vip-one',
    title: 'Advance',
    orderNo: 14,
  },

  children: [
    {
      path: 'fullscreen',
      name: 'ViewFullscreen',
      component: () => import('@/views/wba/fullscreen.vue'),
      meta: {
        title: 'View Fullscreen',
        hideMenu: !isShopifyEmbedded(),
      },
    },
    {
      path: 'google-reviews',
      name: 'GoogleReviews',
      component: () => import('@/views/wba/google-reviews/index.vue'),
      meta: {
        title: 'Google Reviews',
        icon: 'basil:google-outline',
      },
    },
    {
      path: 'order',
      name: 'OrderPage',
      component: () => import('@/views/wba/auto-mail/Orders.vue'),
      meta: {
        title: 'Orders',
        icon: 'mingcute:bill-2-line',
      },
    },
    {
      path: 'setting',
      name: 'MailSettingPage',
      component: () => import('@/views/wba/auto-mail/MailSetting.vue'),
      meta: {
        title: 'Orders & Email',
        icon: 'carbon:email',
      },
    },
    {
      path: 'bookmarklet',
      name: 'Bookmarklet',
      component: () => import('@/views/wba/tools/bookmarklet/index.vue'),
      meta: {
        title: 'Scraper Tool',
        icon: 'teenyicons:button-outline',
      },
    },
    {
      path: 'amazon-scraper',
      name: 'Crawler',
      component: () => import('@/views/wba/tools/crawler/index.vue'),
      meta: {
        title: 'Amazon Bot',
        icon: 'bx:bxl-amazon',
      },
    },
    {
      path: 'version-logs',
      name: 'ReleaseNotePage',
      component: () => import('@/views/wba/version-logs/index.vue'),
      meta: {
        title: 'Version 3.0.0',
        icon: 'lucide:logs',
      },
    },
  ],
};

export default route;
