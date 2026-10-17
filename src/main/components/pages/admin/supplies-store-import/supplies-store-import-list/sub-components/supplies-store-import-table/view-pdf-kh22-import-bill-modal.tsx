import {
  KhovtTransPhieuNhapControllerFindDetail200DataItem,
  KhovtTransPhieuNhapWithRelations,
} from 'main/apis/drc/models';
import KH22BillPdfDocument from 'main/components/organisms/pdf-document/kh22-bill-pdf-document';
import PdfViewerTemplate from 'main/components/templates/pdf-viewer-template';
import { useMemo } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  suppliesImportBill?: KhovtTransPhieuNhapControllerFindDetail200DataItem;
};

function ViewPdfKH22ImportBillModal({ isOpen, toggle, suppliesImportBill }: Props) {
  const transformSuppliesImportBill = useMemo((): KhovtTransPhieuNhapWithRelations => {
    if (!suppliesImportBill) {
      return {};
    }
    const { donViNhap, soPhieuNhap, maVt, tenVt, dvt, soLuong, ghiChu } = suppliesImportBill;
    return {
      soPhieuNhap,
      donViNhap,
      details: [
        {
          maVt: String(maVt),
          tenVt,
          dvt,
          soLuong,
          ghiChu,
        },
      ],
    };
  }, [suppliesImportBill]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <ModalHeader toggle={toggle}>Phiếu nhập KH.22</ModalHeader>
      <ModalBody>
        <PdfViewerTemplate
          data={transformSuppliesImportBill}
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
