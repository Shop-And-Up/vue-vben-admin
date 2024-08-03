import { defHttp } from '@/utils/http/axios';

export const disableShopifyAlertApi = async () =>
  defHttp.post({
    url: '/disable-shopify-alert',
  });
