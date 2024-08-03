import { Ref } from 'vue';

import { useTable } from '@/components/Table';
import { reviewsList } from '@/api/wba/reviews';
import { TableRowSelection } from '@/components/Table/src/types/table';

const [registerTable, { reload, getRawDataSource }] = useTable({
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      defaultHidden: true,
    },
    {
      title: 'Customer Name',
      dataIndex: 'is_verified',
      width: 200,
      filters: [{ text: 'Verified', value: 'is_verified' }],
    },
    {
      title: 'Feedback',
      dataIndex: 'feedback',
      width: 300,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      sortDirections: ['descend', 'ascend'],
      sorter: true,
      width: 130,
      filters: [
        { text: '5 stars', value: '5' },
        { text: '4 stars', value: '4' },
        { text: '3 stars', value: '3' },
        { text: '2 stars', value: '2' },
        { text: '1 stars', value: '1' },
      ],
    },
    {
      title: 'Images',
      dataIndex: 'image_count',
      sortDirections: ['descend', 'ascend'],
      sorter: true,
      width: 120,
    },
    {
      title: 'Date',
      dataIndex: 'feedback_date',
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend'],
      sorter: true,
      width: 100,
    },
    {
      title: 'Last Change',
      dataIndex: 'updated_at',
      sortDirections: ['descend', 'ascend'],
      sorter: true,
      width: 100,
    },
    {
      title: 'Published',
      dataIndex: 'status',
      sortDirections: ['descend', 'ascend'],
      sorter: true,
      width: 120,
      filters: [
        { text: 'Published', value: 'published' },
        { text: 'Unpublished', value: 'unpublished' },
      ],
    },
  ],
  api: reviewsList,
  fetchSetting: {
    listField: 'data',
    totalField: 'total',
  },
  actionColumn: {
    width: 120,
    title: 'Action',
    dataIndex: 'action',
  },
  rowKey: 'id',
  indexColumnProps: {
    title: 'Index',
  },
  clickToRowSelect: false,
  striped: false,
  bordered: false,
  showTableSetting: false,
  showIndexColumn: false,
});

export const rowSelection = (checkedRows: Ref): TableRowSelection => {
  return {
    type: 'checkbox',
    onChange(checkedItems) {
      checkedRows.value = checkedItems;
    },
    // getCheckboxProps(record: Recordable) {
    //   return { disabled: false };
    // },
  };
};

export { registerTable, reload, getRawDataSource };
