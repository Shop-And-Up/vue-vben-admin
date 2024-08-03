import { useTable } from '@/components/Table';
import { listProductVisionAPI } from '@/api/wba/products-vision';

export const useProductVisionTable = () => {
  return useTable({
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        defaultHidden: true,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: 'Product Images',
        dataIndex: 'images',
      },
      {
        title: 'Reviews',
        dataIndex: 'total_review',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 180,
      },
    ],
    api: listProductVisionAPI,
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
    pagination: {
      pageSize: 5,
      pageSizeOptions: ['5', '8', '10', '20'],
    },
  });
};
