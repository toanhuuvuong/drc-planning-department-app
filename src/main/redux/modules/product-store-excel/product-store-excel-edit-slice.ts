import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { KhotpTransLenhNhapDetailWithRelations, KhotpTransLenhNhapWithRelations } from 'main/apis/drc/models';
import { ProductStoreExcelInfo } from 'main/components/pages/admin/product-store-excel/product-store-excel-edit/sub-components/product-store-excel-edit-info';
import { RootState } from 'main/redux/store';

type State = {
  productStoreExcelInfo: ProductStoreExcelInfo;
  productStoreExcelDetails: KhotpTransLenhNhapDetailWithRelations[];
};

// State
const initialState: State = {
  productStoreExcelInfo: {},
  productStoreExcelDetails: [],
};

// Slice
const productStoreExcelEditSlice = createSlice({
  name: 'productStoreExcelEdit',
  initialState,
  reducers: {
    loadProductStoreExcel(state, action: PayloadAction<KhotpTransLenhNhapWithRelations>) {
      const { details, ...info } = action.payload;
      state.productStoreExcelInfo = info;
      state.productStoreExcelDetails = details || [];
    },
    setProductDetails(state, action: PayloadAction<KhotpTransLenhNhapDetailWithRelations[]>) {
      state.productStoreExcelDetails = action.payload;
    },
    updateProductDetail: {
      reducer(state, action: PayloadAction<{ id: number; dataField: string; newValue: any }>) {
        const { id, dataField, newValue } = action.payload;
        const updatedIndex = state.productStoreExcelDetails.findIndex((productDetail) => productDetail.id === id);
        if (updatedIndex !== -1) {
          _.set(state.productStoreExcelDetails[updatedIndex], dataField, newValue);
        }
      },
      prepare(id, dataField, newValue) {
        return {
          payload: { id, dataField, newValue },
        };
      },
    },
    resetProductStoreExcelEditState() {
      return initialState;
    },
  },
});

// Action creators
export const { loadProductStoreExcel, setProductDetails, updateProductDetail, resetProductStoreExcelEditState } =
  productStoreExcelEditSlice.actions;

// Selectors
const selectProductStoreExcelEdit = (state: RootState) => state.productStoreExcelEdit;

export const selectProductStoreExcelDetails = createSelector(
  [selectProductStoreExcelEdit],
  (productStoreExcelEdit) => productStoreExcelEdit.productStoreExcelDetails,
);

export const selectProductStoreExcelInfo = createSelector(
  [selectProductStoreExcelEdit],
  (productStoreExcelEdit) => productStoreExcelEdit.productStoreExcelInfo,
);

export default productStoreExcelEditSlice;
