import { defHttp } from '@/utils/http/axios';
import { GetUserInfoModel } from './model/userModel';
import { ErrorMessageMode } from '#/axios';

enum Api {
  GetUserInfo = '/me',
  VerifyShopifySession = '/auth/verify-shopify-session',
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp
    .get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' })
    .then((c) => mapUser(c));
}

export function verifyShopifySession(params: any) {
  return defHttp
    .post(
      {
        url: Api.VerifyShopifySession,
        params,
      },
      {
        errorMessageMode: 'modal',
      },
    )
    .then((c) => {
      return {
        token: c.token,
        info: mapUser(c.info),
      };
    });
}

export function verifyToken(token: string, mode: ErrorMessageMode = 'modal') {
  return defHttp
    .get<GetUserInfoModel>(
      {
        url: Api.GetUserInfo,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
      {
        errorMessageMode: mode,
      },
    )
    .then((c) => mapUser(c));
}

function mapUser(shopInfo: any): GetUserInfoModel {
  return {
    roles: [
      {
        roleName: shopInfo.charge_name,
        value: shopInfo.charge_id,
      },
    ],
    userId: shopInfo.id,
    username: shopInfo.name,
    realName: shopInfo.shop_owner,
    avatar: '',
    uuid: shopInfo.uuid,
    email: shopInfo.email,
    myshopify_domain: shopInfo.myshopify_domain,
    quota_reach_limit: shopInfo.quota_reach_limit,
    quota_visible_logo: shopInfo.quota_visible_logo,
    quota_view: shopInfo.quota_view,
    quota_reset_on: shopInfo.quota_reset_on,
    f_trial_days: shopInfo.f_trial_days,
    charge_name: shopInfo.charge_name,
    charge_id: shopInfo.charge_id,
    free_pro_plan_date: shopInfo.free_pro_plan_date,
    theme_id: shopInfo.theme_id,
    theme_v2: shopInfo.theme_v2,
    theme_name: shopInfo.theme_name,
    shopify_alert: shopInfo.shopify_alert,
    onboard: shopInfo.onboard,
  };
}
