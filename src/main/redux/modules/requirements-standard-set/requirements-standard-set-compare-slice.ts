import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DmTransDinhMucCompareItem } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';

export type RequirementsStandardSetCompareFilter = {
  productCode: string;
  suppliesCode: string;
};

type State = {
  requirementsStandardSetCompareTriggerFlag: boolean;
  requirementsStandardSetCompareFilter: RequirementsStandardSetCompareFilter;
  requirementsStandardSetCompareTable: TableState<DmTransDinhMucCompareItem>;
};

// State
const initialState: State = {
  requirementsStandardSetCompareTriggerFlag: false,
  requirementsStandardSetCompareFilter: {
    productCode: '',
    suppliesCode: '',
  },
  requirementsStandardSetCompareTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const requirementsStandardSetCompareSlice = createSlice({
  name: 'requirementsStandardSetCompare',
  initialState,
  reducers: {
    updateRequirementsStandardSetCompareTable(state, action: PayloadAction<TableState<DmTransDinhMucCompareItem>>) {
      state.requirementsStandardSetCompareTable = { ...action.payload };
    },
    clickSearchRequirementsStandardSetCompare(state, action: PayloadAction<RequirementsStandardSetCompareFilter>) {
      state.requirementsStandardSetCompareFilter = action.payload;
      state.requirementsStandardSetCompareTable.page = 1;
      state.requirementsStandardSetCompareTriggerFlag = !state.requirementsStandardSetCompareTriggerFlag;
    },
    resetRequirementsStandardSetCompareState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  updateRequirementsStandardSetCompareTable,
  clickSearchRequirementsStandardSetCompare,
  resetRequirementsStandardSetCompareState,
} = requirementsStandardSetCompareSlice.actions;

// Selectors
const selectRequirementsStandardSetCompare = (state: RootState) => state.requirementsStandardSetCompare;

export const selectRequirementsStandardSetCompareFilter = createSelector(
  [selectRequirementsStandardSetCompare],
  (requirementsStandardSetCompare) => requirementsStandardSetCompare.requirementsStandardSetCompareFilter,
);

export const selectRequirementsStandardSetCompareTable = createSelector(
  [selectRequirementsStandardSetCompare],
  (requirementsStandardSetCompare) => requirementsStandardSetCompare.requirementsStandardSetCompareTable,
);

export const selectRequirementsStandardSetCompareTriggerFlag = createSelector(
  [selectRequirementsStandardSetCompare],
  (requirementsStandardSetCompare) => requirementsStandardSetCompare.requirementsStandardSetCompareTriggerFlag,
);

export default requirementsStandardSetCompareSlice;
