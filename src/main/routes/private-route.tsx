import { Page } from 'main/constants';
import { useAuth } from 'main/hooks';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }: PropsWithChildren) {
  const { authenticated } = useAuth();

  return authenticated ? <>{children}</> : <Navigate to={Page.LOGIN.PATH} replace />;
}

export default PrivateRoute;
