import { KhotpTransLenhXuat } from 'main/apis/drc/models';
import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  productCommandExportBill?: KhotpTransLenhXuat;
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function CancelCommandExportModal({ productCommandExportBill, isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader toggle={toggle}>Bạn muốn hủy phiếu #{productCommandExportBill?.id}?</ModalHeader>
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

export default CancelCommandExportModal;
