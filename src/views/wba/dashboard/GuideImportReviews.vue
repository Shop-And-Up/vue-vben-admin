<script setup lang="ts">
  import { Card } from 'ant-design-vue';

  import { useRouter } from 'vue-router';
  import { useModal } from '@/components/Modal';
  import { useShopifyAppBridgeStore } from '@/store/modules/shopifyAppBridge';

  import GuideModalCollectReviews from '../reviews/partials/GuideModal.vue';
  import { isShopifyEmbedded } from '@shopify/app-bridge/utilities';

  const router = useRouter();
  const appBridgeStore = useShopifyAppBridgeStore();

  const [registerModal, { openModal }] = useModal();

  const openYoutube = () => {
    appBridgeStore.openRemotePath('https://www.youtube.com/watch?v=pyL6OmKFVpM');
  };
</script>

<template>
  <div>
    <Card class="px-2">
      <div class="flex flex-col space-y-4 mb-3">
        <div class="text-base font-medium mb-2">
          Collect product reviews

          <a-button
            preIcon="material-symbols:slow-motion-video"
            size="small"
            type="link"
            @click="openYoutube"
          >
            Video - Scraper Tool
          </a-button>
        </div>
        <div class="btn-group">
          <a-button class="flex-grow" @click="router.push({ name: 'ReviewPage' })" type="dashed">
            Go to reviews page
          </a-button>
          <a-button
            preIcon="ant-design:export"
            class="flex-grow"
            @click="router.push({ name: 'ViewFullscreen' })"
            type="primary"
            v-if="isShopifyEmbedded()"
          >
            View fullscreen
          </a-button>
          <a-button
            postIcon="ant-design:question-circle-outlined"
            iconSize="14"
            class="!w-100px flex-shrink-0"
            type="primary"
            @click="openModal(true, { tab: 'bookmarklet' })"
          >
            Guide
          </a-button>
        </div>
      </div>
    </Card>
    <GuideModalCollectReviews @register="registerModal" />
  </div>
</template>

<style lang="less" scoped>
  .btn-group {
    @apply flex items-center space-x-3 w-full;
  }
</style>
