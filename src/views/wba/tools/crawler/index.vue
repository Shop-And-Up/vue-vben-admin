<script lang="ts" setup>
  import { onMounted, onUnmounted, reactive } from 'vue';
  import { Switch, Tag, Tooltip } from 'ant-design-vue';
  import { Channel } from 'pusher-js';
  import { useRouter } from 'vue-router';

  import PusherService from '@/plugins/pusher';
  import { Time } from '@/components/Time';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { BasicTable, TableAction } from '@/components/Table';
  import { crawlerDeleteAPI, crawlerStore, crawlerSyncAPI } from '@/api/wba/crawler';
  import { useCrawlerTable } from './tableConfig';

  import CreateModal from './partials/CreateModal.vue';
  import Vue3ClampVue from '@coreThemeExt/components/common/Vue3Clamp.vue';
  import FieldSelectProduct from '../../reviews/partials/FieldSelectProduct.vue';
  import { useShopifyAppBridgeStore } from '@/store/modules/shopifyAppBridge';

  const state = reactive<any>({
    searchInfo: {},
  });
  const { notification } = useMessage();
  const [registerCreateModal, { openModal }] = useModal();
  const [registerTable, { reload, setLoading }] = useCrawlerTable();
  const router = useRouter();
  const appBridgeStore = useShopifyAppBridgeStore();

  // Handle pusher - sync state
  let crawlerPs: Channel;
  onMounted(() => {
    crawlerPs = PusherService.subscribe().bind('auto_scrape_reviews', async () => {
      reload();
    });
  });

  onUnmounted(() => {
    if (crawlerPs) {
      crawlerPs.unbind_all().unsubscribe();
    }
  });

  const handleDelete = (record: Recordable) => {
    setLoading(true);

    crawlerDeleteAPI(record.id).finally(() => {
      setLoading(false);
      reload();
    });
  };

  const handleCreate = () => {
    openModal(true, {});
  };

  const handleEdit = (record: Recordable) => {
    openModal(true, record);
  };

  const handleViewReviews = (product: Recordable) => {
    router.push({
      name: 'ReviewPage',
      query: {
        product_id: product.id,
        product_name: product.name,
      },
    });
  };

  const redirectProductPage = (product: Recordable) => {
    router.push({
      name: 'ProductPage',
      query: {
        product_name: product.name,
      },
    });
  };

  const redirectShopifyProductPage = (product: Recordable) => {
    window.open(product.url, '_blank');
  };

  const handleToggleActive = (status, item) => {
    item.status_loading = true;

    crawlerStore(item.id, { status })
      .then(() => {
        notification.success({ message: 'Saved', description: 'The item has been updated.' });
        item.status = status;
      })
      .finally(() => (item.status_loading = false));
  };

  const handleReSync = (item) => {
    setLoading(true);

    crawlerSyncAPI(item.id).then(() => {});
  };

  // Search product
  const handleProductChange = (val) => {
    state.searchInfo.product_id = val;
    reload();
  };

  const stateColor = (state: string) => {
    switch (state) {
      case 'done':
        return 'blue';

      case 'syncing':
        return 'green';

      case 'pending':
        return 'orange';

      case 'error':
        return 'red';

      default:
        return '';
    }
  };
</script>

<template>
  <div class="p-4">
    <div class="flex flex-wrap mb-4">
      <div class="md:w-auto w-full flex-grow flex flex-col space-y-1">
        <div class="text-lg font-bold">Amazon Bot</div>

        <h5 class="text-xs text-gray-500 mb-5"> Auto scraping all reviews from Amazon website. </h5>
      </div>
      <div class="md:w-auto w-full flex items-center justify-end flex-wrap space-x-2">
        <a-button
          class="w-150px mb-2"
          preIcon="ant-design:plus-outlined"
          type="primary"
          @click="handleCreate"
        >
          Create
        </a-button>
        <FieldSelectProduct
          :allow-clear="true"
          class="w-250px !mb-2"
          title="All product"
          @update:value="handleProductChange"
        />
      </div>
    </div>
    <BasicTable :loading="true" :searchInfo="state.searchInfo" @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'product'">
          <Tooltip placement="top" title="View reviews from this product">
            <div
              class="flex items-center space-x-2 cursor-pointer !text-primary !whitespace-normal"
              @click="handleViewReviews(record.product)"
            >
              <img :src="record.product.image" class="object-cover h-10 w-10 rounded-md" />
              <div class="flex flex-col text-left cursor-pointer">
                <Vue3ClampVue :max-lines="1" :maxHeight="1000" autoresize>
                  {{ record.product.name }}
                </Vue3ClampVue>
                <div v-if="record.total_reviews" class="text-xs text-gray-500">
                  <Vue3ClampVue :max-lines="1" :maxHeight="1000" autoresize>
                    Scraped {{ record.total_reviews }} reviews
                  </Vue3ClampVue>
                </div>
              </div>
            </div>
          </Tooltip>
        </template>
        <template v-else-if="column.key === 'status'">
          <div class="wba-status">
            <Switch
              v-model:checked="record.status"
              :loading="record.status_loading"
              size="small"
              @change="(__checked) => handleToggleActive(__checked, record)"
            />
          </div>
        </template>
        <template v-else-if="column.key === 'type'">
          <span
            class="text-blue-500 cursor-pointer"
            @click="appBridgeStore.openRemotePath(record.source_url)"
          >
            {{ record.product_code }}
          </span>
        </template>
        <template v-else-if="column.key === 'state'">
          <Tag :color="stateColor(record.state)">
            <span class="capitalize">
              {{ record.state }}
            </span>
          </Tag>
        </template>
        <template v-else-if="column.key === 'last_sync_time'">
          <Time
            v-if="record.last_sync_time"
            :value="record.last_sync_time"
            class="font-light"
            mode="date"
          />
        </template>
        <template v-else-if="column.key === 'next_sync_time'">
          <Time
            v-if="record.next_sync_time"
            :value="record.next_sync_time"
            class="font-semibold"
            mode="date"
          />
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'bx:edit',
                label: 'Edit',
                ifShow: () => record.state != 'error',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'carbon:reset',
                label: 'Re-sync',
                ifShow: () => record.state == 'error',
                popConfirm: {
                  title: `Do you want to re-sync this item?`,
                  okText: 'Yes',
                  confirm: handleReSync.bind(null, record),
                },
              },
            ]"
            :divider="false"
            :dropDownActions="[
              {
                icon: 'ci:external-link',
                label: 'View reviews',
                onClick: handleViewReviews.bind(null, record.product),
              },
              {
                icon: 'ci:external-link',
                label: 'View product statistic',
                onClick: redirectProductPage.bind(null, record.product),
              },
              {
                icon: 'ci:external-link',
                label: 'Go to shopify product page',
                onClick: redirectShopifyProductPage.bind(null, record.product),
              },
              {
                icon: 'bx:trash',
                color: 'error',
                label: 'Delete',
                disabled: record.state == 'syncing' || record.state == 'pending',
                popConfirm: {
                  title: 'Do you want to delete this source?',
                  okText: 'Yes',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <CreateModal @register="registerCreateModal" @storaged="reload" />
  </div>
</template>

<style lang="less" scoped>
  .wba-status :deep(span.anticon) {
    vertical-align: 10px !important;
  }
</style>
