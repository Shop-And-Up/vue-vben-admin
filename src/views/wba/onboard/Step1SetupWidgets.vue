<script lang="ts" setup>
  import { computed, onMounted, reactive } from 'vue';
  import { Checkbox, Select } from 'ant-design-vue';

  // import { postOnboard } from '@/api/wba/shop';
  // import { useUserStore } from '@/store/modules/user';
  import { themeLists } from '@/api/wba/theme';

  import Step1WidgetItem from './Step1WidgetItem.vue';

  // const userStore = useUserStore();
  const emit = defineEmits(['next']);
  const state = reactive({
    currenThemeId: <any>null,
    themeList: [],
    allowEditThemeFile: true,
    isSkipLoading: false,
    widgets: [
      {
        id: 'product_widget_setting',
        type: 'product_reviews',
        title: 'Product reviews',
        is_show: true,
        background: '/assets/img/widget-banners/product-reviews.png',
        background_small: '/assets/img/widget-banners/product-reviews_sm.png',
      },
      {
        id: 'rating_product_widget_setting',
        type: 'rating_reviews',
        title: 'Product rating badge',
        is_show: true,
        background: '/assets/img/widget-banners/rating-badge.png',
        background_small: '/assets/img/widget-banners/rating-badge_sm.png',
      },
      {
        id: 'rating_collection_widget_setting',
        type: 'rating_reviews',
        title: 'Collection rating badge',
        is_show: true,
        background: '/assets/img/widget-banners/rating-badge-Collection.png',
        background_small: '/assets/img/widget-banners/rating-badge-Collection_sm.png',
      },
      {
        id: 'popup_widget_setting',
        type: 'popup_reviews',
        title: 'Popup reviews',
        is_show: true,
        background: '/assets/img/widget-banners/popup-reviews.png',
        background_small: '/assets/img/widget-banners/popup-reviews_sm.png',
      },
    ],
  });

  onMounted(() => {
    themeLists().then((res) => {
      state.themeList = res.themes.map((c) => {
        return {
          value: c.id,
          label: c.name + ' theme',
        };
      });
      state.currenThemeId = res.current_theme_id;
    });
  });

  const countSelected = computed(() => {
    return state.widgets.filter((c) => c.is_show).length;
  });

  const setAllWidgetStatus = (val) => {
    state.widgets.forEach((element) => {
      element.is_show = val;
    });
  };

  const handleInstall = () => {
    emit('next', {
      theme_id: state.currenThemeId,
      widgets: state.widgets,
    });
  };

  const handleSkip = () => {
    // Disable all widgets
    setAllWidgetStatus(false);

    state.isSkipLoading = true;

    setTimeout(() => {
      handleInstall();
    }, 1000);
  };
</script>

<template>
  <form>
    <div class="grid grid-cols-4 gap-4">
      <div class="col-span-4 flex items-center justify-center">
        We have many different widget types. And we recommend installing all of below widgets.
      </div>
      <div class="col-span-4 flex items-center justify-center">
        <div class="w-max-600px grid grid-cols-2 gap-y-8 gap-x-14">
          <div
            v-for="(wInfo, i) in state.widgets"
            :key="wInfo.id"
            class="col-span-1 flex items-center justify-center"
          >
            <Step1WidgetItem
              v-model="state.widgets[i]"
              :disable="state.isSkipLoading"
            ></Step1WidgetItem>
          </div>
        </div>
      </div>
      <div class="col-span-4 flex items-center justify-center mt-2">
        <Checkbox
          v-model:checked="state.allowEditThemeFile"
          :disabled="state.isSkipLoading"
          @change="(e) => setAllWidgetStatus(e.target.checked)"
        >
          Allow us to update your theme files to install all of widgets into
        </Checkbox>
        <Select
          v-model:value="state.currenThemeId"
          :options="state.themeList"
          class="w-200px"
          show-search
        />
      </div>
      <div class="col-span-4 flex items-center justify-center font-medium mt-5">
        <a-button :disabled="!countSelected" size="large" type="primary" @click="handleInstall">
          Install {{ countSelected }} {{ countSelected > 1 ? 'widgets' : 'widget' }} now
        </a-button>
        <a-button :loading="state.isSkipLoading" @click="handleSkip" type="link">
          Skip for now
        </a-button>
      </div>
    </div>
  </form>
</template>

<style lang="less" scoped></style>
