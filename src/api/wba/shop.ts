import _ from 'lodash-es';
import { defHttp } from '@/utils/http/axios';

enum Api {
  IMPRESSION = '/shop/statistic-impression',
  COUNTER = '/shop/statistic-counter',
  IMPROVE_FEEDBACK = '/shop/improve-feedback',
  SETTING = '/shop/setting',
  UPDATE_MAIL_SETTING = '/shop/setting-mail',
  UPDATE_GOOGLE_REVIEW_SETTING = '/shop/setting-google-review',
  ONBOARD = '/shop/onboard',
}

export const getStatisticAPI = (from: any, to: any) =>
  defHttp.get({
    url: Api.IMPRESSION,
    params: {
      from,
      to,
    },
  });

export const getCounterAPI = () =>
  defHttp.get({
    url: Api.COUNTER,
  });

export function sendImproveFeedback(params: any) {
  return defHttp.post(
    {
      url: Api.IMPROVE_FEEDBACK,
      params,
    },
    {
      errorMessageMode: 'modal',
    },
  );
}

export const getSettingAPI = () =>
  defHttp.get({
    url: Api.SETTING,
  });

export const updateMailSettingAPI = (params, test = false) =>
  defHttp.put({
    url: Api.UPDATE_MAIL_SETTING,
    params: {
      ...params,
      test,
    },
  });

export const updateGoogleReviewSettingAPI = (params) =>
  defHttp.put({
    url: Api.UPDATE_GOOGLE_REVIEW_SETTING,
    params: {
      ...params,
    },
  });

export const postGenerateGoogleReviewAPI = () =>
  defHttp.post({
    url: Api.UPDATE_GOOGLE_REVIEW_SETTING + '/generate',
  });

export const postOnboard = (payload: { widgets: any[]; theme_id: any }) => {
  return defHttp.post({
    url: Api.ONBOARD,
    params: {
      theme_id: payload.theme_id,
      configs: {
        widgets: _.keyBy(payload.widgets, 'id'),
      },
    },
  });
};
