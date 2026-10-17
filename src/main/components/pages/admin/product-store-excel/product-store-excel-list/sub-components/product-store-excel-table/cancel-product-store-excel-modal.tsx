import { KhotpTransLenhNhap } from 'main/apis/drc/models';
import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  productStoreExcel?: KhotpTransLenhNhap;
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function CancelProductStoreExcelModal({ productStoreExcel, isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader toggle={toggle}>Bạn muốn hủy lệnh nhập #{productStoreExcel?.id}?</ModalHeader>
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

export default CancelProductStoreExcelModal;
