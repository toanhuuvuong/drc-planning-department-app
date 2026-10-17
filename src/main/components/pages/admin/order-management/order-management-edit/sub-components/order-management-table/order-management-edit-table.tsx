import { MuiDataGrid } from 'main/components/atoms/mui-data-grid';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import { useAppDispatch } from 'main/redux/hooks';
import {
  initialData,
  insertNewOrders,
  QldhTransDonHangItemExcludingIdWithRelationsIds,
  updateOrdersDetails,
} from 'main/redux/modules/order-management/order-management-edit-slice';
import { SelectOption } from 'main/types/select-option';
import { generateUUID } from 'main/utils/generateUUID';
import { calculateTonKhoDuKien } from 'main/utils/order-management-utils';
import { useCallback } from 'react';
import { Button } from 'reactstrap';
import useTableConfig from './useTableConfig';

type Props = {
  productDataOptions?: SelectOption[];
  IsLoadingProductData?: boolean;
  orderManagementInfoDetails: QldhTransDonHangItemExcludingIdWithRelationsIds[];
};

function OrderManagementEditTable({ IsLoadingProductData, orderManagementInfoDetails }: Readonly<Props>) {
  const dispatch = useAppDispatch();
  const actionPermission = usePermissionAction();

  const { columns } = useTableConfig({ orderManagementInfoDetails });

  const handleRowEditStop = useCallback(
    (params: any) => {
      const { rowId, newValue } = params;

      // Dispatch an action to update the row data in Redux
      dispatch(updateOrdersDetails({ id: rowId, changes: newValue }));

      // Add new row logic (if last row is edited)
      if (params.reason === 'enterKeyDown' && params.row.id === orderManagementInfoDetails.length - 1) {
        const newRows = Array.from({ length: 10 }, () => ({
          ...initialData,
          id: generateUUID(),
        }));
        dispatch(insertNewOrders(newRows));
      }
    },
    [dispatch, orderManagementInfoDetails.length],
  );

  const handleAddRow = useCallback(() => {
    const newRows = Array.from({ length: 1 }, () => ({
      ...initialData,
      id: generateUUID(),
    }));

    dispatch(insertNewOrders(newRows));
  }, [dispatch]);

  const handleRowEdit = useCallback(
    (newRow: any) => {
      const { tonKho, soLuong, soLuongGiuHang } = newRow;
      const updatedRow = {
        ...newRow,
        soLuong: newRow.soLuong,
        tonKhoDuKien: calculateTonKhoDuKien(soLuong, soLuongGiuHang, tonKho),
      };

      dispatch(
        updateOrdersDetails({
          id: newRow.id,
          changes: {
            ...updatedRow,
          },
        }),
      );

      return updatedRow;
    },
    [dispatch],
  );

  return (
    <>
      <EditPermissionAction>
        <div className="d-flex justify-content-end pb-4">
          <Button color="primary" onClick={handleAddRow}>
            Thêm hàng
          </Button>
        </div>
      </EditPermissionAction>
      <div style={{ width: '100%', overflow: 'auto' }}>
        <MuiDataGrid
          rows={orderManagementInfoDetails}
          columns={columns}
          loading={!!IsLoadingProductData}
          pageSizeOptions={[100]} // max 100 items/page
          onRowEditStop={handleRowEditStop}
          processRowUpdate={handleRowEdit}
          columnVisibilityModel={{ actions: actionPermission }}
          hideFooter={orderManagementInfoDetails.length <= 100} // Ẩn pagination (tối da 100 item/page theo limit của MUI version)
        />
      </div>
    </>
  );
}

export default OrderManagementEditTable;
