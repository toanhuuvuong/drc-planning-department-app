import ErrorTemplate from 'main/components/templates/error-template/error-template';
import { Error, Page } from 'main/constants';

function SystemError() {
  return (
    <ErrorTemplate
      pageTitle={Page.SYSTEM_ERROR.NAME}
      heading={Error.SYSTEM_ERROR.HEADDING}
      message={Error.SYSTEM_ERROR.MESSAGE}
    />
  );
}

export default SystemError;
