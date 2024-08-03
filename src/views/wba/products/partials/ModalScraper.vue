<script lang="ts" setup>
  import { Tabs, TabPane } from 'ant-design-vue';
  import { reactive } from 'vue';

  import Icon from '@/components/Icon/Icon.vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import ModalScraperForm from './ModalScraperForm.vue';
  import { ECommercePlatform } from '../../widget-config';

  const emit = defineEmits(['completed']);

  const state = reactive({
    activeTab: ECommercePlatform.AliExpress,
    modalData: null,
    saving: false,
    tabs: [
      {
        key: ECommercePlatform.AliExpress,
        icon: 'arcticons:aliexpress',
      },
      {
        key: ECommercePlatform.Amazon,
        icon: 'fa-brands:amazon',
      },
    ],
  });

  // Init modal data when open modal
  const [register, { closeModal, redoModalHeight }] = useModalInner((modalData) => {
    state.modalData = modalData;
    state.activeTab = modalData.scrape_type;
  });

  const handleCompleted = () => {
    emit('completed');
    closeModal();
  };

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
    :footer="false"
    :loading="state.saving"
    @register="register"
    title="Scrape Reviews"
    v-bind="$attrs"
    width="700px"
  >
    <Tabs v-model:activeKey="state.activeTab" centered @change="tabChange">
      <TabPane class="px-6" v-for="item in state.tabs" :key="item.key">
        <template #tab>
          <span> <Icon :icon="item.icon" /> {{ item.key }} </span>
        </template>
        <ModalScraperForm
          @completed="handleCompleted"
          :modalData="state.modalData!"
          :scrapeType="item.key"
        />
      </TabPane>
    </Tabs>
  </BasicModal>
</template>
