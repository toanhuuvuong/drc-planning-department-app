import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function CreateProductStoreImportModal({ isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader className="text-center" toggle={toggle}>
        Bạn muốn tạo phiếu nhập cho lệnh nhập
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

export default CreateProductStoreImportModal;
