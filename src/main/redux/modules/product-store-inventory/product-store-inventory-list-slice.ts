import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KhotpXuatNhapTonControllerFind200DataItem } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import moment, { Moment } from 'moment';

export type InventoryFilter = {
  startDate?: Moment;
  endDate?: Moment;
  productStore: string;
  productGroup: string;
  productCode: string;
};

type State = {
  inventoryTriggerFlag: boolean;
  inventoryFilter: InventoryFilter;
  inventoryTable: TableState<KhotpXuatNhapTonControllerFind200DataItem>;
};

// State
const initialState: State = {
  inventoryTriggerFlag: false,
  inventoryFilter: {
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
    productStore: '-1',
    productGroup: '-1',
    productCode: '',
  },
  inventoryTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const productStoreInventoryListSlice = createSlice({
  name: 'productStoreInventoryList',
  initialState,
  reducers: {
    setInventoryTableSelectedRows(state, action: PayloadAction<KhotpXuatNhapTonControllerFind200DataItem[]>) {
      state.inventoryTable.selectedRows = action.payload;
    },
    updateInventoryTable(state, action: PayloadAction<TableState<KhotpXuatNhapTonControllerFind200DataItem>>) {
      state.inventoryTable = { ...action.payload };
    },
    clickSearchInventory(state, action: PayloadAction<InventoryFilter>) {
      state.inventoryFilter = action.payload;
      state.inventoryTable.page = 1;
      state.inventoryTriggerFlag = !state.inventoryTriggerFlag;
    },
    resetProductStoreInventoryListState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  setInventoryTableSelectedRows,
  updateInventoryTable,
  clickSearchInventory,
  resetProductStoreInventoryListState,
} = productStoreInventoryListSlice.actions;

// Selectors
const selectProductStoreInventoryList = (state: RootState) => state.productStoreInventoryList;

export const selectInventoryFilter = createSelector(
  [selectProductStoreInventoryList],
  (productStoreInventoryList) => productStoreInventoryList.inventoryFilter,
);

export const selectInventoryTable = createSelector(
  [selectProductStoreInventoryList],
  (productStoreInventoryList) => productStoreInventoryList.inventoryTable,
);

export const selectInventoryTriggerFlag = createSelector(
  [selectProductStoreInventoryList],
  (productStoreInventoryList) => productStoreInventoryList.inventoryTriggerFlag,
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
  (inventoryTableSelectedRows) => inventoryTableSelectedRows.map((row) => row.maSanPham),
);

export default productStoreInventoryListSlice;
