<script lang="ts" setup>
  import { Affix, Card, Switch } from 'ant-design-vue';
  import { useFormValues } from 'vee-validate';
  import { computed, onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue';

  import Icon from '@/components/Icon/Icon.vue';
  import { useUserStore } from '@/store/modules/user';
  import { RatingReviewsWidget } from '@coreThemeExt';

  import FormEmbeddedCode from '@/views/wba/widget/partials/FormEmbeddedCode.vue';
  import FieldDesign from './FieldDesign.vue';

  import { useManageWidgetStore } from '@/views/wba/widget/useManageWidgetStore';

  const userStore = useUserStore();
  const fValue = useFormValues();
  const mngWgStore = useManageWidgetStore();

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
      key: 'embedded-code',
      tab: 'Embedded Code',
      icon: 'ph:file-code-duotone',
      disabled: false,
      isShow: mngWgStore.isDefaultWidget,
      component: FormEmbeddedCode,
    },
  ];

  const referenceAfixx = ref();

  const state = reactive({
    currentTab: tabMenu[0].key,
  });

  onBeforeMount(() => {
    changeUseDefaultSetting(fValue.value.use_default_widget_setting);
  });

  onMounted(() => {
    window.addEventListener('scroll', handleScrollEvent, true);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScrollEvent, true);
  });

  const handleScrollEvent = () => {
    referenceAfixx.value.updatePosition();
  };

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
          <div v-else class="flex items-center justify-between h-45px">
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
      <Affix :offset-top="16" ref="referenceAfixx">
        <Card>
          <template #title>
            <div class="text-base font-bold h-45px">Preview</div>
          </template>
          <div class="p-4">
            <RatingReviewsWidget
              v-bind="{
                uuid: fValue.block_id,
                shopifyDomain: userStore.getUserInfo.myshopify_domain,

                setting,
                customSetting,

                totalReviews: 89,
                averageRate: 4.5,
              }"
            />
          </div>
        </Card>
      </Affix>
    </div>
  </div>
</template>
