import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function ExportCompleteModal({ isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader className="text-center" toggle={toggle}>
        Xuất hàng thành công!
      </ModalHeader>
      <ModalFooter className="justify-content-center">
        <Button color="primary" onClick={handleConfirmClick}>
          Xem phiếu xuất
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ExportCompleteModal;
