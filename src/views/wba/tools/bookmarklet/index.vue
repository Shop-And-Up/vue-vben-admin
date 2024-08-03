<script setup lang="ts">
  import { Card, Col, Row, Tooltip } from 'ant-design-vue';
  import { computed } from 'vue';

  import { useShopifyAppBridgeStore } from '@/store/modules/shopifyAppBridge';
  import { useUserStore } from '@/store/modules/user';
  import { bookmarkletName, bookmarkletScript } from '@/views/wba/bookmarklet-utils';
  import { ECommercePlatform } from '../../widget-config';

  const userStore = useUserStore();
  const appBridgeStore = useShopifyAppBridgeStore();

  const btnLink = computed(() => {
    return bookmarkletScript
      .replace('__WBA_SHOP_ID__', userStore.getUserInfo.uuid!)
      .replace('__BOOKMARKLET_URL__', import.meta.env.VITE_GLOB_BOOKMARKLET_URL);
  });

  const sampleProducts = [
    {
      name: ECommercePlatform.Amazon,
      url: 'https://www.amazon.com/Nintendo-Classic-T-Shirt-Premium-Heather/dp/B06Y27V6TL',
      icon: '/assets/img/bookmarklet/amazon.png',
    },
    {
      name: ECommercePlatform.AliExpress,
      url: 'https://aliexpress.com/item/1005003521196147.html',
      icon: '/assets/img/bookmarklet/aliexpress.png',
    },
    {
      name: ECommercePlatform.Etsy,
      url: 'https://www.etsy.com/listing/733759013',
      icon: '/assets/img/bookmarklet/etsy.png',
    },
  ];
</script>

<template>
  <div class="p-4">
    <h1 class="text-lg font-bold"> Scrape Reviews Tool </h1>
    <h5 class="text-xs text-gray-500 mb-5">
      Scraping all reviews from AliExpress, Etsy and Amazon website.
    </h5>

    <Row :gutter="[16, 16]">
      <Col :span="24" :md="12">
        <Card class="shadow-sm">
          <template #title> Step 1 - Add scraper button to bookmark bar </template>

          <ul class="list-decimal list-inside">
            <li>
              Show your bookmark bar

              <ul class="sub-list">
                <li>
                  <code>Ctrl (⌘ on Mac) + Shift + B </code> on Chrome, Safari, Opera, Internet
                  Explorer, Firefox (New version)
                </li>
                <li> <code>Ctrl (⌘ on Mac) + B </code> on Firefox (Old version)</li>
              </ul>
            </li>
            <li>
              Drag and drop this button to your browser bookmark toolbar.

              <div class="ml-9 mt-2">
                <a
                  class="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded"
                  :href="btnLink"
                >
                  {{ bookmarkletName }} ⭐ Auto scrape reviews
                </a>
              </div>
            </li>
            <li class="!mb-0">
              Please <span class="text-red-600 font-bold">DO NOT SHARE</span> your button with
              others or install it on a public computer.

              <div class="ml-9 mt-2">
                <a-button
                  class="!w-350px"
                  type="dashed"
                  @click="
                    appBridgeStore.openRemotePath('https://www.youtube.com/watch?v=pyL6OmKFVpM')
                  "
                  preIcon="material-symbols:slow-motion-video"
                >
                  Video - Scraper Tool
                </a-button>
              </div>
            </li>
          </ul>
        </Card>
      </Col>
      <Col :span="24" :md="12">
        <div class="img-guide">
          <img src="/assets/img/bookmarklet/step-1.gif" />
        </div>
      </Col>
      <Col :span="24" :md="12">
        <Card class="shadow-sm">
          <template #title>
            Step 2 - Import review from Amazon, Etsy or AliExpress product page
          </template>

          <p>
            Go to Amazon, Etsy or AliExpress product page and click
            <code> {{ bookmarkletName }} </code> at the bookmark toolbar.
          </p>

          <div class="flex justify-around items-center mt-5">
            <Tooltip
              v-for="item in sampleProducts"
              :key="item.name"
              placement="top"
              :title="`Go to ${item.name} product page`"
            >
              <div
                class="flex justify-center items-center space-x-2 cursor-pointer"
                @click="appBridgeStore.openRemotePath(item.url)"
              >
                <img :src="item.icon" class="object-cover h-10 w-10 rounded-md" />
                <div class="font-medium text-blue-500 text-lg">
                  {{ item.name }}
                </div>
              </div>
            </Tooltip>
          </div>
        </Card>
      </Col>
      <Col :span="24" :md="12">
        <div class="img-guide">
          <img src="/assets/img/bookmarklet/step-2.gif" />
        </div>
      </Col>
    </Row>
  </div>
</template>

<style lang="less" scoped>
  code {
    @apply bg-light-400 text-red-600 py-1 px-2 rounded;
  }

  ul.sub-list {
    @apply list-circle list-inside ml-4 !text-xs leading-5;

    li {
      @apply my-1;
    }
  }

  li {
    @apply mb-10;
  }

  .img-guide {
    @apply flex items-center justify-center;

    img {
      @apply w-full !max-w-500px rounded border-solid border border-light-500;
    }
  }
</style>
