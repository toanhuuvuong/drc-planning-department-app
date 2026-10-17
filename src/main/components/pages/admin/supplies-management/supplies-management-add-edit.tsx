import { useKhovtMasterVtControllerCount } from 'main/apis/drc/endpoints/khovt-master-vt-controller/khovt-master-vt-controller';
import { KhovtMasterVtWithRelations } from 'main/apis/drc/models';
import { Select2Box } from 'main/components/molecules/selectbox';
import { useSuppliesGroupOptions } from 'main/hooks';
import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';

interface AddEditItemModalProps {
  isOpen: boolean;
  toggle: () => void;
  handleAdd: (item: {
    maVt: string;
    tenVt: string;
    ghiChu: string;
    dvt: string;
    maNhom: string;
    tenGoiNho: string;
    thoiHanLuuKho: number;
  }) => void;
  handleEdit: (id: string, item: Partial<KhovtMasterVtWithRelations>) => void;
  currentItem?: KhovtMasterVtWithRelations | null;
}

const AddNewItemModal: React.FC<AddEditItemModalProps> = ({ isOpen, toggle, handleAdd, handleEdit, currentItem }) => {
  const [item, setItem] = useState({
    maVt: '',
    tenVt: '',
    ghiChu: '',
    dvt: '',
    maNhom: '',
    tenGoiNho: '',
    thoiHanLuuKho: 0,
  });
  const [errors, setErrors] = useState({ maVt: '', tenVt: '', dvt: '', maNhom: '', thoiHanLuuKho: '' });
  const [loading, setLoading] = useState(false);
  const { suppliesGroupOptions } = useSuppliesGroupOptions(false);

  const { refetch: refetchCountMaVT } = useKhovtMasterVtControllerCount(
    {
      where: { maVt: item.maVt.trim() },
    },
    {
      query: {
        enabled: false,
      },
    },
  );

  const { refetch: refetchCountTenVT } = useKhovtMasterVtControllerCount(
    {
      where: { tenVt: item.tenVt.trim() },
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
        maVt: currentItem.maVt || '',
        tenVt: currentItem.tenVt || '',
        ghiChu: currentItem.ghiChu || '',
        dvt: currentItem.dvt || '',
        maNhom: currentItem.maNhom || '',
        tenGoiNho: currentItem.tenGoiNho || '',
        thoiHanLuuKho: currentItem.thoiHanLuuKho || 0,
      });
    } else {
      resetForm();
    }
  }, [currentItem]);

  const resetForm = () => {
    setItem({ maVt: '', tenVt: '', ghiChu: '', dvt: '', maNhom: '', tenGoiNho: '', thoiHanLuuKho: 0 });
    setErrors({ maVt: '', tenVt: '', dvt: '', maNhom: '', thoiHanLuuKho: '' });
  };

  const validate = async () => {
    const newErrors = { maVt: '', tenVt: '', dvt: '', maNhom: '', thoiHanLuuKho: '' };

    if (!item.maVt) {
      newErrors.maVt = 'Mã vật tư là trường bắt buộc';
    } else {
      const countMaVTResponse = await refetchCountMaVT();
      if (
        countMaVTResponse.data &&
        countMaVTResponse.data.count !== undefined &&
        countMaVTResponse.data.count > 0 &&
        (!currentItem || item.maVt !== currentItem.maVt)
      ) {
        newErrors.maVt = 'Mã vật tư đã tồn tại';
      }
    }

    if (!item.tenVt) {
      newErrors.tenVt = 'Tên vật tư là trường bắt buộc';
    } else {
      const countTenVTResponse = await refetchCountTenVT();
      if (
        countTenVTResponse.data &&
        countTenVTResponse.data.count !== undefined &&
        countTenVTResponse.data.count > 0 &&
        (!currentItem || item.tenVt !== currentItem.tenVt)
      ) {
        newErrors.tenVt = 'Tên vật tư đã tồn tại';
      }
    }

    if (!item.dvt) {
      newErrors.dvt = 'Đơn vị tính là trường bắt buộc';
    }

    if (!item.maNhom) {
      newErrors.maNhom = 'Nhóm vật tư là trường bắt buộc';
    }

    if (item.thoiHanLuuKho < 0) {
      newErrors.thoiHanLuuKho = 'Thời hạn lưu kho phải lớn hơn hoặc bằng 0';
    }

    setErrors(newErrors);
    return !newErrors.maVt && !newErrors.tenVt && !newErrors.maNhom && !newErrors.dvt && !newErrors.thoiHanLuuKho;
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, maNhom: e.target.value });
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
      maVt: item.maVt.trim(),
      tenVt: item.tenVt.trim(),
      ghiChu: item.ghiChu.trim(),
      dvt: item.dvt.trim(),
      maNhom: item.maNhom.trim(),
      tenGoiNho: item.tenGoiNho.trim(),
      thoiHanLuuKho: Number(item.thoiHanLuuKho),
    };
    setItem(trimmedItem);
    const isValid = await validate();
    if (isValid) {
      if (currentItem) {
        handleEdit(currentItem.maVt || '', trimmedItem);
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
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="maVt">
                  Mã vật tư <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="maVt"
                  id="maVt"
                  value={item.maVt}
                  onChange={handleChange}
                  invalid={!!errors.maVt}
                  readOnly={!!currentItem}
                />
                <FormFeedback>{errors.maVt}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="maNhom">
                  Nhóm vật tư <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Select2Box
                  className="form-control"
                  options={{ placeholder: 'Chọn Nhóm Vật Tư' }}
                  value={item.maNhom}
                  onChange={handleSelectChange}
                  data={suppliesGroupOptions}
                  invalid={!!errors.maNhom}
                />
                {errors.maNhom && <FormFeedback className="d-block">{errors.maNhom}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="tenVt">
                  Tên vật tư <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="tenVt"
                  id="tenVt"
                  value={item.tenVt}
                  onChange={handleChange}
                  invalid={!!errors.tenVt}
                />
                <FormFeedback>{errors.tenVt}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="tenGoiNho">Tên gợi nhớ</Label>
                <Input type="text" name="tenGoiNho" id="tenGoiNho" value={item.tenGoiNho} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="dvt">
                  Đơn vị tính <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="dvt"
                  id="dvt"
                  value={item.dvt}
                  onChange={handleChange}
                  invalid={!!errors.dvt}
                />
                <FormFeedback>{errors.dvt}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="thoiHanLuuKho">
                  Thời hạn lưu kho (tháng) <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="number"
                  name="thoiHanLuuKho"
                  id="thoiHanLuuKho"
                  min="0"
                  value={item.thoiHanLuuKho}
                  onChange={handleChange}
                  invalid={!!errors.thoiHanLuuKho}
                />
                <FormFeedback>{errors.thoiHanLuuKho}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
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

export default AddNewItemModal;
