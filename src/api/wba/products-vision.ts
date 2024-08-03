import { defHttp } from '@/utils/http/axios';

enum Api {
  LIST = '/product-vision/list',
  REVIEWS = '/product-vision/reviews',
  CLONE_ALL = '/product-vision/clone',
}

export const listProductVisionAPI = async (params: any) =>
  defHttp.get({
    url: Api.LIST,
    params,
  });

export const listReviewVisionAPI = async (params: any) =>
  defHttp.get({
    url: Api.REVIEWS,
    params,
  });

export const cloneReviewAPI = async (params: any) =>
  defHttp.post(
    {
      url: Api.CLONE_ALL,
      params,
    },
    {
      errorMessageMode: 'none',
    },
  );
