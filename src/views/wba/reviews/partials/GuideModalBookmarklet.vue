<script setup lang="ts">
  import { computed } from 'vue';

  import { bookmarkletName, bookmarkletScript } from '@/views/wba/bookmarklet-utils';
  import { useShopifyAppBridgeStoreWithOut } from '@/store/modules/shopifyAppBridge';
  import { useUserStore } from '@/store/modules/user';

  const appBridgeStore = useShopifyAppBridgeStoreWithOut();
  const userStore = useUserStore();

  const btnLink = computed(() => {
    return bookmarkletScript
      .replace('__WBA_SHOP_ID__', userStore.getUserInfo.uuid!)
      .replace('__BOOKMARKLET_URL__', import.meta.env.VITE_GLOB_BOOKMARKLET_URL);
  });
  const redirectYoutube = () => {
    appBridgeStore.openRemotePath('https://www.youtube.com/watch?v=pyL6OmKFVpM');
  };
</script>

<template>
  <div>
    <div>
      Scraper Tool will help you scrape all the reviews from AliExpress, Etsy and Amazon websites.
    </div>

    <div class="flex items-center justify-center my-4 space-x-4">
      <a class="bg-primary hover:bg-blue-700 text-white py-5px px-4 rounded" :href="btnLink">
        {{ bookmarkletName }} ⭐ Auto scrape reviews
      </a>

      <a-button
        @click="redirectYoutube()"
        type="dashed"
        preIcon="material-symbols:slow-motion-video"
      >
        Video - Scraper Tool
      </a-button>
    </div>

    <div class="flex flex-col">
      <div class="title">
        1. Go to
        <router-link class="font-bold mx-1 text-blue-500" :to="{ name: 'Bookmarklet' }">
          Scraper Tool
        </router-link>

        page and add <span class="font-bold text-red-500 mx-1">{{ bookmarkletName }}</span> button
        to the bookmark bar.
      </div>
      <div class="flex justify-center">
        <img
          src="/assets/img/bookmarklet/step-1.gif"
          class="rounded w-full max-w-500px border-solid border border-light-500"
        />
      </div>

      <div class="title">
        2. Go to Amazon, Etsy or AliExpress product page and click
        <span class="font-bold text-red-500 mx-1"> {{ bookmarkletName }} </span> at the bookmark
        toolbar to scrape and import reviews.
      </div>
      <div class="flex justify-center">
        <img
          src="/assets/img/bookmarklet/step-2.gif"
          class="rounded w-full max-w-500px border-solid border border-light-500"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .title {
    @apply mb-2;
  }

  img {
    @apply mb-5;
  }
</style>
