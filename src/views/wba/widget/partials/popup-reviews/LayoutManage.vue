<script lang="ts" setup>
  import { Affix, Card, Switch } from 'ant-design-vue';
  import { useField, useFormValues } from 'vee-validate';
  import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue';

  import Icon from '@/components/Icon/Icon.vue';
  import { PopupReviewsWidget } from '@coreThemeExt';

  import FieldReview from '../carousel-reviews/FieldReview.vue';
  import FieldDesign from './FieldDesign.vue';

  const formValue = useFormValues();
  const { value: position } = useField('setting.position');
  const tabMenu = [
    {
      key: 'layout',
      tab: 'Layout',
      icon: 'ant-design:highlight-outlined',
      component: FieldDesign,
      disabled: false,
    },
    {
      key: 'reviews',
      tab: 'Data',
      icon: 'ant-design:database-twotone',
      component: FieldReview,
      disabled: false,
    },
  ];

  const referenceAfixx = ref();

  const state = reactive({
    currentTab: 'layout',
  });

  onBeforeMount(() => {
    handleToggleShow(formValue.value.is_show);
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

  const handleToggleShow = (val: boolean) => {
    formValue.value.is_show = val;

    // Update tab: disable
    state.currentTab = val ? 'layout' : '';
    tabMenu.forEach((c) => (c.disabled = !val));
  };
</script>

<template>
  <div class="grid grid-cols-2 gap-4 w-full">
    <div class="col-span-2 md:col-span-1">
      <Card
        :active-tab-key="state.currentTab"
        :tab-list="tabMenu"
        @tab-change="(val) => (state.currentTab = val)"
      >
        <template #title>
          <div class="flex items-center justify-between h-30px">
            <div class="text-base font-bold">Setting</div>
            <Switch
              :checked="formValue.is_show"
              checked-children="Show"
              un-checked-children="Hide"
              @change="handleToggleShow"
            />
          </div>
        </template>
        <template #customTab="item">
          <Icon :icon="item.icon" />
          <span class="text-sm">{{ item.tab }}</span>
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
          <div class="preview">
            <PopupReviewsWidget
              v-if="formValue.is_show"
              :style="{
                left: position == 'left' ? 0 : 'auto',
                right: position == 'right' ? 0 : 'auto',
              }"
              class="pr-container"
              v-bind="{
                setting: formValue.setting,
                customSetting: formValue.custom_setting,
                previewMode: true,
              }"
            />
          </div>
        </Card>
      </Affix>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .preview {
    @apply min-h-600px rounded relative;

    background-image: url('/assets/img/widget-banners/sample_background.png');
    background-repeat: no-repeat;
    background-size: cover;

    .pr-container {
      @apply absolute bottom-0;
    }
  }
</style>
