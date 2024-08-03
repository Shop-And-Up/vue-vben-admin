import { defHttp } from '@/utils/http/axios';

enum Api {
  CHANGE = '/theme/change',
  LIST = '/theme/list',
  PAGES = '/theme/structure',
}

export const themeChange = (new_theme_id) =>
  defHttp.post({
    url: Api.CHANGE,
    params: {
      new_theme_id,
    },
  });

export const themeLists = () =>
  defHttp.get({
    url: Api.LIST,
  });

export const themePages = (theme_id, template = null, block_id = null) =>
  defHttp
    .get({
      url: Api.PAGES,
      params: {
        theme_id,
        template,
        block_id,
      },
    })
    .then((res: any) => {
      res.template_struct.map((sec: object) => {
        sec.class = 'tree-parent';

        if (!sec.hasOwnProperty('children')) {
          sec.isLeaf = true;
        } else {
          sec.children.map((child) => {
            child.class = 'tree-child';
            return child;
          });
        }

        return sec;
      });

      return res;
    });
