import { reviewsList, bestReviewsList } from '@/api/wba/reviews';

export const settings: any = {
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      defaultHidden: true,
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
      sortDirections: ['descend', 'ascend'],
      sorter: true,
      width: 100,
    },
  ],
  api: reviewsList,
  fetchSetting: {
    listField: 'data',
    totalField: 'total',
  },
  rowKey: 'id',
  indexColumnProps: {
    title: 'Index',
  },
  clickToRowSelect: true,
  striped: false,
  bordered: false,
  showTableSetting: false,
  showIndexColumn: false,
  pagination: {
    pageSize: 8,
    pageSizeOptions: ['5', '8', '10', '20'],
  },
};

export const previewSettings: any = {
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
  ],
  actionColumn: {
    width: 120,
    title: 'Action',
    dataIndex: 'action',
  },
  api: bestReviewsList,
  fetchSetting: {
    listField: 'data',
    totalField: 'total',
  },
  rowKey: 'id',
  indexColumnProps: {
    title: 'Index',
  },
  clickToRowSelect: false,
  striped: false,
  bordered: true,
  showTableSetting: false,
  showIndexColumn: false,
  pagination: {
    pageSize: 5,
    pageSizeOptions: ['5', '8', '10', '20'],
  },
};
