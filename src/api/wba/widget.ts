import { defHttp } from '@/utils/http/axios';
import { fillStandardConfig } from '@coreThemeExt/components/utils';

enum Api {
  WidgetPath = '/widget',
  SyncWidgets = '/widget/sync',
  FIST_BY_TYPE = '/widget/first-by-type',
  ListWidgets = '/widget/list',
  GetDefaultWidget = '/widget/default-widget',
}

export const listWidgetByType = async (params: any) =>
  defHttp
    .get({
      url: Api.ListWidgets + `/${params.type}`,
      params,
    })
    .then((res) => {
      res.data = res.data.map((c: any) => {
        c = fillStandardConfig(c);

        // Widget list page need this attr to show/hide Toggle
        c.is_show_loading = false;

        return c;
      });

      return res;
    });

export const widgetSync = async () =>
  defHttp.get({
    url: Api.SyncWidgets,
  });

export const widgetCreate = async (params: any) =>
  defHttp.post(
    {
      url: Api.WidgetPath + `/create`,
      params,
    },
    {
      errorMessageMode: 'modal',
    },
  );

export const widgetChangePage = async (id: any, params: any) =>
  defHttp.post(
    {
      url: Api.WidgetPath + `/${id}/change-position`,
      params,
    },
    {
      errorMessageMode: 'modal',
    },
  );

export const widgetDetail = async (id: any) =>
  defHttp
    .get({
      url: Api.WidgetPath + `/${id}`,
    })
    .then((widget) => {
      return fillStandardConfig(widget);
    });

export const getDefaultWidget = async (type: any) =>
  defHttp
    .get({
      url: Api.GetDefaultWidget + `/${type}`,
    })
    .then((widget) => {
      return fillStandardConfig(widget);
    });

export const widgetDelete = async (ids: any[]) =>
  defHttp.delete(
    {
      url: Api.WidgetPath,
      params: {
        ids,
      },
    },
    {
      errorMessageMode: 'none',
      retryRequest: { isOpenRetry: false, count: 0, waitTime: 0 },
    },
  );

export const widgetFirstByType = async (type: any) =>
  defHttp.get(
    {
      url: Api.FIST_BY_TYPE,
      params: {
        type,
      },
    },
    {
      errorMessageMode: 'none',
      retryRequest: { isOpenRetry: false, count: 0, waitTime: 0 },
    },
  );

export const widgetStore = async (id: any, params) =>
  defHttp.put({
    url: Api.WidgetPath + `/${id}`,
    params,
  });

export const widgetSystemSetting = async () =>
  defHttp.get(
    {
      url: Api.WidgetPath + '/system-setting',
    },
    {
      errorMessageMode: 'none',
      retryRequest: { isOpenRetry: false, count: 0, waitTime: 0 },
    },
  );
