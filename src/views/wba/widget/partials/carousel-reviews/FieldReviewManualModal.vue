<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { DatePicker, Tooltip, Switch, Rate, Badge } from 'ant-design-vue';

  import Vue3ClampVue from '@coreThemeExt/components/common/Vue3Clamp.vue';
  import { dateUtil, formatToDate } from '@/utils/dateUtil';
  import { BasicTable, useTable } from '@/components/Table';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { settings } from './FieldReviewTableConfig';
  import { reviewsUpdateAPI } from '@/api/wba/reviews';
  import { useMessage } from '@/hooks/web/useMessage';

  import FieldSelectProduct from '../../../reviews/partials/FieldSelectProduct.vue';
  import VerifiedSVG from '../../../reviews/assets/verified.svg';

  const DateRangePicker = DatePicker.RangePicker;

  const emit = defineEmits(['added']);

  const state = reactive({
    checkedRows: [],
  });
  const searchInfo = reactive<Recordable>({});
  const [register, { closeModal }] = useModalInner();
  const [registerTable, { reload }] = useTable(settings);
  const { notification } = useMessage();

  const AddBtnTitle = computed(() => {
    return `Add ${state.checkedRows.length} selected items`;
  });

  const handleRowSelection = (): any => {
    return {
      type: 'checkbox',
      onChange(checkedItems) {
        state.checkedRows = checkedItems;
      },
      getCheckboxProps(record: Recordable) {
        if (record.status == 'unpublished') {
          return { disabled: true };
        } else {
          return { disabled: false };
        }
      },
    };
  };

  // Switch published/unpublished
  const handleTogglePublished = (status, item) => {
    item.status_loading = true;
    reviewsUpdateAPI(
      item.id,
      Object.assign({}, item, {
        status,
      }),
    )
      .then(() => (item.status = status))
      .finally(() => {
        notification.success({ message: 'Saved', description: 'The item has been updated.' });
        item.status_loading = false;
      });
  };

  // Search product
  const handleProductChange = (val) => {
    searchInfo.product_id = val;
    reload();
  };

  // Search feedback date
  const handleDateChange = (days: any[]) => {
    if (days) {
      days = days.map((c) => formatToDate(c));
    }
    searchInfo.feedback_date = days;
    reload();
  };

  const handleAdd = () => {
    emit('added', state.checkedRows);
    closeModal();
  };
</script>

<template>
  <BasicModal
    :canFullscreen="true"
    :defaultFullscreen="true"
    :useWrapper="false"
    :draggable="false"
    :showOkBtn="!!state.checkedRows.length"
    :okText="AddBtnTitle"
    v-bind="$attrs"
    title="Select reviews"
    @ok="handleAdd"
    @register="register"
  >
    <div>
      <div class="md:w-auto w-full flex items-center justify-end flex-wrap space-x-2">
        <FieldSelectProduct
          class="w-250px !mb-2"
          title="All product"
          @update:value="handleProductChange"
          :allow-clear="true"
        />
        <DateRangePicker
          class="w-250px !mb-2"
          @change="handleDateChange"
          :ranges="{
            Today: [dateUtil(), dateUtil()],
            'Last 7 days': [dateUtil().subtract(7, 'day'), dateUtil()],
            'Last 30 days': [dateUtil().subtract(30, 'day'), dateUtil()],
          }"
        />
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
          <template v-else-if="column.key === 'rate'">
            <div class="flex flex-col items-center justify-center space-y-1">
              <Rate class="!text-16px" :allowClear="false" disabled :value="record.rate" />
            </div>
          </template>
          <template v-else-if="column.key === 'feedback_date'">
            <span class="text-xs text-gray-500">
              {{ dateUtil(record.feedback_date).format('YYYY-MM-DD') }}
            </span>
          </template>
          <template v-else-if="column.key === 'image_count'">
            <div>
              <div v-if="record.images.length == 1" class="flex justify-center">
                <img :src="record.images[0]" class="!object-cover !h-10 !w-10 !rounded-md" />
              </div>

              <Badge
                style="font-size: 10px; text-align: left"
                :offset="[20, 20]"
                :count="'+' + (record.images.length - 1)"
                v-if="record.images.length > 1"
              >
                <img :src="record.images[0]" class="!object-cover !h-10 !w-10 !rounded-md" />
              </Badge>
            </div>
          </template>
          <template v-else-if="column.key === 'status'">
            <div class="wba-status">
              <Switch
                style="vertical-align: 1.125em !important"
                size="small"
                v-model:checked="record.status"
                unCheckedValue="unpublished"
                checkedValue="published"
                :loading="record.status_loading"
                @change="(__checked) => handleTogglePublished(__checked, record)"
              />
            </div>
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>

<style lang="less" scoped>
  .wba-status {
    @apply flex items-center justify-center;
  }

  .wba-status :deep(span.anticon) {
    vertical-align: 10px !important;
  }
</style>
