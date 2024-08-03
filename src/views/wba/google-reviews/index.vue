<script lang="ts" setup>
  import { Card, Radio, Select, Switch } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { Channel } from 'pusher-js';
  import { useForm } from 'vee-validate';
  import { onMounted, onUnmounted, reactive } from 'vue';

  import { SvgIcon } from '@/components/Icon';
  import { PageWrapper } from '@/components/Page';
  import PusherService from '@/plugins/pusher';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useShopifyAppBridgeStore } from '@/store/modules/shopifyAppBridge';
  import { useUserStore } from '@/store/modules/user';
  import { copyText } from '@/utils/copyTextToClipboard';
  import { dateUtil } from '@/utils/dateUtil';

  import {
    getSettingAPI,
    postGenerateGoogleReviewAPI,
    updateGoogleReviewSettingAPI,
  } from '@/api/wba/shop';
  import { countriesList } from './data';

  const RadioGroup = Radio.Group;
  const userStore = useUserStore();
  const { notification } = useMessage();
  const appBridgeStore = useShopifyAppBridgeStore();

  const veeForm = useForm<any>();
  const [googleEnable, googleSettings] = veeForm.useFieldModel([
    'google_enable',
    'google_settings',
  ]);

  const state = reactive<{
    isGenerating: boolean;
    isLoading: boolean;
  }>({
    isGenerating: true,
    isLoading: true,
  });

  // Handle pusher - generating state
  let generatingFeedPs: Channel;

  const countriesData = [{ value: '', label: 'None' }].concat(
    countriesList.map((c) => {
      return {
        value: c,
        label: c,
      };
    }),
  );

  onMounted(() => {
    initData();

    generatingFeedPs = PusherService.subscribe().bind('generate_google_review_xml', async () => {
      notification.success({
        message: 'Google Feed - Generated',
        description: 'Xml file have been generated.',
      });

      initData();
    });
  });

  onUnmounted(() => {
    if (generatingFeedPs) {
      generatingFeedPs.unbind_all().unsubscribe();
    }
  });

  const initData = () => {
    state.isLoading = true;
    getSettingAPI().then((res) => {
      veeForm.resetForm({ values: cloneDeep(res) });

      state.isGenerating = res.google_settings.is_generating;
      state.isLoading = false;
    });
  };

  const handleCopy = (data) => {
    copyText(data, 'The text has been copied!');
  };

  const onGenerate = () => {
    state.isGenerating = true;
    if (!veeForm.meta.value.dirty) {
      postGenerateGoogleReviewAPI();
    } else {
      onSubmit().then(() => {
        postGenerateGoogleReviewAPI();
      });
    }
  };

  const onSubmit = () => {
    return veeForm.validate().then((res) => {
      if (res.valid) {
        // Success case
        state.isLoading = true;
        return updateGoogleReviewSettingAPI(veeForm.values)
          .then(() => {
            veeForm.resetForm({ values: cloneDeep(veeForm.values) });
            notification.success({
              message: 'Saved',
              description: 'The setting has been updated.',
            });
          })
          .finally(() => {
            state.isLoading = false;
          });
      } else {
        // Error case
        Object.keys(res.errors).forEach((key) => {
          notification.error({ message: 'Error', description: res.errors[key] });
        });
      }
    });
  };

  const openLink = (urlLink) => {
    appBridgeStore.openRemotePath(urlLink);
  };
</script>

<template>
  <PageWrapper v-loading="state.isLoading || state.isGenerating" class="pb-60px">
    <div class="grid gap-4 widget-form">
      <!-- Banner - header -->
      <div class="rounded bg-blue-900 lg:relative">
        <div class="p-6">
          <div class="flex space-x-4">
            <div
              class="flex-shrink-0 !h-10 !w-10 grid place-content-center border border-gray-200 rounded bg-white"
            >
              <SvgIcon :size="24" class="text-primary" name="app-widget-product_reviews" />
            </div>
            <div>
              <div class="text-lg font-bold text-white"> Google Product Review Feed</div>
              <div class="text-xs text-gray-300">
                Auto generate and update reviews into google product feed
              </div>
            </div>
          </div>
        </div>
        <img
          src="/assets/img/google-reviews/banner1.png"
          class="invisible lg:visible bottom-0 right-10 w-auto h-60px mb-3 absolute"
          alt="Google Product Review Feed"
        />
      </div>

      <form class="form">
        <div class="grid grid-cols-2 gap-4" v-if="veeForm.values.id">
          <div class="col-span-2 md:col-span-1">
            <Card>
              <template #title>
                <div class="flex flex-row">
                  <div class="flex-grow">
                    <div class="text-base font-bold">Advanced Settings</div>
                    <div class="text-sm text-gray-500"> Configure and save your xml settings.</div>
                  </div>

                  <Switch
                    v-model:checked="googleEnable"
                    :unCheckedValue="false"
                    :checkedValue="true"
                    checked-children="Active"
                    un-checked-children="Disable"
                  />
                </div>
              </template>

              <div class="collapse-panel">
                <div class="col-span-2 flex justify-between mb-10px">
                  <div>
                    <div>Adding product prefix into Sku</div>
                    <div class="text-gray-500 text-xs">
                      By choosing <strong>"None"</strong>, we will keep the original sku from
                      product variants.
                    </div>
                  </div>
                  <div>
                    <Select
                      class="!w-130px"
                      size="small"
                      v-model:value="googleSettings.product_prefix"
                      show-search
                      :options="countriesData"
                    />
                  </div>
                </div>

                <div class="col-span-2 flex justify-between mb-10px">
                  <div>
                    <div>Add MPN in the feed</div>
                    <div class="text-gray-500 text-xs">
                      The additional MPN field will have the same value as SKU in Shopify product
                      admin.
                    </div>
                  </div>
                  <div>
                    <Switch
                      size="small"
                      v-model:checked="googleSettings.mpn"
                      :unCheckedValue="false"
                      :checkedValue="true"
                    />
                  </div>
                </div>

                <div class="col-span-2 flex justify-between mb-10px">
                  <div>Add GTIN in the feed</div>
                  <div>
                    <Switch
                      size="small"
                      v-model:checked="googleSettings.gtin"
                      :unCheckedValue="false"
                      :checkedValue="true"
                    />
                  </div>
                </div>

                <div class="col-span-2 flex justify-between mb-10px">
                  <div>Add review photos in the feed</div>
                  <div>
                    <Switch
                      size="small"
                      v-model:checked="googleSettings.photo"
                      :unCheckedValue="false"
                      :checkedValue="true"
                    />
                  </div>
                </div>

                <div class="col-span-2 flex justify-between mb-10px">
                  <div>
                    <div> Exclude shop-level reviews with these keywords</div>

                    <div class="grid grid-cols-3 md:grid-cols-5 gap-2">
                      <code>shipped</code>
                      <code>shipping</code>
                      <code>shipment</code>
                      <code>service</code>
                      <code>deliver</code>
                      <code>arrived</code>
                      <code>company</code>
                      <code>store</code>
                      <code>business</code>
                      <code>order</code>
                      <code>support</code>
                      <code>email</code>
                      <code>package</code>
                    </div>
                  </div>
                  <div>
                    <Switch
                      size="small"
                      v-model:checked="googleSettings.exclude_keyword"
                      :unCheckedValue="false"
                      :checkedValue="true"
                    />
                  </div>
                </div>

                <div class="col-span-2 flex flex-col justify-between mb-10px">
                  <div>
                    <div>Schedule</div>
                    <div class="text-gray-500 text-xs">
                      Xml file will be generated automatically base on the scheduled time.
                    </div>
                  </div>
                  <div class="mt-2 ml-5">
                    <radio-group
                      v-model:value="userStore.userInfo!.charge_name"
                      class="!flex !flex-col space-y-2"
                    >
                      <Radio value="Free" :disabled="!googleEnable"> Monthly </Radio>
                      <Radio value="Pro" :disabled="!googleEnable || userStore.isFreePlan">
                        Daily (Charged plan)
                      </Radio>
                    </radio-group>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div class="col-span-2 md:col-span-1">
            <Card>
              <template #title>
                <div class="text-base font-bold">Installation Info</div>
                <div class="text-sm text-gray-500">
                  This info will be used for the Product Reviews XML feed.
                </div>
              </template>

              <div class="mb-20px">
                <div class="mb-1">
                  <a @click="openLink(googleSettings.google_xml_url)" class="text-blue-500">
                    XML URL
                  </a>

                  for the scheduled fetches
                </div>
                <div class="flex justify-center space-x-2">
                  <a-textarea
                    class="!text-xs !text-gray-500 !h-100px"
                    readonly
                    :value="googleSettings.google_xml_url"
                    :auto-size="{ maxRows: 5 }"
                  />
                  <a-button
                    @click="handleCopy(googleSettings.google_xml_url)"
                    class="w-100px !h-90px"
                    preIcon="cil:clone"
                  />
                </div>
              </div>

              <div class="mb-20px">
                <div class="mb-1"> File name</div>
                <div class="flex justify-center space-x-2">
                  <a-textarea
                    class="!text-xs !text-gray-500"
                    readonly
                    :value="googleSettings.google_xml_file_name"
                    :auto-size="{ maxRows: 1 }"
                  />
                  <a-button
                    @click="handleCopy(googleSettings.google_xml_file_name)"
                    class="w-100px"
                    preIcon="cil:clone"
                  />
                </div>
              </div>
              <div class="flex justify-between items-start">
                <div v-if="veeForm.values.google_last_sync" class="sync-date">
                  <div> Last sync:</div>
                  <div class="text-blue-500">
                    {{ dateUtil(veeForm.values.google_last_sync).format('YYYY-MM-DD HH:mm:ss') }}
                  </div>
                </div>

                <div v-if="veeForm.values.google_next_sync" class="sync-date">
                  <div> Next sync</div>
                  <div class="text-blue-500">
                    {{ dateUtil(veeForm.values.google_next_sync).format('YYYY-MM-DD HH:mm:ss') }}
                  </div>
                </div>
              </div>

              <div class="mt-20px">
                Please read
                <a
                  @click="
                    openLink(
                      'https://www.wakeupdata.com/blog/product-review-feeds-for-google-shopping',
                    )
                  "
                  target="_blank"
                  class="text-blue-500"
                >
                  this article
                </a>
                about adding your product reviews to Google Shopping with the Product Reviews XML
                feed.
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>

    <template #leftFooter>
      <div class="w-full flex items-center justify-center space-x-2 my-3">
        <a-button
          :loading="state.isLoading"
          :disabled="!veeForm.meta.value.dirty"
          class="w-120px"
          @click="onSubmit()"
          preIcon="bx:save"
          type="primary"
        >
          Save
        </a-button>
        <a-button
          :loading="state.isGenerating"
          :disabled="state.isGenerating"
          preIcon="bx:save"
          class="w-220px"
          @click="onGenerate()"
        >
          Save & Generate now
        </a-button>
      </div>
    </template>
  </PageWrapper>
</template>

<style lang="less" scoped>
  .sync-date {
    @apply col-span-2 flex justify-start items-start space-x-2 mb-10px text-xs;
  }

  code {
    @apply bg-light-400 text-xs text-center text-red-600 py-1 px-2 rounded;
  }

  .collapse-panel {
    @apply grid grid-cols-2 gap-x-8 gap-y-4;
  }
</style>
