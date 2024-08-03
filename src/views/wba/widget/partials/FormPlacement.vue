<script lang="ts" setup>
  import { computed, onMounted, reactive } from 'vue';
  import { useFormValues } from 'vee-validate';
  import { Card, Radio, Select } from 'ant-design-vue';

  import { useModal } from '@/components/Modal';
  import { useUserStore } from '@/store/modules/user';
  import { themeChange, themeLists, themePages } from '@/api/wba/theme';
  import UseEmbedCodeGuide from './modals/UseEmbedCodeGuide.vue';
  import UseAppBlockWidgetGuide from './modals/UseAppBlockWidgetGuide.vue';
  import ChangePageModal from './modals/ChangePageModal.vue';
  import { createType } from '@/views/wba/widget/service';
  import { useManageWidgetStore } from '@/views/wba/widget/useManageWidgetStore';

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const userStore = useUserStore();
  const formValues = useFormValues();
  const mngWgStore = useManageWidgetStore();
  const [regUseEmbedModal, { openModal: openUseEmbedModal }] = useModal();
  const [regUseShopifyModal, { openModal: openUseShopifyModal }] = useModal();
  const [regUseChangePageModal, { openModal: openChangePageModal }] = useModal();

  const state = reactive({
    createType: createType.AppBlock,
    currenThemeId: <any>null,
    themeList: [],
    loading: true,
    pages: [],
  });

  onMounted(() => {
    state.currenThemeId = userStore.userInfo?.theme_id;
    formValues.value.theme_id = state.currenThemeId;

    // Init data
    reloadThemeList();

    // Load theme page để parse page name
    themePages(state.currenThemeId).then((res) => {
      state.loading = false;
      state.pages = res.templates.map((item) => {
        return {
          value: item.key,
          label: item.name + ' page',
        };
      });

      // Set page mặc định là home page
      if (!formValues.value.page_type && state.pages.length) {
        const homePage = state.pages.find((c) => c.value == 'index' || c.value == 'product');
        if (homePage) {
          formValues.value.page_type = homePage.value;
        }
      }

      state.pages.push({
        value: null,
        label: 'Embed Code (Manually)',
      });
    });
  });

  const reloadThemeList = () => {
    themeLists().then((res) => {
      state.themeList = res.themes.map((c) => {
        return {
          value: c.id,
          label: c.name + ' theme',
        };
      });
      state.currenThemeId = res.current_theme_id;
    });
  };

  const changeTheme = (themeId: any) => {
    state.loading = true;
    state.currenThemeId = themeId;
    formValues.value.theme_id = themeId;
    formValues.value.position = [];

    themeChange(themeId).then(() => {
      // Reload shop info
      userStore.validUserInfoAction();

      state.loading = false;
    });
  };

  const pageName = computed(() => {
    const homePage = state.pages.find((c) => c.value == formValues.value.page_type);
    return homePage ? homePage.label : '';
  });

  const changePageHandle = (pageType, _, struct) => {
    formValues.value.page_type = pageType;
    formValues.value.position = struct;
  };

  const changeCreateType = (event: any) => {
    const typeVal = event.target.value;

    mngWgStore.hideSaveBtn = typeVal == createType.ShopifyEditor;

    switch (typeVal) {
      case createType.EmbeddedCode:
        formValues.value.page_type = null;
        formValues.value.position = [];
        break;

      case createType.AppBlock:
      default:
        formValues.value.page_type = 'index';
        formValues.value.position = [];
        break;
    }
  };
</script>

<template>
  <Card :loading="state.loading" class="px-2 min-h-230px">
    <div class="flex flex-col items-center justify-center space-y-2">
      <div class="font-bold text-base mb-2"> There are 3 ways to create a widget</div>
      <RadioGroup
        v-model:value="state.createType"
        button-style="solid"
        class="!mb-4"
        @change="changeCreateType"
      >
        <RadioButton :value="createType.AppBlock" class="w-200px text-center">
          1. Drag & Drop
        </RadioButton>
        <RadioButton :value="createType.EmbeddedCode" class="w-200px text-center">
          2. Embed code manually
        </RadioButton>
        <RadioButton :value="createType.ShopifyEditor" class="w-200px text-center">
          3. Shopify Theme Editor
        </RadioButton>
      </RadioGroup>

      <!-- Drag and Drop Option -->
      <template v-if="state.createType == createType.AppBlock">
        <div class="text-gray-500 mt-4 mb-3">
          Please select page and position to place the widget. You can change the position later.
        </div>
        <div class="text-gray-500 text-xs mt-2 mb-3">
          After creating, this widget will be <strong> synchronized automatically </strong> with
          Shopify Theme Editor.
        </div>
        <div class="flex items-center justify-center">
          <Select
            :disabled="state.loading"
            :options="state.themeList"
            :value="state.currenThemeId"
            class="!w-200px"
            show-search
            size="small"
            @change="changeTheme"
          />

          <span class="mx-2"> | </span>
          <span> {{ pageName }} </span>
          <span class="mx-2"> | </span>

          <a-button
            preIcon="bx:edit"
            size="small"
            type="primary"
            @click="openChangePageModal(true, {})"
          >
            Set position
          </a-button>
        </div>
      </template>

      <template v-else-if="state.createType == createType.EmbeddedCode">
        <div class="text-gray-500 mt-4 mb-2">
          Embedded code will
          <strong>be generated after creating</strong>.
          <a-button size="small" type="link" @click="openUseEmbedModal(true, {})">
            How to use?
          </a-button>
        </div>
      </template>

      <template v-else>
        <div class="text-gray-500 mt-4 mb-2">
          Widget will be created from the <strong> Shopify Theme Editor </strong> directly.
        </div>

        <div class="flex items-center justify-center">
          <a-button
            preIcon="ant-design:export"
            size="small"
            type="primary"
            @click="userStore.goToThemeEditor(null, false)"
          >
            Redirect to Shopify Theme Editor
          </a-button>

          <a-button size="small" type="link" @click="openUseShopifyModal(true, {})">
            How to use?
          </a-button>
        </div>
      </template>
    </div>

    <UseEmbedCodeGuide @register="regUseEmbedModal" />
    <UseAppBlockWidgetGuide @register="regUseShopifyModal" />
    <ChangePageModal
      @register="regUseChangePageModal"
      @selected="changePageHandle"
      :widget="formValues"
    />
  </Card>
</template>
