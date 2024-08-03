<script setup lang="ts">
  import { Alert } from 'ant-design-vue';

  import { disableShopifyAlertApi } from '@/api/wba/system';
  import Icon from '@/components/Icon/Icon.vue';
  import { CrispOpenWithText } from '@/plugins/crisp';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  const onCloseAlert = () => {
    disableShopifyAlertApi().then(() => {
      // Reload shop info
      userStore.validUserInfoAction();
    });
  };

  const handleContactUs = () => {
    CrispOpenWithText('Hi!');
  };
</script>

<template>
  <Alert
    v-if="userStore.getUserInfo.shopify_alert"
    type="warning"
    show-icon
    closable
    @close="onCloseAlert"
  >
    <template #message>
      <strong> Shopify Storefront Updating </strong>
    </template>
    <template #description>
      <p>
        Starting from
        <a
          class="font-medium text-blue-500"
          href="https://www.shopify.com/partners/blog/shopify-storefronts-have-gotten-more-than-30-faster"
          target="_blank"
        >
          Jul 26, 2023 </a
        >, Shopify will be enhancing storefront performance. As a result, there might be a slight
        delay of a few seconds in reflecting changes to your store after adjusting or creating
        widget settings. If you require any assistance with setting up widgets, please don't
        hesitate to <a @click="handleContactUs" class="text-blue-600"> reach out to us.</a>
      </p>
    </template>
    <template #icon><Icon icon="fa-brands:shopify" size="46" /></template>
  </Alert>
</template>
