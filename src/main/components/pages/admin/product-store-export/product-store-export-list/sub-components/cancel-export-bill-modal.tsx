import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  productExportBillId?: String;
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function CancelExportBillModal({ productExportBillId, isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader className="justify-content-center" toggle={toggle}>
        Bạn muốn hủy phiếu xuất {productExportBillId}?
      </ModalHeader>
      <ModalFooter className="justify-content-between">
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

export default CancelExportBillModal;
