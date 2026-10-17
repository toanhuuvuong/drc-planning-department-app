import { KhovtTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  suppliesImportBill?: KhovtTransPhieuNhapControllerFindDetail200DataItem;
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function RequestRecheckImportBillModal({ suppliesImportBill, isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader toggle={toggle}>Bạn muốn yêu cầu kiểm tra lại phiếu #{suppliesImportBill?.phieuNhapId}?</ModalHeader>
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
