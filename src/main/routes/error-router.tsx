import SystemError from 'main/components/pages/error/system-error';
import UrlNotFound from 'main/components/pages/error/url-not-found';
import ErrorLayout from 'main/layouts/error';
import { Route } from 'react-router-dom';

const errorRouter = (
  <Route path="/error/*" element={<ErrorLayout />}>
    <Route path="system-error" element={<SystemError />} />
    <Route path="url-not-found" element={<UrlNotFound />} />
  </Route>
);

export default errorRouter;
