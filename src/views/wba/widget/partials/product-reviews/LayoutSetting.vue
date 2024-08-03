<script lang="ts" setup>
  import { Card, Switch } from 'ant-design-vue';
  import { useFormValues } from 'vee-validate';
  import { computed, onBeforeMount, reactive } from 'vue';

  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { useUserStore } from '@/store/modules/user';
  import { ProductReviewsWidget } from '@coreThemeExt';

  import FullPreviewModal from '@/views/wba/widget/partials/FullPreviewModal.vue';
  import FieldDesign from '@/views/wba/widget/partials/product-reviews/FieldDesign.vue';
  import FieldTranslate from '@/views/wba/widget/partials/product-reviews/FieldTranslate.vue';
  import FormEmbeddedCode from '../FormEmbeddedCode.vue';

  import { useManageWidgetStore } from '@/views/wba/widget/useManageWidgetStore';

  const userStore = useUserStore();
  const fValue = useFormValues();
  const mngWgStore = useManageWidgetStore();

  const [registerModal, { openModal }] = useModal();

  const tabMenu = [
    {
      key: 'layout',
      tab: 'Design',
      icon: 'ant-design:highlight-outlined',
      disabled: false,
      isShow: true,
      component: FieldDesign,
    },
    {
      key: 'translate',
      tab: 'Language',
      icon: 'ion:language',
      disabled: false,
      isShow: mngWgStore.isDefaultWidget,
      component: FieldTranslate,
    },
    {
      key: 'embedded-code',
      tab: 'Embedded Code',
      icon: 'ph:file-code-duotone',
      disabled: false,
      isShow: mngWgStore.isDefaultWidget,
      component: FormEmbeddedCode,
    },
  ];

  const state = reactive({
    currentTab: tabMenu[0].key,
  });

  onBeforeMount(() => {
    changeUseDefaultSetting(fValue.value.use_default_widget_setting);
  });

  const changeUseDefaultSetting = (useDefault: boolean) => {
    if (mngWgStore.isDefaultWidget) {
      return;
    }

    fValue.value.use_default_widget_setting = useDefault;

    // Update tab: disable
    state.currentTab = useDefault ? '' : tabMenu[0].key;
    tabMenu.forEach((c) => (c.disabled = useDefault));
  };

  const setting = computed(() => {
    if (mngWgStore.isDefaultWidget || !fValue.value.use_default_widget_setting) {
      return fValue.value.setting;
    }

    return mngWgStore.defaultWidget.setting;
  });

  const customSetting = computed(() => {
    if (mngWgStore.isDefaultWidget || !fValue.value.use_default_widget_setting) {
      return fValue.value.custom_setting;
    }

    return mngWgStore.defaultWidget.custom_setting;
  });

  // Make compute for language field
  const language = computed(() => {
    if (mngWgStore.isDefaultWidget) {
      return fValue.value.language;
    }

    return mngWgStore.defaultWidget.language;
  });
</script>

<template>
  <div class="col-span-2 grid grid-cols-2 gap-4">
    <div class="col-span-2 md:col-span-1">
      <Card
        :active-tab-key="state.currentTab"
        :tab-list="tabMenu"
        @tab-change="(val) => (state.currentTab = val)"
      >
        <template #title>
          <template v-if="mngWgStore.isDefaultWidget">
            <div class="text-base font-bold">Default Setting</div>
            <div class="text-sm text-gray-500"> Configure and save your widget.</div>
          </template>
          <div v-else class="flex items-center justify-between h-30px">
            <div class="text-base font-bold">Setting</div>
            <Switch
              :checked="fValue.use_default_widget_setting"
              checked-children="Use Default"
              un-checked-children="Use Custom"
              @change="changeUseDefaultSetting"
            />
          </div>
        </template>

        <template #customTab="item">
          <div v-show="item.isShow">
            <Icon :icon="item.icon" />
            <span class="text-sm">{{ item.tab }}</span>
          </div>
        </template>

        <div>
          <div v-for="item in tabMenu" :key="item.key">
            <div v-show="item.key === state.currentTab">
              <component :is="item.component" />
            </div>
          </div>
        </div>
      </Card>
    </div>
    <div class="col-span-2 md:col-span-1">
      <Card>
        <a-button block class="mb-5" type="dashed" @click="openModal"> Full preview </a-button>
        <div class="p-4">
          <ProductReviewsWidget
            v-bind="{
              uuid: fValue.block_id,
              shopifyDomain: userStore.getUserInfo.myshopify_domain,
              setting: setting,
              customSetting: customSetting,
              language: language,
              quotaVisibleLogo: userStore.getQuotaLogo,
              previewMode: true,
            }"
          />
        </div>
        <a-button block class="mt-5" type="dashed" @click="openModal"> Full preview </a-button>
      </Card>
    </div>

    <FullPreviewModal @register="registerModal">
      <ProductReviewsWidget
        v-bind="{
          uuid: fValue.block_id + '-preview',
          shopifyDomain: userStore.getUserInfo.myshopify_domain,
          setting: setting,
          customSetting: customSetting,
          language: language,
          quotaVisibleLogo: userStore.getQuotaLogo,
          previewMode: true,
          canShowModal: false,
        }"
      />
    </FullPreviewModal>
  </div>
</template>
