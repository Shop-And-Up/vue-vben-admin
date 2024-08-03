/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: any[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  uuid?: string;
  email?: string;
  quota_reset_on: any;
  myshopify_domain?: string;
  quota_reach_limit?: boolean;
  quota_visible_logo?: boolean;
  quota_view?: number;
  f_trial_days?: number;
  charge_name?: string;
  charge_id?: string;
  free_pro_plan_date?: string;
  theme_id?: string;
  theme_name?: string;
  theme_v2?: boolean;
  shopify_alert?: boolean;
  onboard?: boolean;
}
