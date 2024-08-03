<script lang="ts" setup>
  import { computed, onBeforeMount, reactive } from 'vue';
  import { useFormValues } from 'vee-validate';
  import { Card, Switch } from 'ant-design-vue';

  import { useUserStore } from '@/store/modules/user';
  import { TrustBadgeWidget } from '@coreThemeExt';
  import Icon from '@/components/Icon/Icon.vue';

  import FieldDesign from './FieldDesign.vue';
  import FieldPayment from './FieldPayment.vue';
  import FieldBadge from './FieldBadge.vue';
  import FullPreviewModal from '@/views/wba/widget/partials/FullPreviewModal.vue';
  import FormEmbeddedCode from '@/views/wba/widget/partials/FormEmbeddedCode.vue';

  import { useManageWidgetStore } from '@/views/wba/widget/useManageWidgetStore';
  import { useModal } from '@/components/Modal';

  const userStore = useUserStore();
  const fValue = useFormValues();
  const mngWgStore = useManageWidgetStore();

  const [registerModal, { openModal }] = useModal();

  const tabMenu = [
    {
      key: 'template',
      tab: 'Layout',
      icon: 'ant-design:highlight-outlined',
      disabled: false,
      isShow: true,
      component: FieldDesign,
    },
    {
      key: 'payment',
      tab: 'Payment',
      icon: 'ant-design:credit-card-outlined',
      disabled: false,
      isShow: true,
      component: FieldPayment,
    },
    {
      key: 'badges',
      tab: 'Badges',
      icon: 'ant-design:deployment-unit-outlined',
      disabled: false,
      isShow: true,
      component: FieldBadge,
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
    currentTab: 'template',
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
    state.currentTab = useDefault ? '' : 'template';
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

        <div v-for="item in tabMenu" :key="item.key">
          <div v-show="item.key === state.currentTab">
            <component :is="item.component" />
          </div>
        </div>
      </Card>
    </div>
    <div class="col-span-2 md:col-span-1">
      <Card>
        <a-button block type="dashed" @click="openModal"> Full preview</a-button>

        <div class="p-4">
          <TrustBadgeWidget
            v-bind="{
              uuid: fValue.block_id,
              setting: setting,
              customSetting: customSetting,
              quotaVisibleLogo: userStore.getQuotaLogo,
            }"
          />
        </div>

        <a-button block type="dashed" @click="openModal"> Full preview</a-button>
      </Card>
    </div>
  </div>

  <FullPreviewModal @register="registerModal">
    <TrustBadgeWidget
      v-bind="{
        uuid: fValue.block_id + '-preview',
        setting: setting,
        customSetting: customSetting,
        quotaVisibleLogo: userStore.getQuotaLogo,
      }"
    />
  </FullPreviewModal>
</template>
