import { KhotpTransLenhXuatWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { useProductStoreAndOriginOptions } from 'main/hooks';
import useProductExportCustomerUnitOptions from 'main/hooks/useProductExportCustomerUnitOptions';
import moment from 'moment';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

type Props = {
  productCommandExportBill: KhotpTransLenhXuatWithRelations;
};

function ProductCommandExportDetailInfo({
  productCommandExportBill: { maKhoXuat, soChungTu, ngayXuat, maKh, diaChiKh, ghiChu },
}: Props) {
  // React State
  const { productStoreAndOriginOptions, productStoresAndOriginsIsLoading } = useProductStoreAndOriginOptions(false);
  const { productExportCustomersUnitOptions, suppliesUnitsAndOriginsIsLoading } =
    useProductExportCustomerUnitOptions(false);

  if (productStoresAndOriginsIsLoading || suppliesUnitsAndOriginsIsLoading || !maKhoXuat) {
    return null;
  }

  return (
    <Form>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Kho xuất
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                value={maKhoXuat}
                data={productStoreAndOriginOptions}
                disabled={true}
              />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Số chứng từ
            </Label>
            <Col md="8">
              <Input type="text" value={soChungTu || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Ngày xuất kho
            </Label>
            <Col md="8">
              <DatePicker inputProps={{ disabled: true }} value={ngayXuat ? moment(ngayXuat) : undefined} />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Khách hàng
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                value={maKh}
                data={productExportCustomersUnitOptions}
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
              Địa chỉ
            </Label>
            <Col lg="10" md="8">
              <Input type="text" value={diaChiKh || ''} disabled />
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
              <Input type="textarea" value={ghiChu || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default ProductCommandExportDetailInfo;
