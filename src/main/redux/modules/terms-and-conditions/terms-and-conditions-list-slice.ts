import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QdhdsdMasterTaiLieu } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';

export type DocumentFilter = {
  documentName: string;
  documentCode: string;
};

type State = {
  documentTriggerFlag: boolean;
  documentFilter: DocumentFilter;
  documentTable: TableState<QdhdsdMasterTaiLieu>;
};

// State
const initialState: State = {
  documentTriggerFlag: false,
  documentFilter: {
    documentName: '',
    documentCode: '',
  },
  documentTable: {
    page: 1,
    sizePerPage: 10,
  },
};

// Slice
const termsAndConditionsListSlice = createSlice({
  name: 'termsAndConditionsList',
  initialState,
  reducers: {
    updateDocumentTable(state, action: PayloadAction<TableState<QdhdsdMasterTaiLieu>>) {
      state.documentTable = { ...action.payload };
    },
    clickSearchDocument(state, action: PayloadAction<DocumentFilter>) {
      state.documentFilter = action.payload;
      state.documentTable.page = 1;
      state.documentTriggerFlag = !state.documentTriggerFlag;
    },
    resetTermsAndConditionsListState() {
      return initialState;
    },
  },
});

// Action creators
export const { updateDocumentTable, clickSearchDocument, resetTermsAndConditionsListState } =
  termsAndConditionsListSlice.actions;

// Selectors
const selectTermsAndConditionsList = (state: RootState) => state.termsAndConditionsList;

export const selectDocumentFilter = createSelector(
  [selectTermsAndConditionsList],
  (termsAndConditionsList) => termsAndConditionsList.documentFilter,
);

export const selectDocumentTable = createSelector(
  [selectTermsAndConditionsList],
  (termsAndConditionsList) => termsAndConditionsList.documentTable,
);

export const selectDocumentTriggerFlag = createSelector(
  [selectTermsAndConditionsList],
  (termsAndConditionsList) => termsAndConditionsList.documentTriggerFlag,
);

export default termsAndConditionsListSlice;
