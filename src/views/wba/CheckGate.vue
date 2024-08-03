<script setup lang="ts">
  import { Badge as ABadge, Tooltip } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useUserStore } from '@/store/modules/user';

  const ABadgeRibbon = ABadge.Ribbon;
  const { isFreePlan } = useUserStore();
</script>

<template>
  <template v-if="isFreePlan">
    <Tooltip placement="right" title="Please upgrade your plan to use this feature">
      <a-badge :offset="[-38, -40]">
        <template #count>
          <a-badge-ribbon placement="end">
            <template #text>
              <Icon :size="17" icon="ant-design:crown-twotone" />
              Upgrade
            </template>
          </a-badge-ribbon>
        </template>
        <slot name="button" :isFreePlan="isFreePlan"></slot>
      </a-badge>
    </Tooltip>
  </template>
  <template v-else>
    <slot name="button" :isFreePlan="isFreePlan"></slot>
  </template>
</template>

<style lang="less" scoped></style>
