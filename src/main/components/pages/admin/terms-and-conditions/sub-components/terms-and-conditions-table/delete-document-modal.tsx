import { QdhdsdMasterTaiLieu } from 'main/apis/drc/models';
import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  document?: QdhdsdMasterTaiLieu;
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function DeleteDocumentModal({ document, isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader toggle={toggle}>Bạn có chắc chắn muốn xóa #{document?.tenTaiLieu}?</ModalHeader>
      <ModalFooter className="justify-content-end">
        <Button color="danger" onClick={handleConfirmClick}>
          Xóa
        </Button>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DeleteDocumentModal;
