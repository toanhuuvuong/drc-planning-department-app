import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DmTransDinhMucItemWithRelations } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';

export type RequirementsStandardItemFilter = {
  productCode: string;
  suppliesCode: string;
};

type State = {
  requirementsStandardItemTriggerFlag: boolean;
  requirementsStandardItemFilter: RequirementsStandardItemFilter;
  requirementsStandardItemTable: TableState<DmTransDinhMucItemWithRelations>;
};

// State
const initialState: State = {
  requirementsStandardItemTriggerFlag: false,
  requirementsStandardItemFilter: {
    productCode: '',
    suppliesCode: '',
  },
  requirementsStandardItemTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const requirementsStandardSetDetailSlice = createSlice({
  name: 'requirementsStandardSetDetail',
  initialState,
  reducers: {
    updateRequirementsStandardItemTable(state, action: PayloadAction<TableState<DmTransDinhMucItemWithRelations>>) {
      state.requirementsStandardItemTable = { ...action.payload };
    },
    clickSearchRequirementsStandardItem(state, action: PayloadAction<RequirementsStandardItemFilter>) {
      state.requirementsStandardItemFilter = action.payload;
      state.requirementsStandardItemTable.page = 1;
      state.requirementsStandardItemTriggerFlag = !state.requirementsStandardItemTriggerFlag;
    },
    resetRequirementsStandardSetDetail() {
      return initialState;
    },
  },
});

// Action creators
export const {
  updateRequirementsStandardItemTable,
  clickSearchRequirementsStandardItem,
  resetRequirementsStandardSetDetail,
} = requirementsStandardSetDetailSlice.actions;

// Selectors
const selectRequirementsStandardItemList = (state: RootState) => state.requirementsStandardSetDetail;

export const selectRequirementsStandardItemFilter = createSelector(
  [selectRequirementsStandardItemList],
  (requirementsStandardSetDetail) => requirementsStandardSetDetail.requirementsStandardItemFilter,
);

export const selectRequirementsStandardItemTable = createSelector(
  [selectRequirementsStandardItemList],
  (requirementsStandardSetDetail) => requirementsStandardSetDetail.requirementsStandardItemTable,
);

export const selectRequirementsStandardItemTriggerFlag = createSelector(
  [selectRequirementsStandardItemList],
  (requirementsStandardSetDetail) => requirementsStandardSetDetail.requirementsStandardItemTriggerFlag,
);

export default requirementsStandardSetDetailSlice;
