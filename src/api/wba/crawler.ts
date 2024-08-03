import { defHttp } from '@/utils/http/axios';

enum Api {
  LIST = '/crawler',
}

export const crawlerListAPI = async (params) =>
  defHttp
    .get({
      url: Api.LIST,
      params,
    })
    .then((res) => {
      res.data = res.data.map((c) => {
        c.status_loading = false;
        return c;
      });

      return res;
    });

export const crawlerDeleteAPI = async (id) =>
  defHttp.delete({
    url: Api.LIST + `/${id}`,
  });

export const crawlerStore = async (id: any, params) =>
  defHttp.put({
    url: Api.LIST + `/${id}`,
    params,
  });

export const crawlerCreate = (params: any): Promise<any> =>
  defHttp.post(
    {
      url: Api.LIST,
      params,
      timeout: 20000,
    },
    {
      errorMessageMode: 'modal',
    },
  );

export const crawlerUpdateAPI = (id: any, params): Promise<any> =>
  defHttp.put(
    {
      url: Api.LIST + `/${id}`,
      params,
    },
    {
      errorMessageMode: 'modal',
    },
  );

export const crawlerSyncAPI = (id: any): Promise<any> =>
  defHttp.post(
    {
      url: Api.LIST + `/${id}/sync`,
    },
    {
      errorMessageMode: 'modal',
    },
  );
