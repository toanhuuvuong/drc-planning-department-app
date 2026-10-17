import { useKhovtMasterNguonGocControllerCount } from 'main/apis/drc/endpoints/khovt-master-nguon-goc-controller/khovt-master-nguon-goc-controller';
import { KhovtMasterNguonGocWithRelations } from 'main/apis/drc/models';
import { Select2Box } from 'main/components/molecules/selectbox';
import useSuppliesNuocOptions from 'main/hooks/useSuppliesNuocOptions';
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
  handleAdd: (item: { tenNhaSx: string; ghiChu: string; nuocId: string }) => void;
  handleEdit: (id: number, item: Partial<KhovtMasterNguonGocWithRelations>) => void;
  currentItem?: KhovtMasterNguonGocWithRelations | null;
}

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({ isOpen, toggle, handleAdd, handleEdit, currentItem }) => {
  const [item, setItem] = useState({ tenNhaSx: '', ghiChu: '', nuocId: '' });
  const [errors, setErrors] = useState({ tenNhaSx: '', nuocId: '' });
  const [loading, setLoading] = useState(false);
  const { suppliesNuocOptions } = useSuppliesNuocOptions(false);

  const newWhere: any = {};
  if (item.tenNhaSx) {
    newWhere.tenNhaSx = item.tenNhaSx.trim();
  }
  if (item.nuocId) {
    newWhere.nuocId = item.nuocId;
  }
  const { refetch: refetchCountItem } = useKhovtMasterNguonGocControllerCount(
    {
      where: newWhere,
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
        tenNhaSx: currentItem.tenNhaSx || '',
        ghiChu: currentItem.ghiChu || '',
        nuocId: currentItem.nuocId || '',
      });
    } else {
      resetForm();
    }
  }, [currentItem]);

  const resetForm = () => {
    setItem({ tenNhaSx: '', ghiChu: '', nuocId: '' });
    setErrors({ tenNhaSx: '', nuocId: '' });
  };

  const validate = async () => {
    const newErrors = { tenNhaSx: '', nuocId: '' };

    if (!item.tenNhaSx) {
      newErrors.tenNhaSx = 'Tên nhà sản xuất là trường bắt buộc';
    } else {
      const countItemResponse = await refetchCountItem();
      if (
        countItemResponse.data &&
        countItemResponse.data.count !== undefined &&
        countItemResponse.data.count > 0 &&
        (!currentItem || item.tenNhaSx !== currentItem.tenNhaSx || item.nuocId !== currentItem.nuocId)
      ) {
        newErrors.tenNhaSx = 'Nhà sản xuất đã tồn tại';
      }
    }

    if (!item.nuocId) {
      newErrors.nuocId = 'Nước sản xuất là trường bắt buộc';
    }

    setErrors(newErrors);
    return !newErrors.tenNhaSx && !newErrors.nuocId;
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, nuocId: e.target.value });
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
      tenNhaSx: item.tenNhaSx.trim(),
      ghiChu: item.ghiChu.trim(),
      nuocId: item.nuocId.trim(),
    };
    setItem(trimmedItem);
    const isValid = await validate();
    if (isValid) {
      if (currentItem) {
        handleEdit(currentItem.id || 0, trimmedItem);
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
            <Label for="tenNhaSx">
              Tên Nhà Cung Cấp <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Input
              type="text"
              name="tenNhaSx"
              id="tenNhaSx"
              value={item.tenNhaSx}
              onChange={handleChange}
              invalid={!!errors.tenNhaSx}
            />
            <FormFeedback>{errors.tenNhaSx}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="nuocId">
              Nước Sản Xuất <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Select2Box
              className="form-control"
              options={{ placeholder: 'Chọn Nước Sản Xuất' }}
              value={item.nuocId}
              onChange={handleSelectChange}
              data={suppliesNuocOptions}
              invalid={!!errors.nuocId}
            />
            {errors.nuocId && <FormFeedback className="d-block">{errors.nuocId}</FormFeedback>}
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
