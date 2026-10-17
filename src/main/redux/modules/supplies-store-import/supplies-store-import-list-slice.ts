import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KhovtTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { Moment } from 'moment';

export type ImportFilter = {
  importStore: string;
  origin: string;
  startDate?: Moment;
  endDate?: Moment;
  searchField?: string;
  searchKey?: string;
  importStatus: string;
};

type State = {
  importTriggerFlag: boolean;
  importFilter: ImportFilter;
  importTable: TableState<KhovtTransPhieuNhapControllerFindDetail200DataItem>;
};

// State
const initialState: State = {
  importTriggerFlag: false,
  importFilter: {
    importStore: '-1',
    origin: '-1',
    importStatus: '-1',
  },
  importTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const suppliesStoreImportListSlice = createSlice({
  name: 'suppliesStoreImportList',
  initialState,
  reducers: {
    updateImportTable(state, action: PayloadAction<TableState<KhovtTransPhieuNhapControllerFindDetail200DataItem>>) {
      state.importTable = { ...action.payload };
    },
    clickSearchImport(state, action: PayloadAction<ImportFilter>) {
      state.importFilter = action.payload;
      state.importTable.page = 1;
      state.importTriggerFlag = !state.importTriggerFlag;
    },
    resetSuppliesStoreImportListState() {
      return initialState;
    },
  },
});

// Action creators
export const { updateImportTable, clickSearchImport, resetSuppliesStoreImportListState } =
  suppliesStoreImportListSlice.actions;

// Selectors
const selectSuppliesStoreImportList = (state: RootState) => state.suppliesStoreImportList;

export const selectImportFilter = createSelector(
  [selectSuppliesStoreImportList],
  (suppliesStoreImportList) => suppliesStoreImportList.importFilter,
);

export const selectImportTable = createSelector(
  [selectSuppliesStoreImportList],
  (suppliesStoreImportList) => suppliesStoreImportList.importTable,
);

export const selectImportTriggerFlag = createSelector(
  [selectSuppliesStoreImportList],
  (suppliesStoreImportList) => suppliesStoreImportList.importTriggerFlag,
);

export default suppliesStoreImportListSlice;
