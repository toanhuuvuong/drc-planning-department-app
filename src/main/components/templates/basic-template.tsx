import { TransparentSpinner } from 'main/components/atoms/spiner';
import SimpleHeader from 'main/components/organisms/header/simple-header';
import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

type Props = {
  pageCategory: string;
  pageTitle: string;
  pageName: string;
  parentPage?: {
    name: string;
    path: string;
  };
  isLoading?: boolean;
};

function BasicTemplate({
  pageCategory,
  pageTitle,
  pageName,
  parentPage,
  isLoading,
  children,
}: PropsWithChildren<Props>) {
  return (
    <BasicTemplateWrapper>
      <Helmet title={pageTitle} />

      <SimpleHeader pageCategory={pageCategory} pageName={pageName} parentPage={parentPage} />

      {isLoading ? (
        <div className="text-center pt-8 pb-8">
          <TransparentSpinner />
        </div>
      ) : (
        children
      )}
    </BasicTemplateWrapper>
  );
}

const BasicTemplateWrapper = styled.div`
  background-color: transparent;
`;

export default BasicTemplate;
