import { BasicSpinner } from 'main/components/atoms/spiner';
import SimpleHeader from 'main/components/organisms/header/simple-header';
import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet-async';
import './basic-template.scss';

type Props = {
  pageTitle: string;
  pageName: string;
  parentPage?: {
    name: string;
    path: string;
  };
  isLoading?: boolean;
};

function BasicTemplate({ pageTitle, pageName, parentPage, isLoading, children }: PropsWithChildren<Props>) {
  return (
    <div className="basic-template">
      <Helmet title={pageTitle} />

      <SimpleHeader pageName={pageName} parentPage={parentPage} />

      {isLoading ? (
        <div className="justify-content-center">
          <BasicSpinner />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default BasicTemplate;
