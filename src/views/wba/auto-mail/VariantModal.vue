<script lang="ts" setup>
  import { Table as ATable } from 'ant-design-vue';

  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useUserStore } from '@/store/modules/user';

  const [register, { closeModal }] = useModalInner();
  const { userInfo } = useUserStore();

  const dataSource = [
    { key: '6', variant: '@Store_Name', example: userInfo?.username },
    { key: '5', variant: '@Order_Name', example: '#9999' },
    { key: '2', variant: '@Buyer_First_Name', example: 'John' },
    { key: '3', variant: '@Buyer_Last_Name', example: 'Smith' },
    { key: '1', variant: '@Buyer_Full_Name', example: 'John Smith' },
    { key: '4', variant: '@Buyer_Email', example: 'JohnSmith@sample.mail' },
  ];

  const columns = [
    {
      title: 'Variant',
      dataIndex: 'variant',
      key: 'variant',
    },
    {
      title: 'Example Value',
      dataIndex: 'example',
      key: 'example',
    },
  ];
</script>

<template>
  <BasicModal :canFullscreen="false" v-bind="$attrs" @register="register" title="Variant List">
    <a-table :dataSource="dataSource" :columns="columns" :pagination="false" />

    <template #footer>
      <a-button key="back" @click="closeModal">Cancel</a-button>
    </template>
  </BasicModal>
</template>

<style lang="less" scoped></style>
