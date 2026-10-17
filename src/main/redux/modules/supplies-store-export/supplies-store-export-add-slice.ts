import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  KhovtTransPhieuNhapControllerFindDetail200DataItem,
  KhovtTransPhieuXuatDetailWithRelations,
} from 'main/apis/drc/models';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { DateUtil } from 'main/utils';
import { generateUUID } from 'main/utils/generateUUID';
import moment from 'moment';

export const initialData = {
  id: generateUUID(),
  maVt: '',
  tenVt: '',
  maLo: '',
  nguonGoc: '',
  soLuongYeuCau: 0,
  soLuongThucTe: 0,
  tonKhoDuKien: 0,
  tonKho: 0,
  idNhap: undefined,
  phieuXuat: undefined,
  phieuXuatId: undefined,
  ngayXuat: DateUtil.toDateISOString(moment()),
};

export type SuppliesFilter = {
  suppliesGroup: string;
  batchCode: string;
  suppliesCode: string;
  suppliesStoreCode: string;
};

export type SuppliesDetailExport = KhovtTransPhieuXuatDetailWithRelations & {
  tonKhoDuKien?: number;
};

type State = {
  suppliesTriggerFlag: boolean;
  suppliesFilter: SuppliesFilter;
  suppliesTable: TableState<KhovtTransPhieuNhapControllerFindDetail200DataItem>;
  suppliesStoreExportDetails: SuppliesDetailExport[];
};

// State
const initialState: State = {
  suppliesTriggerFlag: false,
  suppliesFilter: {
    suppliesGroup: '-1',
    batchCode: '',
    suppliesCode: '',
    suppliesStoreCode: '',
  },
  suppliesTable: {
    page: 1,
    sizePerPage: 10,
  },
  // suppliesStoreExportDetails: [],
  suppliesStoreExportDetails: Array.from({ length: 10 }, () => ({
    ...initialData,
    id: generateUUID(),
  })),
};

// Slice
const suppliesStoreExportAddSlice = createSlice({
  name: 'suppliesStoreExportAdd',
  initialState,
  reducers: {
    syncSuppliesStoreCodeFilter(state, action: PayloadAction<string>) {
      state.suppliesFilter.suppliesStoreCode = action.payload;
    },
    // insertNewSupplies(state, action: PayloadAction<KhovtTransPhieuNhapControllerFindDetail200DataItem[] | undefined>) {
    //   if (!action.payload) {
    //     return;
    //   }

    //   // Convert supplies to suppliesStoreExportDetails
    //   const newSuppliesDetails: KhovtTransPhieuXuatDetailWithRelations[] = [];
    //   for (const supplies of action.payload) {
    //     const { id, maVt, tenVt, soLo, tonKho, nguonGoc } = supplies;
    //     newSuppliesDetails.push({
    //       idNhap: id,
    //       maLo: soLo,
    //       maVt,
    //       tenVt,
    //       nguonGoc,
    //       tonKho,
    //       soLuongThucTe: undefined,
    //       soLuongYeuCau: undefined,
    //       ngayXuat: DateUtil.toDateISOString(moment()),
    //     });
    //   }

    //   // Merge and deduplicate
    //   const updatedSuppliesDetails = _.unionBy(state.suppliesStoreExportDetails, newSuppliesDetails, FieldName.ID_NHAP);

    //   // Update state
    //   state.suppliesStoreExportDetails = updatedSuppliesDetails;
    // },

    insertNewSupplies(state, action: PayloadAction<KhovtTransPhieuNhapControllerFindDetail200DataItem[]>) {
      const newSupplies = action.payload;
      if (newSupplies && newSupplies.length > 0) {
        state.suppliesStoreExportDetails = [...state.suppliesStoreExportDetails, ...newSupplies];
      }
    },

    setSuppliesDetails(state, action: PayloadAction<KhovtTransPhieuXuatDetailWithRelations[]>) {
      state.suppliesStoreExportDetails = action.payload;
    },
    // updateSuppliesDetail: {
    //   reducer(state, action: PayloadAction<{ idNhap: number; dataField: string; newValue: any }>) {
    //     const { idNhap, dataField, newValue } = action.payload;
    //     const updatedIndex = state.suppliesStoreExportDetails.findIndex(
    //       (suppliesDetail) => suppliesDetail.idNhap === idNhap,
    //     );
    //     if (updatedIndex !== -1) {
    //       _.set(state.suppliesStoreExportDetails[updatedIndex], dataField, newValue);
    //     }
    //   },
    //   prepare(idNhap, dataField, newValue) {
    //     return {
    //       payload: { idNhap, dataField, newValue },
    //     };
    //   },
    // },

    updateSuppliesDetail: (state, action: PayloadAction<{ id: number; changes: Partial<any> }>) => {
      const { id, changes } = action.payload;
      const index = state.suppliesStoreExportDetails.findIndex((detail) => detail.id === id);
      if (index !== -1) {
        state.suppliesStoreExportDetails[index] = {
          ...state.suppliesStoreExportDetails[index],
          ...changes, // Apply the changes to the row
        };
      }
    },

    // deleteSuppliesDetail(state, action: PayloadAction<number | null | undefined>) {
    //   state.suppliesStoreExportDetails = state.suppliesStoreExportDetails.filter(
    //     (suppliesDetail) => suppliesDetail.idNhap !== action.payload,
    //   );
    // },

    deleteSuppliesDetail(state, action: PayloadAction<number>) {
      state.suppliesStoreExportDetails = state.suppliesStoreExportDetails.filter(
        (suppliesDetail) => suppliesDetail.id !== action.payload,
      );
    },

    setSuppliesTableSelectedRows(state, action: PayloadAction<KhovtTransPhieuNhapControllerFindDetail200DataItem[]>) {
      state.suppliesTable.selectedRows = action.payload;
    },
    updateSuppliesTable(state, action: PayloadAction<TableState<KhovtTransPhieuNhapControllerFindDetail200DataItem>>) {
      state.suppliesTable = { ...action.payload };
    },
    clickSearchSupplies(state, action: PayloadAction<SuppliesFilter>) {
      state.suppliesFilter = action.payload;
      state.suppliesTable.page = 1;
      state.suppliesTriggerFlag = !state.suppliesTriggerFlag;
    },
    resetSuppliesFilterAndTable(state) {
      state.suppliesFilter = {
        ...initialState.suppliesFilter,
        suppliesStoreCode: state.suppliesFilter.suppliesStoreCode,
      };
      state.suppliesTable = initialState.suppliesTable;
    },
    resetSuppliesStoreExportAddState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  syncSuppliesStoreCodeFilter,
  insertNewSupplies,
  setSuppliesDetails,
  updateSuppliesDetail,
  deleteSuppliesDetail,
  setSuppliesTableSelectedRows,
  updateSuppliesTable,
  clickSearchSupplies,
  resetSuppliesFilterAndTable,
  resetSuppliesStoreExportAddState,
} = suppliesStoreExportAddSlice.actions;

// Selectors
const selectSuppliesStoreExportAdd = (state: RootState) => state.suppliesStoreExportAdd;

export const selectSuppliesDetails = createSelector(
  [selectSuppliesStoreExportAdd],
  (suppliesStoreExportAdd) => suppliesStoreExportAdd.suppliesStoreExportDetails,
);

export const selectSuppliesFilter = createSelector(
  [selectSuppliesStoreExportAdd],
  (suppliesStoreExportAdd) => suppliesStoreExportAdd.suppliesFilter,
);

export const selectSuppliesTable = createSelector(
  [selectSuppliesStoreExportAdd],
  (suppliesStoreExportAdd) => suppliesStoreExportAdd.suppliesTable,
);

export const selectSuppliesTriggerFlag = createSelector(
  [selectSuppliesStoreExportAdd],
  (suppliesStoreExportAdd) => suppliesStoreExportAdd.suppliesTriggerFlag,
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
  (suppliesTableSelectedRows) => suppliesTableSelectedRows.map((row) => row.id),
);

export default suppliesStoreExportAddSlice;
