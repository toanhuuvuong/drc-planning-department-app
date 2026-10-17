import { NewQldhTransYeuCauSanXuat, QldhTransDonHangControllerSearchItems200DataItem } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import moment from 'moment';
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

type QldhYeuCauThem = QldhTransDonHangControllerSearchItems200DataItem & {
  ngayDatHang: string;
  soLuongDatHang: number;
  soLuongYeuCau: number;
};

interface AddEditItemModalProps {
  isOpen: boolean;
  toggle: () => void;
  handleAdd?: (item: {
    ghiChu: string;
    maSanPham: string;
    ngayDatHang: string;
    nguoiYeuCau: string;
    soLuongDatHang: number;
    soLuongYeuCau: number;
  }) => void;
  handleEdit: (item: NewQldhTransYeuCauSanXuat) => void;
  currentItem?: Partial<QldhYeuCauThem> | null;
}

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({ isOpen, toggle, handleEdit, currentItem }) => {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({
    ghiChu: '',
    maSanPham: '',
    ngayDatHang: '',
    nguoiYeuCau: '',
    soLuongDatHang: 0,
    soLuongYeuCau: 0,
  });

  const [errors, setErrors] = useState({
    nguoiYeuCau: '',
    soLuongYeuCau: '',
  });

  const validate = async () => {
    const newErrors = {
      nguoiYeuCau: '',
      soLuongYeuCau: '',
    };
    if (!item.nguoiYeuCau) {
      newErrors.nguoiYeuCau = ' Người nhận yêu cầu';
    }
    if (!item.soLuongYeuCau) {
      newErrors.soLuongYeuCau = 'Số lượng yêu cầu thêm';
    }
    setErrors(newErrors);
    return !newErrors.nguoiYeuCau && !newErrors.soLuongYeuCau;
  };

  useEffect(() => {
    if (currentItem) {
      setItem({
        ghiChu: currentItem.ghiChu || '',
        maSanPham: currentItem.maSanPham || '',
        ngayDatHang: currentItem.ngayDatHang || '',
        nguoiYeuCau: currentItem.nguoiYeuCau || '',
        soLuongDatHang: currentItem.soLuongDatHang || 0,
        soLuongYeuCau: currentItem.soLuongYeuCau || 0,
      });
    } else {
      resetForm();
    }
  }, [currentItem]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors((prevState) => ({
      ...prevState,
      [name]: '',
    }));

    setItem((prevState) => ({
      ...prevState,
      [name]: name === 'thoiHanLuuKho' || name === 'luuKho' ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const isValid = await validate();
      if (isValid) {
        const itemToSubmit = {
          // donHangId: String(currentItem?.donHangId) || '',
          donHangItemId: currentItem?.id,
          ghiChu: item.ghiChu,
          ngayYeuCau: item.ngayDatHang,
          nguoiNhanYeuCau: item.nguoiYeuCau,
          soLuongYeuCau: Number(item.soLuongYeuCau) || 0,
          trangThai: 'tao-moi',
          // maSanPham: item.maSanPham,
          // soLuongDatHang: item.soLuongDatHang || undefined,
        };

        if (currentItem) {
          handleEdit(itemToSubmit);
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
      ghiChu: '',
      maSanPham: '',
      ngayDatHang: '',
      nguoiYeuCau: '',
      soLuongDatHang: 0,
      soLuongYeuCau: 0,
    });
    setErrors({ nguoiYeuCau: '', soLuongYeuCau: '' });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} onClosed={resetForm}>
      <ModalHeader toggle={toggle}>YÊU CẦU SẢN XUẤT THÊM</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="maSanPham">
                  Mã sản phẩm
                  {/* <i className="fa fa-asterisk fa-sm" /> */}
                </Label>
                <Input
                  type="text"
                  name="maSanPham"
                  id="maSanPham"
                  value={item.maSanPham}
                  onChange={handleChange}
                  disabled
                />
                {/* <FormFeedback>{errors.maSanPham}</FormFeedback> */}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="soLuongDatHang">
                  Số lượng đặt hàng
                  {/* <i className="fa fa-asterisk fa-sm" /> */}
                </Label>
                <Input
                  type="number"
                  name="soLuongDatHang"
                  id="soLuongDatHang"
                  value={item.soLuongDatHang}
                  onChange={handleChange}
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="nguoiYeuCau">
                  Người nhận yêu cầu <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="nguoiYeuCau"
                  id="nguoiYeuCau"
                  value={item.nguoiYeuCau}
                  onChange={handleChange}
                  invalid={!!errors.nguoiYeuCau}
                />
                <FormFeedback>{errors.nguoiYeuCau}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="soLuongDatHang">
                  Số lượng yêu cầu thêm
                  <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="number"
                  name="soLuongYeuCau"
                  id="soLuongYeuCau"
                  value={item.soLuongYeuCau}
                  onChange={handleChange}
                  invalid={!!errors.soLuongYeuCau}
                />
                {/* <FormFeedback>{errors.soLuongDatHang}</FormFeedback> */}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="ghiChu">Ngày yêu cầu</Label>
                <DatePicker value={moment()} inputProps={{ disabled: true }} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="ghiChu">Ghi chú đơn hàng</Label>
                <Input type="text" name="ghiChu" id="ghiChu" value={item.ghiChu} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Đang lưu...' : 'Xác nhận'}
        </Button>{' '}
        <Button color="secondary" onClick={toggle} disabled={loading}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddEditItemModal;
