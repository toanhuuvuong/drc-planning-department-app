import { useKhotpMasterSanPhamControllerCount } from 'main/apis/drc/endpoints/khotp-master-san-pham-controller/khotp-master-san-pham-controller';
import { KhotpMasterSanPhamWithRelations } from 'main/apis/drc/models';
import { Select2Box } from 'main/components/molecules/selectbox';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
    ghiChu: string;
    maNhom: string;
    maSanPham: string;
    tenGoiNho: string;
    tenSanPham: string;
    thoiHanLuuKho: number;
    luuKho: number;
    dvt: string;
  }) => void;
  handleEdit: (id: string, item: Partial<KhotpMasterSanPhamWithRelations>) => void;
  currentItem?: KhotpMasterSanPhamWithRelations | null;
  dataNhomSP: { maNhom: string; tenNhom: string }[]; // Update type definition
}

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({
  isOpen,
  toggle,
  handleAdd,
  handleEdit,
  currentItem,
  dataNhomSP,
}) => {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({
    thoiHanLuuKho: '',
    dvt: '',
    ghiChu: '',
    maNhom: '',
    maSanPham: '',
    tenGoiNho: '',
    tenSanPham: '',
    luuKho: 0,
  });

  const [errors, setErrors] = useState({
    thoiHanLuuKho: '',
    dvt: '',
    maNhom: '',
    maSanPham: '',
    tenGoiNho: '',
    tenSanPham: '',
  });

  const { refetch: refetchCountMaSanPham } = useKhotpMasterSanPhamControllerCount(
    {
      where: { maSanPham: item.maSanPham },
    },
    {
      query: {
        enabled: false,
      },
    },
  );

  const { refetch: refetchCountTenSanPham } = useKhotpMasterSanPhamControllerCount(
    {
      where: { tenSanPham: item.tenSanPham },
    },
    {
      query: {
        enabled: false,
      },
    },
  );

  const validate = async () => {
    const newErrors = {
      thoiHanLuuKho: '',
      dvt: '',
      maNhom: '',
      maSanPham: '',
      tenGoiNho: '',
      tenSanPham: '',
    };
    if (!item.dvt) {
      newErrors.dvt = 'Đơn vị tính là trường bắt buộc';
    }
    if (!item.maNhom) {
      newErrors.maNhom = 'Mã nhóm là trường bắt buộc';
    }
    if (!item.tenGoiNho) {
      newErrors.tenGoiNho = 'Tên gợi nhớ là trường bắt buộc';
    }
    if (!item.thoiHanLuuKho) {
      newErrors.thoiHanLuuKho = 'Thời hạn lưu kho là trường bắt buộc';
    }
    if (!item.maSanPham) {
      newErrors.maSanPham = 'Mã sản phẩm là trường bắt buộc';
    } else {
      const countMaSanPhamResponse = await refetchCountMaSanPham();
      if (
        countMaSanPhamResponse.data &&
        countMaSanPhamResponse.data.count !== undefined &&
        countMaSanPhamResponse.data.count > 0 &&
        (!currentItem || item.maSanPham !== currentItem.maSanPham)
      ) {
        newErrors.maSanPham = 'Sản phẩm đã tồn tại';
      }
    }

    if (!item.tenSanPham) {
      newErrors.tenSanPham = 'Tên sản phẩm là trường bắt buộc';
    } else {
      const countTenSanPhamResponse = await refetchCountTenSanPham();
      if (
        countTenSanPhamResponse.data &&
        countTenSanPhamResponse.data.count !== undefined &&
        countTenSanPhamResponse.data.count > 0 &&
        (!currentItem || item.tenSanPham !== currentItem.tenSanPham)
      ) {
        newErrors.tenSanPham = 'Sản phẩm đã tồn tại';
      }
    }

    setErrors(newErrors);
    return !newErrors.maNhom && !newErrors.thoiHanLuuKho && !newErrors.maSanPham && !newErrors.tenSanPham;
  };

  useEffect(() => {
    if (currentItem) {
      setItem({
        luuKho: currentItem.luuKho || 0,
        thoiHanLuuKho: currentItem.thoiHanLuuKho?.toString() || '',
        dvt: currentItem.dvt || '',
        ghiChu: currentItem.ghiChu || '',
        maNhom: currentItem.maNhom || '',
        maSanPham: currentItem.maSanPham || '',
        tenGoiNho: currentItem.tenGoiNho || '',
        tenSanPham: currentItem.tenSanPham || '',
      });
    } else {
      resetForm();
    }
  }, [currentItem]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'thoiHanLuuKho' && isNaN(Number(value))) {
      setErrors((prevState) => ({
        ...prevState,
        thoiHanLuuKho: 'Thời hạn lưu kho phải là số',
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        [name]: '',
      }));
    }

    setItem((prevState) => ({
      ...prevState,
      [name]: name === 'thoiHanLuuKho' || name === 'luuKho' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string) => (e: ChangeEvent<HTMLSelectElement>) => {
    setErrors((prevState) => ({
      ...prevState,
      [name]: '',
    }));
    setItem((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const isValid = await validate();
      if (isValid) {
        const itemToSubmit = {
          ...item,
          thoiHanLuuKho: item.thoiHanLuuKho ? Number(item.thoiHanLuuKho) : 0, // Convert to number if not empty
        };
        if (currentItem) {
          handleEdit(currentItem.maSanPham || '', itemToSubmit);
        } else {
          handleAdd(itemToSubmit);
        }
        resetForm();
        toggle();
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setItem({
      dvt: '',
      thoiHanLuuKho: '',
      ghiChu: '',
      maNhom: '',
      maSanPham: '',
      tenGoiNho: '',
      tenSanPham: '',
      luuKho: 0,
    });
    setErrors({ dvt: '', thoiHanLuuKho: '', maNhom: '', maSanPham: '', tenGoiNho: '', tenSanPham: '' });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} onClosed={resetForm}>
      <ModalHeader toggle={toggle}>{currentItem === null ? 'Thêm Mới' : 'Chỉnh sửa'}</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="maSanPham">
                  Mã sản phẩm <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="maSanPham"
                  id="maSanPham"
                  value={item.maSanPham}
                  onChange={handleChange}
                  invalid={!!errors.maSanPham}
                  disabled={!!currentItem} // Disable input if currentItem is present
                />
                <FormFeedback>{errors.maSanPham}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="tenSanPham">
                  Tên sản phẩm <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="tenSanPham"
                  id="tenSanPham"
                  value={item.tenSanPham}
                  onChange={handleChange}
                  invalid={!!errors.tenSanPham}
                />
                <FormFeedback>{errors.tenSanPham}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="tenGoiNho">
                  Tên gợi nhớ <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="tenGoiNho"
                  id="tenGoiNho"
                  value={item.tenGoiNho}
                  onChange={handleChange}
                  invalid={!!errors.tenGoiNho}
                />
                <FormFeedback>{errors.tenGoiNho}</FormFeedback>
              </FormGroup>
            </Col>
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
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="maNhom">
                  Mã nhóm <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Select2Box
                  id="maNhom"
                  value={item.maNhom}
                  onChange={handleSelectChange('maNhom')}
                  options={{ placeholder: '' }}
                  data={dataNhomSP.map((nhom) => ({ id: nhom.maNhom, text: `${nhom.maNhom} - ${nhom.tenNhom}` }))}
                  invalid={!!errors.maNhom}
                />
                {errors.maNhom && <FormFeedback className="d-block">{errors.maNhom}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="thoiHanLuuKho">
                  Thời hạn lưu kho (Tháng) <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="thoiHanLuuKho"
                  id="thoiHanLuuKho"
                  value={item.thoiHanLuuKho}
                  onChange={handleChange}
                  invalid={!!errors.thoiHanLuuKho}
                />
                <FormFeedback>{errors.thoiHanLuuKho}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="ghiChu">Ghi chú</Label>
                <Input type="text" name="ghiChu" id="ghiChu" value={item.ghiChu} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>{' '}
        <Button color="secondary" onClick={toggle} disabled={loading}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddEditItemModal;
