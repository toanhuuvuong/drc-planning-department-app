import { KhotpTransPhieuNhapWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { DateFormat } from 'main/constants';
import { ProductImportType } from 'main/constants/enums';
import { useProductStoreAndOriginOptions, useProductStoreLocationOptions, useProductStoreOptions } from 'main/hooks';
import moment from 'moment';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

type Props = {
  productImportBill: KhotpTransPhieuNhapWithRelations;
};

function ProductStoreImportDetailInfo({
  productImportBill: { maKhoXuat, loaiPhieu, maKhoNhap, ngayNhap, nguoiNhanHang, soChungTu, viTri, soXe, loaiXe },
}: Props) {
  // React State
  const { productStoreOptions, productStoresIsLoading } = useProductStoreOptions(false);
  const { productStoreAndOriginOptions, productStoresAndOriginsIsLoading } = useProductStoreAndOriginOptions(false);
  const { productStoreLocationOptions, productStoreLocationsIsLoading } = useProductStoreLocationOptions(false);

  if (productStoresIsLoading || productStoresAndOriginsIsLoading || productStoreLocationsIsLoading || !loaiPhieu) {
    return null;
  }

  return (
    <Form>
      <h3 className="mb-2">Loại nhập</h3>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row" check>
            <Col md="12">
              <Input type="checkbox" defaultChecked={loaiPhieu === ProductImportType.INTERNAL} disabled />
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
        <Col md={12} lg={5}>
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
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Kho nhập
            </Label>
            <Col md="8">
              <Select2Box className="form-control" value={maKhoNhap} data={productStoreOptions} disabled={true} />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Vị trí lưu kho
            </Label>
            <Col md="8">
              <Select2Box className="form-control" value={viTri} data={productStoreLocationOptions} disabled={true} />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Tháng nhập
            </Label>
            <Col md="8">
              <DatePicker
                inputProps={{ disabled: true }}
                dateFormat={DateFormat.MM_YYYY_VN}
                value={ngayNhap ? moment(ngayNhap) : undefined}
              />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Số xe
            </Label>
            <Col md="8">
              <Input type="text" value={soXe || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Người nhận hàng
            </Label>
            <Col md="8">
              <Input type="text" value={nguoiNhanHang || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Loại xe
            </Label>
            <Col md="8">
              <Input type="text" value={loaiXe || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default ProductStoreImportDetailInfo;
