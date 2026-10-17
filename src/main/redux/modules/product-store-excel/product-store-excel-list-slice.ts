import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KhotpTransLenhNhap } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { Moment } from 'moment';

export type ProductExcelFilter = {
  startDate?: Moment;
  endDate?: Moment;
  productStoreExcelCode: string;
  productExcelTemplateType: string;
  status: string;
};

type State = {
  productStoreExcelTriggerFlag: boolean;
  productStoreExcelFilter: ProductExcelFilter;
  productStoreExcelTable: TableState<KhotpTransLenhNhap>;
};

// State
const initialState: State = {
  productStoreExcelTriggerFlag: false,
  productStoreExcelFilter: {
    productStoreExcelCode: '',
    productExcelTemplateType: '-1',
    status: '-1',
  },
  productStoreExcelTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const productStoreExcelListSlice = createSlice({
  name: 'productStoreExcelList',
  initialState,
  reducers: {
    updateProductStoreExcelTable(state, action: PayloadAction<TableState<KhotpTransLenhNhap>>) {
      state.productStoreExcelTable = { ...action.payload };
    },
    clickSearchProductStoreExcel(state, action: PayloadAction<ProductExcelFilter>) {
      state.productStoreExcelFilter = action.payload;
      state.productStoreExcelTable.page = 1;
      state.productStoreExcelTriggerFlag = !state.productStoreExcelTriggerFlag;
    },
    resetProductStoreExcelListState() {
      return initialState;
    },
  },
});

// Action creators
export const { updateProductStoreExcelTable, clickSearchProductStoreExcel, resetProductStoreExcelListState } =
  productStoreExcelListSlice.actions;

// Selectors
const selectProductStoreExcelList = (state: RootState) => state.productStoreExcelList;

export const selectProductExcelFilter = createSelector(
  [selectProductStoreExcelList],
  (productStoreExcelList) => productStoreExcelList.productStoreExcelFilter,
);

export const selectProductStoreExcelTable = createSelector(
  [selectProductStoreExcelList],
  (productStoreExcelList) => productStoreExcelList.productStoreExcelTable,
);

export const selectProductStoreExcelTriggerFlag = createSelector(
  [selectProductStoreExcelList],
  (productStoreExcelList) => productStoreExcelList.productStoreExcelTriggerFlag,
);

export default productStoreExcelListSlice;
