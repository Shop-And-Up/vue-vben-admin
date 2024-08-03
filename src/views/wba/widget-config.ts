import { widgetDefaultConfigs } from '@coreThemeExt';

export interface IWidgetTemplate {
  id: string;
  name: string;
  shopify_block_id_default: string;
  form?: any;
  icon: string;
  banner: string;
  banner_small: string;
  category: string;
  description: string;
}

function mapIWidgetTemplate(key: string): IWidgetTemplate {
  return {
    id: key,
    name: widgetDefaultConfigs[key].name,
    shopify_block_id_default: widgetDefaultConfigs[key].shopify_block_id_default,
    form: widgetDefaultConfigs[key].form,
    icon: widgetDefaultConfigs[key].icon,
    banner_small: (widgetDefaultConfigs[key].banner as string).replace('.png', '_sm.png'),
    banner: widgetDefaultConfigs[key].banner,
    category: widgetDefaultConfigs[key].category,
    description: widgetDefaultConfigs[key].description,
  };
}

const WidgetTemplates: IWidgetTemplate[] = Object.keys(widgetDefaultConfigs)
  .filter((c) => c != 'core')
  .map(mapIWidgetTemplate);

export function getWidgetTemplate(type: string): IWidgetTemplate {
  return mapIWidgetTemplate(type);
}

const CategoryWidgets = [
  {
    id: 'reviews',
    text: 'Reviews',
  },
  {
    id: 'website-tools',
    text: 'Website tools',
  },
];

const priceList = [
  {
    id: 1,
    title: 'Free',
    description: 'Upgrade as you grow',
    price: 0,
    quota_view: 200,
    features: [
      '<span class="text-blue-500 font-medium">200</span> monthly impressions',
      '',
      '',
      '',
      '',
    ],
  },
  {
    id: 3,
    title: 'Free Pro',
    description: 'Sufficient for startups',
    price: 0,
    quota_view: null,
    features: [
      '<span class="text-blue-500 font-medium">Unlimited</span> impressions',
      '<span class="text-blue-500 font-medium">Unlimited</span> settings',
      'Clone reviews by AI',
      'Sync Amazon reviews',
      'Remove <span class="text-blue-500 font-medium">[Power by]</span> logo',
    ],
  },
  {
    id: 5,
    title: 'Pro',
    description: 'Sufficient for startups',
    price: 9.9,
    quota_view: null,
    features: [
      '<span class="text-blue-500 font-medium">Unlimited</span> impressions',
      '<span class="text-blue-500 font-medium">Unlimited</span> settings',
      'Clone reviews by AI',
      'Sync Amazon reviews',
      'Remove <span class="text-blue-500 font-medium">[Power by]</span> logo',
    ],
  },
  {
    id: 7,
    title: 'Advance',
    description: 'Growing businesses',
    price: 49.9,
    quota_view: null,
    features: [
      'All in <span class="text-blue-500 font-medium">Pro</span> plan',
      'Separate server',
      'You say, we serve',
      'Supper fast loading',
      '',
    ],
  },
];

export const isGlobalWidget = (type: any) => {
  return type == 'cookie_consent' || type == 'popup_reviews';
};

export const youtubeGuideLink = 'https://www.youtube.com/watch?v=pyL6OmKFVpM';

export enum ECommercePlatform {
  Amazon = 'Amazon',
  AliExpress = 'AliExpress',
  Etsy = 'Etsy',
}

export { WidgetTemplates, CategoryWidgets, priceList };
