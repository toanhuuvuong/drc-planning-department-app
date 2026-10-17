import { KhotpTransLenhNhapWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { useProductExcelStatusOptions, useProductExcelTemplateTypeOptions } from 'main/hooks';
import moment from 'moment';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

type Props = {
  productStoreExcel: KhotpTransLenhNhapWithRelations;
};

function ProductStoreExcelDetailInfo({
  productStoreExcel: { soChungTu, ngayNhap, loaiLenhNhap, status, ghiChu },
}: Props) {
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
              <Input type="text" value={soChungTu || ''} disabled={true} />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Trạng thái
            </Label>
            <Col md="8">
              <Select2Box className="form-control" value={status} data={productExcelStatusOptions} disabled={true} />
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
              <DatePicker inputProps={{ disabled: true }} value={ngayNhap ? moment(ngayNhap) : undefined} />
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
                value={loaiLenhNhap}
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
              <Input type="textarea" value={ghiChu || ''} disabled={true} />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default ProductStoreExcelDetailInfo;
