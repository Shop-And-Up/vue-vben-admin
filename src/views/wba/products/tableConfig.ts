import { useTable } from '@/components/Table';
import { productListAPI } from '@/api/wba/products';

export const useProductTable = () => {
  return useTable({
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
        title: 'Reviews',
        dataIndex: 'average_rate',
        width: 100,
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Updated',
        dataIndex: 'updated_at',
        width: 100,
        sorter: true,
        defaultSortOrder: 'descend',
        sortDirections: ['descend', 'ascend'],
      },
    ],
    api: productListAPI,
    fetchSetting: {
      listField: 'data',
      totalField: 'total',
    },
    actionColumn: {
      width: 200,
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
