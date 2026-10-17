import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  KhovtMasterVtWithRelations,
  KhovtTransPhieunhapDetailWithRelations,
  KhovtTransPhieuNhapWithRelations,
} from 'main/apis/drc/models';
import { SuppliesStoreImportInfo } from 'main/components/pages/admin/supplies-store-import/supplies-store-import-add/sub-components/supplies-store-import-add-info';
import { FieldName } from 'main/constants/enums';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import moment from 'moment';
import { SuppliesFilter } from './supplies-store-import-add-slice';

type State = {
  suppliesTriggerFlag: boolean;
  suppliesFilter: SuppliesFilter;
  suppliesTable: TableState<KhovtMasterVtWithRelations>;
  suppliesStoreImportInfo: SuppliesStoreImportInfo;
  suppliesStoreImportDetailIndex: number;
  suppliesStoreImportDetails: KhovtTransPhieunhapDetailWithRelations[];
};

// State
const initialState: State = {
  suppliesTriggerFlag: false,
  suppliesFilter: {
    suppliesGroup: '-1',
    suppliesCode: '',
    suppliesName: '',
    suppliesSuggestiveName: '',
  },
  suppliesTable: {
    page: 1,
    sizePerPage: 10,
  },
  suppliesStoreImportInfo: {},
  suppliesStoreImportDetailIndex: 0,
  suppliesStoreImportDetails: [],
};

// Slice
const suppliesStoreImportEditSlice = createSlice({
  name: 'suppliesStoreImportEdit',
  initialState,
  reducers: {
    loadSuppliesImportBill(state, action: PayloadAction<KhovtTransPhieuNhapWithRelations>) {
      const { details, ...info } = action.payload;
      state.suppliesStoreImportInfo = info;
      state.suppliesStoreImportDetails = details || [];
    },
    insertNewSupplies(state, action: PayloadAction<KhovtMasterVtWithRelations[] | undefined>) {
      if (!action.payload) {
        return;
      }

      // Convert supplies to suppliesStoreImportDetails
      const newSuppliesDetails: KhovtTransPhieunhapDetailWithRelations[] = [];
      for (const supplies of action.payload) {
        state.suppliesStoreImportDetailIndex = state.suppliesStoreImportDetailIndex + 1;
        const { dvt, maVt, tenVt, thoiHanLuuKho } = supplies;
        newSuppliesDetails.push({
          dvt,
          maVt,
          tenVt,
          ngayHetHanLK: moment().add(thoiHanLuuKho, 'months').toLocaleString(),
          ngaySx: undefined,
          ngayHetHan: undefined,
          ngayThiNghiem: undefined,
          soLuong: undefined,
          ghiChu: undefined,
        });
      }

      // Merge and deduplicate
      const updatedSuppliesDetails = _.unionBy(state.suppliesStoreImportDetails, newSuppliesDetails, FieldName.MA_VT);

      // Update state
      state.suppliesStoreImportDetails = updatedSuppliesDetails;
    },
    setSuppliesDetails(state, action: PayloadAction<KhovtTransPhieunhapDetailWithRelations[]>) {
      state.suppliesStoreImportDetails = action.payload;
    },
    updateSuppliesDetail: {
      reducer(state, action: PayloadAction<{ maVt: string; dataField: string; newValue: any }>) {
        const { maVt, dataField, newValue } = action.payload;
        const updatedIndex = state.suppliesStoreImportDetails.findIndex(
          (suppliesDetail) => suppliesDetail.maVt === maVt,
        );
        if (updatedIndex !== -1) {
          _.set(state.suppliesStoreImportDetails[updatedIndex], dataField, newValue);
        }
      },
      prepare(maVt, dataField, newValue) {
        return {
          payload: { maVt, dataField, newValue },
        };
      },
    },
    deleteSuppliesDetail(state, action: PayloadAction<string>) {
      state.suppliesStoreImportDetails = state.suppliesStoreImportDetails.filter(
        (suppliesDetail) => suppliesDetail.maVt !== action.payload,
      );
    },
    setSuppliesTableSelectedRows(state, action: PayloadAction<KhovtMasterVtWithRelations[]>) {
      state.suppliesTable.selectedRows = action.payload;
    },
    updateSuppliesTable(state, action: PayloadAction<TableState<KhovtMasterVtWithRelations>>) {
      state.suppliesTable = { ...action.payload };
    },
    clickSearchSupplies(state, action: PayloadAction<SuppliesFilter>) {
      state.suppliesFilter = action.payload;
      state.suppliesTable.page = 1;
      state.suppliesTriggerFlag = !state.suppliesTriggerFlag;
    },
    resetSuppliesFilterAndTable(state) {
      state.suppliesFilter = initialState.suppliesFilter;
      state.suppliesTable = initialState.suppliesTable;
    },
    resetSuppliesStoreImportEditState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  loadSuppliesImportBill,
  insertNewSupplies,
  setSuppliesDetails,
  updateSuppliesDetail,
  deleteSuppliesDetail,
  setSuppliesTableSelectedRows,
  updateSuppliesTable,
  clickSearchSupplies,
  resetSuppliesFilterAndTable,
  resetSuppliesStoreImportEditState,
} = suppliesStoreImportEditSlice.actions;

// Selectors
const selectSuppliesStoreImportEdit = (state: RootState) => state.suppliesStoreImportEdit;

export const selectSuppliesStoreImportDetails = createSelector(
  [selectSuppliesStoreImportEdit],
  (suppliesStoreImportEdit) => suppliesStoreImportEdit.suppliesStoreImportDetails,
);

export const selectSuppliesStoreImportInfo = createSelector(
  [selectSuppliesStoreImportEdit],
  (suppliesStoreImportEdit) => suppliesStoreImportEdit.suppliesStoreImportInfo,
);

export const selectSuppliesFilter = createSelector(
  [selectSuppliesStoreImportEdit],
  (suppliesStoreImportEdit) => suppliesStoreImportEdit.suppliesFilter,
);

export const selectSuppliesTable = createSelector(
  [selectSuppliesStoreImportEdit],
  (suppliesStoreImportEdit) => suppliesStoreImportEdit.suppliesTable,
);

export const selectSuppliesTriggerFlag = createSelector(
  [selectSuppliesStoreImportEdit],
  (suppliesStoreImportEdit) => suppliesStoreImportEdit.suppliesTriggerFlag,
);

export const selectSuppliesTableExcludeSelectedRows = createSelector([selectSuppliesTable], (suppliesTable) => ({
  ...suppliesTable,
  selectedRows: undefined,
}));

export const selectSuppliesTableSelectedRows = createSelector(
  [selectSuppliesTable],
  (suppliesTable) => suppliesTable.selectedRows || [],
);

export const selectSuppliesTableSelectedRowIds = createSelector(
  [selectSuppliesTableSelectedRows],
  (suppliesTableSelectedRows) => suppliesTableSelectedRows.map((row) => row.maVt),
);

export default suppliesStoreImportEditSlice;
