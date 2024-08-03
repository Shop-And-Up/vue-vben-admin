import { useTable } from '@/components/Table';
import { listWidgetByType } from '@/api/wba/widget';

const [registerTable, { reload, getRawDataSource }] = useTable({
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      defaultHidden: true,
    },
    {
      title: 'Customized at Page',
      dataIndex: 'page_type',
      sorter: true,
      filters: [
        { value: 'all', text: 'All' },
        { value: 'index', text: 'Home' },
        { value: 'product', text: 'Product' },
        { value: 'collection', text: 'Collection' },
        { value: 'list-collections', text: 'List Collections' },
        { value: 'cart', text: 'Cart' },
        { value: 'blog', text: 'Blog' },
        { value: 'article', text: 'Article' },
        { value: 'page', text: 'Page' },
        { value: 'page.contact', text: 'Page Contact' },
        { value: 'password', text: 'Password' },
        { value: 'search', text: 'Search' },
        { value: '404', text: '404' },
      ],
    },
    {
      title: 'Name',
      sorter: false,
      dataIndex: 'name',
    },
    {
      title: 'Show/Hide',
      dataIndex: 'is_show',
      sorter: true,
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend'],
      width: 200,
    },
  ],
  api: listWidgetByType,
  pagination: {
    pageSize: 5,
  },
  canResize: false, // Fix height
  fetchSetting: {
    listField: 'data',
    totalField: 'total',
  },
  actionColumn: {
    title: 'Action',
    dataIndex: 'action',
    width: 200,
  },
  rowKey: 'id',
  indexColumnProps: {
    title: 'Index',
  },
  clickToRowSelect: false,
  striped: true,
  bordered: true,
  showTableSetting: false,
  showIndexColumn: false,
});

export { registerTable, reload, getRawDataSource };
