<script setup lang="ts">
  import { SvgIcon } from '@/components/Icon';
  import { useModal } from '@/components/Modal';
  import { CrispOpenWithText } from '@/plugins/crisp';
  import FormRatingUsModal from './FormRatingUsModal.vue';

  const [registerModal, { openModal }] = useModal();

  const handleContactUs = () => {
    CrispOpenWithText(
      "Hi! I'd like to upgrade to a one-month PRO plan. Please check my screenshot rating.",
    );
  };
</script>

<template>
  <div class="unlock">
    <div class="icon">
      <SvgIcon size="42" name="app-unlock" />
    </div>
    <div class="contain">
      <div class="title">Get FREE PRO plan 🎉 🚀 </div>
      <div class="message">
        Please rate us on the Shopify App Store, then
        <span class="font-bold">take a screenshot and send it</span> to Crisp Chat to receive a free
        one-month upgrade to PRO plan.
      </div>
    </div>

    <a-button
      type="primary"
      @click="openModal(true, {})"
      target="_blank"
      class="!w-120px"
      preIcon="ant-design:star-filled"
    >
      Rating us
    </a-button>

    <a-button type="primary" @click="handleContactUs" class="!w-120px"> Contact us </a-button>

    <FormRatingUsModal @register="registerModal" />
  </div>
</template>

<style lang="less" scoped>
  .unlock {
    @apply flex items-center space-x-3 p-25px border rounded border-solid border-yellow-300 bg-yellow-50;

    .contain {
      @apply flex-1;

      .title {
        @apply font-semibold;
      }

      .message {
        @apply text-xs text-gray-500 mt-2;
      }
    }
  }
</style>
