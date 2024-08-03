import { defHttp } from '@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '@/hooks/setting';

const { urlPrefix, apiUrl } = useGlobSetting();

enum Api {
  LIST = '/reviews',
  BULK_ACTIONS = '/reviews/bulk-actions',
}

export const reviewsList = (params): Promise<any> =>
  defHttp
    .get({
      url: Api.LIST,
      params,
    })
    .then((res) => {
      // Filter: product attribute is not null
      res.data = res.data.filter((c) => c.product !== null);

      res.data = res.data.map((c) => {
        c.status_loading = false;
        c.image_show_preview = false;
        return c;
      });

      return res;
    });

export const bestReviewsList = (params): Promise<any> =>
  defHttp.get({
    url: Api.LIST + `/best-list`,
    params,
  });

export const reviewsCreate = (params: any): Promise<any> =>
  defHttp.post(
    {
      url: Api.LIST,
      params,
    },
    {
      errorMessageMode: 'modal',
    },
  );

export const reviewsDeleteAPI = (ids: any[]): Promise<any> => reviewsBulkActionAPI('delete', ids);

export const reviewsBulkActionAPI = (type, ids: any[]): Promise<any> =>
  defHttp.post({
    url: Api.BULK_ACTIONS,
    params: {
      ids,
      type,
    },
  });

export const reviewsUpdateAPI = (id: any, params): Promise<any> =>
  defHttp.put({
    url: Api.LIST + `/${id}`,
    params,
  });

export const reviewsImportCSVAPI = (params: UploadFileParams) =>
  defHttp
    .uploadFile(
      {
        url: `${apiUrl}${urlPrefix}${Api.LIST}/import-csv`,
      },
      params,
    )
    .then((res) => res.data);

export const publishAllReviews = (): Promise<any> =>
  defHttp.post(
    {
      url: Api.LIST + '/publish-all-reviews',
    },
    {
      errorMessageMode: 'modal',
    },
  );
