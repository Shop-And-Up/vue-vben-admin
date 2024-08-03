<script lang="ts" setup>
  import { TabPane, Tabs } from 'ant-design-vue';
  import { computed, reactive } from 'vue';

  import { BasicModal, useModalInner } from '@/components/Modal';
  import GuideModalAutoMail from './GuideModalAutoMail.vue';
  import GuideModalBookmarklet from './GuideModalBookmarklet.vue';
  import GuideModalCrawler from './GuideModalCrawler.vue';
  import GuideModalHelper from './GuideModalHelper.vue';
  import GuideModalImport from './GuideModalImport.vue';

  const emit = defineEmits(['reloadTable']);
  const [register, { closeModal, redoModalHeight }] = useModalInner((data) => {
    data && initData(data);
  });

  function initData(data: any) {
    if (data.tab !== undefined) {
      state.currentTab = data.tab;
      tabChange();
    }
  }

  const state = reactive({
    currentTab: 'import',
  });

  const tabs = [
    { id: 'import', text: 'Import CSV File' },
    { id: 'bookmarklet', text: 'Scraper Tool' },
    { id: 'crawler', text: 'Amazon Bot' },
    { id: 'mail', text: 'Orders & Email' },
    { id: 'guide', text: 'Filters Guide' },
  ];

  const tabChange = () => {
    setTimeout(() => {
      redoModalHeight();
    }, 200);

    setTimeout(() => {
      redoModalHeight();
    }, 2000);
  };

  const title = computed(() => tabs.find((c) => c.id == state.currentTab)?.text);
</script>

<template>
  <BasicModal
    :footer="null"
    @register="register"
    :draggable="false"
    v-bind="$attrs"
    :title="title"
    width="700px"
  >
    <Tabs v-model:activeKey="state.currentTab" centered @change="tabChange">
      <TabPane class="p-6 pt-0" v-for="tab in tabs" :key="tab.id" :tab="tab.text as any">
        <GuideModalImport
          v-show="tab.id == 'import'"
          @success="
            () => {
              emit('reloadTable');
              closeModal();
            }
          "
        />
        <GuideModalHelper v-show="tab.id == 'guide'" />
        <GuideModalBookmarklet v-show="tab.id == 'bookmarklet'" />
        <GuideModalCrawler v-show="tab.id == 'crawler'" />
        <GuideModalAutoMail v-show="tab.id == 'mail'" />
      </TabPane>
    </Tabs>
  </BasicModal>
</template>

<style lang="less" scoped></style>
