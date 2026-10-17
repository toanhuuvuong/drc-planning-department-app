import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QldhTransDonHangControllerSearchItems200DataItem } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';

export type OrderItemFilter = {
  orderItemProductCode: string;
  orderItemStoreCode: string;
};

type State = {
  orderItemTriggerFlag: boolean;
  orderItemFilter: OrderItemFilter;
  orderItemTable: TableState<QldhTransDonHangControllerSearchItems200DataItem>;
};

// State
const initialState: State = {
  orderItemTriggerFlag: false,
  orderItemFilter: {
    orderItemProductCode: '',
    orderItemStoreCode: '-1',
  },
  orderItemTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const orderAnalyticsSlice = createSlice({
  name: 'orderAnalytics',
  initialState,
  reducers: {
    updateOrderItemTable(state, action: PayloadAction<TableState<QldhTransDonHangControllerSearchItems200DataItem>>) {
      state.orderItemTable = { ...action.payload };
    },
    searchOrderItem(state, action: PayloadAction<OrderItemFilter>) {
      state.orderItemFilter = action.payload;
      state.orderItemTable.page = 1;
      state.orderItemTriggerFlag = !state.orderItemTriggerFlag;
    },
    resetOrderItemFilterAndTable(state) {
      state.orderItemFilter = initialState.orderItemFilter;
      state.orderItemTable = initialState.orderItemTable;
    },
    resetOrderAnalyticsState() {
      return initialState;
    },
  },
});

// Action creators
export const { updateOrderItemTable, searchOrderItem, resetOrderItemFilterAndTable, resetOrderAnalyticsState } =
  orderAnalyticsSlice.actions;

// Selectors
const selectOrderAnalytics = (state: RootState) => state.orderAnalytics;

export const selectOrderItemFilter = createSelector(
  [selectOrderAnalytics],
  (orderAnalytics) => orderAnalytics.orderItemFilter,
);

export const selectOrderItemTable = createSelector(
  [selectOrderAnalytics],
  (orderAnalytics) => orderAnalytics.orderItemTable,
);

export const selectOrderItemTriggerFlag = createSelector(
  [selectOrderAnalytics],
  (orderAnalytics) => orderAnalytics.orderItemTriggerFlag,
);

export default orderAnalyticsSlice;
