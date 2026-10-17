import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KhotpTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { Moment } from 'moment';

export type ProductImportFilter = {
  importStore: string;
  origin: string;
  startDate?: Moment;
  endDate?: Moment;
  searchField?: string;
  searchKey?: string;
  importStatus: string;
};

type State = {
  productImportTriggerFlag: boolean;
  productImportFilter: ProductImportFilter;
  productImportTable: TableState<KhotpTransPhieuNhapControllerFindDetail200DataItem>;
};

// State
const initialState: State = {
  productImportTriggerFlag: false,
  productImportFilter: {
    importStore: '-1',
    origin: '-1',
    importStatus: '-1',
  },
  productImportTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const productStoreImportListSlice = createSlice({
  name: 'productStoreImportList',
  initialState,
  reducers: {
    updateProductImportTable(
      state,
      action: PayloadAction<TableState<KhotpTransPhieuNhapControllerFindDetail200DataItem>>,
    ) {
      state.productImportTable = { ...action.payload };
    },
    clickSearchProductImport(state, action: PayloadAction<ProductImportFilter>) {
      state.productImportFilter = action.payload;
      state.productImportTable.page = 1;
      state.productImportTriggerFlag = !state.productImportTriggerFlag;
    },
    resetProductStoreImportListState() {
      return initialState;
    },
  },
});

// Action creators
export const { updateProductImportTable, clickSearchProductImport, resetProductStoreImportListState } =
  productStoreImportListSlice.actions;

// Selectors
const selectProductStoreImportList = (state: RootState) => state.productStoreImportList;

export const selectProductImportFilter = createSelector(
  [selectProductStoreImportList],
  (productStoreImportList) => productStoreImportList.productImportFilter,
);

export const selectProductImportTable = createSelector(
  [selectProductStoreImportList],
  (productStoreImportList) => productStoreImportList.productImportTable,
);

export const selectProductImportTriggerFlag = createSelector(
  [selectProductStoreImportList],
  (suppliesStoreProductImportList) => suppliesStoreProductImportList.productImportTriggerFlag,
);

export default productStoreImportListSlice;
