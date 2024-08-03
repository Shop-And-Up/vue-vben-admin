<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { Tooltip } from 'ant-design-vue';

  import { useUserStore } from '@/store/modules/user';
  import Icon from '@/components/Icon/Icon.vue';

  const userStore = useUserStore();
  const currentPlan = userStore.currentPlan;

  const impressTitle = computed(() => {
    return userStore.userInfo!.quota_reach_limit
      ? 'Your quota limit reached. So all widgets will be temporarily hidden from your store, please upgrade your plan to show your widgets.'
      : 'Impression counter';
  });

  onMounted(() => {
    userStore.validUserInfoAction();
  });
</script>
<template>
  <div class="bg-white rounded p-6 border border-solid border-gray-100">
    <div class="flex items-center space-x-4">
      <div class="relative">
        <div class="h-10 w-10 border bg-gray-200 border-gray-200 rounded"></div>
        <div
          class="h-10 w-10 grid place-content-center border border-gray-200 rounded absolute top-1 left-1 bg-white"
        >
          <Icon :size="20" icon="logos:shopify" />
        </div>
      </div>

      <div class="flex flex-col text-left">
        <div class="font-semibold text-lg">
          {{ userStore.userInfo!.username }}
        </div>
        <div class="text-xs text-gray-500">
          {{ userStore.userInfo!.email }}
        </div>
      </div>

      <div class="flex-grow text-right">
        <a-button @click="userStore.goToStore" type="link" class="!font-semibold !px-0">
          Go to Store
        </a-button>
      </div>
    </div>
    <div class="flex items-center justify-between mt-5">
      <div class="flex flex-col text-left">
        <div class="font-semibold text-lg"> {{ currentPlan!.title }} plan</div>
        <div class="text-xs text-gray-500" v-if="!currentPlan!.quota_view">
          {{ currentPlan!.description }}
        </div>
        <div class="font-light text-xs" v-if="currentPlan!.quota_view">
          Your quota will be reset on
          <span class="font-medium text-blue-400">
            {{ userStore.userInfo!.quota_reset_on.substr(0, 10) }}
          </span>
        </div>
        <div
          class="text-gray-500 text-xs mt-2"
          v-if="
            userStore.userInfo!.charge_name == 'Pro' &&
            !userStore.userInfo!.charge_id &&
            userStore.userInfo!.f_trial_days
          "
        >
          Your Free Pro plan will end on
          <span class="font-medium text-blue-400">
            {{ userStore.userInfo!.free_pro_plan_date!.substr(0, 10) }}
          </span>
        </div>
      </div>
      <div class="flex-shrink">
        <Tooltip placement="top" :title="impressTitle">
          <div
            class="text-primary font-semibold relative"
            :class="{ '!text-red-600': userStore.userInfo!.quota_reach_limit }"
          >
            <span
              v-if="userStore.userInfo!.quota_reach_limit"
              class="flex absolute h-2 w-2 top-0 left-0 mt-7px -ml-5"
            >
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
              ></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <template v-if="currentPlan!.quota_view">
              {{ userStore.userInfo?.quota_view }}/{{ currentPlan!.quota_view }}
            </template>
            <template v-if="!currentPlan!.quota_view"> Unlimited</template>
          </div>
        </Tooltip>
      </div>
    </div>
  </div>
</template>
