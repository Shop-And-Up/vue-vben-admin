import { useTable } from '@/components/Table';
import { crawlerListAPI } from '@/api/wba/crawler';

export const useCrawlerTable = () => {
  return useTable({
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        defaultHidden: true,
        sorter: true,
      },
      {
        title: 'Product',
        dataIndex: 'product',
        width: 200,
      },
      {
        title: 'Product code',
        dataIndex: 'type',
        sorter: false,
        width: 100,
      },
      {
        title: 'State',
        dataIndex: 'state',
        sorter: true,
        width: 100,
        filters: [
          { text: 'Done', value: 'done' },
          { text: 'Syncing', value: 'syncing' },
          { text: 'Pending', value: 'pending' },
          { text: 'Error', value: 'error' },
        ],
      },
      {
        title: 'Auto sync',
        dataIndex: 'status',
        sorter: true,
        width: 100,
      },
      {
        title: 'Last sync',
        dataIndex: 'last_sync_time',
        width: 100,
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Next sync',
        dataIndex: 'next_sync_time',
        width: 100,
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
    ],
    api: crawlerListAPI,
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
};
