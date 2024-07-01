import { Page } from 'main/constants';
import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import adminRouter from './admin-router';
import authRouter from './auth-router';
import errorRouter from './error-router';

const baseRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {authRouter}
      {adminRouter}
      {errorRouter}
      <Route index element={<Navigate to={Page.DASHBOARD.PATH} replace />} />
      <Route path="*" element={<Navigate to={Page.URL_NOT_FOUND.PATH} replace />} />
    </Route>,
  ),
);

export default baseRouter;
