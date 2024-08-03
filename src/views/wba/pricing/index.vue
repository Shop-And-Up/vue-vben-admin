<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { Collapse, CollapsePanel } from 'ant-design-vue';

  import { useUserStore } from '@/store/modules/user';
  import { PageWrapper } from '@/components/Page';
  import { deleteChargeAPI, generateChargeURLAPI } from '@/api/wba/charge';
  import { useShopifyAppBridgeStore } from '@/store/modules/shopifyAppBridge';
  import ShopStatistic from '../components/ShopStatistic.vue';

  import { priceList, WidgetTemplates } from '../widget-config';
  import CheckedIcon from './assets/checked.svg';
  import CouponCode from './CouponCode.vue';
  import { useModal } from '@/components/Modal';

  const appBridgeStore = useShopifyAppBridgeStore();
  const userStore = useUserStore();
  const [registerModal, { openModal }] = useModal();

  const state = reactive<{ selectedPlan: any }>({
    selectedPlan: null,
  });

  const upgradeText = computed(() => {
    return !userStore.userInfo!.f_trial_days
      ? 'Upgrade'
      : 'Start ' + userStore.userInfo!.f_trial_days + '-Day Free Trial';
  });

  const currentPlan = computed(() => {
    return userStore.currentPlan;
  });

  const handleCharge = (plan: any) => {
    state.selectedPlan = plan.id;

    if (plan.title == 'Free') {
      deleteChargeAPI().then(() => {
        userStore.loginWithToken({ token: userStore.getToken, goHome: false });
      });
    } else {
      openModal(true, {});
    }
  };

  const handleCouponCancel = () => {
    state.selectedPlan = null;
  };

  const handleCouponSubmit = (couponCode: any) => {
    const selectedPlanObj = priceList.find((c) => c.id == state.selectedPlan);

    generateChargeURLAPI(selectedPlanObj?.title, couponCode).then((url) => {
      appBridgeStore.openRemotePath(url, false);
    });
  };

  const showPlan = (plan: any) => {
    if (currentPlan.value.title == 'Free Pro' && plan.title == 'Advance') {
      return false;
    }

    if (plan.title == 'Free Pro' && currentPlan.value.title != 'Free Pro') {
      return false;
    }

    return true;
  };
</script>
<template>
  <PageWrapper>
    <div class="mx-auto max-w-screen-md">
      <ShopStatistic />
      <div class="flex my-10 items-start justify-center space-x-10px">
        <!-- Pricing Card -->
        <template v-for="(plan, _) in priceList" :key="plan.id">
          <div
            v-show="showPlan(plan)"
            class="mb-5 flex flex-col p-6 max-w-sm text-center rounded bg-white shadow-sm w-270px"
          >
            <h3 class="mb-1 text-2xl font-bold">{{ plan.title }}</h3>
            <p class="mb-0 font-light text-gray-500 text-md xl:max-w-400px">
              {{ plan.description }}
            </p>
            <div class="flex justify-center items-baseline my-6">
              <span class="mr-2 text-5xl font-extrabold">${{ plan.price }}</span>
              <span class="text-gray-500" v-if="plan.price">/month</span>
            </div>
            <div>
              <a-button
                v-if="currentPlan!.id < plan.id"
                class="mb-10"
                type="primary"
                block
                size="large"
                @click="handleCharge(plan)"
                :loading="state.selectedPlan == plan.id"
              >
                {{ upgradeText }}
              </a-button>
              <a-button
                v-if="currentPlan!.id > plan.id"
                class="mb-10"
                type="dashed"
                block
                size="large"
                @click="handleCharge(plan)"
                :loading="state.selectedPlan == plan.id"
              >
                Downgrade
              </a-button>
              <a-button v-if="currentPlan!.id == plan.id" class="mb-10" disabled block size="large">
                You are here
              </a-button>
            </div>
            <!-- List -->
            <ul role="list" class="space-y-4 text-left">
              <li class="flex items-center space-x-3" v-for="(item, j) in plan.features" :key="j">
                <!-- Icon -->
                <CheckedIcon v-if="item" class="flex-shrink-0 w-5 h-5 text-green-500" />

                <span v-html="item"></span>
                <span v-if="!item">&nbsp;</span>
              </li>
            </ul>

            <div class="font-semibold mb-3 mt-6 text-center"> Unlimited features</div>
            <ul role="list" class="space-y-4 text-left">
              <li class="flex items-center space-x-3">
                <CheckedIcon class="flex-shrink-0 w-5 h-5 text-green-500" />
                <span> Google Product Reviews </span>
              </li>

              <li class="flex items-center space-x-3" v-for="(item, j) in WidgetTemplates" :key="j">
                <CheckedIcon class="flex-shrink-0 w-5 h-5 text-green-500" />

                <span>{{ item.name }}</span>
              </li>

              <li class="flex items-center space-x-3">
                <CheckedIcon class="flex-shrink-0 w-5 h-5 text-green-500" />

                <span> Bookmarklet scraper tool </span>
              </li>
            </ul>

            <!-- <div class="font-semibold mb-3 mt-6 text-left"> Coming soon </div>
            <ul role="list" class="space-y-4 text-left">
              <li class="flex items-center space-x-3" v-for="(tmpName, j) in planingList" :key="j">
                <CheckedIcon class="flex-shrink-0 w-5 h-5 text-green-500" />

                <span>{{ tmpName }}</span>
              </li>
            </ul> -->
          </div>
        </template>
      </div>

      <div class="mx-auto max-w-screen-md text-center mb-8">
        <h2 class="mb-4 text-2xl tracking-tight font-extrabold"> Frequently Asked Questions </h2>
      </div>
      <div>
        <Collapse :bordered="true">
          <CollapsePanel key="1">
            <template #header>
              <span class="font-bold"> How will you bill me? </span>
            </template>
            <p> We will charge you monthly through Shopify's policies and gateway. </p>
          </CollapsePanel>
          <CollapsePanel key="2">
            <template #header>
              <span class="font-bold">
                What happens if I reach my monthly quota of impressions?
              </span>
            </template>
            <p>
              If your quota is reached, all widgets will be <strong>temporarily hidden</strong> from
              your store. And they will appear right away when you upgrade your plan or wait until
              the next cycle.
            </p>
          </CollapsePanel>
          <CollapsePanel key="3">
            <template #header>
              <span class="font-bold"> Can I cancel or change my subscription at any time? </span>
            </template>
            <p>
              Absolutely. You can easily to cancel or change your subscription plan at any time.
              When you upgrade or downgrade your current plan, the payment cycle and fee will be
              charged based on the new one.
            </p>
          </CollapsePanel>
        </Collapse>
      </div>
    </div>

    <CouponCode
      @register="registerModal"
      @submit="handleCouponSubmit"
      @cancel="handleCouponCancel"
    />
  </PageWrapper>
</template>
