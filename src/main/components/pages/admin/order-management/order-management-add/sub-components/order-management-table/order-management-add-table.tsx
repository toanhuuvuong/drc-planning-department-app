import { FormikProps } from 'formik';
import { MuiDataGrid } from 'main/components/atoms/mui-data-grid';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  initialData,
  insertNewOrders,
  selectOrdersDetails,
  updateOrdersDetails,
} from 'main/redux/modules/order-management/order-management-add-slice';
import { generateUUID } from 'main/utils/generateUUID';
import { calculateTonKhoDuKien } from 'main/utils/order-management-utils';
import { useCallback } from 'react';
import { Button } from 'reactstrap';
import useTableConfig from './useTableConfig';
import { OrderManagementInfo } from '../order-management-add-info';

type Props = {
  formikProps: FormikProps<OrderManagementInfo>;
};

function OrderManagementAddTable(formikProps: Props) {
  const dispatch = useAppDispatch();
  const suppliesDetails = useAppSelector(selectOrdersDetails);

  const { IsLoadingProductData, columns } = useTableConfig(formikProps);

  const handleRowEditStop = useCallback(
    (params: any, event: any) => {
      const { rowId, newValue } = params;

      // Dispatch an action to update the row data in Redux
      dispatch(updateOrdersDetails({ id: rowId, changes: newValue }));

      // Add new row logic (if last row is edited)
      if (params.reason === 'enterKeyDown' && params.row.id === suppliesDetails.length - 1) {
        const newRows = Array.from({ length: 10 }, () => ({
          ...initialData,
          id: generateUUID(),
        }));
        dispatch(insertNewOrders(newRows));
      }
    },
    [dispatch, suppliesDetails.length],
  );

  const handleAddRow = useCallback(() => {
    const newRows = Array.from({ length: 10 }, () => ({
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
        soLuong: newRow.soLuong != null ? Number(newRow.soLuong) : 0,
        tonKhoDuKien: calculateTonKhoDuKien(soLuong, soLuongGiuHang, tonKho),
        // soLuongThucTe: calculateSoLuongThucTe(soLuongThucTe, tonKho),
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
      <div className="d-flex justify-content-end pb-4">
        <EditPermissionAction>
          <Button color="primary" onClick={handleAddRow}>
            Thêm hàng
          </Button>
        </EditPermissionAction>
      </div>
      <div style={{ width: '100%', overflow: 'auto' }}>
        <MuiDataGrid
          rows={suppliesDetails}
          columns={columns}
          loading={IsLoadingProductData}
          pageSizeOptions={[100]} // max 100 items/page
          onRowEditStop={handleRowEditStop}
          processRowUpdate={handleRowEdit}
          hideFooter={suppliesDetails.length <= 100} // Ẩn pagination (tối da 100 items/page theo limit của MUI version)
        />
      </div>
    </>
  );
}

export default OrderManagementAddTable;
