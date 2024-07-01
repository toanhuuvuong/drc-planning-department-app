import Dashboard from 'main/components/pages/admin/dashboard/dashboard';
import SuppliesCategoryEdit from 'main/components/pages/admin/supplies-category/supplies-category-edit';
import SuppliesCategoryList from 'main/components/pages/admin/supplies-category/supplies-category-list';
import SuppliesStoreExportAdd from 'main/components/pages/admin/supplies-store-export/supplies-store-export-add/supplies-store-export-add';
import SuppliesStoreExportDetail from 'main/components/pages/admin/supplies-store-export/supplies-store-export-detail/supplies-store-export-detail';
import SuppliesStoreExportList from 'main/components/pages/admin/supplies-store-export/supplies-store-export-list/supplies-store-export-list';
import { Page } from 'main/constants';
import AdminLayout from 'main/layouts/admin';
import { Navigate, Route } from 'react-router-dom';
import PrivateRoute from './private-route';

const adminRouter = (
  <Route
    path="/admin/*"
    element={
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    }>
    {/** Dashboard Routes */}
    <Route path="dashboard" element={<Dashboard />} />

    {/** Supplies Store Export Routes */}
    <Route path="supplies-store-export/list" element={<SuppliesStoreExportList />} />
    <Route path="supplies-store-export/add" element={<SuppliesStoreExportAdd />} />
    <Route path="supplies-store-export/detail/:id" element={<SuppliesStoreExportDetail />} />

    {/** Supplies Category Routes */}
    <Route path="supplies-category/list" element={<SuppliesCategoryList />} />
    <Route path="supplies-category/edit" element={<SuppliesCategoryEdit />} />

    {/** Other Routes */}
    <Route path="*" element={<Navigate to={Page.DASHBOARD.PATH} replace />} />
  </Route>
);

export default adminRouter;
