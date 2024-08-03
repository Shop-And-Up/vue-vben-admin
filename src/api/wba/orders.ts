import { defHttp } from '@/utils/http/axios';

enum Api {
  LIST = '/orders',
  // SYNC = '/orders/sync',
}

export const orderListAPI = async (params) =>
  defHttp
    .get({
      url: Api.LIST,
      params,
    })
    .then((res) => {
      res.data.map((item) => {
        // Convert display tag

        switch (item.status) {
          case 'failed':
            item.tag_color = 'red';
            item.tag_name = 'Failed';
            break;

          case 'opened':
            item.tag_color = 'blue';
            item.tag_name = 'Opened';
            break;

          case 'sent':
            item.tag_color = 'blue';
            item.tag_name = 'Sent';
            break;

          case 'sending':
            item.tag_color = 'green';
            item.tag_name = 'Sending';
            break;

          case 'queue':
            item.tag_color = 'green';
            item.tag_name = 'Scheduled';
            break;

          case 'sync':
            item.tag_name = 'Synchronized';
            item.tag_color = 'orange';
            break;

          default:
            item.tag_color = 'orange';
        }

        return item;
      });
      return res;
    });

export const orderResendAPI = async (id) =>
  defHttp.put({
    url: Api.LIST + `/${id}`,
    params: {
      status: 'queue',
    },
  });

export const orderDeleteAPI = async (id) =>
  defHttp.delete({
    url: Api.LIST + `/${id}`,
  });
