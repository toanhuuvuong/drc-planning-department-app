import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { useMemo } from 'react';
import styled from 'styled-components';

type Props = {
  documentUri: any;
  documentFileType?: string;
  height: number;
};

const DocumentViewerTemplate = ({ documentUri, documentFileType, height }: Props) => {
  const docs = useMemo(() => [{ uri: documentUri, fileType: documentFileType }], [documentUri, documentFileType]);

  return (
    <DocumentViewWrapper height={height}>
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        config={{
          header: {
            disableHeader: false,
            disableFileName: true,
            retainURLParams: false,
          },
        }}
      />
    </DocumentViewWrapper>
  );
};

type DocumentViewWrapperProps = {
  height?: number;
};

const DocumentViewWrapper = styled.div<DocumentViewWrapperProps>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ height }) => (height ? `height: ${height}px;` : '')}
  overflow: auto;

  #react-doc-viewer > #header-bar {
    display: none;
  }

  iframe {
    ${({ height }) => (height ? `height: ${height}px;` : '')}
  }
`;

export default DocumentViewerTemplate;
