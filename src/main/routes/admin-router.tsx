import Dashboard from 'main/components/pages/admin/dashboard/dashboard';
import OrderAnalytics from 'main/components/pages/admin/order-management/order-analytics/order-analytics';
import OrderDashboard from 'main/components/pages/admin/order-management/order-dashboard/order-dashboard';
import OrderManagementAdd from 'main/components/pages/admin/order-management/order-management-add/order-management-add';
import OrderManagementDetail from 'main/components/pages/admin/order-management/order-management-detail/order-management-detail';
import OrderManagementEdit from 'main/components/pages/admin/order-management/order-management-edit/order-management-edit';
import OrderManagementList from 'main/components/pages/admin/order-management/order-management-list/order-management-list';
import OrderManagementWarning from 'main/components/pages/admin/order-management/order-management-warning/order-management-warning';
import ProductCommandExportDetail from 'main/components/pages/admin/product-command-export/product-command-export-detail/product-command-export-detail';
import ProductCommandExportEdit from 'main/components/pages/admin/product-command-export/product-command-export-edit/product-command-export-edit';
import ProductCommandExportList from 'main/components/pages/admin/product-command-export/product-command-export-list/product-command-export-list';
import ProductCustomerExportList from 'main/components/pages/admin/product-customer/product-customer-list';
import ProductEnterpriseExportList from 'main/components/pages/admin/product-enterprise/product-enterprise-list';
import ProductGroupExportList from 'main/components/pages/admin/product-group/product-group-list';
import ProductSemiFinishedList from 'main/components/pages/admin/product-semi-finished/product-semi-finished';
import ProductSemiFinishedGroupList from 'main/components/pages/admin/product-semi-finished-group/product-semi-finished-group-list';
import ProductStocksExportList from 'main/components/pages/admin/product-stocks/product-stocks';
import ProductStoreExcelDetail from 'main/components/pages/admin/product-store-excel/product-store-excel-detail/product-store-excel-detail';
import ProductStoreExcelEdit from 'main/components/pages/admin/product-store-excel/product-store-excel-edit/product-store-excel-edit';
import ProductStoreExcelList from 'main/components/pages/admin/product-store-excel/product-store-excel-list/product-store-excel-list';
import ProductStoreExportAdd from 'main/components/pages/admin/product-store-export/product-store-export-add/product-store-export-add';
import ProductStoreExportDetail from 'main/components/pages/admin/product-store-export/product-store-export-detail/product-store-export-detail';
import ProductStoreExportEdit from 'main/components/pages/admin/product-store-export/product-store-export-edit/product-store-export-edit';
import ProductStoreExportList from 'main/components/pages/admin/product-store-export/product-store-export-list/product-store-export-list';
import ProductStoreImportAdd from 'main/components/pages/admin/product-store-import/product-store-import-add/product-store-import-add';
import ProductStoreImportDetail from 'main/components/pages/admin/product-store-import/product-store-import-detail/product-store-import-detail';
import ProductStoreImportEdit from 'main/components/pages/admin/product-store-import/product-store-import-edit/product-store-import-edit';
import ProductStoreImportList from 'main/components/pages/admin/product-store-import/product-store-import-list/product-store-import-list';
import ProductStoreInventoryList from 'main/components/pages/admin/product-store-inventory/product-store-inventory-list/product-store-inventory-list';
import ProductStoreInventoryWarning from 'main/components/pages/admin/product-store-inventory/product-store-inventory-warning/product-store-inventory-warning';
import ProductWarehouseExportList from 'main/components/pages/admin/product-warehouse/product-warehouse-list';
import MyProfile from 'main/components/pages/admin/profile/MyProfile';
import RequirementsStandardSetCompare from 'main/components/pages/admin/requirements-standard-set/requirements-standard-set-compare/requirements-standard-set-compare';
import RequirementsStandardSetDetail from 'main/components/pages/admin/requirements-standard-set/requirements-standard-set-detail/requirements-standard-set-detail';
import RequirementsStandardSetList from 'main/components/pages/admin/requirements-standard-set/requirements-standard-set-list/requirements-standard-set-list';
import SuppliesGroupExportList from 'main/components/pages/admin/supplies-group/supplies-group-list';
import SuppliesManagementExportList from 'main/components/pages/admin/supplies-management/supplies-management-list';
import SuppliesOriginExportList from 'main/components/pages/admin/supplies-origin/supplies-origin-list';
import SuppliesStoreExportAdd from 'main/components/pages/admin/supplies-store-export/supplies-store-export-add/supplies-store-export-add';
import SuppliesStoreExportDetail from 'main/components/pages/admin/supplies-store-export/supplies-store-export-detail/supplies-store-export-detail';
import SuppliesStoreExportList from 'main/components/pages/admin/supplies-store-export/supplies-store-export-list/supplies-store-export-list';
import SuppliesStoreImportAdd from 'main/components/pages/admin/supplies-store-import/supplies-store-import-add/supplies-store-import-add';
import SuppliesStoreImportDetail from 'main/components/pages/admin/supplies-store-import/supplies-store-import-detail/supplies-store-import-detail';
import SuppliesStoreImportEdit from 'main/components/pages/admin/supplies-store-import/supplies-store-import-edit/supplies-store-import-edit';
import SuppliesStoreImportList from 'main/components/pages/admin/supplies-store-import/supplies-store-import-list/supplies-store-import-list';
import SuppliesStoreInventoryCard from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-card/supplies-store-inventory-card';
import SuppliesStoreInventoryDashboard from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-dashboard/supplies-store-inventory-dashboard';
import SuppliesStoreInventoryList from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/supplies-store-inventory-list';
import SuppliesStoreInventoryWarning from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-warning/supplies-store-inventory-warning';
import SuppliesWarehouseExportList from 'main/components/pages/admin/supplies-warehouse/supplies-warehouse-list';
import TermsAndConditionsList from 'main/components/pages/admin/terms-and-conditions/terms-and-conditions-list';
import TitlePermissionManagement from 'main/components/pages/admin/title-permissions-management/title-permission-management';
import UsersManagementList from 'main/components/pages/admin/users-management/users-management-list';
import { Page } from 'main/constants';
import AdminLayout from 'main/layouts/admin';
import { Navigate, Route } from 'react-router-dom';
import PrivateRoute from './private-route';
import { getPathWithoutAdminPrefix } from '../utils';

const adminRouter = (
  <Route
    path="/admin/*"
    element={
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    }>
    {/** Dashboard Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.DASHBOARD.PATH)} element={<Dashboard />} />

    {/** Supplies Store Import Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_IMPORT_LIST.PATH)}
      element={<SuppliesStoreImportList />}
    />
    <Route path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_IMPORT_ADD.PATH)} element={<SuppliesStoreImportAdd />} />
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_IMPORT_DETAIL.PATH)}
      element={<SuppliesStoreImportDetail />}
    />
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_IMPORT_EDIT.PATH)}
      element={<SuppliesStoreImportEdit />}
    />

    {/** Supplies Store Export Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_EXPORT_LIST.PATH)}
      element={<SuppliesStoreExportList />}
    />
    <Route path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_EXPORT_ADD.PATH)} element={<SuppliesStoreExportAdd />} />
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_EXPORT_DETAIL.PATH)}
      element={<SuppliesStoreExportDetail />}
    />

    {/** Supplies Store Inventory Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_INVENTORY_LIST.PATH)}
      element={<SuppliesStoreInventoryList />}
    />
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_INVENTORY_WARNING.PATH)}
      element={<SuppliesStoreInventoryWarning />}
    />
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_INVENTORY_DASHBOARD.PATH)}
      element={<SuppliesStoreInventoryDashboard />}
    />
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_INVENTORY_CARD.PATH)}
      element={<SuppliesStoreInventoryCard />}
    />

    {/** Supplies Management Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_MANAGEMENT_LIST.PATH)}
      element={<SuppliesManagementExportList />}
    />

    {/** Supplies WareHouse Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.SUPPLIES_WAREHOUSE_LIST.PATH)}
      element={<SuppliesWarehouseExportList />}
    />

    {/** Supplies Group Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.SUPPLIES_GROUP_LIST.PATH)} element={<SuppliesGroupExportList />} />

    {/** Supplies Origin Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.SUPPLIES_ORIGIN_LIST.PATH)} element={<SuppliesOriginExportList />} />

    {/** Product Store Import Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_IMPORT_LIST.PATH)} element={<ProductStoreImportList />} />
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_IMPORT_ADD.PATH)} element={<ProductStoreImportAdd />} />
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_IMPORT_DETAIL.PATH)}
      element={<ProductStoreImportDetail />}
    />
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_IMPORT_EDIT.PATH)} element={<ProductStoreImportEdit />} />

    {/** Product Store Excel Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_EXCEL_LIST.PATH)} element={<ProductStoreExcelList />} />
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_EXCEL_DETAIL.PATH)}
      element={<ProductStoreExcelDetail />}
    />
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_EXCEL_EDIT.PATH)} element={<ProductStoreExcelEdit />} />

    {/** Product Store Export Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_EXPORT_LIST.PATH)} element={<ProductStoreExportList />} />
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_EXPORT_ADD.PATH)} element={<ProductStoreExportAdd />} />
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_EXPORT_DETAIL.PATH)}
      element={<ProductStoreExportDetail />}
    />
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_EXPORT_EDIT.PATH)} element={<ProductStoreExportEdit />} />

    {/** Product Command Export Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCT_COMMAND_EXPORT_LIST.PATH)}
      element={<ProductCommandExportList />}
    />
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCT_COMMAND_EXPORT_DETAIL.PATH)}
      element={<ProductCommandExportDetail />}
    />
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCT_COMMAND_EXPORT_EDIT.PATH)}
      element={<ProductCommandExportEdit />}
    />

    {/** Product Store Inventory Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_INVENTORY_LIST.PATH)}
      element={<ProductStoreInventoryList />}
    />
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCT_STORE_INVENTORY_WARNING.PATH)}
      element={<ProductStoreInventoryWarning />}
    />

    {/** Order Management Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.ORDER_DASHBOARD.PATH)} element={<OrderDashboard />} />
    <Route path={getPathWithoutAdminPrefix(Page.ORDER_MANAGEMENT_LIST.PATH)} element={<OrderManagementList />} />
    <Route path={getPathWithoutAdminPrefix(Page.ORDER_MANAGEMENT_WARNING.PATH)} element={<OrderManagementWarning />} />
    <Route path={getPathWithoutAdminPrefix(Page.ORDER_MANAGEMENT_ANALYTICS.PATH)} element={<OrderAnalytics />} />
    <Route path={getPathWithoutAdminPrefix(Page.ORDER_MANAGEMENT_ADD.PATH)} element={<OrderManagementAdd />} />
    <Route path={getPathWithoutAdminPrefix(Page.ORDER_MANAGEMENT_DETAIL.PATH)} element={<OrderManagementDetail />} />
    <Route path={getPathWithoutAdminPrefix(Page.ORDER_MANAGEMENT_EDIT.PATH)} element={<OrderManagementEdit />} />

    {/** Product WareHouse Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCTS_WAREHOUSE_LIST.PATH)}
      element={<ProductWarehouseExportList />}
    />

    {/** Product Enterprise Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCTS_ENTERPRISE_LIST.PATH)}
      element={<ProductEnterpriseExportList />}
    />

    {/** Product Group Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCTS_GROUP_LIST.PATH)} element={<ProductGroupExportList />} />

    {/** Product Stocks Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCTS_STOCKS_LIST.PATH)} element={<ProductStocksExportList />} />

    {/** Product Customer Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.PRODUCTS_CUSTOMER_LIST.PATH)} element={<ProductCustomerExportList />} />

    {/** Product sales group Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCTS_SALES_GROUP_LIST.PATH)}
      element={<ProductSemiFinishedGroupList />}
    />
    <Route
      path={getPathWithoutAdminPrefix(Page.PRODUCTS_SEMI_FINISHED_LIST.PATH)}
      element={<ProductSemiFinishedList />}
    />

    {/** Requirements Standard Set Routes */}
    <Route
      path={getPathWithoutAdminPrefix(Page.REQUIREMENTS_STANDARD_SET_LIST.PATH)}
      element={<RequirementsStandardSetList />}
    />
    <Route
      path={getPathWithoutAdminPrefix(Page.REQUIREMENTS_STANDARD_SET_COMPARE.PATH)}
      element={<RequirementsStandardSetCompare />}
    />
    <Route
      path={getPathWithoutAdminPrefix(Page.REQUIREMENTS_STANDARD_SET_DETAIL.PATH)}
      element={<RequirementsStandardSetDetail />}
    />

    {/** Terms And Conditions Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.TERMS_AND_CONDITIONS_LIST.PATH)} element={<TermsAndConditionsList />} />

    {/** Users Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.USER_MANAGEMENT.PATH)} element={<UsersManagementList />} />

    {/** Title Routes **/}
    <Route path={getPathWithoutAdminPrefix(Page.TITLE_MANAGEMENT.PATH)} element={<TitlePermissionManagement />} />

    {/** My-Profile Routes */}
    <Route path={getPathWithoutAdminPrefix(Page.MY_PROFILE.PATH)} element={<MyProfile />} />

    {/** Other Routes */}
    <Route path="*" element={<Navigate to={Page.DASHBOARD.PATH} replace />} />
  </Route>
);

export default adminRouter;
