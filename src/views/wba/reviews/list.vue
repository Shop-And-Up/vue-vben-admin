<script lang="ts" setup>
  import {
    publishAllReviews,
    reviewsBulkActionAPI,
    reviewsDeleteAPI,
    reviewsUpdateAPI,
  } from '@/api/wba/reviews';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction } from '@/components/Table';
  import { useMessage } from '@/hooks/web/useMessage';
  import { dateUtil, formatToDate } from '@/utils/dateUtil';
  import FieldSelectProduct from '@/views/wba/reviews/partials/FieldSelectProduct.vue';
  import { generateImage } from '@coreThemeExt';
  import Vue3ClampVue from '@coreThemeExt/components/common/Vue3Clamp.vue';
  import {
    Badge,
    DatePicker,
    Dropdown,
    Image,
    InputSearch,
    Menu,
    MenuItem,
    Rate,
    Switch,
    Tooltip,
  } from 'ant-design-vue';
  import { debounce } from 'lodash-es';
  import { onBeforeMount, onMounted, reactive, ref, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import VerifiedSVG from './assets/verified.svg';
  import CreateModal from './partials/CreateModal.vue';
  import FieldSelectCountry from './partials/FieldSelectCountry.vue';
  import GuideModalCollectReviews from './partials/GuideModal.vue';
  import { registerTable, reload, rowSelection } from './tableConfig';

  const DateRangePicker = DatePicker.RangePicker;
  const ImagePreviewGroup = Image.PreviewGroup;

  const { createConfirm, notification } = useMessage();
  const [registerCreateModal, { openModal }] = useModal();
  const [registerCollectReviewModal, { openModal: openCollectReviewModal }] = useModal();

  const { currentRoute, push } = useRouter();
  const checkedRows = ref<Array<string | number>>([]);
  const searchInfo = reactive({
    product_id: null as Number | null,
    country_code: null as any,
    feedback_date: null as any,
    feedback: '' as string,
  });

  const state = reactive({
    isLoading: false,
  });

  onBeforeMount(() => {
    if (unref(currentRoute).query.product_id) {
      searchInfo.product_id = Number(unref(currentRoute).query.product_id);
    }
  });

  onMounted(() => {
    reload();
  });

  const handleDelete = (record: Recordable) => {
    state.isLoading = true;

    reviewsDeleteAPI([record.id]).finally(() => {
      state.isLoading = false;
      reload();
    });
  };

  const handleRowSelection = () => {
    return rowSelection(checkedRows);
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
      .then(() => {
        notification.success({ message: 'Saved', description: 'The item has been updated.' });
        item.status = status;
      })
      .finally(() => {
        item.status_loading = false;
      });
  };

  // Bulk action
  const handleMenuClick = (e) => {
    createConfirm({
      iconType: 'warning',
      title: toTitleCase(e.key),
      content: 'Do you want to ' + e.key + ' these ' + checkedRows.value.length + ' items?',
      onOk: () => reviewsBulkActionAPI(e.key, checkedRows.value).then(() => reload()),
    });

    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  };
  const handleMoreAction = (e: any) => {
    switch (e.key) {
      case 'reload':
        state.isLoading = true;
        reload();
        break;
      case 'google-review':
        push({ name: 'GoogleReviews' });
        break;
      case 'publish-all-unpublish-reviews':
        state.isLoading = true;

        publishAllReviews().finally(() => {
          state.isLoading = false;
          reload();
        });
        break;
    }
  };

  // Search product
  const handleCountryChange = (val: any) => {
    searchInfo.country_code = val;
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

  // Go to product page
  const redirectProductPage = (record: Recordable) => {
    window.open(record.product.url, '_blank');
  };

  const handleSearchChange = debounce((_) => {
    reload();
  }, 500);
</script>

<template>
  <div class="p-4">
    <div class="flex flex-wrap justify-end mb-4">
      <!--      <div class="md:w-auto w-full flex-grow text-lg font-bold"> Reviews</div>-->
      <div class="md:w-auto w-full flex items-center justify-end flex-wrap space-x-2">
        <Dropdown v-if="checkedRows.length">
          <template #overlay>
            <Menu @click="handleMenuClick">
              <MenuItem key="publish"> Publish {{ checkedRows.length }} items</MenuItem>
              <MenuItem key="unpublish"> Unpublish {{ checkedRows.length }} items</MenuItem>
              <MenuItem key="verify"> Verify {{ checkedRows.length }} items</MenuItem>
              <MenuItem key="unverify"> Unverify {{ checkedRows.length }} items</MenuItem>
              <MenuItem key="delete"> Delete {{ checkedRows.length }} items</MenuItem>
            </Menu>
          </template>
          <a-button class="w-140px mb-2">
            Bulk Actions
            <Icon :size="12" icon="ant-design:down-outlined" />
          </a-button>
        </Dropdown>

        <a-button
          class="w-115px mb-2"
          preIcon="ant-design:cloud-upload-outlined"
          @click="openCollectReviewModal(true, {})"
        >
          Import
        </a-button>

        <a-button
          class="w-115px mb-2"
          preIcon="ant-design:plus-outlined"
          @click="openModal(true, {})"
        >
          Create
        </a-button>

        <Dropdown>
          <template #overlay>
            <Menu @click="handleMoreAction">
              <MenuItem key="publish-all-unpublish-reviews" :disabled="state.isLoading">
                <Icon icon="material-symbols-light:publish" />
                Publish all unpublished reviews
              </MenuItem>
              <MenuItem key="google-review">
                <Icon icon="flat-color-icons:google" />
                Generate Google product reviews
              </MenuItem>
              <MenuItem key="reload" :disabled="state.isLoading">
                <Icon :spin="state.isLoading" icon="ant-design:reload-outlined" />
                Reload data
              </MenuItem>
            </Menu>
          </template>
          <a-button class="w-140px mb-2" type="primary">
            More Actions
            <Icon :size="12" icon="ant-design:down-outlined" />
          </a-button>
        </Dropdown>

        <FieldSelectCountry
          :allow-clear="true"
          class="w-150px !mb-2"
          title="All Country"
          @change="handleCountryChange"
        />

        <FieldSelectProduct
          v-model:value="searchInfo.product_id"
          :allow-clear="true"
          class="w-250px !mb-2"
          title="All product"
          @update:value="reload"
        />

        <InputSearch
          v-model:value="searchInfo.feedback"
          class="!mb-2"
          placeholder="Search feedback..."
          style="width: 250px"
          @change="handleSearchChange"
          @search="handleSearchChange"
        />

        <DateRangePicker
          :presets="[
            { label: 'Today', value: [dateUtil(), dateUtil()] },
            { label: 'Last 7 days', value: [dateUtil().subtract(7, 'day'), dateUtil()] },
            { label: 'Last 30 days', value: [dateUtil().subtract(30, 'day'), dateUtil()] },
          ]"
          class="w-250px !mb-2"
          @change="handleDateChange"
        />
      </div>
    </div>
    <BasicTable
      :loading="state.isLoading"
      :rowSelection="handleRowSelection()"
      :searchInfo="searchInfo"
      @register="registerTable"
      @fetch-success="state.isLoading = false"
    >
      <template #bodyCell="{ column: { key }, record }">
        <template v-if="key === 'is_verified'">
          <div class="flex items-center space-x-2 !whitespace-normal">
            <Tooltip :title="record['product'].name" placement="top">
              <img
                :src="generateImage(record['product'].image)"
                class="object-cover h-10 w-10 rounded-md"
              />
            </Tooltip>
            <div class="flex flex-col text-left cursor-pointer" @click="openModal(true, record)">
              <div class="flex items-center justify-start space-x-2">
                <img
                  :src="`https://storage.widgetbuilder.app/widget_builder/static-images/flags/${record[
                    'country_code'
                  ].toUpperCase()}.png`"
                  class="h-3"
                />
                <VerifiedSVG v-if="record['is_verified']" class="w-20px h-20px" />
                <Vue3ClampVue :max-lines="1" :maxHeight="1000" autoresize>
                  {{ record['customer_name'] }}
                </Vue3ClampVue>
              </div>
              <div class="text-xs text-gray-500">
                <Vue3ClampVue :max-lines="1" :maxHeight="1000" autoresize>
                  {{ record['customer_email'] }}
                </Vue3ClampVue>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="key === 'feedback'">
          <div class="flex flex-col text-left !whitespace-normal">
            <Tooltip :title="record['feedback']" placement="top">
              <Vue3ClampVue :max-lines="2" :maxHeight="1000" autoresize>
                {{ record['feedback'] }}
              </Vue3ClampVue>
            </Tooltip>
          </div>
        </template>
        <template v-else-if="key === 'rate'">
          <div class="flex flex-col items-center justify-center space-y-1">
            <Rate :allowClear="false" :value="record['rate']" class="!text-16px" disabled />
          </div>
        </template>
        <template v-else-if="key === 'feedback_date'">
          <span class="text-xs text-gray-500">
            {{ dateUtil(record['feedback_date']).format('YYYY-MM-DD') }}
          </span>
        </template>
        <template v-else-if="key === 'updated_at'">
          <span class="text-xs text-gray-500">
            {{ dateUtil(record['updated_at']).format('YYYY-MM-DD') }}
          </span>
        </template>
        <template v-else-if="key === 'image_count'">
          <Tooltip
            placement="left"
            title="Occasionally, images may not display from your country. Kindly publish your reviews to preview the images directly from your store."
          >
            <div>
              <Image
                v-if="record['images'].length == 1"
                :preview="{ visible: false }"
                :previewMask="false"
                :src="record['images'][0]"
                class="!object-cover !h-10 !w-10 !rounded-md cursor-pointer"
                fallback="/assets/img/no-image.png"
                @click="record['image_show_preview'] = true"
              />
            </div>
          </Tooltip>

          <Badge
            v-if="record['images'].length > 1"
            :count="'+' + (record['images'].length - 1)"
            :offset="[20, 20]"
            style="font-size: 10px"
          >
            <Tooltip
              placement="left"
              title="Occasionally, images may not display from your country. Kindly publish your reviews to preview the images directly from your store."
            >
              <div>
                <Image
                  :preview="{ visible: false }"
                  :previewMask="false"
                  :src="record['images'][0]"
                  class="!object-cover !h-10 !w-10 !rounded-md cursor-pointer"
                  fallback="/assets/img/no-image.png"
                  @click="record['image_show_preview'] = true"
                />
              </div>
            </Tooltip>
          </Badge>
          <ImagePreviewGroup
            :preview="{
              visible: record['image_show_preview'],
              onVisibleChange: (vis) => (record['image_show_preview'] = vis),
            }"
          >
            <div class="hidden">
              <Image
                v-for="(url, index) in record['images']"
                :key="index"
                :previewMask="false"
                :src="url"
                class="!object-cover !h-15 !w-15 !rounded-md cursor-pointer"
                fallback="/assets/img/no-image.png"
              />
            </div>
          </ImagePreviewGroup>
        </template>
        <template v-else-if="key === 'status'">
          <div class="wba-status">
            <Switch
              v-model:checked="record['status']"
              :disabled="!record['feedback']"
              :loading="record['status_loading']"
              checkedValue="published"
              size="small"
              style="vertical-align: 1.125em !important"
              unCheckedValue="unpublished"
              @change="(__checked) => handleTogglePublished(__checked, record)"
            />
          </div>
        </template>
        <template v-else-if="key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'bx:edit',
                tooltip: 'Edit',
                onClick: openModal.bind(null, true, record),
              },
            ]"
            :divider="false"
            :dropDownActions="[
              {
                icon: 'ci:external-link',
                label: 'Go to product page',
                onClick: redirectProductPage.bind(null, record),
              },
              {
                icon: 'bx:trash',
                label: 'Delete',
                popConfirm: {
                  title: 'Do you want to delete this item?',
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
    <GuideModalCollectReviews @register="registerCollectReviewModal" @reload-table="reload" />
  </div>
</template>

<style lang="less" scoped>
  .wba-status {
    @apply flex items-center justify-center;
  }

  .wba-status :deep(span.anticon) {
    vertical-align: 10px !important;
  }
</style>
