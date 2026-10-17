import ErrorTemplate from 'main/components/templates/error-template';
import { Error, Page } from 'main/constants';

function UrlNotFound() {
  return (
    <ErrorTemplate
      pageTitle={Page.URL_NOT_FOUND.NAME}
      heading={Error.URL_NOT_FOUND.HEADING}
      message={Error.URL_NOT_FOUND.MESSAGE}
    />
  );
}

export default UrlNotFound;
