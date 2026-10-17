import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import _, { map } from 'lodash';
import { QldhTransDonHangItemWithRelations, QldhTransDonHangWithRelations } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import { generateUUID } from 'main/utils/generateUUID';
import { calculateTonKhoDuKien } from 'main/utils/order-management-utils';
import { SuppliesFilter } from './order-management-add-slice';

export const initialData: QldhTransDonHangItemExcludingIdWithRelationsIds = {
  id: generateUUID(),
  createTime: null,
  createUser: '',
  donHang: undefined,
  // donHangId: generateUUID(),
  foreignKey: undefined,
  ghiChu: '',
  maSanPham: '',
  sanPham: undefined,
  soLuong: 0,
  soLuongGiuHang: 0,
  // tonKho: 0,
  updateTime: null,
  updateUser: '',
  yeuCauDongGoi: '',
};

export type QldhTransDonHangItemExcludingIdWithRelationsIds = QldhTransDonHangItemWithRelations & {
  id?: number;
  tonKho?: number;
};

export type NewQldhTransDonHangExtend = QldhTransDonHangWithRelations & {
  tonKho?: number;
};

type State = {
  suppliesTriggerFlag: boolean;
  suppliesFilter: SuppliesFilter;
  suppliesTable: TableState<QldhTransDonHangItemExcludingIdWithRelationsIds>;
  orderManagementInfo: QldhTransDonHangWithRelations;
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
  orderManagementInfo: {
    // donHangId: '',
    ngayDatHang: '',
    nguoiTao: '',
    nguoiYeuCau: '',
    ngayGiaoDuKien: '',
    ngayGiaoThucTe: '',
    trangThai: '',
  },
  suppliesStoreImportDetailIndex: 0,
  orderManagementDetails: [],
};

// Slice
const orderManagementEditSlice = createSlice({
  name: 'orderManagementEdit',
  initialState,
  reducers: {
    loadOrderManagementData(state, action: PayloadAction<NewQldhTransDonHangExtend>) {
      const data = action.payload;
      const orderManagementDetailsConvert = map(data.donHangItems, (item: any) => ({
        ...item,
        tonKhoDuKien: calculateTonKhoDuKien(item.soLuong, item.soLuongGiuHang, item.tonKho),
      }));

      state.orderManagementInfo = data;
      state.orderManagementDetails = orderManagementDetailsConvert || [];
    },

    insertNewOrders(state, action: PayloadAction<QldhTransDonHangItemExcludingIdWithRelationsIds[] | undefined>) {
      if (!action.payload) {
        return;
      }

      const newSuppliesDetails: QldhTransDonHangItemExcludingIdWithRelationsIds[] = [];
      for (const supplies of action.payload) {
        state.suppliesStoreImportDetailIndex = state.suppliesStoreImportDetailIndex + 1;
        const { maSanPham, soLuongGiuHang, soLuong, ghiChu } = supplies;
        newSuppliesDetails.push({
          maSanPham: maSanPham || '',
          // tonKho: tonKho ?? 0,
          soLuong: soLuong ?? 0,
          // ngayHetHanLK: thoiHanLuuKho ? moment().add(thoiHanLuuKho, 'months').format('YYYY-MM-DD') : null,
          ghiChu: ghiChu || '',
          createTime: null,
          createUser: '',
          // id: state.suppliesStoreImportDetailIndex++,
          updateTime: null,
          updateUser: '',
          yeuCauDongGoi: '',
          id: generateUUID(),
          soLuongGiuHang: soLuongGiuHang || 0,
        });
      }

      // Merge and deduplicate
      const updatedSuppliesDetails = _.unionBy(state.orderManagementDetails, newSuppliesDetails, FieldName.ID);
      // Update state
      state.orderManagementDetails = updatedSuppliesDetails;
    },

    updateOrdersDetails: (
      state,
      action: PayloadAction<{ id: number; changes: Partial<QldhTransDonHangItemExcludingIdWithRelationsIds> }>,
    ) => {
      const { id, changes } = action.payload;

      const index = state.orderManagementDetails.findIndex((detail) => detail?.id === id);
      if (index !== -1) {
        state.orderManagementDetails[index] = {
          ...state.orderManagementDetails[index],
          ...changes,
        };
      }
    },

    deleteOrdersDetails(state, action: PayloadAction<number>) {
      state.orderManagementDetails = state.orderManagementDetails.filter(
        (suppliesDetail) => suppliesDetail.id !== action.payload,
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
    resetSuppliesStoreImportEditState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  loadOrderManagementData,
  insertNewOrders,
  updateOrdersDetails,
  deleteOrdersDetails,
  setSuppliesTableSelectedRows,
  updateSuppliesTable,
  clickSearchSupplies,
  resetSuppliesFilterAndTable,
  resetSuppliesStoreImportEditState,
} = orderManagementEditSlice.actions;

// Selectors
const selectOrderManagementEdit = (state: RootState) => state.orderManagementEdit;

export const selectOrdersDetails = createSelector(
  [selectOrderManagementEdit],
  (orderManagementEdit) => orderManagementEdit.orderManagementDetails,
);

export const selectOrderManagementInfo = createSelector(
  [selectOrderManagementEdit],
  (orderManagementEdit) => orderManagementEdit.orderManagementInfo,
);

export const selectSuppliesFilter = createSelector(
  [selectOrderManagementEdit],
  (orderManagementEdit) => orderManagementEdit.suppliesFilter,
);

export const selectSuppliesTable = createSelector(
  [selectOrderManagementEdit],
  (orderManagementEdit) => orderManagementEdit.suppliesTable,
);

export const selectSuppliesTriggerFlag = createSelector(
  [selectOrderManagementEdit],
  (orderManagementEdit) => orderManagementEdit.suppliesTriggerFlag,
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
  (orderManagementTableSelectedRows) => orderManagementTableSelectedRows.map((row) => row.id),
);

export default orderManagementEditSlice;
