<script lang="ts" setup>
  import { computed, reactive } from 'vue';

  import { BasicModal, useModalInner } from '@/components/Modal';

  const emit = defineEmits(['submit', 'cancel']);

  const [register, { closeModal }] = useModalInner();

  const state = reactive<any>({
    couponCode: null,
  });

  const handleSubmit = () => {
    emit('submit', state.couponCode);
    closeModal();
  };

  const handleCancel = () => {
    emit('cancel');
    closeModal();
  };

  const okText = computed(() => {
    if (state.couponCode) {
      return 'Apply Coupon Code for Discounted Charges';
    }

    return 'Payment without Coupon Code';
  });
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    title="&#128525; Stretch Your Free Trial Duration to 14 Days or Beyond &#127881;"
    :draggable="false"
    :min-height="60"
    :height="0"
    :canFullscreen="false"
    :ok-text="okText"
    @register="register"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <div class="m-8">
      <a-input
        class="coupon-code text-center"
        v-model:value="state.couponCode"
        addon-before="Coupon Code"
        size="large"
      />
    </div>
  </BasicModal>
</template>

<style lang="less">
  .coupon-code {
    input {
      @apply uppercase !content-center !text-center;
    }
  }
</style>
