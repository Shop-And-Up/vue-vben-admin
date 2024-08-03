<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { TabPane, Tabs } from 'ant-design-vue';
  import { ref } from 'vue';

  const [register, { redoModalHeight }] = useModalInner((data) => {
    data && initData(data);
  });

  const activeTab = ref('best_reviews');

  function initData(type) {
    activeTab.value = type;
  }

  const tabChange = () => {
    setTimeout(() => {
      redoModalHeight();
    }, 200);

    setTimeout(() => {
      redoModalHeight();
    }, 2000);
  };
</script>

<template>
  <BasicModal
    :canFullscreen="false"
    :draggable="false"
    :footer="null"
    v-bind="$attrs"
    title="How to collapse reviews"
    @register="register"
    :width="800"
  >
    <Tabs v-model:activeKey="activeTab" centered @change="tabChange">
      <TabPane class="p-6 pt-3" key="best_reviews" tab="Best Reviews">
        <div>
          The system will <span class="font-bold"> automatically collapse </span> the best reviews
          that meet the following criteria: they must include feedback content, at least one image,
          and a rating of at least 4 stars. You can manage all your data on the
          <router-link class="font-bold mx-2 text-blue-500" :to="{ name: 'ReviewPage' }">
            Reviews
          </router-link>
          page.

          <div class="flex justify-center space-x-5 mt-2">
            <img
              src="/assets/img/best-reviews/guide-best-reviews-1.png"
              class="rounded max-w-500px border-solid border border-light-500"
            />
            <img
              src="/assets/img/best-reviews/guide-best-reviews-2.png"
              class="rounded max-w-500px border-solid border border-light-500"
            />
          </div>
        </div>
      </TabPane>
      <TabPane class="p-6 pt-3" key="verified_reviews" tab="Verified Reviews">
        <div class="pl-2">
          <!-- <span class="font-bold"> How to set verified? </span> -->

          <ul class="list-decimal list-inside">
            <li class="mt-2">
              Go to the
              <router-link class="font-bold mx-2 text-blue-500" :to="{ name: 'ReviewPage' }">
                Manage Reviews
              </router-link>

              page and select the reviews you want to set verified.
            </li>
            <li class="mt-2">
              Click
              <span class="font-semibold"> Bulk Action </span> button and choose
              <span class="font-semibold"> Verified/Unverified </span>
            </li>
            <li class="mt-2">
              To preview all verified reviews. At the customer name column, click the filter icon
              and select Verified to filter.
            </li>
          </ul>

          <div class="flex flex-col items-center justify-center space-y-5 mt-2">
            <img
              src="/assets/img/best-reviews/guide-verified-reviews-0.png"
              class="rounded max-w-500px border-solid border border-light-500"
            />
            <img
              src="/assets/img/best-reviews/guide-verified-reviews-1.png"
              class="rounded max-w-500px border-solid border border-light-500"
            />
          </div>
        </div>
      </TabPane>
    </Tabs>
  </BasicModal>
</template>
