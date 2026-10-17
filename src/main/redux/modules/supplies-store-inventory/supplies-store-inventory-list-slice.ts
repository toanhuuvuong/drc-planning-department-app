import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KhovtXuatNhapTonControllerFind200DataItem } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import moment, { Moment } from 'moment';

export type InventoryFilter = {
  startDate?: Moment;
  endDate?: Moment;
  suppliesStore: string;
  suppliesGroup: string;
  suppliesCode: string;
};

type State = {
  inventoryTriggerFlag: boolean;
  inventoryFilter: InventoryFilter;
  inventoryTable: TableState<KhovtXuatNhapTonControllerFind200DataItem>;
};

// State
const initialState: State = {
  inventoryTriggerFlag: false,
  inventoryFilter: {
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
    suppliesStore: '-1',
    suppliesGroup: '-1',
    suppliesCode: '',
  },
  inventoryTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const suppliesStoreInventoryListSlice = createSlice({
  name: 'suppliesStoreInventoryList',
  initialState,
  reducers: {
    setInventoryTableSelectedRows(state, action: PayloadAction<KhovtXuatNhapTonControllerFind200DataItem[]>) {
      state.inventoryTable.selectedRows = action.payload;
    },
    updateInventoryTable(state, action: PayloadAction<TableState<KhovtXuatNhapTonControllerFind200DataItem>>) {
      state.inventoryTable = { ...action.payload };
    },
    clickSearchInventory(state, action: PayloadAction<InventoryFilter>) {
      state.inventoryFilter = action.payload;
      state.inventoryTable.page = 1;
      state.inventoryTriggerFlag = !state.inventoryTriggerFlag;
    },
    resetSuppliesStoreInventoryListState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  setInventoryTableSelectedRows,
  updateInventoryTable,
  clickSearchInventory,
  resetSuppliesStoreInventoryListState,
} = suppliesStoreInventoryListSlice.actions;

// Selectors
const selectSuppliesStoreInventoryList = (state: RootState) => state.suppliesStoreInventoryList;

export const selectInventoryFilter = createSelector(
  [selectSuppliesStoreInventoryList],
  (suppliesStoreInventoryList) => suppliesStoreInventoryList.inventoryFilter,
);

export const selectInventoryTable = createSelector(
  [selectSuppliesStoreInventoryList],
  (suppliesStoreInventoryList) => suppliesStoreInventoryList.inventoryTable,
);

export const selectInventoryTriggerFlag = createSelector(
  [selectSuppliesStoreInventoryList],
  (suppliesStoreInventoryList) => suppliesStoreInventoryList.inventoryTriggerFlag,
);

export const selectInventoryTableExcludeSelectedRows = createSelector([selectInventoryTable], (inventoryTable) => ({
  ...inventoryTable,
  selectedRows: undefined,
}));

export const selectInventoryTableSelectedRows = createSelector(
  [selectInventoryTable],
  (inventoryTable) => inventoryTable.selectedRows || [],
);

export const selectInventoryTableSelectedRowIds = createSelector(
  [selectInventoryTableSelectedRows],
  (inventoryTableSelectedRows) => inventoryTableSelectedRows.map((row) => row.maVt),
);

export default suppliesStoreInventoryListSlice;
