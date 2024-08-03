import { cloneDeep } from 'lodash-es';
import { FormContext } from 'vee-validate';
import { widgetStore } from '@/api/wba/widget';
import { notification } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';

const { isFreePlan } = useUserStore();

export const pageSizeList = [
  { value: 10, label: '10 items/page' },
  { value: 25, label: '25 items/page' },
  { value: 35, label: '35 items/page' },
  { value: 50, label: '50 items/page' },
];

export const sortByList = [
  { value: 'feedback_date', label: 'Sort by date' },
  { value: 'rate', label: 'Sort by rating (Charged plan)', disabled: isFreePlan },
  { value: 'image_count', label: 'Sort by media (Charged plan)', disabled: isFreePlan },
  {
    value: 'the_latest_change',
    label: 'Sort by the latest change (Charged plan)',
    disabled: isFreePlan,
  },
];

export enum actionType {
  manage,
  create,
  edit,
}

export enum createType {
  AppBlock,
  EmbeddedCode,
  ShopifyEditor,
}

export const copyWidgetSetting = (formContext: FormContext, res: any) => {
  formContext.setFieldValue('setting', res.setting);
  formContext.setFieldValue('custom_setting', res.custom_setting);
};

export const updateWidget = (formContext: FormContext) =>
  formContext.validate().then(async (res) => {
    if (res.valid) {
      // Form pass validate case
      await widgetStore(formContext.values.id, formContext.values).then(() => {
        formContext.resetForm({ values: cloneDeep(formContext.values) });
        notification.success({ message: 'Saved', description: 'The item has been updated.' });
      });
    } else {
      // Error case
      Object.keys(res.errors).forEach((key) => {
        notification.error({ message: 'Error', description: res.errors[key] });
      });
    }
  });
