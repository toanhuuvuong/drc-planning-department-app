import '@cyntler/react-doc-viewer/dist/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'quill/dist/quill.core.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-notification-alert/dist/animate.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'select2/dist/css/select2.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'template/assets/scss/argon-dashboard-pro-react.scss?v1.2.1';
import 'template/assets/vendor/nucleo/css/nucleo.css';
import App from './App';
import './index.scss';
import AppProvider from './providers/app-provider';

import { EnvUtil } from './utils';

async function enableMocking() {
  if (!EnvUtil.isTest()) {
    return;
  }
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

  root.render(
    <AppProvider>
      <App />
      <ToastContainer />
    </AppProvider>,
  );
});
