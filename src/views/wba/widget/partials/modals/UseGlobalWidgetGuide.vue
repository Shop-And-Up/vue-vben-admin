<script lang="ts" setup>
  import UseGlobalWidget from './UseGlobalWidget.vue';
  import { BasicModal, useModalInner } from '@/components/Modal';

  defineProps({
    widgetType: { type: String, default: 'wba-apps' },
  });

  const [register, { redoModalHeight }] = useModalInner(() => {
    redoModalHeight();

    setTimeout(() => {
      redoModalHeight();
    }, 1000);
  });
</script>

<template>
  <BasicModal
    :canFullscreen="false"
    :draggable="false"
    :footer="null"
    v-bind="$attrs"
    title="Customize with Shopify Editor - Embedded App"
    @register="register"
    width="700px"
  >
    <UseGlobalWidget :widgetType="widgetType" class="mx-5" />
  </BasicModal>
</template>

<style lang="less" scoped>
  ul {
    li {
      @apply mt-7;

      span.link {
        @apply text-blue-600 cursor-pointer;
      }
    }
  }
</style>
