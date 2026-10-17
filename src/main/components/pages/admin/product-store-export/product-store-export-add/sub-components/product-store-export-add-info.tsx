import { FormikProps } from 'formik';
import { useKhotpMasterKhachHangControllerFindById } from 'main/apis/drc/endpoints/khotp-master-khach-hang-controller/khotp-master-khach-hang-controller';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { ProductStoreExportInfo } from 'main/components/pages/admin/product-store-export/product-store-export-add/use-product-store-export-add';
import { FieldName } from 'main/constants/enums';
// import useProductOriginOptions from 'main/hooks/useProductOriginOptions';
import useProductExportCustomerUnitOptions from 'main/hooks/useProductExportCustomerUnitOptions';
import useProductStoreOptions from 'main/hooks/useProductStoreOptions';
import { generateTimestampId } from 'main/utils/generateTimestampId';
import moment from 'moment';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';

type Props = {
  formikProps: FormikProps<ProductStoreExportInfo>;
  setLoaiPhieu: Dispatch<SetStateAction<string>>;
};

function ProductStoreExportAddInfo({
  formikProps: { values, errors, handleChange, setFieldValue },
  setLoaiPhieu,
}: Props) {
  // const { productExportCustomers } = useProductExportCustomerOptions(false);
  const { productExportCustomersUnitOptions } = useProductExportCustomerUnitOptions(false);
  const { productStoreOptions } = useProductStoreOptions(false, true);
  // const { productOriginOptions } = useProductOriginOptions(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const timestamp = generateTimestampId();

  const { data: productExportCustomerPortfolio, isLoading } =
    useKhotpMasterKhachHangControllerFindById(selectedCustomer);

  const prevCustomerIdRef = useRef(selectedCustomer);
  const prevDataRef = useRef(productExportCustomerPortfolio);

  useEffect(() => {
    if (!isLoading && productExportCustomerPortfolio) {
      // Kiểm tra xem giá trị có thay đổi không
      if (prevCustomerIdRef.current !== selectedCustomer || prevDataRef.current !== productExportCustomerPortfolio) {
        const { diaChiKh, dtKh, mstKh } = productExportCustomerPortfolio;

        if (values.diaChiKh !== diaChiKh) {
          setFieldValue(FieldName.DIA_CHI_KH, diaChiKh);
        }
        if (values.dtKh !== dtKh) {
          setFieldValue(FieldName.DT_KH, dtKh);
        }
        if (values.maSoThueKh !== mstKh) {
          setFieldValue(FieldName.MA_SO_THUE_KH, mstKh);
        }
        setFieldValue(FieldName.MA_PHIEU, timestamp + 'PXK');
      }

      // Cập nhật ref với giá trị hiện tại
      prevCustomerIdRef.current = selectedCustomer;
      prevDataRef.current = productExportCustomerPortfolio;
    }
  }, [selectedCustomer, isLoading, productExportCustomerPortfolio, setFieldValue, timestamp, values]);

  const handleChangeCheckBox = (event: { target: { checked: boolean } }) => {
    if (event.target.checked) {
      setFieldValue(FieldName.MA_PHIEU, timestamp + 'PXK');
    }
    const maLoaiPhieu = event.target.checked ? '1' : '0';
    setLoaiPhieu(maLoaiPhieu);
    setIsChecked(event.target.checked);
    setFieldValue('isChecked', event.target.checked);
  };

  const handleChangeKhachHang = (maKh: string) => {
    setSelectedCustomer(maKh);
    setFieldValue(FieldName.MA_KH, maKh);
  };

  return (
    <Form>
      <h3 className="mb-2">Loại xuất</h3>
      <Row className="mb-3">
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row" check>
            <Col md="12">
              <Input type="checkbox" checked={isChecked} onChange={handleChangeCheckBox} name={FieldName.LOAI_PHIEU} />
              <Label check className="form-control-label">
                Luân chuyển nội bộ
              </Label>
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <h3 className="mb-2">Phiếu xuất kho</h3>
      {isChecked ? null : (
        <Row>
          <Col md={12} lg={6}>
            <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Khách hàng&nbsp;
                <i className="fa fa-asterisk fa-sm text-danger" />
              </Label>
              <Col md="9">
                <Select2Box
                  className="form-control"
                  options={{ placeholder: 'Chọn khách hàng' }}
                  value={values.maKh}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeKhachHang(e.target.value)}
                  invalid={!!errors.maKh}
                  data={productExportCustomersUnitOptions}
                />
                {errors.maKh && <FormText color="danger">{errors.maKh}</FormText>}
              </Col>
            </FormGroup>

            <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Mã số thuế
              </Label>
              <Col md="9">
                <Input
                  type="text"
                  disabled
                  name={FieldName.MA_SO_THUE_KH}
                  value={values.maSoThueKh || ''}
                  onChange={handleChange}
                />
              </Col>
            </FormGroup>
          </Col>
          <Col md={12} lg={6}>
            <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Địa chỉ
              </Label>
              <Col md="9">
                <Input
                  type="text"
                  name={FieldName.DIA_CHI_KH}
                  placeholder="Nhập địa chỉ"
                  value={values.diaChiKh || ''}
                  onChange={handleChange}
                  invalid={!!errors.diaChiKh}
                />
              </Col>
            </FormGroup>
            <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Số điện thoại
              </Label>
              <Col md="9">
                <Input
                  type="text"
                  name={FieldName.DT_KH}
                  placeholder="Nhập số điện thoại"
                  value={values.dtKh || ''}
                  onChange={handleChange}
                  // onChange={(e) => setFieldValue(FieldName.DT_KH, e.target.value)}
                  // invalid={!!errors.nguoiTaoPhieu}
                />
              </Col>
            </FormGroup>

            {/* <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Số tài khoản
              </Label>
              <Col md="9">
                <Input
                  type="text"
                  disabled
                  // name={FieldName.NGUOI_TAO_PHIEU}
                  // // placeholder="Nhập người tạo phiếu"
                  // value={values.nguoiTaoPhieu || ''}
                  onChange={handleChange}
                  // invalid={!!errors.nguoiTaoPhieu}
                />
              </Col>
            </FormGroup>

            <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Hình thức thanh toán
              </Label>
              <Col md="9">
                <Input
                  type="text"
                  name={FieldName.HINH_THUC_THANH_TOAN}
                  // // placeholder="Nhập người tạo phiếu"
                  // value={values.nguoiTaoPhieu || ''}
                  onChange={handleChange}
                  // invalid={!!errors.nguoiTaoPhieu}
                />
              </Col>
              <Col md="9"></Col>
            </FormGroup> */}
          </Col>
        </Row>
      )}

      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Ngày xuất&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="9">
              <DatePicker
                inputProps={{
                  placeholder: 'Chọn ngày xuất',
                  className: `form-control ${!!errors.ngayXuat ? 'is-invalid' : ''}`,
                }}
                value={values.ngayXuat ? moment(values.ngayXuat) : undefined}
                onChange={(e) => setFieldValue(FieldName.NGAY_XUAT, e ? moment(e) : undefined)}
              />
              {errors.ngayXuat && <FormText color="danger">{errors.ngayXuat}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        {/* <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              ID phiếu xuất
            </Label>
            <Col md="9">
              <Input
                type="text"
                disabled
                name={FieldName.MA_PHIEU}
                // // placeholder="Nhập người tạo phiếu"
                value={values.maPhieu || ''}
                onChange={handleChange}
                // invalid={!!errors.nguoiTaoPhieu}
              />
            </Col>
          </FormGroup>
        </Col> */}
        <Col md={12} lg={6}>
          {/* <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Ngày&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="9">
              <DatePicker
                inputProps={{
                  placeholder: 'DD/MM/YYYY',
                  className: `form-control ${!!errors.ngayChungTu ? 'is-invalid' : ''}`,
                }}
                value={values.ngayChungTu || undefined}
                onChange={(e) => setFieldValue(FieldName.NGAY_CHUNG_TU, e ? moment(e) : undefined)}
              />
              {errors.ngayChungTu && <FormText color="danger">{errors.ngayChungTu}</FormText>}
            </Col>
          </FormGroup> */}
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Người vận chuyển
            </Label>
            <Col md="9">
              <Input
                type="text"
                name={FieldName.NGUOI_VAN_CHUYEN}
                placeholder="Nhập người vận chuyển"
                value={values.nguoiVanChuyen || ''}
                onChange={handleChange}
                // invalid={!!errors.nguoiTaoPhieu}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Số chứng từ
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="9">
              <Input
                type="text"
                name={FieldName.SO_CHUNG_TU}
                placeholder="Nhập số chứng từ"
                value={values.soChungTu || ''}
                onChange={handleChange}
                invalid={!!errors.soChungTu}
              />
              {errors.soChungTu && <FormText color="danger">{errors.soChungTu}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          {/* <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Người vận chuyển
            </Label>
            <Col md="9">
              <Input
                type="text"
                name={FieldName.NGUOI_VAN_CHUYEN}
                // // placeholder="Nhập người tạo phiếu"
                value={values.nguoiVanChuyen || ''}
                onChange={handleChange}
                // invalid={!!errors.nguoiTaoPhieu}
              />
            </Col>
          </FormGroup> */}
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              {/* Kho nhập&nbsp; */}
              Số xe
            </Label>
            <Col md="9">
              <Input
                type="text"
                name={FieldName.SO_XE}
                placeholder="Nhập số xe"
                value={values.soXe || ''}
                onChange={handleChange}
                // invalid={!!errors.nguoiTaoPhieu}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Kho xuất&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="9">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn kho xuất' }}
                value={values.maKhoXuat}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.MA_KHO_XUAT, e.target.value)}
                invalid={!!errors.maKhoXuat}
                data={productStoreOptions}
              />
              {errors.maKhoXuat && <FormText color="danger">{errors.maKhoXuat}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Người xuất hàng&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="9">
              <Input
                type="text"
                name={FieldName.NGUOI_XUAT_HANG}
                placeholder="Nhập người xuất hàng"
                value={values.nguoiXuatHang || ''}
                onChange={handleChange}
                invalid={!!errors.nguoiXuatHang}
              />
              {errors.nguoiXuatHang && <FormText color="danger">{errors.nguoiXuatHang}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        {/* <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Người xuất hàng&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="9">
              <Input
                type="text"
                name={FieldName.NGUOI_XUAT_HANG}
                placeholder="Nhập người xuất hàng"
                value={values.nguoiXuatHang || ''}
                onChange={handleChange}
                invalid={!!errors.nguoiXuatHang}
              />
              {errors.nguoiXuatHang && <FormText color="danger">{errors.nguoiXuatHang}</FormText>}
            </Col>
          </FormGroup>
        </Col> */}
      </Row>
      {isChecked ? (
        <Row>
          <Col md={12} lg={6}>
            <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Kho Nhập&nbsp;
                <i className="fa fa-asterisk fa-sm text-danger" />
              </Label>
              <Col md="9">
                <Select2Box
                  className="form-control"
                  options={{ placeholder: 'Chọn Kho Nhập' }}
                  value={values.maKhoNhap}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.MA_KHO_NHAP, e.target.value)}
                  invalid={!!errors.maKhoNhap}
                  data={productStoreOptions}
                />
                {errors.maKhoNhap && <FormText color="danger">{errors.maKhoNhap}</FormText>}
              </Col>
            </FormGroup>
          </Col>
        </Row>
      ) : null}
    </Form>
  );
}

export default ProductStoreExportAddInfo;
