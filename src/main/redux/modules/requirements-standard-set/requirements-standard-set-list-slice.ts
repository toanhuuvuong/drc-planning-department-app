import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DmMasterBoDinhMuc } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { Moment } from 'moment';

export type RequirementsStandardSetFilter = {
  updateStartDate?: Moment;
  updateEndDate?: Moment;
  requirementsStandardSetCode: string;
  requirementsStandardSetType: string;
};

type State = {
  requirementsStandardSetTriggerFlag: boolean;
  requirementsStandardSetFilter: RequirementsStandardSetFilter;
  requirementsStandardSetTable: TableState<DmMasterBoDinhMuc>;
};

// State
const initialState: State = {
  requirementsStandardSetTriggerFlag: false,
  requirementsStandardSetFilter: {
    requirementsStandardSetCode: '',
    requirementsStandardSetType: '-1',
  },
  requirementsStandardSetTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const requirementsStandardSetListSlice = createSlice({
  name: 'requirementsStandardSetList',
  initialState,
  reducers: {
    updateRequirementsStandardSetTable(state, action: PayloadAction<TableState<DmMasterBoDinhMuc>>) {
      state.requirementsStandardSetTable = { ...action.payload };
    },
    clickSearchRequirementsStandardSet(state, action: PayloadAction<RequirementsStandardSetFilter>) {
      state.requirementsStandardSetFilter = action.payload;
      state.requirementsStandardSetTable.page = 1;
      state.requirementsStandardSetTriggerFlag = !state.requirementsStandardSetTriggerFlag;
    },
    resetRequirementsStandardSetListState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  updateRequirementsStandardSetTable,
  clickSearchRequirementsStandardSet,
  resetRequirementsStandardSetListState,
} = requirementsStandardSetListSlice.actions;

// Selectors
const selectRequirementsStandardSetList = (state: RootState) => state.requirementsStandardSetList;

export const selectRequirementsStandardSetFilter = createSelector(
  [selectRequirementsStandardSetList],
  (requirementsStandardSetList) => requirementsStandardSetList.requirementsStandardSetFilter,
);

export const selectRequirementsStandardSetTable = createSelector(
  [selectRequirementsStandardSetList],
  (requirementsStandardSetList) => requirementsStandardSetList.requirementsStandardSetTable,
);

export const selectRequirementsStandardSetTriggerFlag = createSelector(
  [selectRequirementsStandardSetList],
  (requirementsStandardSetList) => requirementsStandardSetList.requirementsStandardSetTriggerFlag,
);

export default requirementsStandardSetListSlice;
