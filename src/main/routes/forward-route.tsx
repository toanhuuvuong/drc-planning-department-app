import { Page } from 'main/constants';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

function ForwardRoute({ children }: PropsWithChildren) {
  // TODO: Implement useAuth hooks
  const authenticated = false;

  return !authenticated ? <>{children}</> : <Navigate to={Page.DASHBOARD.PATH} replace />;
}

export default ForwardRoute;
