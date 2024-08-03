import { useTable } from '@/components/Table';
import { orderListAPI } from '@/api/wba/orders';

export const useOrderTable = () => {
  return useTable({
    // title: 'My Fulfilled Orders',
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        defaultHidden: true,
        sorter: true,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        width: 200,
        sorter: true,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        sorter: true,
        filters: [
          { text: 'Synchronized', value: 'sync' },
          { text: 'Scheduled', value: 'queue' },
          { text: 'Sending', value: 'sending' },
          { text: 'Sent', value: 'sent' },
          { text: 'Opened', value: 'opened' },
        ],
      },
      {
        title: 'Total Price',
        dataIndex: 'total_price',
        sorter: true,
      },
      {
        title: 'Customer',
        dataIndex: 'customer',
      },
      {
        title: 'Order Date',
        dataIndex: 'order_date',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Fulfillment Date',
        dataIndex: 'fulfillment_date',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Mail Scheduled',
        dataIndex: 'email_date',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
    ],
    api: orderListAPI,
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
