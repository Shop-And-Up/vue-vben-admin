<script lang="ts">
  import { defineComponent } from 'vue';
  import { useShopifyAppBridgeStore } from '@/store/modules/shopifyAppBridge';
  import { useUserStore } from '@/store/modules/user';

  export default defineComponent({
    beforeRouteEnter(_, from) {
      const appBridgeStore = useShopifyAppBridgeStore();
      const userStore = useUserStore();
      const token = userStore.getToken;
      let host = window.location.protocol + '//' + window.location.host + from.fullPath;

      if (host.indexOf('?') >= 0) {
        host += '&';
      } else {
        host += '?';
      }

      host += 'token=' + token;
      appBridgeStore.openRemotePath(host, false);
    },
  });
</script>

<template>
  <div></div>
</template>

<style lang="less" scoped></style>
