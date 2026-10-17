import { useKhotpMasterDonViControllerCount } from 'main/apis/drc/endpoints/khotp-master-don-vi-controller/khotp-master-don-vi-controller';
import { KhotpMasterDonViWithRelations } from 'main/apis/drc/models';
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
  handleAdd: (item: { maDonVi: string; tenDonVi: string; ghiChu: string }) => void;
  handleEdit: (id: string, item: Partial<KhotpMasterDonViWithRelations>) => void;
  currentItem?: KhotpMasterDonViWithRelations | null;
}

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({ isOpen, toggle, handleAdd, handleEdit, currentItem }) => {
  const [item, setItem] = useState({ maDonVi: '', tenDonVi: '', ghiChu: '' });
  const [errors, setErrors] = useState({ maDonVi: '', tenDonVi: '' });
  const [loading, setLoading] = useState(false);

  const { refetch: refetchCountMaDonVi } = useKhotpMasterDonViControllerCount(
    {
      where: { maDonVi: item.maDonVi.trim() },
    },
    {
      query: {
        enabled: false,
      },
    },
  );

  const { refetch: refetchCountTenDonVi } = useKhotpMasterDonViControllerCount(
    {
      where: { tenDonVi: item.tenDonVi.trim() },
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
        maDonVi: currentItem.maDonVi || '',
        tenDonVi: currentItem.tenDonVi || '',
        ghiChu: currentItem.ghiChu || '',
      });
    } else {
      resetForm();
    }
  }, [currentItem]);

  const resetForm = () => {
    setItem({ maDonVi: '', tenDonVi: '', ghiChu: '' });
    setErrors({ maDonVi: '', tenDonVi: '' });
  };

  const validate = async () => {
    const newErrors = { maDonVi: '', tenDonVi: '' };

    if (!item.maDonVi) {
      newErrors.maDonVi = 'Mã đơn vị là trường bắt buộc';
    } else {
      const countMaDonViResponse = await refetchCountMaDonVi();
      if (
        countMaDonViResponse.data &&
        countMaDonViResponse.data.count !== undefined &&
        countMaDonViResponse.data.count > 0 &&
        (!currentItem || item.maDonVi !== currentItem.maDonVi)
      ) {
        newErrors.maDonVi = 'Mã đơn vị đã tồn tại';
      }
    }

    if (!item.tenDonVi) {
      newErrors.tenDonVi = 'Tên đơn vị là trường bắt buộc';
    } else {
      const countTenDonViResponse = await refetchCountTenDonVi();
      if (
        countTenDonViResponse.data &&
        countTenDonViResponse.data.count !== undefined &&
        countTenDonViResponse.data.count > 0 &&
        (!currentItem || item.tenDonVi !== currentItem.tenDonVi)
      ) {
        newErrors.tenDonVi = 'Tên đơn vị đã tồn tại';
      }
    }

    setErrors(newErrors);
    return !newErrors.maDonVi && !newErrors.tenDonVi;
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
      maDonVi: item.maDonVi.trim(),
      tenDonVi: item.tenDonVi.trim(),
      ghiChu: item.ghiChu.trim(),
    };
    setItem(trimmedItem);
    const isValid = await validate();
    if (isValid) {
      if (currentItem) {
        handleEdit(currentItem.maDonVi || '', trimmedItem);
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
            <Label for="maDonVi">
              Mã Đơn Vị <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Input
              type="text"
              name="maDonVi"
              id="maDonVi"
              value={item.maDonVi}
              onChange={handleChange}
              invalid={!!errors.maDonVi}
              readOnly={!!currentItem}
            />
            <FormFeedback>{errors.maDonVi}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="tenDonVi">
              Tên Đơn Vị <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Input
              type="text"
              name="tenDonVi"
              id="tenDonVi"
              value={item.tenDonVi}
              onChange={handleChange}
              invalid={!!errors.tenDonVi}
            />
            <FormFeedback>{errors.tenDonVi}</FormFeedback>
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
