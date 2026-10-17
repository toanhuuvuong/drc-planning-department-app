import { KhovtTransPhieuNhapWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
// import { ImportType } from 'main/constants/enums';
import { useSuppliesOriginOptions, useSuppliesStoreOptions } from 'main/hooks';
import moment from 'moment';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

type Props = {
  suppliesImportBill: KhovtTransPhieuNhapWithRelations;
};

function SuppliesStoreImportDetailInfo({
  suppliesImportBill: {
    typeNhap,
    maKho,
    donViNhap,
    ngayNhap,
    nguoiNhap,
    soPhieuNhap,
    xeVanChuyen,
    soHoaDon,
    viTriLuuKho,
    ngayHoaDon,
  },
}: Props) {
  // React State
  const { suppliesStoreOptions, suppliesStoresIsLoading } = useSuppliesStoreOptions(false);
  const { suppliesOriginOptions, suppliesOriginsIsLoading } = useSuppliesOriginOptions(false);

  if (suppliesStoresIsLoading || suppliesOriginsIsLoading || !typeNhap) {
    return null;
  }

  return (
    <Form>
      {/* <h3 className="mb-2">Loại nhập</h3>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row" check>
            <Col md="12">
              <Input type="checkbox" defaultChecked={typeNhap === ImportType.INTERNAL} disabled />
              <Label check className="form-control-label">
                Nhập luân chuyển nội bộ
              </Label>
            </Col>
          </FormGroup>
        </Col>
      </Row> */}
      <h3 className="mb-2">Phiếu nhập kho</h3>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Ngày nhập
            </Label>
            <Col md="8">
              <DatePicker inputProps={{ disabled: true }} value={ngayNhap ? moment(ngayNhap) : undefined} />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Số phiếu nhập
            </Label>
            <Col md="8">
              <Input type="text" value={soPhieuNhap || ''} disabled />
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
              <Select2Box className="form-control" value={maKho} data={suppliesStoreOptions} disabled={true} />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Vị trí lưu kho
            </Label>
            <Col md="8">
              <Input type="text" value={viTriLuuKho || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Nhà cung cấp
            </Label>
            <Col md="8">
              <Select2Box className="form-control" value={donViNhap} data={suppliesOriginOptions} disabled={true} />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Người nhập
            </Label>
            <Col md="8">
              <Input type="text" value={nguoiNhap || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <h3 className="mb-2">Sổ theo dõi chứng từ nhập</h3>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Xe vận chuyển
            </Label>
            <Col md="8">
              <Input type="text" value={xeVanChuyen || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Số hóa đơn
            </Label>
            <Col md="8">
              <Input type="text" value={soHoaDon || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Ngày trên hóa đơn
            </Label>
            <Col md="8">
              <DatePicker inputProps={{ disabled: true }} value={ngayHoaDon ? moment(ngayHoaDon) : undefined} />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default SuppliesStoreImportDetailInfo;
