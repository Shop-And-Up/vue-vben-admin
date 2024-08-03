import type { UserInfo } from '#/store';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { RoleEnum } from '@/enums/roleEnum';
import { PageEnum } from '@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { GetUserInfoModel } from '@/api/wba/model/userModel';
import { getUserInfo, verifyShopifySession, verifyToken } from '@/api/wba/user';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { LocationQuery, RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { isArray } from '@/utils/is';
import { h } from 'vue';
import PusherService from '@/plugins/pusher';
import { ErrorMessageMode } from '#/axios';
import { isGlobalWidget, priceList } from '@/views/wba/widget-config';
import { useShopifyAppBridgeStore } from './shopifyAppBridge';
import { setCrispUserInfo } from '@/plugins/crisp';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getQuotaLogo(state): boolean {
      return !!state.userInfo?.quota_visible_logo;
    },
    isFreePlan(state): boolean {
      return state.userInfo?.charge_name == 'Free';
    },
    currentPlan(state): any {
      const userInfo = state.userInfo;
      let chargeName: any = userInfo!.charge_name;

      if (!userInfo?.charge_id && chargeName == 'Pro') {
        chargeName = 'Free Pro';
      }

      function findPlan(planName: string) {
        return priceList.find((c) => c.title == planName);
      }

      return findPlan(chargeName) ?? findPlan('Free');
    },
    isThemeV2(state): boolean {
      return !!state.userInfo?.theme_v2;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      // Update pusher channel
      PusherService.setChannel(info?.userId);

      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    goToThemeCodeEditor() {
      const path = `/themes/${this.userInfo?.theme_id}`;

      this.goToAdminPath(path);
    },
    goToThemeEditor(type: null | any = null, newTab = true) {
      const uuid = import.meta.env.VITE_GLOB_SHOPIFY_APP_UUID;
      let path = `/themes/${this.userInfo?.theme_id}/editor`;

      if (type == 'wba-apps') {
        path += `?context=apps&template=index&activateAppId=${uuid}`;
      } else if (isGlobalWidget(type)) {
        const handle = type == 'popup_reviews' ? 'popup-reviews' : 'cookie-consent';
        path += `?context=apps&template=index&activateAppId=${uuid}/${handle}`;
      }

      this.goToAdminPath(path, newTab);
    },
    goToAdminPath(path: string, newTab = true) {
      const appBridgeStore = useShopifyAppBridgeStore();
      if (appBridgeStore.getIsEmbedded) {
        appBridgeStore.openAdminPath(path, newTab);
      } else {
        const url = `https://${this.userInfo?.myshopify_domain}/admin${path}`;
        if (newTab) {
          window.open(url, '_blank');
        } else {
          window.open(url, '_self');
        }
      }
    },
    goToStore() {
      const url = `https://${this.userInfo?.myshopify_domain}`;
      window.open(url, '_blank');
    },

    /**
     * @description: login
     */
    async checkShopifyEmbed(query: LocationQuery): Promise<any> {
      if (query.host && query.shop && query.hmac) {
        return verifyShopifySession(query)
          .then(async (res: { token: any; info: any }) => {
            // Save token
            this.setToken(res.token);

            // Save user info
            return await this.afterLoginAction(false, res.info);
          })
          .catch(() => {
            return Promise.resolve();
          });
      } else {
        return Promise.resolve();
      }
    },

    /**
     * @description: login
     */
    async checkTokenFromParams(params: any): Promise<GetUserInfoModel | null> {
      try {
        const { token } = params;

        if (!token) {
          return Promise.resolve(null);
        }

        const userInfo = await verifyToken(token);

        // save token
        this.setToken(token);

        return this.afterLoginAction(false, userInfo);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: login
     */
    async loginWithToken(params: {
      token: string;
      goHome?: boolean;
      mode?: ErrorMessageMode;
    }): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, token } = params;
        const userInfo = await verifyToken(token, mode);

        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome, userInfo);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async afterLoginAction(
      goHome?: boolean,
      rawUserInfo: any = null,
    ): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.validUserInfoAction(rawUserInfo);

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();

        // 动态路由加载（首次）
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // 记录动态路由加载完成
          permissionStore.setDynamicAddedRoute(true);
        }

        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },

    async validUserInfoAction(rawUserInfo = null): Promise<UserInfo | null> {
      if (!this.getToken) return null;

      const userInfo = rawUserInfo ?? (await getUserInfo());

      setCrispUserInfo(userInfo);

      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }

      this.setUserInfo(userInfo);

      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          // await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          // 主动登出，不带redirect地址
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
