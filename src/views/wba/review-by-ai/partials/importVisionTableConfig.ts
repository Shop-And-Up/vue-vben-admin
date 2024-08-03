import { useTable } from '@/components/Table';
import { listReviewVisionAPI } from '@/api/wba/products-vision';

const [registerTable, { reload, getRawDataSource }] = useTable({
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      defaultHidden: true,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      sortDirections: ['descend', 'ascend'],
      width: 130,
    },
    {
      title: 'Feedback',
      dataIndex: 'feedback',
      width: 300,
    },
    {
      title: 'Feedback in English',
      dataIndex: 'feedback_translate',
      width: 300,
    },
    {
      title: 'Images',
      dataIndex: 'has_image',
      sortDirections: ['descend', 'ascend'],
      sorter: true,
      width: 120,
    },
  ],
  api: listReviewVisionAPI,
  fetchSetting: {
    listField: 'data',
    totalField: 'total',
  },
  actionColumn: {
    width: 100,
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
  immediate: false,
  resizeHeightOffset: 1,
  pagination: {
    pageSize: 5,
    pageSizeOptions: ['5', '8', '10', '20'],
  },
});

export { registerTable, reload, getRawDataSource };
