import { SuppliesCategoryEdit, SuppliesCategoryList } from 'main/components/pages/supplies-category';
import { Page } from 'main/constants';
import { Route } from 'react-router-dom';

const SuppliesCategoryRouter = (
  <>
    <Route path={Page.SUPPLIES_CATEGORY_LIST.PATH} element={<SuppliesCategoryList />} />
    <Route path={Page.SUPPLIES_CATEGORY_EDIT.PATH} element={<SuppliesCategoryEdit />} />
  </>
);

export default SuppliesCategoryRouter;
