import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

// Định nghĩa kiểu dữ liệu cho props của component
interface DeleteModalProps {
  messageItem: string;
  noteMessage?: string;
  modal: boolean;
  toggle: () => void;
  handleDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ messageItem, noteMessage, modal, toggle, handleDelete }) => {
  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Xác nhận xóa</ModalHeader>
      <ModalBody>
        <strong>Bạn có chắc muốn xóa {messageItem}?</strong>
        {noteMessage && (
          <div className="mt-2">
            <i>{noteMessage}</i>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDelete}>
          Xóa
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal;
