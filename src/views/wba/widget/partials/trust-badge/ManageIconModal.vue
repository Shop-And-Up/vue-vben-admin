<script lang="ts" setup>
  import { Tabs, TabPane } from 'ant-design-vue';
  import { ref, computed, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';

  import { paymentTabs, badgeTabs, paymentIcons, badgeIcons } from './config';

  const [register, { closeModal }] = useModalInner();
  const emit = defineEmits(['update:iconSelected']);
  const props = defineProps({
    type: { type: String, default: 'payment' },
    iconSelected: { type: Array, default: () => [] },
  });

  const iconsRef = ref<any[]>([]);

  function handleVisibleChange(v) {
    v &&
      props.iconSelected &&
      nextTick(() => {
        iconsRef.value = [...props.iconSelected];
      });
  }

  const handleSave = () => {
    emit('update:iconSelected', iconsRef.value);
    closeModal();
  };

  const title = computed(() => {
    return (props.type == 'payment' ? 'Payment' : 'Badge') + ' icons';
  });

  const tabs = computed(() => {
    return props.type == 'payment' ? paymentTabs : badgeTabs;
  });

  const tabItems = computed(() => {
    const icons = props.type == 'payment' ? paymentIcons : badgeIcons;
    return icons.filter((c) => c.type == tabKey.value);
  });

  const tabKey = ref(tabs.value.find(() => true)?.id);

  const getActiveCls = (url) => {
    return iconsRef.value.includes(url) ? 'active' : '';
  };

  const toggleSelected = (url) => {
    const index = iconsRef.value.indexOf(url);
    if (index > -1) {
      iconsRef.value.splice(index, 1);
    } else {
      iconsRef.value.push(url);
    }
  };
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    @register="register"
    @visible-change="handleVisibleChange"
    @ok="handleSave"
    okText="Save"
    width="700px"
  >
    <Tabs v-model:activeKey="tabKey">
      <TabPane v-for="tab in tabs" :key="tab.id" :tab="tab.text">
        <div class="grid grid-cols-12 gap-4">
          <div
            v-for="(item, index) in tabItems"
            :key="index"
            :class="getActiveCls(item.icon)"
            @click="toggleSelected(item.icon)"
            class="col-span-6 md:col-span-4 xl:col-span-3 icon-item !h-150px"
          >
            <img class="w-120px" :src="item.icon" />
          </div>
        </div>
      </TabPane>
    </Tabs>
  </BasicModal>
</template>

<style lang="less" scoped>
  .icon-item {
    @apply bg-gray-100 rounded h-72px grid place-content-center cursor-pointer;

    &:hover {
      @apply bg-white border-2 border-light-400;
    }

    &.active {
      @apply bg-white rounded-lg  border-primary border-3;
    }
  }
</style>
