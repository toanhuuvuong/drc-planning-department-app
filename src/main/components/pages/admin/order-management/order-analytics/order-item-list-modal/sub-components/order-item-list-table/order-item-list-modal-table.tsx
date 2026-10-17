import {
  useQldhTransDonHangControllerDeleteById,
  useQldhTransDonHangControllerUpdateStatusById,
} from 'main/apis/drc/endpoints/qldh-trans-don-hang-controller/qldh-trans-don-hang-controller';
import {
  QldhTransDonHangControllerSearchItems200,
  QldhTransDonHangControllerSearchItems200DataItem,
} from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Page, ToastMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { TrangThaiDonHang } from 'main/constants/enums/order-management';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import { selectOrderItemTable, updateOrderItemTable } from 'main/redux/modules/order-management/order-analytics-slice';
import { generateColumnStyle } from 'main/utils';
import { useCallback } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import tableConfig from './table-config';

type Props = {
  data?: QldhTransDonHangControllerSearchItems200;
  dataIsLoading: boolean;
  handleRefreshTable: () => void;
};

function OrderItemListModalTable({
  data: { data, count: dataCount } = { data: [], count: 0 },
  dataIsLoading,
  handleRefreshTable,
}: Props) {
  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage, sortField, sortOrder } = useAppSelector(selectOrderItemTable);

  // React Query
  const { mutateAsync: deletedOrderMutateAsync, isPending: deletedOrderPending } =
    useQldhTransDonHangControllerDeleteById();
  const { mutateAsync: updatedOrderStatusMutateAsync, isPending: updatedOrderStatusPending } =
    useQldhTransDonHangControllerUpdateStatusById();

  // React Function
  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<QldhTransDonHangControllerSearchItems200DataItem>) => {
      const { page, sizePerPage, sortField, sortOrder } = newState;

      dispatch(
        updateOrderItemTable({
          page,
          sizePerPage,
          sortField,
          sortOrder,
        }),
      );
    },
    [dispatch],
  );

  const handleCompleteOrderClick = useCallback(
    (orderId: number) => {
      updatedOrderStatusMutateAsync({
        id: orderId,
      })
        .then((_) => {
          toast.success(ToastMessage.UPDATE_SUCCESS);
          handleRefreshTable();
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [handleRefreshTable, updatedOrderStatusMutateAsync],
  );

  const handleDeleteOrder = useCallback(
    (orderId: number) => {
      deletedOrderMutateAsync({ id: orderId })
        .then((_) => {
          handleRefreshTable();
          toast.success(ToastMessage.DELETE_SUCCESS);
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [deletedOrderMutateAsync, handleRefreshTable],
  );

  return (
    <ToolkitProvider
      data={data || []}
      keyField={`${FieldName.ID}_${FieldName.DON_HANG_ID}`}
      columns={[
        ...tableConfig.columns,
        {
          dataField: FieldName.ACTION,
          isDummyField: true,
          text: 'Thao tác',
          ...generateColumnStyle(),
          formatter: (_: any, row: QldhTransDonHangControllerSearchItems200DataItem) => {
            return (
              <div className="d-flex">
                <Link className="px-2" to={Page.ORDER_MANAGEMENT_DETAIL.PATH.replace(':id', String(row.donHangId))}>
                  <i className="fa-solid fa-eye" title="Xem" />
                </Link>
                {
                  <EditPermissionAction>
                    <Link className="px-2" to={Page.ORDER_MANAGEMENT_EDIT.PATH.replace(':id', String(row.donHangId))}>
                      <i className="fa-solid fa-pen-to-square" title="Sửa" />
                    </Link>
                  </EditPermissionAction>
                }
                {
                  <EditPermissionAction>
                    {TrangThaiDonHang.DANG_TIEN_HANH === row.trangThai && (
                      <Link
                        className="px-2"
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCompleteOrderClick(Number(row.donHangId));
                        }}>
                        <i className="fa-solid fa-check-circle text-green" title="Hoàn thành đơn hàng" />
                      </Link>
                    )}
                  </EditPermissionAction>
                }
                <Link
                  className="px-2"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteOrder(Number(row.donHangId));
                  }}>
                  <i className="fa-solid fa-trash" title="Xóa" />
                </Link>
              </div>
            );
          },
        },
      ]}>
      {(props: any) => (
        <>
          <div className="table-responsive">
            <BootstrapTable
              {...props.baseProps}
              remote
              bootstrap4
              bordered={false}
              pagination={paginationFactory({
                ...tableConfig.pagination,
                page: page,
                sizePerPage: sizePerPage,
                totalSize: dataCount,
              })}
              sort={
                sortField
                  ? {
                      dataField: sortField,
                      order: sortOrder,
                    }
                  : {}
              }
              onTableChange={handleTableChange}
              noDataIndication={() => (
                <div className="text-center">
                  {dataIsLoading || updatedOrderStatusPending || deletedOrderPending ? (
                    <BasicSpinner />
                  ) : (
                    'Không có kết quả nào được tìm thấy'
                  )}
                </div>
              )}
            />
          </div>
        </>
      )}
    </ToolkitProvider>
  );
}

export default OrderItemListModalTable;
