<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { useField } from 'vee-validate';
  import _ from 'lodash-es';

  import Vue3ClampVue from '@coreThemeExt/components/common/Vue3Clamp.vue';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { previewSettings } from './FieldReviewTableConfig';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';

  import EditModal from '../../../reviews/partials/CreateModal.vue';
  import VerifiedSVG from '../../../reviews/assets/verified.svg';

  const [registerTable, { reload }] = useTable(previewSettings);
  const [registerEditModal, { openModal }] = useModal();
  const { createConfirm } = useMessage();

  const { value: dataType } = useField('custom_setting.data_type');
  const { value: ids } = useField<any[]>('custom_setting.data');

  const searchInfo = reactive<Recordable>({
    type: dataType.value,
    ids: ids.value,
  });

  const state = reactive({
    checkedRows: [],
  });

  watch(dataType, () => {
    searchInfo.type = dataType.value;
    searchInfo.ids = ids.value;

    reload();
  });

  watch(ids, () => {
    searchInfo.type = dataType.value;
    searchInfo.ids = ids.value;

    reload();
  });

  const handleRowSelection = (): any => {
    return dataType.value == 'manual'
      ? {
          type: 'checkbox',
          onChange(checkedItems) {
            state.checkedRows = checkedItems;
          },
        }
      : null;
  };

  const handleEdit = (record: Recordable) => {
    openModal(true, record);
  };

  const handleUnset = (list: any[]) => {
    createConfirm({
      iconType: 'warning',
      title: 'Unset',
      content: 'Do you want to unset these items?',
      onOk: () => {
        ids.value = _.difference(ids.value, list);
      },
    });
  };
</script>

<template>
  <div>
    <EditModal @storaged="reload" @register="registerEditModal" />
    <div v-if="dataType == 'manual' && state.checkedRows.length" class="flex justify-end mr-5">
      <a-button @click="handleUnset(state.checkedRows)" type="danger">
        Unset {{ state.checkedRows.length }} items
      </a-button>
    </div>
    <BasicTable
      @register="registerTable"
      :searchInfo="searchInfo"
      :rowSelection="handleRowSelection()"
      :canResize="false"
      class="!m-0 !p-0"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'is_verified'">
          <div class="flex items-center space-x-2 !whitespace-normal">
            <Tooltip placement="top" :title="record.product.name">
              <img :src="record.product.image" class="object-cover h-10 w-10 rounded-md" />
            </Tooltip>
            <div class="flex flex-col text-left">
              <div class="flex items-center justify-start space-x-2">
                <img
                  :src="`https://storage.widgetbuilder.app/widget_builder/static-images/flags/${record.country_code.toUpperCase()}.png`"
                  class="h-3"
                />
                <VerifiedSVG class="w-20px h-20px" v-if="record.is_verified" />
                <Vue3ClampVue autoresize :max-lines="1" :maxHeight="1000">
                  {{ record.customer_name }}
                </Vue3ClampVue>
              </div>
              <div class="text-xs text-gray-500">
                <Vue3ClampVue autoresize :max-lines="1" :maxHeight="1000">
                  {{ record.customer_email }}
                </Vue3ClampVue>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="column.key === 'feedback'">
          <div class="flex flex-col text-left !whitespace-normal">
            <Tooltip placement="top" :title="record.feedback">
              <Vue3ClampVue autoresize :max-lines="1" :maxHeight="1000">
                {{ record.feedback }}
              </Vue3ClampVue>
            </Tooltip>
          </div>
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :divider="false"
            :actions="[
              {
                icon: 'bx:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'bx:trash',
                ifShow: dataType == 'manual',
                onClick: handleUnset.bind(null, [record.id]),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>

<style lang="less" scoped></style>
