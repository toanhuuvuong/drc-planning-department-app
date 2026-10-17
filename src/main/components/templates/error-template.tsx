import { AlertIcon } from 'main/components/atoms/icons';
import { Color } from 'main/constants';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

type Props = {
  pageTitle: string;
  heading: string;
  message: string;
};

function ErrorTemplate({ pageTitle, heading, message }: Props) {
  return (
    <ErrorWrapper>
      <Helmet title={pageTitle} />
      <div className="error-container">
        <AlertIcon fill={Color.RED} />
        <h1 className="error-heading">{heading}</h1>
        <p className="error-message">{message}</p>
      </div>
    </ErrorWrapper>
  );
}

const ErrorWrapper = styled.div`
  .error-container {
    text-align: center;
    margin: 0 auto;
    max-width: 960px;
    padding: 56px 24px;

    .error-heading {
      margin-top: 32px;
      margin-bottom: 32px;
    }

    .error-message {
      font-size: 16px;
      line-height: 1.8;
      white-space: pre-wrap;
    }
  }
`;

export default ErrorTemplate;
