<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';

  const [register, { redoModalHeight }] = useModalInner(initData);

  function initData() {
    setTimeout(() => {
      redoModalHeight();
    }, 2000);
  }
</script>

<template>
  <BasicModal
    :canFullscreen="true"
    :defaultFullscreen="true"
    :draggable="false"
    :footer="null"
    title="Full preview"
    v-bind="$attrs"
    width="100%"
    @register="register"
  >
    <div class="px-8 flex justify-center items-center">
      <slot></slot>
    </div>
  </BasicModal>
</template>
