<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, reactive, unref } from 'vue';
  import { Card, Select, Switch, Tooltip } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { Channel } from 'pusher-js';
  import { debounce } from 'lodash-es';

  import PusherService from '@/plugins/pusher';
  import { useUserStore } from '@/store/modules/user';
  import { themeChange, themeLists } from '@/api/wba/theme';
  import { widgetDelete, widgetStore, widgetSync } from '@/api/wba/widget';
  import { BasicTable, TableAction } from '@/components/Table';
  import Icon from '@/components/Icon/Icon.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { WidgetTemplates } from '../../widget-config';
  import { getRawDataSource, registerTable, reload } from './tableConfig';

  const router = useRouter();
  const userStore = useUserStore();
  const { notification, createMessage } = useMessage();

  const searchInfo = reactive<Recordable>({
    type: unref(router.currentRoute).params.type as string,
  });

  const state = reactive({
    currenThemeId: null,
    themeList: [],
    isLoading: false,
    isSyncing: false,
  });

  // Handle pusher - sync state
  let syncWidgetPs: Channel;
  onMounted(() => {
    syncWidgetPs = PusherService.subscribe().bind('sync_shopify_theme', () => {
      createMessage.success('Widgets have been synchronized.');

      reloadThemeList();

      // Reload table data
      reload();
    });

    reloadThemeList();
  });

  onUnmounted(() => {
    if (syncWidgetPs) {
      syncWidgetPs.unbind_all().unsubscribe();
    }
  });

  const reloadThemeList = () => {
    themeLists().then((res) => {
      state.themeList = res.themes.map((c) => {
        return {
          value: c.id,
          label: c.name + ' theme',
        };
      });
      state.currenThemeId = res.current_theme_id;
    });
  };

  const changeTheme = (themeId: any) => {
    state.isLoading = true;
    state.currenThemeId = themeId;

    themeChange(themeId).then(() => {
      // Reload shop info
      userStore.validUserInfoAction();

      // Reload widget list
      reload();
    });
  };

  const handleCreate = () => {
    router.push({
      name: 'WidgetCreate',
      params: {
        type: searchInfo.type,
      },
    });
  };

  const handleEdit = (record: Recordable) => {
    router.push({
      name: 'WidgetEdit',
      params: {
        id: record.id,
        type: searchInfo.type,
      },
    });
  };

  const handleDelete = (record: Recordable) => {
    state.isLoading = true;

    widgetDelete([record.id]).finally(() => {
      state.isLoading = false;
      reload();
    });
  };

  const handleSync = () => {
    state.isSyncing = true;
    widgetSync();
  };

  const handleToggleShow = (is_show: any, item: any) => {
    item.is_show_loading = true;

    widgetStore(item.id, { is_show })
      .then(() => {
        notification.success({ message: 'Saved', description: 'The widget has been updated.' });

        item.is_show = is_show;
      })
      .finally(() => (item.is_show_loading = false));
  };

  const widgetType = computed(() => {
    return WidgetTemplates.find((c) => c.id === searchInfo.type);
  });

  const handleSearch = debounce(($event) => {
    searchInfo.search_field = 'name';
    searchInfo.search_value = $event.target.value;
    reload();
  }, 500);
</script>

<template>
  <Card>
    <div class="flex flex-wrap mb-4">
      <div class="md:w-auto w-full flex-grow text-base font-bold">
        {{ widgetType?.name }} Widget
      </div>
      <div class="md:w-auto w-full flex items-center justify-end flex-wrap space-x-2">
        <a-button
          class="w-100px mb-2"
          preIcon="ant-design:plus-outlined"
          type="primary"
          @click="handleCreate"
        >
          Create
        </a-button>

        <Tooltip placement="top" title="Reload">
          <a-button
            :disabled="state.isLoading"
            class="w-100px mb-2"
            @click="
              state.isLoading = true;
              reload();
            "
          >
            <Icon :size="16" :spin="state.isLoading" icon="ant-design:reload-outlined" />
            Reload
          </a-button>
        </Tooltip>

        <Tooltip placement="top" title="Sync widgets from Shopify Theme">
          <a-button
            :disabled="state.isSyncing || state.isLoading"
            class="w-100px mb-2"
            @click="handleSync"
          >
            <Icon :size="16" :spin="state.isSyncing" icon="ant-design:sync-outlined" />
            Sync
          </a-button>
        </Tooltip>

        <Select
          :disabled="state.isLoading || state.isSyncing"
          :options="state.themeList"
          :value="state.currenThemeId"
          class="w-250px !mb-2"
          show-search
          @change="changeTheme"
        />

        <a-input class="!w-250px mb-2" placeholder="Search by name..." @input="handleSearch">
          <template #prefix>
            <Icon :size="16" icon="ant-design:search-outlined" />
          </template>
        </a-input>
      </div>
    </div>
    <BasicTable
      :afterFetch="
        () => {
          state.isSyncing = getRawDataSource().syncing;
        }
      "
      :loading="state.isLoading"
      :searchInfo="searchInfo"
      size="small"
      @register="registerTable"
      @fetch-success="state.isLoading = false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div> {{ record.name }}</div>
        </template>
        <template v-else-if="column.key === 'page_type'">
          <div class="capitalize">
            <span v-if="record.page_type"> {{ record.page_name }}</span>
            <span v-else> Manually </span>
          </div>
          <!-- <div class="text-xs text-gray-500"> {{ record.theme_name }} Theme </div> -->
        </template>
        <template v-else-if="column.key === 'is_show'">
          <div class="wba-status">
            <Switch
              v-model:checked="record.is_show"
              :loading="record.is_show_loading"
              size="small"
              @change="(__checked) => handleToggleShow(__checked, record)"
            />
          </div>
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'bx:edit',
                label: 'Edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'bx:trash',
                label: 'Delete',
                color: 'error',
                popConfirm: {
                  title: 'Do you want to delete this item?',
                  okText: 'Yes',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </Card>
</template>

<style lang="less" scoped>
  .wba-status :deep(span.anticon) {
    vertical-align: 10px !important;
  }
</style>
