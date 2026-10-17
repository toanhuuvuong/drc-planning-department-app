import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  KhotpMasterSanPhamWithRelations,
  KhotpTransPhieuNhapDetailWithRelations,
  KhotpTransPhieuNhapWithRelations,
} from 'main/apis/drc/models';
import { ProductStoreImportInfo } from 'main/components/pages/admin/product-store-import/product-store-import-add/sub-components/product-store-import-add-info';
import { FieldName } from 'main/constants/enums';
import { RootState } from 'main/redux/store';
import { TableState } from 'main/types';
import moment from 'moment';
import { ProductFilter } from './product-store-import-add-slice';

type State = {
  productTriggerFlag: boolean;
  productFilter: ProductFilter;
  productTable: TableState<KhotpMasterSanPhamWithRelations>;
  productStoreImportInfo: ProductStoreImportInfo;
  productStoreImportDetails: KhotpTransPhieuNhapDetailWithRelations[];
};

// State
const initialState: State = {
  productTriggerFlag: false,
  productFilter: {
    productGroup: '-1',
    productCode: '',
    productName: '',
    productSuggestiveName: '',
  },
  productTable: {
    page: 1,
    sizePerPage: 10,
  },
  productStoreImportInfo: {
    maPhieu: '',
  },
  productStoreImportDetails: [],
};

// Slice
const productStoreImportEditSlice = createSlice({
  name: 'productStoreImportEdit',
  initialState,
  reducers: {
    loadProductImportBill(state, action: PayloadAction<KhotpTransPhieuNhapWithRelations>) {
      const { details, ...info } = action.payload;
      state.productStoreImportInfo = info;
      state.productStoreImportDetails = details || [];
    },
    insertNewProduct(
      state,
      action: PayloadAction<{
        selectedProductRows: KhotpMasterSanPhamWithRelations[] | undefined;
        productStoreImportInfo: ProductStoreImportInfo;
      }>,
    ) {
      const { selectedProductRows, productStoreImportInfo } = action.payload;

      if (!selectedProductRows) {
        return;
      }

      // Convert product to productStoreImportDetails
      const ngayNhap = productStoreImportInfo.ngayNhap ? moment(productStoreImportInfo.ngayNhap) : moment();
      const newProductDetails: KhotpTransPhieuNhapDetailWithRelations[] = [];
      for (const product of selectedProductRows) {
        const { maSanPham, thoiHanLuuKho } = product;
        newProductDetails.push({
          maSanPham,
          thoiHanLuuKho: ngayNhap.add(thoiHanLuuKho, 'months').toLocaleString(),
          soLuong: undefined,
          ghiChu: '',
        });
      }

      // Merge and deduplicate
      const updatedProductDetails = _.unionBy(
        state.productStoreImportDetails,
        newProductDetails,
        FieldName.MA_SAN_PHAM,
      );

      // Update state
      state.productStoreImportDetails = updatedProductDetails;
    },
    setProductDetails(state, action: PayloadAction<KhotpTransPhieuNhapDetailWithRelations[]>) {
      state.productStoreImportDetails = action.payload;
    },
    updateProductDetail: {
      reducer(state, action: PayloadAction<{ maSanPham: string; dataField: string; newValue: any }>) {
        const { maSanPham, dataField, newValue } = action.payload;
        const updatedIndex = state.productStoreImportDetails.findIndex(
          (productDetail) => productDetail.maSanPham === maSanPham,
        );
        if (updatedIndex !== -1) {
          _.set(state.productStoreImportDetails[updatedIndex], dataField, newValue);
        }
      },
      prepare(maSanPham, dataField, newValue) {
        return {
          payload: { maSanPham, dataField, newValue },
        };
      },
    },
    deleteProductDetail(state, action: PayloadAction<string>) {
      state.productStoreImportDetails = state.productStoreImportDetails.filter(
        (productDetail) => productDetail.maSanPham !== action.payload,
      );
    },
    setProductTableSelectedRows(state, action: PayloadAction<KhotpMasterSanPhamWithRelations[]>) {
      state.productTable.selectedRows = action.payload;
    },
    updateProductTable(state, action: PayloadAction<TableState<KhotpMasterSanPhamWithRelations>>) {
      state.productTable = { ...action.payload };
    },
    clickSearchProduct(state, action: PayloadAction<ProductFilter>) {
      state.productFilter = action.payload;
      state.productTable.page = 1;
      state.productTriggerFlag = !state.productTriggerFlag;
    },
    resetProductFilterAndTable(state) {
      state.productFilter = initialState.productFilter;
      state.productTable = initialState.productTable;
    },
    resetProductStoreImportEditState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  loadProductImportBill,
  insertNewProduct,
  setProductDetails,
  updateProductDetail,
  deleteProductDetail,
  setProductTableSelectedRows,
  updateProductTable,
  clickSearchProduct,
  resetProductFilterAndTable,
  resetProductStoreImportEditState,
} = productStoreImportEditSlice.actions;

// Selectors
const selectProductStoreImportEdit = (state: RootState) => state.productStoreImportEdit;

export const selectProductStoreImportDetails = createSelector(
  [selectProductStoreImportEdit],
  (productStoreImportEdit) => productStoreImportEdit.productStoreImportDetails,
);

export const selectProductStoreImportInfo = createSelector(
  [selectProductStoreImportEdit],
  (productStoreImportEdit) => productStoreImportEdit.productStoreImportInfo,
);

export const selectProductFilter = createSelector(
  [selectProductStoreImportEdit],
  (productStoreImportEdit) => productStoreImportEdit.productFilter,
);

export const selectProductTable = createSelector(
  [selectProductStoreImportEdit],
  (productStoreImportEdit) => productStoreImportEdit.productTable,
);

export const selectProductTriggerFlag = createSelector(
  [selectProductStoreImportEdit],
  (productStoreImportEdit) => productStoreImportEdit.productTriggerFlag,
);

export const selectProductTableExcludeSelectedRows = createSelector([selectProductTable], (productTable) => ({
  ...productTable,
  selectedRows: undefined,
}));

export const selectProductTableSelectedRows = createSelector(
  [selectProductTable],
  (productTable) => productTable.selectedRows || [],
);

export const selectProductTableSelectedRowIds = createSelector(
  [selectProductTableSelectedRows],
  (productTableSelectedRows) => productTableSelectedRows.map((row) => row.maSanPham),
);

export default productStoreImportEditSlice;
