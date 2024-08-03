<script setup lang="ts">
  import { onMounted, onUnmounted, ref, reactive, unref } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { Channel } from 'pusher-js';
  import { debounce } from 'lodash-es';
  import { useRouter } from 'vue-router';

  import { BasicTable, TableAction } from '@/components/Table';
  import { Time } from '@/components/Time';
  import Icon from '@/components/Icon/Icon.vue';
  import { orderDeleteAPI, orderResendAPI } from '@/api/wba/orders';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useUserStore } from '@/store/modules/user';
  import PusherService from '@/plugins/pusher';

  import { useOrderTable } from './tableConfig';

  const isLoading = ref(false);
  const isSyncing = ref(false);
  const searchInfo = reactive<Recordable>({});

  const [registerTable, { reload, getRawDataSource }] = useOrderTable();
  const { createMessage } = useMessage();
  const router = useRouter();
  const userStore = useUserStore();

  const orderRouteQuery = reactive<any>({
    name: unref(router.currentRoute).query.order_name,
  });

  // Handle pusher - sync state
  let syncOrdersPs: Channel;

  onMounted(() => {
    if (orderRouteQuery.name) {
      handleSearch(orderRouteQuery.name);
    }

    syncOrdersPs = PusherService.subscribe().bind('sync_all_order', async () => {
      createMessage.success('Orders have been updated.');
      reload();
    });
  });

  onUnmounted(() => {
    if (syncOrdersPs) {
      syncOrdersPs.unbind_all().unsubscribe();
    }
  });

  const genOrderLink = (record: Recordable) => {
    return `https://${userStore.getUserInfo.myshopify_domain}/admin/orders/${record.id}`;
  };

  const redirectOrderPage = (record: Recordable) => {
    window.open(genOrderLink(record), '_blank');
  };

  const handleDeleteOrder = (record: Recordable) => {
    isLoading.value = true;
    orderDeleteAPI(record.id).finally(() => {
      isLoading.value = false;
      createMessage.success('Order has been deleted');
      reload();
    });
  };

  const handleResent = (record: Recordable) => {
    isLoading.value = true;
    orderResendAPI(record.id).finally(() => {
      isLoading.value = false;
      createMessage.success('Order has been scheduled to resend');
      reload();
    });
  };

  const handleSearch = debounce((searchStr) => {
    searchInfo.search_field = 'name';
    searchInfo.search_value = searchStr;
    reload();
  }, 500);

  const redirectMailSetting = () => {
    router.push({
      name: 'MailSettingPage',
    });
  };
</script>

<template>
  <div class="p-4">
    <div class="flex flex-wrap items-center justify-end mb-4">
      <div class="md:w-auto w-full flex-grow text-lg font-bold"> Fulfilled Orders </div>
      <div class="md:w-auto w-full flex items-center justify-end flex-wrap space-x-2">
        <a-button
          @click="redirectMailSetting"
          preIcon="ant-design:mail-outlined"
          class="w-150px mb-2"
          type="primary"
        >
          Mail Setting
        </a-button>
        <Tooltip title="Reload" placement="top">
          <a-button
            class="mb-2"
            @click="
              isLoading = true;
              reload();
            "
            :disabled="isLoading"
          >
            <Icon :size="16" :spin="isLoading" icon="ant-design:reload-outlined" />
          </a-button>
        </Tooltip>
        <a-input
          :value="orderRouteQuery.name"
          @input="($e) => handleSearch($e.target.value)"
          class="!w-300px mb-2"
          placeholder="Search by order name..."
        >
          <template #prefix> <Icon :size="16" icon="ant-design:search-outlined" /> </template>
        </a-input>
      </div>
    </div>

    <BasicTable
      class="mt-4"
      @register="registerTable"
      :searchInfo="searchInfo"
      :loading="isLoading"
      :afterFetch="
        () => {
          isSyncing = getRawDataSource().syncing;
        }
      "
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-button :href="genOrderLink(record)" type="link" target="_blank">
            {{ record.name }}
          </a-button>
        </template>
        <template v-else-if="column.key === 'total_price'">
          {{ record.total_price }} {{ record.currency }}
        </template>
        <template v-else-if="column.key === 'customer' && record.customer">
          <div class="capitalize">
            {{ record.customer.first_name }}
            {{ record.customer.last_name }}
          </div>
          <div class="text-xs text-gray-500">
            {{ record.customer.email }}
          </div>
        </template>

        <template v-else-if="column.key === 'status'">
          <Tag :color="record.tag_color" class="capitalize">
            {{ record.tag_name }}
          </Tag>
        </template>

        <template v-else-if="column.key === 'order_date'">
          <Time mode="date" :value="record.order_date" />
        </template>
        <template v-else-if="column.key === 'fulfillment_date'">
          <Time mode="datetime" :value="record.fulfillment_date" />
        </template>
        <template v-else-if="column.key === 'email_date'">
          <Time mode="datetime" :value="record.email_date" v-if="record.email_date" />
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :divider="false"
            :dropDownActions="[
              {
                icon: 'ci:external-link',
                label: 'Go to shopify order page',
                onClick: redirectOrderPage.bind(null, record),
              },
              {
                icon: 'carbon:reset',
                label: 'Schedule to send mail',
                ifShow: () => record.status == 'sync' || record.status == 'failed',
                onClick: handleResent.bind(null, record),
              },
              {
                icon: 'bx:trash',
                label: 'Delete',
                ifShow: () =>
                  record.status == 'sync' || record.status == 'sent' || record.status == 'failed',
                popConfirm: {
                  title: `Do you want to delete order ${record.name}?`,
                  okText: 'Yes',
                  confirm: handleDeleteOrder.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
