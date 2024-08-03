import { defineStore } from 'pinia';
import { store } from '@/store';

import { ClientApplication } from '@shopify/app-bridge/client';
import { isShopifyEmbedded } from '@shopify/app-bridge/utilities';
import { Redirect } from '@shopify/app-bridge/actions';
import createAppBridge from '@shopify/app-bridge/production.js';
import { MenuTypeEnum } from '@/enums/menuEnum';

interface ShopifyAppBridgeState {
  isShopifyAdminEmbedded: boolean;
  currentPath: string | null;
  appBridge: ClientApplication | null;
}

export const useShopifyAppBridgeStore = defineStore({
  id: 'app-shopify-app-bridge',
  state: (): ShopifyAppBridgeState => ({
    isShopifyAdminEmbedded: false,
    currentPath: null,
    appBridge: null,
  }),
  getters: {
    getIsEmbedded(): boolean {
      return this.isShopifyAdminEmbedded;
    },
    getCurrentPath(): any {
      return this.currentPath;
    },
    getAppBridge(): ClientApplication {
      return this.appBridge as ClientApplication;
    },
    getProjectSetting() {
      const isEmb = !!this.getIsEmbedded;

      return {
        showSettingButton: false,
        showBreadCrumb: false,
        headerSetting: {
          show: false,
        },
        menuSetting: {
          type: isEmb ? MenuTypeEnum.TOP_MENU : MenuTypeEnum.SIDEBAR,
          split: isEmb,
        },
        multiTabsSetting: {
          show: false,
        },
      };
    },
  },
  actions: {
    setIsEmbedded(v: boolean) {
      this.isShopifyAdminEmbedded = v;
    },
    setAppBridge(v: ClientApplication) {
      this.appBridge = v;
    },
    setCurrentPath(v: string) {
      this.currentPath = v;
    },
    initShopifyAppBridge() {
      this.setIsEmbedded(isShopifyEmbedded());

      if (this.isShopifyAdminEmbedded) {
        // Init AppBridge
        const appBridge = createAppBridge({
          // The client ID provided for your application in the Partner Dashboard.
          apiKey: import.meta.env.VITE_GLOB_SHOPIFY_APP_KEY,
          // The host of the specific shop that's embedding your app. This value is provided by Shopify as a URL query parameter that's appended to your application URL when your app is loaded inside the Shopify admin.
          host: new URLSearchParams(location.search).get('host') as string,
          forceRedirect: true,
        });

        this.setAppBridge(appBridge);
      }
    },
    openAdminPath(path: string, newTab = true) {
      const redirect = Redirect.create(this.appBridge as ClientApplication);

      redirect.dispatch(Redirect.Action.ADMIN_PATH, {
        path,
        newContext: newTab,
      });
    },
    openRemotePath(url: string, newTab = true) {
      if (this.getIsEmbedded) {
        const redirect = Redirect.create(this.appBridge as ClientApplication);

        redirect.dispatch(Redirect.Action.REMOTE, {
          url,
          newContext: newTab,
        });
      } else {
        if (newTab) {
          window.open(url, '_blank');
        } else {
          window.location.href = url;
        }
      }
    },
  },
});

// Need to be used outside the setup
export function useShopifyAppBridgeStoreWithOut() {
  return useShopifyAppBridgeStore(store);
}
