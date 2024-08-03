import { defHttp } from '@/utils/http/axios';

enum Api {
  DEL = '/charge',
  GEN = '/charge/generate',
}

export const generateChargeURLAPI = async (plan, coupon_code) =>
  defHttp.get({
    url: Api.GEN,
    params: {
      plan,
      coupon_code,
    },
  });

export const deleteChargeAPI = async () =>
  defHttp.delete({
    url: Api.DEL,
  });
