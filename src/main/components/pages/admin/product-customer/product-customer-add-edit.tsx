import { useKhotpMasterKhachHangControllerCount } from 'main/apis/drc/endpoints/khotp-master-khach-hang-controller/khotp-master-khach-hang-controller';
import { KhotpMasterKhachHangWithRelations } from 'main/apis/drc/models';
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
    diaChiKh: string;
    dtKh: string;
    ghiChu: string;
    khuVucKh: string;
    lienHeKh: string;
    maKh: string;
    tenKh: string;
    mstKh: string;
    faxKh: string;
  }) => void;
  handleEdit: (id: string, item: Partial<KhotpMasterKhachHangWithRelations>) => void;
  currentItem?: KhotpMasterKhachHangWithRelations | null;
  dataNhomSP: string[];
}

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({
  isOpen,
  toggle,
  handleAdd,
  handleEdit,
  currentItem,
  dataNhomSP,
}) => {
  const [item, setItem] = useState({
    diaChiKh: '',
    dtKh: '',
    ghiChu: '',
    khuVucKh: '',
    lienHeKh: '',
    maKh: '',
    tenKh: '',
    mstKh: '',
    faxKh: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    diaChiKh: '',
    dtKh: '',
    ghiChu: '',
    khuVucKh: '',
    lienHeKh: '',
    maKh: '',
    tenKh: '',
    mstKh: '',
    faxKh: '',
  });

  useEffect(() => {
    if (currentItem) {
      setItem({
        diaChiKh: currentItem.diaChiKh || '',
        dtKh: currentItem.dtKh || '',
        ghiChu: currentItem.ghiChu || '',
        khuVucKh: currentItem.khuVucKh || '',
        lienHeKh: currentItem.lienHeKh || '',
        maKh: currentItem.maKh || '',
        tenKh: currentItem.tenKh || '',
        mstKh: currentItem.mstKh || '',
        faxKh: currentItem.faxKh || '',
      });
    } else {
      resetForm();
    }
  }, [currentItem]);

  const resetForm = () => {
    setItem({
      diaChiKh: '',
      dtKh: '',
      ghiChu: '',
      khuVucKh: '',
      lienHeKh: '',
      maKh: '',
      tenKh: '',
      mstKh: '',
      faxKh: '',
    });
    setErrors({
      diaChiKh: '',
      dtKh: '',
      ghiChu: '',
      khuVucKh: '',
      lienHeKh: '',
      maKh: '',
      tenKh: '',
      mstKh: '',
      faxKh: '',
    });
  };

  const { refetch: refetchCountMaKh } = useKhotpMasterKhachHangControllerCount(
    {
      where: { maKh: item.maKh },
    },
    {
      query: {
        enabled: false,
      },
    },
  );

  const { refetch: refetchCountTenKh } = useKhotpMasterKhachHangControllerCount(
    {
      where: { tenKh: item.tenKh },
    },
    {
      query: {
        enabled: false,
      },
    },
  );

  const validate = async () => {
    const newErrors = {
      diaChiKh: '',
      dtKh: '',
      ghiChu: '',
      khuVucKh: '',
      lienHeKh: '',
      maKh: '',
      tenKh: '',
      mstKh: '',
      faxKh: '',
    };
    if (!item.maKh) {
      newErrors.maKh = 'Mã khách hàng là trường bắt buộc';
    } else {
      const countmaKhResponse = await refetchCountMaKh();
      if (
        countmaKhResponse.data &&
        countmaKhResponse.data.count !== undefined &&
        countmaKhResponse.data.count > 0 &&
        (!currentItem || item.maKh !== currentItem.maKh)
      ) {
        newErrors.maKh = 'Khách hàng đã tồn tại';
      }
    }
    if (!item.tenKh) {
      newErrors.tenKh = 'Tên khách hàng là trường bắt buộc';
    } else {
      const countTenKhResponse = await refetchCountTenKh();
      if (
        countTenKhResponse.data &&
        countTenKhResponse.data.count !== undefined &&
        countTenKhResponse.data.count > 0 &&
        (!currentItem || item.tenKh !== currentItem.tenKh)
      ) {
        newErrors.tenKh = 'Khách hàng đã tồn tại';
      }
    }

    if (!item.diaChiKh) {
      newErrors.diaChiKh = 'Địa chỉ khách hàng là trường bắt buộc';
    }

    if (item.dtKh && !/^\d*$/.test(item.dtKh)) {
      newErrors.dtKh = 'Số điện thoại chỉ được chứa chữ số';
    }

    setErrors(newErrors);
    return !newErrors.maKh && !newErrors.tenKh && !newErrors.diaChiKh && !newErrors.dtKh;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const isValid = await validate();
      if (isValid) {
        if (currentItem) {
          await handleEdit(currentItem.maKh || '', item);
        } else {
          await handleAdd(item);
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

  return (
    <Modal isOpen={isOpen} toggle={toggle} onClosed={resetForm}>
      <ModalHeader toggle={toggle}>{currentItem === null ? 'Thêm Mới' : 'Chỉnh sửa thông tin khách hàng'}</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="maKh">
                  Mã khách hàng <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="maKh"
                  id="maKh"
                  value={item.maKh}
                  onChange={handleChange}
                  invalid={!!errors.maKh}
                  disabled={!!currentItem} // Disable input if currentItem is present
                />
                <FormFeedback>{errors.maKh}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="tenKh">
                  Tên Khách hàng <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="tenKh"
                  id="tenKh"
                  value={item.tenKh}
                  onChange={handleChange}
                  invalid={!!errors.tenKh}
                />
                <FormFeedback>{errors.tenKh}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="diaChiKh">
                  Địa chỉ <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="diaChiKh"
                  id="diaChiKh"
                  value={item.diaChiKh}
                  onChange={handleChange}
                  invalid={!!errors.diaChiKh}
                />
                <FormFeedback>{errors.diaChiKh}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="dtKh">Số điện thoại</Label>
                <Input
                  type="text"
                  name="dtKh"
                  id="dtKh"
                  value={item.dtKh}
                  onChange={handleChange}
                  invalid={!!errors.dtKh}
                />
                <FormFeedback>{errors.dtKh}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="lienHeKh">Người liên hệ</Label>
                <Input type="text" name="lienHeKh" id="lienHeKh" value={item.lienHeKh} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="mstKh">Mã số thuế</Label>
                <Input type="text" name="mstKh" id="mstKh" value={item.mstKh} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="khuVucKh">Vùng</Label>
                <Input type="text" name="khuVucKh" id="khuVucKh" value={item.khuVucKh} onChange={handleChange} />
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
