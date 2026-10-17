import { useKhotpMasterNhomBtpControllerCount } from 'main/apis/drc/endpoints/khotp-master-nhom-btp-controller/khotp-master-nhom-btp-controller';
import { KhotpMasterNhomspWithRelations } from 'main/apis/drc/models';
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

interface ProductSalesGroupAddEditProps {
  isOpen: boolean;
  toggle: () => void;
  handleAdd: (item: { ghiChu: string; maNhom: string; tenNhom: string }) => Promise<void>;
  handleEdit: (id: string, item: Partial<KhotpMasterNhomspWithRelations>) => Promise<void>;
  currentItem?: KhotpMasterNhomspWithRelations | null;
}

const ProductSalesGroupAddEdit: React.FC<ProductSalesGroupAddEditProps> = ({
  isOpen,
  toggle,
  handleAdd,
  handleEdit,
  currentItem,
}) => {
  const [item, setItem] = useState<{ ghiChu: string; maNhom: string; tenNhom: string }>({
    ghiChu: '',
    maNhom: '',
    tenNhom: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ ghiChu: string; maNhom: string; tenNhom: string }>({
    ghiChu: '',
    maNhom: '',
    tenNhom: '',
  });

  useEffect(() => {
    if (currentItem) {
      setItem({
        ghiChu: currentItem.ghiChu || '',
        maNhom: currentItem.maNhom || '',
        tenNhom: currentItem.tenNhom || '',
      });
    } else {
      resetForm();
    }
  }, [currentItem]);

  const resetForm = () => {
    setItem({ ghiChu: '', maNhom: '', tenNhom: '' });
    setErrors({ ghiChu: '', maNhom: '', tenNhom: '' });
  };

  const { refetch: refetchCountMaKh } = useKhotpMasterNhomBtpControllerCount(
    { where: { maNhom: item.maNhom } },
    { query: { enabled: false } },
  );

  const { refetch: refetchCountTenKh } = useKhotpMasterNhomBtpControllerCount(
    { where: { tenNhom: item.tenNhom } },
    { query: { enabled: false } },
  );

  const validate = async (): Promise<boolean> => {
    const newErrors = { ghiChu: '', maNhom: '', tenNhom: '' };

    if (!item.maNhom) {
      newErrors.maNhom = 'Mã nhóm BTP là trường bắt buộc';
    } else {
      const { data } = await refetchCountMaKh();
      if (data && data.count !== undefined && data.count > 0 && (!currentItem || item.maNhom !== currentItem.maNhom)) {
        newErrors.maNhom = 'Mã nhóm  BTP là trường bắt buộc';
      }
    }

    if (!item.tenNhom) {
      newErrors.tenNhom = 'Tên nhóm BTP là trường bắt buộc';
    } else {
      const { data } = await refetchCountTenKh();
      if (
        data &&
        data.count !== undefined &&
        data.count > 0 &&
        (!currentItem || item.tenNhom !== currentItem.tenNhom)
      ) {
        newErrors.tenNhom = 'Tên nhóm đã tồn tại';
      }
    }

    setErrors(newErrors);
    return !newErrors.maNhom && !newErrors.tenNhom;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const isValid = await validate();
      if (isValid) {
        if (currentItem) {
          await handleEdit(currentItem.maNhom || '', item);
        } else {
          await handleAdd(item);
        }
        resetForm();
        toggle();
      }
    } catch (error) {
      toast.error((error as any)?.response?.data?.error?.message || (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} onClosed={resetForm}>
      <ModalHeader toggle={toggle}>{currentItem ? 'Chỉnh sửa nhóm bán thành phẩm' : 'Thêm Mới'}</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="maNhom">
                  Mã nhóm BTP <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="maNhom"
                  id="maNhom"
                  value={item.maNhom}
                  onChange={handleChange}
                  invalid={!!errors.maNhom}
                  disabled={!!currentItem}
                />
                <FormFeedback>{errors.maNhom}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label for="tenNhom">
                  Tên nhóm BTP <i className="fa fa-asterisk fa-sm text-danger" />
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
            </Col>
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
        </Button>
        <Button color="secondary" onClick={toggle} disabled={loading}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductSalesGroupAddEdit;
