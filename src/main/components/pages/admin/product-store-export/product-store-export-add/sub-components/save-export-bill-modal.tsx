import { Button, FormGroup, Label, Modal, ModalFooter, ModalHeader, Row } from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleClosedCompletePopup: () => void;
};

function SaveExportBillModal({ isOpen, toggle, handleClosedCompletePopup }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false}>
      <ModalHeader className="text-center justify-content-center"></ModalHeader>
      <FormGroup className="column">
        <Row className="justify-content-center">
          <Label className="form-control-label text-center">Xuất sản phẩm thành công!</Label>
        </Row>
      </FormGroup>
      <ModalFooter className="justify-content-center">
        <Button color="primary" onClick={() => handleClosedCompletePopup()}>
          Đóng
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default SaveExportBillModal;
