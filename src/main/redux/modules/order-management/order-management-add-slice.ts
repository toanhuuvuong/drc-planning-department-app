import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QldhTransDonHangItemWithRelations } from 'main/apis/drc/models';
import { OrderManagementMaSanPhamType } from 'main/components/pages/admin/order-management/order-management-add/sub-components/order-management-table/useTableConfig';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { generateUUID } from 'main/utils/generateUUID';

export const initialData: QldhTransDonHangItemWithRelations = {
  id: generateUUID(),
  createTime: null,
  createUser: '',
  donHang: undefined,
  donHangId: generateUUID(),
  foreignKey: undefined,
  ghiChu: '',
  maSanPham: '',
  // ngayGiaoDuKien: null,
  // ngayGiaoThucTe: null,
  sanPham: undefined,
  soLuong: 0,
  // tonKho: 0,
  updateTime: null,
  updateUser: '',
  yeuCauDongGoi: '',
  soLuongGiuHang: 0,
};

export type QldhTransDonHangItemExcludingIdWithRelationsIds = QldhTransDonHangItemWithRelations & {
  maKho?: string;
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
  suppliesTable: TableState<QldhTransDonHangItemExcludingIdWithRelationsIds>;
  suppliesStoreImportDetailIndex: number;
  orderManagementDetails: QldhTransDonHangItemExcludingIdWithRelationsIds[];
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
  orderManagementDetails: Array.from({ length: 10 }, () => ({
    ...initialData,
    id: generateUUID(),
  })),
};

// Slice
const orderManagementAddSlice = createSlice({
  name: 'orderManagementAdd',
  initialState,
  reducers: {
    insertNewOrders(state, action: PayloadAction<QldhTransDonHangItemWithRelations[]>) {
      const newSupplies = action.payload;

      // Ensure the newSupplies array is not empty and merge with existing details

      if (newSupplies && newSupplies.length > 0) {
        state.orderManagementDetails = [...state.orderManagementDetails, ...newSupplies];
      }
    },
    setSuppliesDetails(state, action: PayloadAction<QldhTransDonHangItemWithRelations[]>) {
      state.orderManagementDetails = action.payload;
    },

    updateOrdersDetails: (
      state,
      action: PayloadAction<{ id: number; changes: Partial<OrderManagementMaSanPhamType> }>,
    ) => {
      const { id, changes } = action.payload;
      const index = state.orderManagementDetails.findIndex((detail) => detail?.id === id);
      if (index !== -1) {
        state.orderManagementDetails[index] = {
          ...state.orderManagementDetails[index],
          ...changes, // Apply the changes to the row
        };
      }
    },

    deleteOrdersDetails(state, action: PayloadAction<number>) {
      state.orderManagementDetails = state.orderManagementDetails.filter(
        (suppliesDetail) => suppliesDetail?.id !== action.payload,
      );
    },
    setSuppliesTableSelectedRows(state, action: PayloadAction<QldhTransDonHangItemWithRelations[]>) {
      state.suppliesTable.selectedRows = action.payload;
    },
    updateSuppliesTable(state, action: PayloadAction<TableState<QldhTransDonHangItemWithRelations>>) {
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
    resetSuppliesStoreImportAddState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  insertNewOrders,
  setSuppliesDetails,
  updateOrdersDetails,
  deleteOrdersDetails,
  setSuppliesTableSelectedRows,
  updateSuppliesTable,
  clickSearchSupplies,
  resetSuppliesFilterAndTable,
  resetSuppliesStoreImportAddState,
} = orderManagementAddSlice.actions;

// Selectors
const selectOrdersManagementImportAdd = (state: RootState) => state.orderManagementAdd;

export const selectOrdersDetails = createSelector(
  [selectOrdersManagementImportAdd],
  (orderManagementAdd) => orderManagementAdd.orderManagementDetails,
);

export const selectOrdersFilter = createSelector(
  [selectOrdersManagementImportAdd],
  (orderManagementAdd) => orderManagementAdd.suppliesFilter,
);

export const selectOrdersTable = createSelector(
  [selectOrdersManagementImportAdd],
  (orderManagementAdd) => orderManagementAdd.suppliesTable,
);

export const selectOrdersTriggerFlag = createSelector(
  [selectOrdersManagementImportAdd],
  (orderManagementAdd) => orderManagementAdd.suppliesTriggerFlag,
);

export const selectOrdersTableExcludeSelectedRows = createSelector([selectOrdersTable], (suppliesTable) => ({
  ...suppliesTable,
  selectedRows: undefined,
}));

export const selectOrdersTableSelectedRows = createSelector(
  [selectOrdersTable],
  (suppliesTable) => suppliesTable.selectedRows || [],
);

export const selectOrdersTableSelectedRowIds = createSelector(
  [selectOrdersTableSelectedRows],
  (suppliesTableSelectedRows) => suppliesTableSelectedRows.map((row) => row.maSanPham),
);

export default orderManagementAddSlice;
