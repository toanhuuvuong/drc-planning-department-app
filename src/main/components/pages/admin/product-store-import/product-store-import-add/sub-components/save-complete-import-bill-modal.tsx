import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleViewBillClick: () => void;
  handleEditBillClick: () => void;
};

function SaveCompleteImportBillModal({ isOpen, toggle, handleViewBillClick, handleEditBillClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <ModalHeader className="text-center" toggle={toggle}>
        Nhập sản phẩm thành công!
      </ModalHeader>
      <ModalFooter className="justify-content-center">
        <Button color="primary" onClick={handleViewBillClick}>
          Xem phiếu nhập
        </Button>
        <Button color="primary" onClick={handleEditBillClick}>
          Sửa phiếu nhập
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default SaveCompleteImportBillModal;
