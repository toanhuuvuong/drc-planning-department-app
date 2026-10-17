import { FormikProps } from 'formik';
import { KhotpTransPhieuNhapWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { DateFormat } from 'main/constants';
import { FieldName, ProductImportType } from 'main/constants/enums';
import { useProductOriginOptions, useProductStoreLocationOptions, useProductStoreOptions } from 'main/hooks';
import moment from 'moment';
import { ChangeEvent } from 'react';
import { Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';

export type ProductStoreImportInfo = Omit<KhotpTransPhieuNhapWithRelations, 'id' | 'details'>;

type Props = {
  formikProps: FormikProps<ProductStoreImportInfo>;
};

function ProductStoreImportAddInfo({ formikProps: { values, errors, handleChange, setFieldValue } }: Props) {
  // React State
  const { productStoreOptions } = useProductStoreOptions(false, true, values.viTri, errors.viTri);
  const { productOriginOptions } = useProductOriginOptions(false);
  const { productStoreLocationOptions } = useProductStoreLocationOptions(false, values.maKhoNhap, errors.maKhoNhap);

  return (
    <Form>
      <h3 className="mb-2">Loại nhập</h3>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row" check>
            <Col md="12">
              <Input
                type="checkbox"
                defaultChecked={values.loaiPhieu === ProductImportType.INTERNAL}
                onChange={() => {
                  setFieldValue(
                    FieldName.LOAI_PHIEU,
                    values.loaiPhieu === ProductImportType.INTERNAL
                      ? ProductImportType.EXTERNAL
                      : ProductImportType.INTERNAL,
                  );
                }}
                disabled
              />
              <Label check className="form-control-label">
                Nhập luân chuyển nội bộ
              </Label>
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <h3 className="mb-2">Phiếu nhập kho</h3>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Kho xuất&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn kho xuất' }}
                value={values.maKhoXuat}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.MA_KHO_XUAT, e.target.value)}
                invalid={!!errors.maKhoXuat}
                data={values.loaiPhieu === ProductImportType.INTERNAL ? productStoreOptions : productOriginOptions}
              />
              {errors.maKhoXuat && <FormText color="danger">{errors.maKhoXuat}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Số chứng từ&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
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
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Kho nhập&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn kho nhập' }}
                value={values.maKhoNhap}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.MA_KHO_NHAP, e.target.value)}
                invalid={!!errors.maKhoNhap}
                data={productStoreOptions}
              />
              {errors.maKhoNhap && <FormText color="danger">{errors.maKhoNhap}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Vị trí lưu kho&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn vị trí' }}
                value={values.viTri}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.VI_TRI, e.target.value)}
                invalid={!!errors.viTri}
                data={productStoreLocationOptions}
              />
              {errors.viTri && <FormText color="danger">{errors.viTri}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Tháng nhập&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <DatePicker
                inputProps={{
                  placeholder: 'Chọn tháng',
                  className: `form-control ${!!errors.ngayNhap ? 'is-invalid' : ''}`,
                }}
                dateFormat={DateFormat.MM_YYYY_VN}
                value={values.ngayNhap ? moment(values.ngayNhap) : undefined}
                onChange={(e) => setFieldValue(FieldName.NGAY_NHAP, e ? moment(e) : undefined)}
              />
              {errors.ngayNhap && <FormText color="danger">{errors.ngayNhap}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Số xe
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.SO_XE}
                placeholder="Nhập số xe"
                value={values.soXe || ''}
                onChange={handleChange}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Người nhận hàng&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.NGUOI_NHAN_HANG}
                placeholder="Nhập người hàng"
                value={values.nguoiNhanHang || ''}
                onChange={handleChange}
                invalid={!!errors.nguoiNhanHang}
              />
              {errors.nguoiNhanHang && <FormText color="danger">{errors.nguoiNhanHang}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Loại xe
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.LOAI_XE}
                placeholder="Nhập loại xe"
                value={values.loaiXe || ''}
                onChange={handleChange}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default ProductStoreImportAddInfo;
