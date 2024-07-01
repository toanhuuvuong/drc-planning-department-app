import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, RouterProvider } from 'react-router-dom';
import { Page } from './constants';
import baseRouter from './routes/base-router';

function App() {
  return (
    <ErrorBoundary fallback={<Navigate to={Page.SYSTEM_ERROR.PATH} replace />}>
      <RouterProvider router={baseRouter} />
    </ErrorBoundary>
  );
}

export default App;
