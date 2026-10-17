import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KhovtMasterVtWithRelations, KhovtTransPhieunhapDetailWithRelations } from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { generateUUID } from 'main/utils/generateUUID';

export const initialData = {
  id: generateUUID(),
  maVt: '',
  tenVt: '',
  dvt: '',
  ngaySx: '',
  ngayHetHan: '',
  ngayThiNghiem: '',
  ngayHetHanLK: '',
  soLuong: 0,
  ghiChu: '',
};

export type SuppliesFilter = {
  suppliesGroup: string;
  suppliesCode: string;
  suppliesName: string;
  suppliesSuggestiveName: string;
};

type State = {
  suppliesTriggerFlag: boolean;
  suppliesFilter: SuppliesFilter;
  suppliesTable: TableState<KhovtMasterVtWithRelations>;
  suppliesStoreImportDetailIndex: number;
  suppliesStoreImportDetails: KhovtTransPhieunhapDetailWithRelations[];
  nextMaSoLo?: string;
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
  suppliesStoreImportDetailIndex: 0,
  suppliesStoreImportDetails: Array.from({ length: 10 }, () => ({
    ...initialData,
    id: generateUUID(),
  })),
};

// Slice
const suppliesStoreImportAddSlice = createSlice({
  name: 'suppliesStoreImportAdd',
  initialState,
  reducers: {
    insertNewSupplies(state, action: PayloadAction<KhovtTransPhieunhapDetailWithRelations[]>) {
      const newSupplies = action.payload;

      // Ensure the newSupplies array is not empty and merge with existing details
      if (newSupplies && newSupplies.length > 0) {
        state.suppliesStoreImportDetails = [...state.suppliesStoreImportDetails, ...newSupplies];
      }
    },
    setSuppliesDetails(state, action: PayloadAction<KhovtTransPhieunhapDetailWithRelations[]>) {
      state.suppliesStoreImportDetails = action.payload;
    },

    updateSuppliesDetail: (state, action: PayloadAction<{ id: number; changes: Partial<any> }>) => {
      const { id, changes } = action.payload;
      const index = state.suppliesStoreImportDetails.findIndex((detail) => detail?.id === id);
      if (index !== -1) {
        state.suppliesStoreImportDetails[index] = {
          ...state.suppliesStoreImportDetails[index],
          ...changes, // Apply the changes to the row
        };
      }
    },

    deleteSuppliesDetail(state, action: PayloadAction<number>) {
      state.suppliesStoreImportDetails = state.suppliesStoreImportDetails.filter(
        (suppliesDetail) => suppliesDetail?.id !== action.payload,
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
    updateNextMaSoLo(state, action: PayloadAction<string>) {
      state.nextMaSoLo = action.payload;
    },
    resetSuppliesFilterAndTable(state) {
      state.suppliesFilter = initialState.suppliesFilter;
      state.suppliesTable = initialState.suppliesTable;
    },
    resetSuppliesStoreImportAddState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  insertNewSupplies,
  setSuppliesDetails,
  updateSuppliesDetail,
  deleteSuppliesDetail,
  setSuppliesTableSelectedRows,
  updateSuppliesTable,
  clickSearchSupplies,
  updateNextMaSoLo,
  resetSuppliesFilterAndTable,
  resetSuppliesStoreImportAddState,
} = suppliesStoreImportAddSlice.actions;

// Selectors
const selectSuppliesStoreImportAdd = (state: RootState) => state.suppliesStoreImportAdd;

export const selectSuppliesDetails = createSelector(
  [selectSuppliesStoreImportAdd],
  (suppliesStoreImportAdd) => suppliesStoreImportAdd.suppliesStoreImportDetails,
);

export const selectSuppliesFilter = createSelector(
  [selectSuppliesStoreImportAdd],
  (suppliesStoreImportAdd) => suppliesStoreImportAdd.suppliesFilter,
);

export const selectSuppliesTable = createSelector(
  [selectSuppliesStoreImportAdd],
  (suppliesStoreImportAdd) => suppliesStoreImportAdd.suppliesTable,
);

export const selectSuppliesTriggerFlag = createSelector(
  [selectSuppliesStoreImportAdd],
  (suppliesStoreImportAdd) => suppliesStoreImportAdd.suppliesTriggerFlag,
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

export const selectNextMaSoLo = createSelector(
  [selectSuppliesStoreImportAdd],
  (suppliesStoreImportAdd) => suppliesStoreImportAdd.nextMaSoLo,
);

export default suppliesStoreImportAddSlice;
