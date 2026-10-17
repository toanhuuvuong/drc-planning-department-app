import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleViewKH22BillClick: () => void;
  handleEditBillClick: () => void;
};

function SaveCompleteModal({ isOpen, toggle, handleViewKH22BillClick, handleEditBillClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <ModalHeader className="text-center" toggle={toggle}>
        Lưu đơn hàng thành công!
      </ModalHeader>
      <ModalFooter className="justify-content-end">
        <Button color="primary" onClick={handleViewKH22BillClick}>
          Xem phiếu nhập KH.22
        </Button>
        <Button color="primary" onClick={handleEditBillClick}>
          Sửa phiếu nhập kho
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default SaveCompleteModal;
