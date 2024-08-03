import { defHttp } from '@/utils/http/axios';

enum Api {
  LIST = '/products',
  SYNC = '/products/sync',
  CLONE = '/products/clone-reviews',
}

export const productListAPI = async (params) =>
  defHttp.get({
    url: Api.LIST,
    params,
  });

export const productSyncAPI = async () =>
  defHttp.get({
    url: Api.SYNC,
  });

export const productDeleteReviewsAPI = async (id) =>
  defHttp.delete({
    url: Api.LIST + `/${id}/reviews`,
  });

export const productRecalcRatingAPI = async (id) =>
  defHttp.post({
    url: Api.LIST + `/${id}/calc-rating`,
  });

export const productDeleteAPI = async (id) =>
  defHttp.delete({
    url: Api.LIST + `/${id}`,
  });

export const productCloneReviewAPI = async (params) =>
  defHttp.post(
    {
      url: Api.CLONE,
      params,
    },
    {
      errorMessageMode: 'none',
    },
  );
