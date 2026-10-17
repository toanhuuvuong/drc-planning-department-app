import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KhotpTransLenhXuat } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { Moment } from 'moment';

export type ProductCommandFilter = {
  exportStore: string;
  startDate?: Moment;
  endDate?: Moment;
  exportBillNo: string;
};

type State = {
  productCommandExportTriggerFlag: boolean;
  productCommandExportFilter: ProductCommandFilter;
  productCommandExportTable: TableState<KhotpTransLenhXuat>;
};

// State
const initialState: State = {
  productCommandExportTriggerFlag: false,
  productCommandExportFilter: {
    exportStore: '-1',
    exportBillNo: '',
  },
  productCommandExportTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const productCommandExportListSlice = createSlice({
  name: 'productCommandExportList',
  initialState,
  reducers: {
    updateProductCommandExportTable(state, action: PayloadAction<TableState<KhotpTransLenhXuat>>) {
      state.productCommandExportTable = { ...action.payload };
    },
    clickSearchProductCommandExport(state, action: PayloadAction<ProductCommandFilter>) {
      state.productCommandExportFilter = action.payload;
      state.productCommandExportTable.page = 1;
      state.productCommandExportTriggerFlag = !state.productCommandExportTriggerFlag;
    },
    resetProductCommandExportListState() {
      return initialState;
    },
  },
});

// Action creators
export const { updateProductCommandExportTable, clickSearchProductCommandExport, resetProductCommandExportListState } =
  productCommandExportListSlice.actions;

// Selectors
const selectProductCommandExportList = (state: RootState) => state.productCommandExportList;

export const selectProductCommandFilter = createSelector(
  [selectProductCommandExportList],
  (productCommandExportList) => productCommandExportList.productCommandExportFilter,
);

export const selectProductCommandExportTable = createSelector(
  [selectProductCommandExportList],
  (productCommandExportList) => productCommandExportList.productCommandExportTable,
);

export const selectProductCommandExportTriggerFlag = createSelector(
  [selectProductCommandExportList],
  (suppliesStoreProductCommandExportList) => suppliesStoreProductCommandExportList.productCommandExportTriggerFlag,
);

export default productCommandExportListSlice;
