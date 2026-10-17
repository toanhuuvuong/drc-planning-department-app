import { configureStore } from '@reduxjs/toolkit';
import authSlice from './modules/auth/auth-slice';
import orderAnalyticsSlice from './modules/order-management/order-analytics-slice';
import orderManagementAddSlice from './modules/order-management/order-management-add-slice';
import orderManagementEditSlice from './modules/order-management/order-management-edit-slice';
import productCommandExportEditSlice from './modules/product-command-export/product-command-export-edit-slice';
import productCommandExportListSlice from './modules/product-command-export/product-command-export-list-slice';
import productStoreExcelEditSlice from './modules/product-store-excel/product-store-excel-edit-slice';
import productStoreExcelListSlice from './modules/product-store-excel/product-store-excel-list-slice';
import productStoreImportAddSlice from './modules/product-store-import/product-store-import-add-slice';
import productStoreImportEditSlice from './modules/product-store-import/product-store-import-edit-slice';
import productStoreImportListSlice from './modules/product-store-import/product-store-import-list-slice';
import productStoreInventoryListSlice from './modules/product-store-inventory/product-store-inventory-list-slice';
import requirementsStandardSetCompareSlice from './modules/requirements-standard-set/requirements-standard-set-compare-slice';
import requirementsStandardSetDetailSlice from './modules/requirements-standard-set/requirements-standard-set-detail-slice';
import requirementsStandardSetListSlice from './modules/requirements-standard-set/requirements-standard-set-list-slice';
import suppliesStoreExportAddSlice from './modules/supplies-store-export/supplies-store-export-add-slice';
import suppliesStoreExportListSlice from './modules/supplies-store-export/supplies-store-export-list-slice';
import suppliesStoreImportAddSlice from './modules/supplies-store-import/supplies-store-import-add-slice';
import suppliesStoreImportEditSlice from './modules/supplies-store-import/supplies-store-import-edit-slice';
import suppliesStoreImportListSlice from './modules/supplies-store-import/supplies-store-import-list-slice';
import suppliesStoreInventoryCardSlice from './modules/supplies-store-inventory/supplies-store-inventory-card-slice';
import suppliesStoreInventoryDashboardSlice from './modules/supplies-store-inventory/supplies-store-inventory-dashboard-slice';
import suppliesStoreInventoryListSlice from './modules/supplies-store-inventory/supplies-store-inventory-list-slice';
import termsAndConditionsListSlice from './modules/terms-and-conditions/terms-and-conditions-list-slice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    suppliesStoreImportList: suppliesStoreImportListSlice.reducer,
    suppliesStoreImportAdd: suppliesStoreImportAddSlice.reducer,
    suppliesStoreImportEdit: suppliesStoreImportEditSlice.reducer,
    suppliesStoreExportList: suppliesStoreExportListSlice.reducer,
    suppliesStoreExportAdd: suppliesStoreExportAddSlice.reducer,
    suppliesStoreInventoryList: suppliesStoreInventoryListSlice.reducer,
    suppliesStoreInventoryCard: suppliesStoreInventoryCardSlice.reducer,
    suppliesStoreInventoryDashboard: suppliesStoreInventoryDashboardSlice.reducer,
    productStoreImportList: productStoreImportListSlice.reducer,
    productStoreImportAdd: productStoreImportAddSlice.reducer,
    productStoreImportEdit: productStoreImportEditSlice.reducer,
    productCommandExportList: productCommandExportListSlice.reducer,
    productCommandExportEdit: productCommandExportEditSlice.reducer,
    productStoreExcelList: productStoreExcelListSlice.reducer,
    productStoreExcelEdit: productStoreExcelEditSlice.reducer,
    productStoreInventoryList: productStoreInventoryListSlice.reducer,
    termsAndConditionsList: termsAndConditionsListSlice.reducer,
    requirementsStandardSetList: requirementsStandardSetListSlice.reducer,
    requirementsStandardSetDetail: requirementsStandardSetDetailSlice.reducer,
    requirementsStandardSetCompare: requirementsStandardSetCompareSlice.reducer,
    orderManagementList: orderManagementEditSlice.reducer,
    orderManagementAdd: orderManagementAddSlice.reducer,
    orderManagementEdit: orderManagementEditSlice.reducer,
    orderAnalytics: orderAnalyticsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
