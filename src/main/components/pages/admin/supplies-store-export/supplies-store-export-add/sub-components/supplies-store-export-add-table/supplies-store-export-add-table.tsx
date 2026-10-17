import { FormikProps } from 'formik';
import { MuiDataGrid } from 'main/components/atoms/mui-data-grid';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import useSuppliesExportOptions from 'main/hooks/useSuppliesExportOptions'; // Import hook
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  initialData,
  insertNewSupplies,
  selectSuppliesDetails, // Import selector for details
  selectSuppliesFilter,
  updateSuppliesDetail,
  SuppliesDetailExport, // Import type if needed here
} from 'main/redux/modules/supplies-store-export/supplies-store-export-add-slice';
import { generateUUID } from 'main/utils/generateUUID';
import { GridRowEditStopParams, GridRowModel, GridRowModesModel, GridColDef } from '@mui/x-data-grid';
import { useCallback, useState } from 'react';
import { Button } from 'reactstrap';
import useTableConfig from './useTableConfig';
import { SuppliesStoreExportInfo } from '../supplies-store-export-add-info';

type Props = {
  formikProps: FormikProps<SuppliesStoreExportInfo>;
};

function SuppliesStoreExportAddTable({
  formikProps: { values, errors, setValues, handleChange, setFieldValue },
}: Props) {
  // Redux
  const dispatch = useAppDispatch();
  const suppliesDetails = useAppSelector(selectSuppliesDetails);
  const filter = useAppSelector(selectSuppliesFilter);

  const { suppliesOptions, suppliesIsLoading } = useSuppliesExportOptions(true); // Pass boolean instead of string

  const { columns } = useTableConfig(suppliesOptions, suppliesIsLoading, suppliesDetails, suppliesDetails); // Pass all required arguments

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop = useCallback(
    (params: GridRowEditStopParams, event: any) => {
      // Removed incorrect destructuring and dispatch call.
      // Updates should be handled by processRowUpdate.
      // You might still need logic here for specific 'reason' cases like 'escapeKeyDown'
      // or triggering actions like adding a new row on Enter.

      // Example: Logic for adding new row on Enter key press (if needed)
      const isLastRow = params.id === suppliesDetails[suppliesDetails.length - 1]?.id;
      const reversedCols = columns.slice().reverse();
      const lastEditableReversedIndex = reversedCols.findIndex((col: GridColDef) => col.editable);
      const lastEditableColumnIndex =
        lastEditableReversedIndex === -1 ? -1 : columns.length - 1 - lastEditableReversedIndex;
      const isLastEditableCell =
        lastEditableColumnIndex !== -1 && params.field === columns[lastEditableColumnIndex]?.field;

      if (params.reason === 'enterKeyDown' && isLastRow && isLastEditableCell) {
        const currentRow = suppliesDetails.find((row) => row.id === params.id);
        if (currentRow && currentRow.maVt) {
          // Check essential data
          const newRows = Array.from({ length: 10 }, () => ({
            ...initialData,
            id: generateUUID(),
          }));
          dispatch(insertNewSupplies(newRows));
        }
      }
    },
    [dispatch, suppliesDetails, columns], // Keep dependencies
  );

  const handleAddRow = useCallback(() => {
    const newRows = Array.from({ length: 10 }, () => ({
      ...initialData,
      id: generateUUID(),
    }));

    dispatch(insertNewSupplies(newRows));
  }, [dispatch]);

  const processRowUpdate = useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel): Promise<GridRowModel> | GridRowModel => {
      // Merge changes
      const updatedRow = { ...oldRow, ...newRow };

      // Ensure numeric types if necessary
      updatedRow.soLuong = Number(updatedRow.soLuong) || 0;

      dispatch(
        updateSuppliesDetail({
          id: newRow.id,
          changes: updatedRow,
        }),
      );
      return updatedRow; // Return the updated row
    },
    [dispatch],
  );

  const handleProcessRowUpdateError = useCallback((error: any) => {
    // Handle row update error
  }, []);

  return (
    <>
      <div className="d-flex justify-content-end pb-4">
        <EditPermissionAction>
          <Button color="primary" onClick={handleAddRow} disabled={!filter.suppliesStoreCode}>
            Thêm hàng
          </Button>
        </EditPermissionAction>
      </div>
      <div className="table-responsive">
        <MuiDataGrid
          rows={suppliesDetails}
          columns={columns}
          loading={suppliesIsLoading} // Pass loading state to MuiDataGrid
          pageSizeOptions={[100]} // max 100 items/page
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          hideFooter={suppliesDetails.length <= 100} // Ẩn pagination (tối da 100 item/page theo limit của MUI version)
        />
      </div>
    </>
  );
}

export default SuppliesStoreExportAddTable;
