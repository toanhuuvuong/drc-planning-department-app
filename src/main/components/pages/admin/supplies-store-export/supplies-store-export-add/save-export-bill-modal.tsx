import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function SaveExportBillModal({ isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader className="text-center" toggle={toggle}>
        Bạn muốn lưu phiếu xuất
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

export default SaveExportBillModal;
