<script lang="ts" setup>
  import { onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Card, Image, Select, Switch } from 'ant-design-vue';
  import { CategoryWidgets, IWidgetTemplate, WidgetTemplates } from '../widget-config';
  import { widgetStore, widgetSystemSetting } from '@/api/wba/widget';
  import { useMessage } from '@/hooks/web/useMessage';
  import { themeChange, themeLists } from '@/api/wba/theme';
  import { useUserStore } from '@/store/modules/user';

  const ImagePreviewGroup = Image.PreviewGroup;
  const { notification, createConfirm } = useMessage();
  const userStore = useUserStore();
  const router = useRouter();

  const state = reactive({
    widgetList: WidgetTemplates,
    currentCategory: 'all',
    viewSampleImage: '',
    coreWidget: {
      id: null,
      is_show: false,
    },
    coreWidgetLoading: true,
  });

  const themeListState = reactive({
    currenThemeId: null,
    themeList: [],
    isLoading: false,
  });

  onMounted(() => {
    widgetSystemSetting().then((res) => {
      state.coreWidget = res;
      state.coreWidgetLoading = false;
    });

    // Loading theme list
    reloadThemeList();
  });

  const reloadThemeList = () => {
    themeLists().then((res) => {
      themeListState.themeList = res.themes.map((c) => {
        return {
          value: c.id,
          label: c.name + ' theme',
        };
      });
      themeListState.currenThemeId = res.current_theme_id;
    });
  };

  const changeTheme = (themeId: any) => {
    themeListState.isLoading = true;
    themeListState.currenThemeId = themeId;

    themeChange(themeId)
      .then(() => {
        // Reload shop info
        userStore.validUserInfoAction();
      })
      .finally(() => (themeListState.isLoading = false));
  };

  const getCategoryName = (id: string) => {
    return CategoryWidgets.find((item) => item.id == id)?.text;
  };

  const changeCategory = (id) => {
    state.currentCategory = id;

    if (id == 'all') {
      state.widgetList = WidgetTemplates;
    } else {
      state.widgetList = WidgetTemplates.filter((c) => c.category == id);
    }
  };

  const goToManagePage = (item: IWidgetTemplate) => {
    router.push({
      name: 'WidgetManage',
      params: {
        type: item.id,
      },
    });
  };

  const handleDisableAllWidget = (is_show: boolean) => {
    const action = is_show ? 'active' : 'disable';
    const title = 'Do you want to ' + action + ' all widgets ?';

    createConfirm({
      iconType: 'warning',
      title: 'Update all widgets',
      content: title,
      onCancel: () => {},
      onOk: () => {
        state.coreWidgetLoading = true;

        widgetStore(state.coreWidget.id, { is_show })
          .then(() => {
            state.coreWidget.is_show = is_show;

            notification.success({
              message: 'Saved',
              description: 'All widgets have been updated.',
            });
          })
          .finally(() => (state.coreWidgetLoading = false));
      },
    });
  };
</script>

<template>
  <div class="max-w-screen-xl mx-auto gap-4 p-4">
    <div class="grid grid-cols-3 gap-2">
      <div class="col-span-3 md:col-span-1">
        <ul class="flex flex-wrap gap-3 !m-0">
          <li>
            <a-button
              :type="[state.currentCategory == 'all' && 'primary']"
              @click="changeCategory('all')"
            >
              All
            </a-button>
          </li>
          <li v-for="(item, index) in CategoryWidgets" :key="index">
            <a-button
              :type="[state.currentCategory == item.id && 'primary']"
              @click="changeCategory(item.id)"
            >
              {{ item.text }}
            </a-button>
          </li>
        </ul>
      </div>

      <div class="col-span-3 md:col-span-1 flex items-center justify-end">
        <Switch
          :checked="state.coreWidget.is_show"
          :loading="state.coreWidgetLoading"
          checked-children="Active All Widgets"
          un-checked-children="Disable All Widgets"
          @change="(__checked) => handleDisableAllWidget(__checked as boolean)"
        />
      </div>

      <Select
        :disabled="themeListState.isLoading"
        :loading="themeListState.isLoading"
        :options="themeListState.themeList"
        :value="themeListState.currenThemeId as any"
        class="col-span-3 md:col-span-1"
        show-search
        @change="changeTheme"
      />
    </div>

    <div class="grid grid-cols-12 gap-8 mt-7">
      <Card
        v-for="(item, index) in state.widgetList"
        :key="index"
        class="col-span-12 md:col-span-6 xl:col-span-3 shadow-sm"
      >
        <template #cover>
          <img
            :alt="item.id"
            :src="item.banner_small"
            class="cursor-pointer"
            @click="state.viewSampleImage = item.id"
          />
        </template>

        <ImagePreviewGroup
          :preview="{
            visible: state.viewSampleImage == item.id,
            onVisibleChange: (vis) => (state.viewSampleImage = vis as any),
          }"
        >
          <div class="hidden">
            <Image :previewMask="false" :src="item.banner" fallback="/assets/img/no-image.png" />
          </div>
        </ImagePreviewGroup>

        <div class="!h-full flex flex-col justify-between">
          <div class="flex items-center justify-between space-x-1">
            <span class="text-base font-bold">
              {{ item.name }}
            </span>
            <span class="inline-flex px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded-md">
              {{ getCategoryName(item.category) }}
            </span>
          </div>
          <div class="mt-5 flex items-center justify-between space-x-1">
            <a-button type="primary" @click="goToManagePage(item)"> Manage</a-button>
            <a-button size="small" type="link" @click="state.viewSampleImage = item.id">
              Quick view
            </a-button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<style lang="less" scoped>
  ::v-deep(.ant-card-body) {
    padding: 15px !important;
  }
</style>
