import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { KhotpTransLenhXuatDetailWithRelations, KhotpTransLenhXuatWithRelations } from 'main/apis/drc/models';
import { ProductCommandExportInfo } from 'main/components/pages/admin/product-command-export/product-command-export-edit/sub-components/product-command-export-edit-info';
import { RootState } from 'main/redux/store';

type State = {
  productCommandExportInfo: ProductCommandExportInfo;
  productCommandExportDetails: KhotpTransLenhXuatDetailWithRelations[];
};

// State
const initialState: State = {
  productCommandExportInfo: {},
  productCommandExportDetails: [],
};

// Slice
const productCommandExportEditSlice = createSlice({
  name: 'productCommandExportEdit',
  initialState,
  reducers: {
    loadProductCommandExportBill(state, action: PayloadAction<KhotpTransLenhXuatWithRelations>) {
      const { details, ...info } = action.payload;
      state.productCommandExportInfo = info;
      state.productCommandExportDetails = details || [];
    },
    setProductDetails(state, action: PayloadAction<KhotpTransLenhXuatDetailWithRelations[]>) {
      state.productCommandExportDetails = action.payload;
    },
    updateProductDetail: {
      reducer(state, action: PayloadAction<{ maSanPham: string; dataField: string; newValue: any }>) {
        const { maSanPham, dataField, newValue } = action.payload;
        const updatedIndex = state.productCommandExportDetails.findIndex(
          (productDetail) => productDetail.maSanPham === maSanPham,
        );
        if (updatedIndex !== -1) {
          _.set(state.productCommandExportDetails[updatedIndex], dataField, newValue);
        }
      },
      prepare(maSanPham, dataField, newValue) {
        return {
          payload: { maSanPham, dataField, newValue },
        };
      },
    },
    deleteProductDetail(state, action: PayloadAction<string>) {
      state.productCommandExportDetails = state.productCommandExportDetails.filter(
        (productDetail) => productDetail.maSanPham !== action.payload,
      );
    },
    resetProductCommandExportEditState() {
      return initialState;
    },
  },
});

// Action creators
export const {
  loadProductCommandExportBill,
  setProductDetails,
  updateProductDetail,
  deleteProductDetail,
  resetProductCommandExportEditState,
} = productCommandExportEditSlice.actions;

// Selectors
const selectProductCommandExportEdit = (state: RootState) => state.productCommandExportEdit;

export const selectProductCommandExportDetails = createSelector(
  [selectProductCommandExportEdit],
  (productCommandExportEdit) => productCommandExportEdit.productCommandExportDetails,
);

export const selectProductCommandExportInfo = createSelector(
  [selectProductCommandExportEdit],
  (productCommandExportEdit) => productCommandExportEdit.productCommandExportInfo,
);

export default productCommandExportEditSlice;
