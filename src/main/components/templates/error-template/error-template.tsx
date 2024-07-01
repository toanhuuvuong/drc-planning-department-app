import { AlertIcon } from 'main/components/atoms/icons';
import { Color } from 'main/constants';
import { Helmet } from 'react-helmet-async';
import './error-template.scss';

type Props = {
  pageTitle: string;
  heading: string;
  message: string;
};

function ErrorTemplate({ pageTitle, heading, message }: Props) {
  return (
    <div className="error-template">
      <Helmet title={pageTitle} />
      <div className="error-container">
        <AlertIcon fill={Color.RED} />
        <h1 className="error-heading">{heading}</h1>
        <p className="error-message">{message}</p>
      </div>
    </div>
  );
}

export default ErrorTemplate;
