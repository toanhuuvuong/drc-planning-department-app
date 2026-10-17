import { FormikProps } from 'formik';
import { KhotpTransLenhNhapWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useProductExcelStatusOptions, useProductExcelTemplateTypeOptions } from 'main/hooks';
import moment from 'moment';
import { Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';

export type ProductStoreExcelInfo = Omit<KhotpTransLenhNhapWithRelations, 'id' | 'details'>;

type Props = {
  formikProps: FormikProps<ProductStoreExcelInfo>;
};

function ProductStoreExcelEditInfo({ formikProps: { values, errors, handleChange, setFieldValue } }: Props) {
  // React State
  const productExcelStatusOptions = useProductExcelStatusOptions(false);
  const productExcelTemplateTypeOptions = useProductExcelTemplateTypeOptions(false);

  return (
    <Form>
      <Row>
        <Col md={12} lg={6}>
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
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Trạng thái
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                value={values.status}
                data={productExcelStatusOptions}
                disabled={true}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Ngày nhập&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <DatePicker
                inputProps={{
                  placeholder: 'Chọn ngày',
                  className: `form-control ${!!errors.ngayNhap ? 'is-invalid' : ''}`,
                }}
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
              Template
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                value={values.loaiLenhNhap}
                data={productExcelTemplateTypeOptions}
                disabled={true}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <FormGroup className="row">
            <Label className="form-control-label" lg="2" md="4">
              Ghi chú
            </Label>
            <Col lg="10" md="8">
              <Input
                type="textarea"
                name={FieldName.GHI_CHU}
                placeholder="Nhập ghi chú"
                value={values.ghiChu || ''}
                onChange={handleChange}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default ProductStoreExcelEditInfo;
