<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs, TabPane } from 'ant-design-vue';

  import { BasicModal, useModalInner } from '@/components/Modal';
  import UseAppBlockWidget from './UseAppBlockWidget.vue';
  import UseGlobalWidget from './UseGlobalWidget.vue';

  const [register, { redoModalHeight }] = useModalInner(() => {
    redoModalHeight();

    setTimeout(() => {
      redoModalHeight();
    }, 1000);
  });

  const activeTab = ref('block');
  const tabs = [
    { id: 'block', text: 'App Blocks' },
    { id: 'embeds', text: 'App Embeds' },
  ];

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
    title="Customize widgets from Shopify editor"
    @register="register"
    width="700px"
  >
    <Tabs v-model:activeKey="activeTab" centered @change="tabChange">
      <TabPane class="p-6 pt-0" v-for="tab in tabs" :key="tab.id" :tab="tab.text">
        <UseAppBlockWidget v-show="tab.id == 'block'" />
        <UseGlobalWidget v-show="tab.id == 'embeds'" />
      </TabPane>
    </Tabs>
  </BasicModal>
</template>

<style lang="less" scoped>
  ul {
    li {
      @apply mt-7;

      span.link {
        @apply text-blue-600 cursor-pointer;
      }
    }
  }
</style>
