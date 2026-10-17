import { useKhotpMasterNhomSpControllerCount } from 'main/apis/drc/endpoints/khotp-master-nhom-sp-controller/khotp-master-nhom-sp-controller';
import { KhotpMasterNhomspWithRelations } from 'main/apis/drc/models';
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
  handleAdd: (item: { maNhom: string; tenNhom: string; ghiChu: string }) => void;
  handleEdit: (id: string, item: Partial<KhotpMasterNhomspWithRelations>) => void;
  currentItem?: KhotpMasterNhomspWithRelations | null;
}

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({ isOpen, toggle, handleAdd, handleEdit, currentItem }) => {
  const [item, setItem] = useState({ maNhom: '', tenNhom: '', ghiChu: '' });
  const [errors, setErrors] = useState({ maNhom: '', tenNhom: '' });
  const [loading, setLoading] = useState(false);

  const { refetch: refetchCountMaNhom } = useKhotpMasterNhomSpControllerCount(
    {
      where: { maNhom: item.maNhom.trim() },
    },
    {
      query: {
        enabled: false,
      },
    },
  );

  const { refetch: refetchCountTenNhom } = useKhotpMasterNhomSpControllerCount(
    {
      where: { tenNhom: item.tenNhom.trim() },
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
        maNhom: currentItem.maNhom || '',
        tenNhom: currentItem.tenNhom || '',
        ghiChu: currentItem.ghiChu || '',
      });
    } else {
      resetForm();
    }
  }, [currentItem]);

  const resetForm = () => {
    setItem({ maNhom: '', tenNhom: '', ghiChu: '' });
    setErrors({ maNhom: '', tenNhom: '' });
  };

  const validate = async () => {
    const newErrors = { maNhom: '', tenNhom: '' };

    if (!item.maNhom) {
      newErrors.maNhom = 'Mã nhóm sản phẩm là trường bắt buộc';
    } else {
      const countMaNhomResponse = await refetchCountMaNhom();
      if (
        countMaNhomResponse.data &&
        countMaNhomResponse.data.count !== undefined &&
        countMaNhomResponse.data.count > 0 &&
        (!currentItem || item.maNhom !== currentItem.maNhom)
      ) {
        newErrors.maNhom = 'Mã nhóm sản phẩm đã tồn tại';
      }
    }

    if (!item.tenNhom) {
      newErrors.tenNhom = 'Tên nhóm sản phẩm là trường bắt buộc';
    } else {
      const countTenNhomResponse = await refetchCountTenNhom();
      if (
        countTenNhomResponse.data &&
        countTenNhomResponse.data.count !== undefined &&
        countTenNhomResponse.data.count > 0 &&
        (!currentItem || item.tenNhom !== currentItem.tenNhom)
      ) {
        newErrors.tenNhom = 'Tên nhóm sản phẩm đã tồn tại';
      }
    }

    setErrors(newErrors);
    return !newErrors.maNhom && !newErrors.tenNhom;
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
      maNhom: item.maNhom.trim(),
      tenNhom: item.tenNhom.trim(),
      ghiChu: item.ghiChu.trim(),
    };
    setItem(trimmedItem);
    const isValid = await validate();
    if (isValid) {
      if (currentItem) {
        handleEdit(currentItem.maNhom || '', trimmedItem);
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
            <Label for="maNhom">
              Mã Nhóm Sản Phẩm <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Input
              type="text"
              name="maNhom"
              id="maNhom"
              value={item.maNhom}
              onChange={handleChange}
              invalid={!!errors.maNhom}
              readOnly={!!currentItem}
            />
            <FormFeedback>{errors.maNhom}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="tenNhom">
              Tên Nhóm Sản Phẩm <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Input
              type="text"
              name="tenNhom"
              id="tenNhom"
              value={item.tenNhom}
              onChange={handleChange}
              invalid={!!errors.tenNhom}
            />
            <FormFeedback>{errors.tenNhom}</FormFeedback>
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
