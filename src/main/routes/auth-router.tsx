import Login from 'main/components/pages/auth/login';
import Register from 'main/components/pages/auth/register';
import { Page } from 'main/constants';
import AuthLayout from 'main/layouts/auth';
import { Navigate, Route } from 'react-router-dom';
import ForwardRoute from './forward-route';

const authRouter = (
  <Route
    path="/auth/*"
    element={
      <ForwardRoute>
        <AuthLayout />
      </ForwardRoute>
    }>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="*" element={<Navigate to={Page.LOGIN.PATH} replace />} />
  </Route>
);

export default authRouter;
