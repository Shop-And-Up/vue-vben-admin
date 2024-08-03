import type { Router } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
import { useMultipleTabStore } from '@/store/modules/multipleTab';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';
import { PageEnum } from '@/enums/pageEnum';
import { removeTabChangeListener } from '@/logics/mitt/routeChange';

export function createStateGuard(router: Router) {
  // EthanWilson - Start
  router.beforeEach(async (to, _, next) => {
    const userStore = useUserStore();
    if (userStore.$state.userInfo) {
      if (userStore.$state.userInfo?.onboard) {
        if (to.path != PageEnum.ONBOARD) {
          next({
            path: PageEnum.ONBOARD,
            replace: true,
          });
          return;
        }
      } else {
        if (to.path == PageEnum.ONBOARD) {
          next({
            path: PageEnum.BASE_HOME,
            replace: true,
          });
          return;
        }
      }
    }

    next();
  });
  // EthanWilson - End

  router.afterEach((to) => {
    // Just enter the login page and clear the authentication information
    if (to.path === PageEnum.BASE_LOGIN) {
      const tabStore = useMultipleTabStore();
      const userStore = useUserStore();
      const appStore = useAppStore();
      const permissionStore = usePermissionStore();
      appStore.resetAllState();
      permissionStore.resetState();
      tabStore.resetState();
      userStore.resetState();
      removeTabChangeListener();
    }
  });
}
