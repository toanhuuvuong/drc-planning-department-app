import { KhotpTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  productImportBill?: KhotpTransPhieuNhapControllerFindDetail200DataItem;
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function RequestRecheckImportBillModal({ productImportBill, isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader toggle={toggle}>Bạn muốn yêu cầu kiểm tra lại phiếu #{productImportBill?.masterId}?</ModalHeader>
      <ModalFooter className="justify-content-end">
        <Button color="primary" onClick={handleConfirmClick}>
          Xác nhận
        </Button>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default RequestRecheckImportBillModal;
