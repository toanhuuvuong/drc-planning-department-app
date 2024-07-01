import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  suppliesExportBillId?: string;
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function CancelExportBillModal({ suppliesExportBillId, isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader className="text-center" toggle={toggle}>
        Bạn muốn hủy #{suppliesExportBillId}
      </ModalHeader>
      <ModalFooter className="justify-content-between">
        <Button color="primary" onClick={handleConfirmClick}>
          Xác nhận
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default CancelExportBillModal;
