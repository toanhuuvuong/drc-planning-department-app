import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowModel,
  GridRowModesModel,
  GridRowsProp,
} from '@mui/x-data-grid';
import { GridColumnVisibilityModel } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import { generateUUID } from 'main/utils/generateUUID';
import React from 'react';
import './index.css';

interface DataGridProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  loading: boolean;
  onRowEditStop?: GridEventListener<'rowEditStop'>;
  processRowUpdate?: (newRow: GridRowModel, oldRow: GridRowModel) => Promise<GridRowModel> | GridRowModel;
  onProcessRowUpdateError?: (error: any) => void;
  onAddRow?: () => void;
  pageSizeOptions?: number[];
  columnVisibilityModel?: GridColumnVisibilityModel;
  hideFooter?: boolean;
  rowModesModel?: GridRowModesModel;
  onRowModesModelChange?: (newModeModel: GridRowModesModel) => void;
  editMode?: 'cell' | 'row';
}

const MuiDataGrid: React.FC<DataGridProps> = ({
  columns,
  rows,
  loading,
  onRowEditStop,
  processRowUpdate,
  onProcessRowUpdateError,
  pageSizeOptions = [10, 25, 50, 100],
  columnVisibilityModel,
  hideFooter = false,
  rowModesModel,
  onRowModesModelChange,
  editMode = 'cell',
  ...rest
}) => {
  return (
    <div style={{ height: 396, width: '100%' }}>
      <DataGrid
        {...rest}
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={pageSizeOptions}
        onRowEditStop={onRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={onProcessRowUpdateError}
        disableRowSelectionOnClick
        getRowId={(row) => row.id || generateUUID()}
        rowHeight={35}
        columnHeaderHeight={45}
        disableColumnMenu={true}
        editMode={editMode}
        rowModesModel={rowModesModel}
        onRowModesModelChange={onRowModesModelChange}
        columnVisibilityModel={columnVisibilityModel}
        hideFooter={hideFooter}
        sx={{
          border: '1px solid #ccc',
          fontFamily: 'Arial, sans-serif',
          fontSize: '0.875rem',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f2f2f2',
            borderBottom: '1px solid #ccc',
          },
          '& .MuiDataGrid-columnHeader': {
            borderRight: '1px solid #ccc',
            padding: '0 8px', // Add back some horizontal padding if needed
            display: 'flex',
            alignItems: 'center', // Keep vertical centering
            // Remove justify-content from the header cell itself
            '&:last-child': {
              borderRight: 0,
            },
          },
          // Target the container of the title for horizontal centering
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            display: 'flex',
            flexGrow: 1, // Allow the container to grow
            justifyContent: 'center', // Center content (the title) horizontally
            alignItems: 'center', // Ensure vertical alignment within this container too
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            color: '#333',
            fontSize: '0.875rem',
            textAlign: 'center', // Keep text-align center as a fallback
            // width: '100%', // May not be needed if container handles centering
          },
          '& .MuiDataGrid-cell': {
            borderRight: '1px solid #ccc',
            borderBottom: '1px solid #ccc',
            padding: '0 8px', // Ensure cell padding is consistent
            display: 'flex',
            alignItems: 'center',
            '&:last-child': {
              borderRight: 0,
            },
            '&.MuiDataGrid-cell--editing': {
              backgroundColor: 'rgba(255, 255, 0, 0.1)',
              outline: '1px solid #0078d4',
              outlineOffset: '-1px',
              boxShadow: 'none',
            },
            '&:focus': {
              outline: 'none',
            },
            '&:focus-within': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: '#e6f7ff',
            },
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-overlay': {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputBase-root': {
            height: '100%',
            margin: 0,
            fontSize: 'inherit',
            fontFamily: 'inherit',
            '& .MuiInputBase-input': {
              padding: '0 8px', // Ensure input padding is consistent
              height: '100%',
              boxSizing: 'border-box',
            },
            '&.MuiInput-underline:before, &.MuiInput-underline:after': {
              display: 'none',
            },
            '& fieldset': {
              border: 'none',
            },
          },
        }}
      />
    </div>
  );
};

export default MuiDataGrid;
