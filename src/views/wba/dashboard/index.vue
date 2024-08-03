<script lang="ts" setup>
  import { router } from '@/router';
  import {
    EyeTwoTone,
    HighlightTwoTone,
    StarTwoTone,
    ThunderboltTwoTone,
  } from '@ant-design/icons-vue';
  import { Card, DatePicker, Divider } from 'ant-design-vue';
  import { computed, onMounted, reactive } from 'vue';

  import { getCounterAPI, getStatisticAPI } from '@/api/wba/shop';
  import { SvgIcon } from '@/components/Icon';
  import { useGlobSetting } from '@/hooks/setting';
  import { useShopifyAppBridgeStore } from '@/store/modules/shopifyAppBridge';
  import { useUserStore } from '@/store/modules/user';
  import { dateUtil, formatToDate } from '@/utils/dateUtil';
  import { appUrl } from '@coreThemeExt/components/utils';
  import ShopStatistic from '../components/ShopStatistic.vue';
  import { priceList } from '../widget-config';
  import FormFreeUpgradePro from '../widget/partials/FormFreeUpgradePro.vue';
  import GuideCreateWidget from './GuideCreateWidget.vue';
  import GuideImportReviews from './GuideImportReviews.vue';
  import VisitAnalysis from './VisitAnalysis.vue';

  const DateRangePicker = DatePicker.RangePicker;
  const { title } = useGlobSetting();
  const userStore = useUserStore();
  const appBridgeStore = useShopifyAppBridgeStore();
  const state = reactive({
    isLoading: true,
    reviewCounter: 0,
    sttData: {
      date: [],
      view: [],
      click: [],
    },
    sttDateRange: [dateUtil().subtract(30, 'day'), dateUtil()],
    totalReviewCounter: 0,
  });

  onMounted(() => {
    loadStatistic();

    // Load counter
    getCounterAPI().then((res) => {
      state.reviewCounter = +res.reviewCounter;
      state.totalReviewCounter = +res.totalReviewCounter;
    });
  });

  const goToPricingPage = () => {
    router.push({
      name: 'Pricing',
    });
  };

  const currentPercentage = computed(() => {
    const plan = priceList.find((c) => c.title == userStore.userInfo!.charge_name);
    if (!plan || plan!.quota_view == null) {
      return 0;
    }

    const quotaView = userStore.userInfo!.quota_view!;
    if (quotaView >= plan!.quota_view!) {
      return 100;
    }

    return Math.floor((quotaView / plan!.quota_view!) * 100);
  });

  const loadStatistic = () => {
    state.isLoading = true;
    const days = state.sttDateRange.map((c) => formatToDate(c));

    getStatisticAPI(days[0], days[1])
      .then((res) => (state.sttData = res))
      .finally(() => (state.isLoading = false));
  };

  const impressions = computed(() => {
    return state.sttData.view.reduce((previousValue, currentValue) => {
      return previousValue + currentValue;
    }, 0);
  });

  const clickCounter = computed(() => {
    return state.sttData.click.reduce((previousValue, currentValue) => {
      return previousValue + currentValue;
    }, 0);
  });

  const ctr = computed(() => {
    return impressions.value ? ((clickCounter.value * 100) / impressions.value).toFixed(2) : 0;
  });

  const openRemote = (url: any) => {
    appBridgeStore.openRemotePath(url);
  };
</script>

<template>
  <div class="p-4">
    <div class="grid grid-cols-1 md:grid-cols-4 max-w-screen-xl mx-auto gap-4">
      <div class="col-span-1 md:col-span-2">
        <ShopStatistic />
      </div>

      <div
        class="col-span-1 bg-white rounded border border-solid border-gray-100 p-6 flex flex-col"
      >
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="h-10 w-10 border bg-gray-200 border-gray-200 rounded"></div>
            <div
              class="h-10 w-10 grid place-content-center border border-gray-200 rounded absolute top-1 left-1 bg-white"
            >
              <StarTwoTone class="bar-icon" />
            </div>
          </div>

          <div class="flex flex-col text-left">
            <div class="font-semibold text-md">All Published Reviews</div>
          </div>
        </div>
        <div
          v-if="!state.isLoading"
          class="flex items-center justify-center flex-grow text-25px text-primary"
        >
          {{ state.reviewCounter }} / {{ state.totalReviewCounter }}
        </div>
      </div>

      <div
        class="col-span-1 bg-white rounded border border-solid border-gray-100 p-6 flex flex-col"
      >
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="h-10 w-10 border bg-gray-200 border-gray-200 rounded"></div>
            <div
              class="h-10 w-10 grid place-content-center border border-gray-200 rounded absolute top-1 left-1 bg-white"
            >
              <img class="w-24px h-24px object-cover inline-block" src="/assets/img/ecom.png" />
            </div>
          </div>

          <div class="flex flex-col text-left">
            <div class="font-semibold text-md">{{ title }}</div>
          </div>
        </div>
        <div
          class="flex items-center justify-center flex-grow text-25px text-primary font-medium cursor-pointer"
          @click="openRemote(appUrl)"
        >
          Shopify App
        </div>
      </div>

      <div v-if="currentPercentage > 80" class="quota-warning">
        <div class="icon">
          <SvgIcon name="app-quota-limit" size="42" />
        </div>

        <div class="contain">
          <div class="title"> The quota has reached {{ currentPercentage }}%</div>
          <div class="message">
            Your store has used up most of the monthly impression in your plan. Please monitor or
            upgrade to make sure your widgets won't be disabled.
          </div>
        </div>
        <a-button class="w-200px" type="primary" @click="goToPricingPage"> Upgrade</a-button>
      </div>

      <GuideCreateWidget class="col-span-1 md:col-span-2" />

      <GuideImportReviews class="col-span-1 md:col-span-2" />

      <div class="col-span-1 md:col-span-4" v-if="userStore.isFreePlan">
        <FormFreeUpgradePro />
      </div>

      <Card :loading="state.isLoading" class="col-span-1 md:col-span-4" title="Analytics">
        <template #extra>
          <DateRangePicker
            v-model:value="state.sttDateRange"
            :presets="[
              { label: 'Last 7 days', value: [dateUtil().subtract(7, 'day'), dateUtil()] },
              { label: 'Last 30 days', value: [dateUtil().subtract(30, 'day'), dateUtil()] },
            ]"
            class="w-250px"
            @change="loadStatistic"
          />
        </template>
        <div class="grid sm:grid-cols-3 gap-4">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="h-15 w-15 border bg-gray-200 border-gray-200 rounded"></div>
              <div
                class="h-15 w-15 grid place-content-center border border-gray-200 rounded absolute top-1 left-1 bg-white"
              >
                <EyeTwoTone class="statistic-icon" />
              </div>
            </div>

            <div class="flex flex-col text-left space-y-1">
              <div> Impressions</div>
              <div class="font-semibold text-lg"> {{ impressions }}</div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="h-15 w-15 border bg-gray-200 border-gray-200 rounded"></div>
              <div
                class="h-15 w-15 grid place-content-center border border-gray-200 rounded absolute top-1 left-1 bg-white"
              >
                <HighlightTwoTone class="statistic-icon" />
              </div>
            </div>

            <div class="flex flex-col text-left space-y-1">
              <div> Click</div>
              <div class="font-semibold text-lg"> {{ clickCounter }}</div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="h-15 w-15 border bg-gray-200 border-gray-200 rounded"></div>
              <div
                class="h-15 w-15 grid place-content-center border border-gray-200 rounded absolute top-1 left-1 bg-white"
              >
                <ThunderboltTwoTone class="statistic-icon" />
              </div>
            </div>

            <div class="flex flex-col text-left space-y-1">
              <div> CTR</div>
              <div class="font-semibold text-lg"> {{ ctr }}%</div>
            </div>
          </div>
        </div>

        <Divider dashed />
        <VisitAnalysis :setting="state.sttData" />
      </Card>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .statistic-icon {
    @apply text-32px;
  }

  .bar-icon {
    @apply text-20px;
  }

  .btn-link {
    @apply col-span-2 py-2 rounded border border-solid border-blue-300 bg-blue-100 !h-60px;
  }

  .quota-warning {
    @apply col-span-1 md:col-span-4 flex items-center space-x-3 p-6 border rounded border-solid border-yellow-300 bg-yellow-50;

    .icon {
      @apply mr-2;
    }

    .contain {
      @apply flex-1;

      .title {
        @apply font-semibold;
      }

      .message {
        @apply text-sm text-gray-500 flex space-x-2 items-center;
      }
    }
  }
</style>
