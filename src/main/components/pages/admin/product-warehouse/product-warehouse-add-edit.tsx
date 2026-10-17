import { useKhotpMasterKhoControllerCount } from 'main/apis/drc/endpoints/khotp-master-kho-controller/khotp-master-kho-controller';
import { KhotpMasterKhoWithRelations } from 'main/apis/drc/models';
import { useEffect, useState } from 'react';
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

interface AddEditItemModalProps {
  isOpen: boolean;
  toggle: () => void;
  handleAdd: (item: { maKho: string; tenKho: string; ghiChu: string }) => void;
  handleEdit: (id: string, item: Partial<KhotpMasterKhoWithRelations>) => void;
  currentItem?: KhotpMasterKhoWithRelations | null;
}

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({ isOpen, toggle, handleAdd, handleEdit, currentItem }) => {
  const [item, setItem] = useState({ maKho: '', tenKho: '', ghiChu: '' });
  const [errors, setErrors] = useState({ maKho: '', tenKho: '' });
  const [loading, setLoading] = useState(false);

  const { refetch: refetchCountMaKho } = useKhotpMasterKhoControllerCount(
    {
      where: { maKho: item.maKho.trim() },
    },
    {
      query: {
        enabled: false,
      },
    },
  );

  const { refetch: refetchCountTenKho } = useKhotpMasterKhoControllerCount(
    {
      where: { tenKho: item.tenKho.trim() },
    },
    {
      query: {
        enabled: false,
      },
    },
  );

  useEffect(() => {
    if (currentItem) {
      setItem({
        maKho: currentItem.maKho || '',
        tenKho: currentItem.tenKho || '',
        ghiChu: currentItem.ghiChu || '',
      });
    } else {
      resetForm();
    }
  }, [currentItem]);

  const resetForm = () => {
    setItem({ maKho: '', tenKho: '', ghiChu: '' });
    setErrors({ maKho: '', tenKho: '' });
  };

  const validate = async () => {
    const newErrors = { maKho: '', tenKho: '' };

    if (!item.maKho) {
      newErrors.maKho = 'Mã kho là trường bắt buộc';
    } else {
      const countMaKhoResponse = await refetchCountMaKho();
      if (
        countMaKhoResponse.data &&
        countMaKhoResponse.data.count !== undefined &&
        countMaKhoResponse.data.count > 0 &&
        (!currentItem || item.maKho !== currentItem.maKho)
      ) {
        newErrors.maKho = 'Mã kho đã tồn tại';
      }
    }

    if (!item.tenKho) {
      newErrors.tenKho = 'Tên Kho là trường bắt buộc';
    } else {
      const countTenKhoResponse = await refetchCountTenKho();
      if (
        countTenKhoResponse.data &&
        countTenKhoResponse.data.count !== undefined &&
        countTenKhoResponse.data.count > 0 &&
        (!currentItem || item.tenKho !== currentItem.tenKho)
      ) {
        newErrors.tenKho = 'Tên kho đã tồn tại';
      }
    }

    setErrors(newErrors);
    return !newErrors.maKho && !newErrors.tenKho;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const trimmedItem = {
      maKho: item.maKho.trim(),
      tenKho: item.tenKho.trim(),
      ghiChu: item.ghiChu.trim(),
    };
    setItem(trimmedItem);
    const isValid = await validate();
    if (isValid) {
      if (currentItem) {
        handleEdit(currentItem.maKho || '', trimmedItem);
      } else {
        handleAdd(trimmedItem);
      }
      resetForm();
      toggle();
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} onClosed={resetForm}>
      <ModalHeader toggle={toggle}>{currentItem === null ? 'Thêm Mới' : 'Chỉnh sửa'}</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="maKho">
              Mã Kho <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Input
              type="text"
              name="maKho"
              id="maKho"
              value={item.maKho}
              onChange={handleChange}
              invalid={!!errors.maKho}
              readOnly={!!currentItem}
            />
            <FormFeedback>{errors.maKho}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="tenKho">
              Tên Kho <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Input
              type="text"
              name="tenKho"
              id="tenKho"
              value={item.tenKho}
              onChange={handleChange}
              invalid={!!errors.tenKho}
            />
            <FormFeedback>{errors.tenKho}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="ghiChu">Ghi Chú</Label>
            <Input type="text" name="ghiChu" id="ghiChu" value={item.ghiChu} onChange={handleChange} />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddEditItemModal;
