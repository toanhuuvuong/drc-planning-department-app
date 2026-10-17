import { PDFViewer } from '@react-pdf/renderer';
import { FC } from 'react';
import styled from 'styled-components';

type Props = {
  data: any;
  pdfComponent: FC<{ data: any }>;
  height: number;
};

const PdfViewerTemplate = ({ data, pdfComponent: PdfComponent, height }: Props) => {
  return (
    <PdfViewWrapper>
      <PDFViewer width="100%" height={height}>
        <PdfComponent data={data} />
      </PDFViewer>
    </PdfViewWrapper>
  );
};

const PdfViewWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default PdfViewerTemplate;
