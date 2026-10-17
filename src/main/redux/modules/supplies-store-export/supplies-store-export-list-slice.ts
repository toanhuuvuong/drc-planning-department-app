import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KhovtTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { Moment } from 'moment';

export type ExportFilter = {
  startDate?: Moment;
  endDate?: Moment;
  exportStore: string;
  importStore: string;
  exportBillNo: string;
  exportStatus: string;
};

type State = {
  exportTriggerFlag: boolean;
  exportFilter: ExportFilter;
  exportTable: TableState<KhovtTransPhieuXuatControllerFindDetail200DataItem>;
};

// State
const initialState: State = {
  exportTriggerFlag: false,
  exportFilter: {
    exportStore: '-1',
    importStore: '-1',
    exportBillNo: '',
    exportStatus: '',
  },
  exportTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const suppliesStoreExportListSlice = createSlice({
  name: 'suppliesStoreExportList',
  initialState,
  reducers: {
    setExportTableSelectedRows(state, action: PayloadAction<KhovtTransPhieuXuatControllerFindDetail200DataItem[]>) {
      state.exportTable.selectedRows = action.payload;
    },
    updateExportTable(state, action: PayloadAction<TableState<KhovtTransPhieuXuatControllerFindDetail200DataItem>>) {
      state.exportTable = { ...action.payload };
    },
    clickSearchExport(state, action: PayloadAction<ExportFilter>) {
      state.exportFilter = action.payload;
      state.exportTable.page = 1;
      state.exportTriggerFlag = !state.exportTriggerFlag;
    },
    resetSuppliesStoreExportListState() {
      return initialState;
    },
  },
});

// Action creators
export const { setExportTableSelectedRows, updateExportTable, clickSearchExport, resetSuppliesStoreExportListState } =
  suppliesStoreExportListSlice.actions;

// Selectors
const selectSuppliesStoreExportList = (state: RootState) => state.suppliesStoreExportList;

export const selectExportFilter = createSelector(
  [selectSuppliesStoreExportList],
  (suppliesStoreExportList) => suppliesStoreExportList.exportFilter,
);

export const selectExportTable = createSelector(
  [selectSuppliesStoreExportList],
  (suppliesStoreExportList) => suppliesStoreExportList.exportTable,
);

export const selectExportTriggerFlag = createSelector(
  [selectSuppliesStoreExportList],
  (suppliesStoreExportList) => suppliesStoreExportList.exportTriggerFlag,
);

export const selectExportTableExcludeSelectedRows = createSelector([selectExportTable], (exportTable) => ({
  ...exportTable,
  selectedRows: undefined,
}));

export const selectExportTableSelectedRows = createSelector(
  [selectExportTable],
  (exportTable) => exportTable.selectedRows || [],
);

export const selectExportTableSelectedRowIds = createSelector(
  [selectExportTableSelectedRows],
  (exportTableSelectedRows) => exportTableSelectedRows.map((row) => row.id),
);

export default suppliesStoreExportListSlice;
