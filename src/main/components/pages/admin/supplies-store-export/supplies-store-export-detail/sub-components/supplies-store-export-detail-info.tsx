import { KhovtTransPhieuXuatWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { useExportStatusOptions, useSuppliesStoreOptions, useSuppliesUnitAndOriginOptions } from 'main/hooks';
import moment from 'moment';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

type Props = {
  suppliesExportBill: KhovtTransPhieuXuatWithRelations;
};

function SuppliesStoreExportDetailInfo({
  suppliesExportBill: { ghiChu, khoNhap, khoXuat, lyDoXuat, ngayXuat, nguoiTaoPhieu, soPhieu, status, thongTinCanhBao },
}: Props) {
  // React State
  const { suppliesStoreOptions, suppliesStoresIsLoading } = useSuppliesStoreOptions(false);
  const { suppliesUnitAndOriginOptions, suppliesUnitsAndOriginsIsLoading } = useSuppliesUnitAndOriginOptions(false);
  const exportStatusOptions = useExportStatusOptions(false);

  if (suppliesStoresIsLoading || suppliesUnitsAndOriginsIsLoading || !soPhieu) {
    return null;
  }

  return (
    <Form>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Số phiếu xuất
            </Label>
            <Col md="9">
              <Input type="text" value={soPhieu || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Trạng thái
            </Label>
            <Col md="9">
              <Select2Box className="form-control" value={status} data={exportStatusOptions} disabled={true} />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Kho xuất
            </Label>
            <Col md="9">
              <Select2Box className="form-control" value={khoXuat} data={suppliesStoreOptions} disabled={true} />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Đơn vị nhận
            </Label>
            <Col md="9">
              <Select2Box
                className="form-control"
                value={khoNhap}
                data={suppliesUnitAndOriginOptions}
                disabled={true}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Người tạo phiếu
            </Label>
            <Col md="9">
              <Input type="text" value={nguoiTaoPhieu || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Ngày xuất kho
            </Label>
            <Col md="9">
              <DatePicker inputProps={{ disabled: true }} value={ngayXuat ? moment(ngayXuat) : undefined} />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <FormGroup className="row">
            <Label className="form-control-label col-md-3 col-lg-1_5">Lý do xuất</Label>
            <div className="col-md-9 col-lg-10_5">
              <Input type="textarea" value={lyDoXuat || ''} disabled />
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <FormGroup className="row">
            <Label className="form-control-label col-md-3 col-lg-1_5">Thông tin cảnh báo</Label>
            <div className="col-md-9 col-lg-10_5">
              <Input type="textarea" value={thongTinCanhBao || ''} disabled />
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <FormGroup className="row">
            <Label className="form-control-label col-md-3 col-lg-1_5">Ghi chú</Label>
            <div className="col-md-9 col-lg-10_5">
              <Input type="textarea" value={ghiChu || ''} disabled />
            </div>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default SuppliesStoreExportDetailInfo;
