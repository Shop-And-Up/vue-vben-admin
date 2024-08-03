<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import UseAppBlockWidget from './UseAppBlockWidget.vue';

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
    title="Customize with Shopify Editor - App Blocks"
    @register="register"
    width="700px"
  >
    <UseAppBlockWidget class="mx-5" />
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
