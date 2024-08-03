<script setup lang="ts">
  import { Card } from 'ant-design-vue';

  import { useUserStore } from '@/store/modules/user';
  import { useModal } from '@/components/Modal';
  import GuideAppBlockAndEmbed from '../widget/partials/modals/GuideAppBlockAndEmbed.vue';

  const [registerModal, { openModal }] = useModal();
  const userStore = useUserStore();
</script>

<template>
  <div>
    <Card class="px-2">
      <div class="flex flex-col space-y-4 mb-3">
        <div class="text-base font-medium mb-2"> Customize widgets from Shopify </div>
        <div class="btn-group">
          <a-button
            preIcon="ant-design:export"
            class="flex-grow"
            @click="userStore.goToThemeCodeEditor"
            type="dashed"
          >
            Code Editor
          </a-button>
          <a-button
            preIcon="ant-design:export"
            class="flex-grow"
            @click="userStore.goToThemeEditor()"
            type="dashed"
          >
            Theme Editor
          </a-button>
          <a-button
            postIcon="ant-design:question-circle-outlined"
            iconSize="14"
            class="!w-100px flex-shrink-0"
            type="primary"
            @click="openModal(true, {})"
          >
            Guide
          </a-button>
        </div>
      </div>
    </Card>
    <GuideAppBlockAndEmbed @register="registerModal" />
  </div>
</template>

<style lang="less" scoped>
  .btn-group {
    @apply flex items-center space-x-3 w-full;
  }
</style>
