import { KhovtTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import ImportBillsPdfDocument from 'main/components/organisms/pdf-document/import-bills-pdf-document';
import PdfViewerTemplate from 'main/components/templates/pdf-viewer-template';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  suppliesImportBills?: KhovtTransPhieuNhapControllerFindDetail200DataItem[];
};

function ViewPdfImportBillModal({ isOpen, toggle, suppliesImportBills }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <ModalHeader toggle={toggle}>Sổ theo dõi chứng từ nhập về</ModalHeader>
      <ModalBody>
        <PdfViewerTemplate
          height={400}
          data={suppliesImportBills}
          pdfComponent={({ data }) => (
            <ImportBillsPdfDocument
              title="Sổ theo dõi chứng từ nhập về"
              // @ts-ignore
              data={data}
            />
          )}
        />
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ViewPdfImportBillModal;
