<script lang="ts" setup>
  import { Tabs, TabPane } from 'ant-design-vue';
  import { reactive } from 'vue';

  import { BasicModal, useModalInner } from '@/components/Modal';
  import CreateByManualForm from './CreateByManualForm.vue';
  import CreateByBookmarklet from './CreateByBookmarklet.vue';

  const emit = defineEmits(['storaged']);
  const state = reactive({
    activeTab: 'manual',
    modelData: null,
    saving: false,
  });

  // Init modal data when open modal
  const [register, { closeModal, redoModalHeight }] = useModalInner((modalData) => {
    modalData && initData(modalData);
  });

  const initData = (modelData) => {
    state.modelData = modelData;
    state.activeTab = 'manual';
  };

  const handleSave = () => {
    emit('storaged');
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
    title="Setup Scheduler"
    :footer="false"
    :loading="state.saving"
    @register="register"
    v-bind="$attrs"
    width="700px"
  >
    <Tabs v-model:activeKey="state.activeTab" centered @change="tabChange">
      <TabPane class="px-6" key="manual" tab="Manual">
        <CreateByManualForm
          :modelData="state.modelData!"
          v-model:saving="state.saving"
          @storaged="handleSave"
        />
      </TabPane>
      <TabPane class="px-6" key="bookmarklet" tab="Scraper Tool">
        <CreateByBookmarklet />
      </TabPane>
    </Tabs>
  </BasicModal>
</template>
