import { KhovtTransPhieuNhapWithRelations } from 'main/apis/drc/models';
import KH22BillPdfDocument from 'main/components/organisms/pdf-document/kh22-bill-pdf-document';
import PdfViewerTemplate from 'main/components/templates/pdf-viewer-template';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  newSuppliesImportBill?: KhovtTransPhieuNhapWithRelations;
};

function ViewPdfKH22ImportBillModal({ isOpen, toggle, newSuppliesImportBill }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <ModalHeader toggle={toggle}>Phiếu nhập KH.22</ModalHeader>
      <ModalBody>
        <PdfViewerTemplate
          data={newSuppliesImportBill}
          pdfComponent={({ data }) => <KH22BillPdfDocument title="Phiếu nhập KH.22" data={data} />}
          height={400}
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

export default ViewPdfKH22ImportBillModal;
