import { DmMasterBoDinhMuc } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap';

type Props = {
  requirementsStandardSet?: DmMasterBoDinhMuc;
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: () => void;
};

function DeleteRequirementsStandardSetModal({ requirementsStandardSet, isOpen, toggle, handleConfirmClick }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader toggle={toggle}>Bạn có chắc chắn muốn xóa #{requirementsStandardSet?.maBoDinhMuc}?</ModalHeader>
      <ModalFooter className="justify-content-end">
        <EditPermissionAction>
          <Button color="danger" onClick={handleConfirmClick}>
            Xóa
          </Button>
        </EditPermissionAction>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DeleteRequirementsStandardSetModal;
