import { Page } from 'main/constants';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }: PropsWithChildren) {
  // TODO: Implement useAuth hooks
  const authenticated = true;

  return authenticated ? <>{children}</> : <Navigate to={Page.LOGIN.PATH} replace />;
}

export default PrivateRoute;
