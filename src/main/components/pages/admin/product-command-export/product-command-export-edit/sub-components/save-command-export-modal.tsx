import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function SaveCommandExportModal({ isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader className="text-center" toggle={toggle}>
        Bạn muốn lưu lệnh xuất kho
      </ModalHeader>
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

export default SaveCommandExportModal;
