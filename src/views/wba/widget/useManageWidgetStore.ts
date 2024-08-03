import { defineStore } from 'pinia';

import { getDefaultWidget, widgetDetail } from '@/api/wba/widget';
import { getWidgetTemplate, isGlobalWidget } from '@/views/wba/widget-config';
import {
  BestReviewsCreate,
  BestReviewsEdit,
  BestReviewsManage,
  CarouselReviewsCreate,
  CarouselReviewsEdit,
  CarouselReviewsManage,
  CookieConsentManage,
  PopupReviewManage,
  ProductReviewsCreate,
  ProductReviewsEdit,
  ProductReviewsManage,
  RatingReviewsCreate,
  RatingReviewsEdit,
  RatingReviewsManage,
  TestimonialCreate,
  TestimonialEdit,
  TestimonialManage,
  TrustBadgeCreate,
  TrustBadgeEdit,
  TrustBadgeManage,
} from '@/views/wba/widget/partials';
import { actionType } from '@/views/wba/widget/service';

export interface IManageWidgetStore {
  type: any;
  actionType: actionType;
  isLoading: boolean;

  hideSaveBtn: boolean;
  selectedCpt: any;
  widgetTypeInfo: any;

  widgetInfo: any;
  defaultWidget: any;
}

export const useManageWidgetStore = () => {
  return defineStore('wba-manage-widget-store', {
    state: (): IManageWidgetStore => ({
      type: '',
      actionType: actionType.manage,
      isLoading: true,

      hideSaveBtn: false,
      selectedCpt: null,
      widgetTypeInfo: {},

      widgetInfo: {},
      defaultWidget: {},
    }),
    getters: {
      isDefaultWidget: (state) => {
        return state.actionType == actionType.manage;
      },
      isEmbeddedWidget: (state) => {
        // Embedded/Global widget is embedded in setting of the theme
        return isGlobalWidget(state.type);
      },
      useDefaultWidgetSetting: (state) => {
        if (state.actionType == actionType.manage) {
          return false;
        }

        return state.widgetInfo.use_default_widget_setting as boolean;
      },
      hasBothDefaultAndNormalWidget: (state) => {
        return !!state.widgetInfo.id && !!state.defaultWidget.id;
      },
    },
    actions: {
      setState(payload: IManageWidgetStore) {
        this.$patch(payload);

        if (payload.type) {
          this.widgetTypeInfo = getWidgetTemplate(payload.type);
        }

        if (this.type && payload.actionType !== undefined) {
          this.selectedCpt = getWidgetComponent(this.type, payload.actionType);
        }
      },
      async getDefaultWidget() {
        this.isLoading = true;
        return getDefaultWidget(this.type)
          .then((res) => {
            this.defaultWidget = res;
            return res;
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
      async getWidgetInfo(widgetId: any) {
        this.isLoading = true;
        return widgetDetail(widgetId)
          .then((res) => {
            this.widgetInfo = res;
            return res;
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
    },
  })();
};

const getWidgetComponent = (type: string, action: actionType) => {
  switch (type) {
    case 'best_reviews':
      if (action == actionType.manage) {
        return BestReviewsManage;
      }

      if (action == actionType.create) {
        return BestReviewsCreate;
      }

      // actionType.edit
      return BestReviewsEdit;

    case 'rating_reviews':
      if (action == actionType.manage) {
        return RatingReviewsManage;
      }

      if (action == actionType.create) {
        return RatingReviewsCreate;
      }

      // actionType.edit
      return RatingReviewsEdit;

    case 'cookie_consent':
      return CookieConsentManage;

    case 'testimonial':
      if (action == actionType.manage) {
        return TestimonialManage;
      }

      if (action == actionType.create) {
        return TestimonialCreate;
      }

      // actionType.edit
      return TestimonialEdit;

    case 'carousel_reviews':
      if (action == actionType.manage) {
        return CarouselReviewsManage;
      }

      if (action == actionType.create) {
        return CarouselReviewsCreate;
      }

      // actionType.edit
      return CarouselReviewsEdit;

    case 'popup_reviews':
      return PopupReviewManage;

    case 'trust_badge':
      if (action == actionType.manage) {
        return TrustBadgeManage;
      }

      if (action == actionType.create) {
        return TrustBadgeCreate;
      }

      // actionType.edit
      return TrustBadgeEdit;

    case 'product_reviews':
      if (action == actionType.manage) {
        return ProductReviewsManage;
      }

      if (action == actionType.create) {
        return ProductReviewsCreate;
      }

      // actionType.edit
      return ProductReviewsEdit;
  }

  return null;
};
