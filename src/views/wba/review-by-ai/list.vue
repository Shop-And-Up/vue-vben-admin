<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { useProductVisionTable } from '@/views/wba/review-by-ai/listTableConfig';
  import { reactive } from 'vue';
  import { debounce, trim } from 'lodash-es';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { Badge, Radio, Space, Tooltip, Upload as AUpload } from 'ant-design-vue';
  import { useModal } from '@/components/Modal';
  import ImportVisionModal from '@/views/wba/review-by-ai/partials/ImportVisionModal.vue';
  import Vue3ClampVue from '@coreThemeExt/components/common/Vue3Clamp.vue';
  import FieldSelectProduct from '@/views/wba/reviews/partials/FieldSelectProduct.vue';
  import { uploadImageApi } from '@/api/wba/upload';
  import CheckGate from '@/views/wba/CheckGate.vue';

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const SearchType = {
    ProductName: 'product_name',
    ProductImage: 'product_image',
    ImageUrl: 'image_url',
    UploadedImage: 'image_file',
  };

  const [registerTable, { reload }] = useProductVisionTable();
  const [registerImportModal, { openModal: openImportModel }] = useModal();

  const state = reactive({
    minNameLength: 3,
    isLoading: true,
    searchType: SearchType.ProductName,
    UploadProcessing: false,
  });

  const searchInfo = reactive({
    by_product_vision_name: null,
    by_product_id: null,
    by_image_url: null,
    by_image_file: null,
    search_type: SearchType.ProductName,
  });

  function reloadTable() {
    state.isLoading = true;
    reload();
  }

  const handleSearchByProductName = debounce((searchStr) => {
    searchStr = trim(searchStr);

    if (searchStr.length > 0 && searchStr.length < state.minNameLength) {
      return;
    }

    searchInfo.by_product_vision_name = searchStr;
    searchInfo.search_type = SearchType.ProductName;
    reloadTable();
  }, 500);

  const handleSearchByProductImage = () => {
    searchInfo.search_type = SearchType.ProductImage;
    reloadTable();
  };

  const handleSearchByImageUrl = () => {
    searchInfo.search_type = SearchType.ImageUrl;
    reloadTable();
  };

  const handleSearchByImageFile = () => {
    searchInfo.search_type = SearchType.UploadedImage;
    reloadTable();
  };

  const handleSwitchType = (e: Event) => {
    if (e.target?.value == SearchType.ProductName) {
      searchInfo.search_type = SearchType.ProductName;
      reloadTable();
    }
  };

  const handleFileUpload = async (file: any): Promise<any> => {
    state.UploadProcessing = true;

    return uploadImageApi({ file }, (progressEvent) => {
      file.status = progressEvent.total == progressEvent.loaded ? 'done' : 'uploading';
      file.percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
    })
      .then((res) => {
        searchInfo.by_image_file = res.data.result;

        return false;
      })
      .finally(() => {
        state.UploadProcessing = false;
        return false;
      });
  };
</script>

<template>
  <div class="max-w-screen-xl mx-auto gap-4 p-4">
    <div class="flex flex-col items-center justify-center space-y-2 bg-white p-4">
      <div class="font-bold text-base mb-2"> There are 4 ways to find and clone reviews</div>
      <RadioGroup
        @change="handleSwitchType"
        button-style="solid"
        class="!mb-4"
        v-model:value="state.searchType"
      >
        <RadioButton :value="SearchType.ProductName" class="w-150px text-center">
          1. Name
        </RadioButton>
        <RadioButton :value="SearchType.ProductImage" class="w-150px text-center">
          2. Shop Product
        </RadioButton>
        <RadioButton :value="SearchType.ImageUrl" class="w-150px text-center">
          3. Image URL
        </RadioButton>
        <RadioButton :value="SearchType.UploadedImage" class="w-150px text-center">
          4. Upload Image
        </RadioButton>
      </RadioGroup>

      <div class="h-min-50px">
        <a-input
          v-show="state.searchType == SearchType.ProductName"
          :placeholder="'Search by name... (Min: ' + state.minNameLength + ' chars)'"
          @input="($e) => handleSearchByProductName($e.target.value)"
          class="!w-600px"
        >
          <template #prefix>
            <Icon :size="16" icon="ant-design:search-outlined" />
          </template>
        </a-input>

        <div v-show="state.searchType == SearchType.ProductImage" class="">
          <CheckGate #button="{ isFreePlan }">
            <a-input-group compact>
              <FieldSelectProduct
                title="All shop products"
                class="w-450px"
                :allow-clear="true"
                v-model:value="searchInfo.by_product_id"
                :disabled="isFreePlan"
              />
              <a-button
                :disabled="!searchInfo.by_product_id || isFreePlan"
                :loading="state.isLoading"
                @click="handleSearchByProductImage"
                class="w-150px"
                type="primary"
              >
                Submit
              </a-button>
            </a-input-group>
          </CheckGate>
        </div>

        <div v-show="state.searchType == SearchType.ImageUrl">
          <CheckGate #button="{ isFreePlan }">
            <a-input-group compact>
              <a-input
                class="!w-450px"
                placeholder="https://your-image-file-url"
                v-model:value="searchInfo.by_image_url"
                :disabled="isFreePlan"
              />
              <a-button
                :disabled="!searchInfo.by_image_url || isFreePlan"
                :loading="state.isLoading"
                @click="handleSearchByImageUrl"
                class="w-150px"
                type="primary"
              >
                Submit
              </a-button>
            </a-input-group>
          </CheckGate>
        </div>

        <div v-show="state.searchType == SearchType.UploadedImage">
          <CheckGate #button="{ isFreePlan }">
            <a-upload
              v-show="!searchInfo.by_image_file"
              :beforeUpload="handleFileUpload"
              :max-count="1"
              :showUploadList="false"
              class="!w-600px"
              accept="image/*"
            >
              <a-button :disabled="isFreePlan" :loading="state.UploadProcessing">
                <UploadOutlined />
                Choose image file to upload
              </a-button>
            </a-upload>

            <a-input-group compact v-show="searchInfo.by_image_file">
              <a-button
                :disabled="state.isLoading"
                @click="searchInfo.by_image_file = null"
                class="w-150px"
              >
                Change file
              </a-button>
              <a-input disabled class="!w-300px" :value="searchInfo.by_image_file" />
              <a-button
                :loading="state.isLoading"
                @click="handleSearchByImageFile"
                class="w-150px"
                type="primary"
              >
                Submit
              </a-button>
            </a-input-group>
          </CheckGate>
        </div>
      </div>

      <BasicTable
        @register="registerTable"
        @fetch-success="state.isLoading = false"
        @fetch-error="state.isLoading = false"
        :searchInfo="searchInfo"
        :loading="state.isLoading"
      >
        <template
          #bodyCell="{
            column: { key },
            record: { id, images_gcs, average_rate, total_review, total_image_review, name },
          }"
        >
          <template v-if="key === 'images'">
            <div class="avatars">
              <span class="avatar" v-for="item in images_gcs" :key="item">
                <img :src="item" :alt="name" />
              </span>
            </div>
          </template>
          <template v-else-if="key === 'name'">
            <div class="flex flex-col text-left !whitespace-normal">
              <Tooltip placement="top" :title="name">
                <Vue3ClampVue autoresize :max-lines="3" :maxHeight="1000">
                  {{ name }}
                </Vue3ClampVue>
              </Tooltip>
            </div>
          </template>
          <template v-if="key === 'total_review'">
            <Space class="text-left w-full" direction="vertical">
              <div>
                <Badge status="warning" />
                <span class="!w-100px font-medium"> Total reviews: </span>
                <span> {{ total_review }} </span>
              </div>

              <div>
                <Badge status="warning" />
                <span class="!w-100px font-medium"> Image reviews: </span>
                <span> {{ total_image_review }} </span>
              </div>
            </Space>
          </template>
          <template v-else-if="key === 'action'">
            <TableAction
              :divider="false"
              :actions="[
                {
                  icon: 'clarity:clone-line',
                  label: 'View & clone',
                  tooltip: 'Search with Google Lens',
                  onClick: openImportModel.bind(null, true, {
                    id,
                    images_gcs,
                    average_rate,
                    total_review,
                    total_image_review,
                    name,
                  }),
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>

      <ImportVisionModal @register="registerImportModal" />
    </div>
  </div>
</template>

<style lang="less" scoped>
  .avatars {
    display: inline-flex;
    flex-direction: row-reverse;
  }

  .avatar {
    position: relative;
    width: 70px;
    overflow: hidden;
    border: 2px solid #fff2f0;
    border-radius: 20%;
  }

  .avatar:not(:last-child) {
    margin-left: 5px;
  }

  .avatar img {
    display: block;
    width: 100%;
  }
</style>
