import { MuiDataGrid } from 'main/components/atoms/mui-data-grid';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  initialData,
  insertNewSupplies,
  selectSuppliesDetails,
  updateSuppliesDetail,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-add-slice';
import { generateUUID } from 'main/utils/generateUUID';
import { GridColDef, GridRowEditStopParams, GridRowModel, GridRowModesModel } from '@mui/x-data-grid';
import { useCallback, useState } from 'react';
import { Button } from 'reactstrap';
import useTableConfig from './useTableConfig';

function SuppliesStoreImportAddTable() {
  const dispatch = useAppDispatch();
  const suppliesDetails = useAppSelector(selectSuppliesDetails);
  const { suppliesIsLoading, columns } = useTableConfig();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({}); // Optional: For managing edit modes if needed

  const handleRowEditStop = useCallback(
    (params: GridRowEditStopParams, event: any) => {
      // Optional: Add logic based on params.reason if needed (e.g., 'escapeKeyDown')
      // console.log('Row edit stopped:', params.reason);

      // Prevent default behavior that might commit edits prematurely or interfere
      // event.defaultMuiPrevented = true; // Use if needed based on observed behavior

      // Logic for adding new row on Enter key press in the last row's last editable cell
      // This might need adjustment depending on exact column order and editability
      const isLastRow = params.id === suppliesDetails[suppliesDetails.length - 1]?.id;
      // Find the index of the last editable column using reverse and findIndex
      const reversedCols = columns.slice().reverse();
      const lastEditableReversedIndex = reversedCols.findIndex((col: GridColDef) => col.editable);
      const lastEditableColumnIndex =
        lastEditableReversedIndex === -1 ? -1 : columns.length - 1 - lastEditableReversedIndex;

      const isLastEditableCell =
        lastEditableColumnIndex !== -1 && params.field === columns[lastEditableColumnIndex]?.field;

      if (params.reason === 'enterKeyDown' && isLastRow && isLastEditableCell) {
        // Check if the current row has essential data (e.g., maVt) before adding new rows
        const currentRow = suppliesDetails.find((row) => row.id === params.id);
        if (currentRow && currentRow.maVt) {
          const newRows = Array.from({ length: 10 }, () => ({
            ...initialData,
            id: generateUUID(),
          }));
          dispatch(insertNewSupplies(newRows));
        }
      }
    },
    [dispatch, suppliesDetails, columns],
  );

  const handleAddRow = useCallback(() => {
    const newRows = Array.from({ length: 10 }, () => ({
      ...initialData,
      id: generateUUID(),
    }));

    dispatch(insertNewSupplies(newRows));
  }, [dispatch]);

  // processRowUpdate handles the actual data update after editing is committed
  const processRowUpdate = useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) => {
      // Merge the changes into the existing row data
      const updatedRow = { ...oldRow, ...newRow };

      // Ensure numeric fields are correctly typed if necessary
      updatedRow.soLuong = Number(updatedRow.soLuong) || 0; // Example conversion

      dispatch(
        updateSuppliesDetail({
          id: newRow.id,
          changes: updatedRow, // Send the entire updated row or just the changes
        }),
      );

      // Return the updated row to the grid
      return updatedRow;
    },
    [dispatch],
  );

  // Optional: Handle errors during row update
  const handleProcessRowUpdateError = useCallback((error: any) => {
    console.error('Error updating row:', error);
    // Potentially show a notification to the user
  }, []);

  return (
    <>
      <div className="d-flex justify-content-end pb-4">
        <EditPermissionAction>
          <Button color="primary" onClick={handleAddRow}>
            Thêm hàng
          </Button>
        </EditPermissionAction>
      </div>
      {/* <div style={{ height: 650, width: '100%' }}> */}
      <MuiDataGrid
        rows={suppliesDetails}
        columns={columns}
        loading={suppliesIsLoading}
        pageSizeOptions={[100]} // max 100 items/page
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError} // Handle potential errors
        hideFooter={suppliesDetails.length <= 100} // Ẩn pagination (tối da 100 item/page theo limit của MUI version)
        rowModesModel={rowModesModel} // Pass if managing edit modes
        onRowModesModelChange={setRowModesModel} // Pass if managing edit modes
        editMode="cell" // Explicitly set edit mode
      />
    </>
  );
}

export default SuppliesStoreImportAddTable;
