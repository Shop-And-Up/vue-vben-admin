<script setup lang="ts">
  import { computed, onMounted, onUnmounted, reactive, ref, unref } from 'vue';
  import { Dropdown, Menu, MenuItem, Tooltip } from 'ant-design-vue';
  import { Channel } from 'pusher-js';
  import { debounce } from 'lodash-es';
  import { useRouter } from 'vue-router';

  import { generateImage } from '@coreThemeExt';
  import { bookmarkletName, bookmarkletScript } from '@/views/wba/bookmarklet-utils';
  import { useShopifyAppBridgeStore } from '@/store/modules/shopifyAppBridge';
  import { BasicTable, TableAction } from '@/components/Table';
  import { Time } from '@/components/Time';
  import Icon from '@/components/Icon/Icon.vue';
  import {
    productDeleteAPI,
    productDeleteReviewsAPI,
    productRecalcRatingAPI,
    productSyncAPI,
  } from '@/api/wba/products';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useProductTable } from './tableConfig';
  import { useModal } from '@/components/Modal';
  import { ModalCloneReview, ModalScraper } from './partials';
  import PusherService from '@/plugins/pusher';
  import GuideModal from '@/views/wba/reviews/partials/GuideModal.vue';
  import { useUserStore } from '@/store/modules/user';
  import { ECommercePlatform, youtubeGuideLink } from '@/views/wba/widget-config';

  const isLoading = ref(false);
  const isSyncing = ref(false);
  const searchInfo = reactive<Recordable>({});

  const appBridgeStore = useShopifyAppBridgeStore();

  const [registerTable, { reload, getRawDataSource }] = useProductTable();
  const [registerModalCloneReview, { openModal: openModalCloneReviews }] = useModal();
  const [registerModalScraper, { openModal: openModalScraper }] = useModal();
  const [registerGuideBookmarkletModal, { openModal: openGuideBookmarkletModal }] = useModal();

  const { createMessage } = useMessage();
  const router = useRouter();
  const userStore = useUserStore();

  const productRouteQuery = reactive<any>({
    name: unref(router.currentRoute).query.product_name,
  });

  // Handle pusher - sync state
  let syncProductsPs: Channel;

  onMounted(() => {
    if (productRouteQuery.name) {
      handleSearch(productRouteQuery.name);
    }

    syncProductsPs = PusherService.subscribe().bind('sync_all_product', async () => {
      createMessage.success('Products have been synchronized.');
      reload();
    });
  });

  onUnmounted(() => {
    if (syncProductsPs) {
      syncProductsPs.unbind_all().unsubscribe();
    }
  });

  const btnLink = computed(() => {
    return bookmarkletScript
      .replace('__WBA_SHOP_ID__', userStore.getUserInfo.uuid!)
      .replace('__BOOKMARKLET_URL__', import.meta.env.VITE_GLOB_BOOKMARKLET_URL);
  });

  const handleScraper = (record: Recordable, scrapeType: ECommercePlatform) => {
    record.scrape_type = scrapeType;
    openModalScraper(true, record);
  };

  const getProductname = (item: any) => {
    let name = item.name;

    // Max length of product name is 50
    const length = 75;
    if (name.length > length) {
      name = name.substring(0, length) + '...';
    }

    return name;
  };

  const redirectYoutube = () => {
    appBridgeStore.openRemotePath(youtubeGuideLink);
  };

  const redirectProductPage = (record: Recordable) => {
    window.open(record.url, '_blank');
  };

  const redirectGoogleLens = (record: Recordable) => {
    appBridgeStore.openRemotePath('https://lens.google.com/uploadbyurl?url=' + record.image);
  };

  const handleCloneReviews = (record: Recordable) => {
    openModalCloneReviews(true, record);
  };

  const handleViewReviews = (record: Recordable) => {
    router.push({
      name: 'ReviewPage',
      query: {
        product_id: record.id,
        product_name: record.name,
      },
    });
  };

  const handleDeleteProduct = (record: Recordable) => {
    isLoading.value = true;
    productDeleteAPI(record.id).finally(() => {
      isLoading.value = false;
      createMessage.success('Product has been deleted');
      reload();
    });
  };

  const handleRecalc = (record: Recordable) => {
    isLoading.value = true;
    productRecalcRatingAPI(record.id).finally(() => {
      isLoading.value = false;
      createMessage.success('Product has been updated rating');
      reload();
    });
  };

  const handleDeleteReviews = (record: Recordable) => {
    isLoading.value = true;
    productDeleteReviewsAPI(record.id).finally(() => {
      isLoading.value = false;
      createMessage.success('All reviews have been deleted');
      reload();
    });
  };

  const handleSearch = debounce((searchStr) => {
    searchInfo.search_field = 'name';
    searchInfo.search_value = searchStr;
    reload();
  }, 500);

  const handleMoreAction = (e: any) => {
    switch (e.key) {
      case 'sync':
        isSyncing.value = true;
        productSyncAPI();
        break;
      case 'reload':
        isLoading.value = true;
        reload();
        break;
      case 'google-review':
        router.push({ name: 'GoogleReviews' });
        break;
      case 'bookmarklet-guide':
        openGuideBookmarkletModal(true, { tab: 'bookmarklet' });
        break;
    }
  };
</script>

<template>
  <div class="max-w-screen-xl mx-auto gap-4 p-4">
    <div class="flex flex-wrap justify-end mb-4">
      <div class="md:w-auto w-full flex items-center justify-end flex-wrap space-x-2">
        <a-button
          type="dashed"
          @click="redirectYoutube()"
          preIcon="material-symbols:slow-motion-video"
          class="mb-2"
        >
          Review Scraping Guide
        </a-button>

        <Tooltip
          placement="top"
          title="DO NOT CLICK ME! Please drag and drop this button to your browser bookmark toolbar."
        >
          <a
            class="bg-primary hover:bg-blue-700 text-white py-6px mb-2 px-4 rounded"
            :href="btnLink"
          >
            {{ bookmarkletName }} ⭐
          </a>
        </Tooltip>

        <Dropdown>
          <template #overlay>
            <Menu @click="handleMoreAction">
              <MenuItem key="sync" :disabled="isSyncing">
                <Icon icon="ant-design:sync-outlined" :spin="isSyncing" />
                Sync products from Shopify
              </MenuItem>
              <MenuItem key="bookmarklet-guide">
                <Icon icon="ant-design:question-circle-outlined" />
                Tutorial - Search with Google Lens
              </MenuItem>
              <MenuItem key="google-review">
                <Icon icon="flat-color-icons:google" />
                Generate Google product reviews
              </MenuItem>
              <MenuItem key="reload" :disabled="isLoading">
                <Icon :spin="isLoading" icon="ant-design:reload-outlined" />
                Reload data
              </MenuItem>
            </Menu>
          </template>
          <a-button class="w-140px mb-2" type="primary">
            More Actions
            <Icon :size="12" icon="ant-design:down-outlined" />
          </a-button>
        </Dropdown>

        <a-input
          :value="productRouteQuery.name"
          @input="($e) => handleSearch($e.target.value)"
          class="!w-300px mb-2"
          placeholder="Search by name..."
        >
          <template #prefix>
            <Icon :size="16" icon="ant-design:search-outlined" />
          </template>
        </a-input>
      </div>
    </div>
    <BasicTable
      @register="registerTable"
      @fetch-success="isLoading = false"
      :searchInfo="searchInfo"
      Sync
      product
      from
      Shopify
      :loading="isLoading || isSyncing"
      :afterFetch="
        () => {
          isSyncing = getRawDataSource().syncing;
        }
      "
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div class="flex items-center space-x-3">
            <img
              @click="handleViewReviews(record)"
              :src="generateImage(record.image ?? '/assets/img/no-image.png')"
              class="object-cover h-10 w-10 rounded-md cursor-pointer"
            />
            <div class="whitespace-normal text-left">
              {{ getProductname(record) }}
            </div>
          </div>
        </template>
        <template v-else-if="column.key === 'average_rate'">
          <Tooltip
            placement="top"
            :title="
              ' Published: ' +
              record.total_reviews +
              ' | Unpublished: ' +
              record.unpublished_reviews
            "
          >
            <div class="font-medium flex justify-center items-center space-x-2">
              <Icon :size="16" icon="clarity:star-solid" class="!text-yellow-400" />

              <span>{{ record.average_rate }}</span>
            </div>
            <div class="text-xs text-gray-500">
              {{ record.total_reviews }} /
              {{ record.total_reviews + record.unpublished_reviews }} reviews</div
            >
          </Tooltip>
        </template>
        <template v-else-if="column.key === 'updated_at'">
          <Time class="text-xs text-gray-500" mode="date" :value="record.updated_at" />
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :divider="false"
            :actions="[
              {
                icon: 'arcticons:aliexpress',
                tooltip: 'Scrape AliExpress reviews',
                onClick: handleScraper.bind(null, record, ECommercePlatform.AliExpress),
              },
              {
                icon: 'fa-brands:amazon',
                tooltip: 'Scrape Amazon reviews',
                onClick: handleScraper.bind(null, record, ECommercePlatform.Amazon),
              },
              // {
              //   icon: 'solar:star-bold-duotone',
              //   tooltip: 'Generate sample reviews',
              //   onClick: redirectGoogleLens.bind(null, record),
              //   ifShow: () => record.image,
              // },
              {
                icon: 'simple-icons:googlelens',
                tooltip: 'Search with Google Lens',
                onClick: redirectGoogleLens.bind(null, record),
                ifShow: () => record.image,
              },
              {
                icon: 'fa-brands:shopify',
                tooltip: 'Go to product page',
                onClick: redirectProductPage.bind(null, record),
              },
            ]"
            :dropDownActions="[
              {
                icon: 'clarity:star-solid',
                label: 'View all reviews',
                onClick: handleViewReviews.bind(null, record),
              },
              {
                icon: 'clarity:clone-line',
                label: 'Clone reviews',
                onClick: handleCloneReviews.bind(null, record),
              },
              {
                icon: 'carbon:calculation',
                label: 'Recalculate rating',
                onClick: handleRecalc.bind(null, record),
              },
              {
                icon: 'clarity:remove-line',
                label: 'Delete reviews',
                ifShow: () => record.total_reviews || record.unpublished_reviews,
                popConfirm: {
                  title: `Do you want to delete all reviews (published & unpublished) for ${record.name} product?`,
                  okText: 'Yes',
                  confirm: handleDeleteReviews.bind(null, record),
                },
              },
              {
                icon: 'bx:trash',
                label: 'Delete product',
                popConfirm: {
                  title: `Do you want to delete ${record.name} product?`,
                  okText: 'Yes',
                  confirm: handleDeleteProduct.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <GuideModal @register="registerGuideBookmarkletModal" />
    <ModalCloneReview @storaged="reload" @register="registerModalCloneReview" />
    <ModalScraper @completed="reload" @register="registerModalScraper" />
  </div>
</template>
