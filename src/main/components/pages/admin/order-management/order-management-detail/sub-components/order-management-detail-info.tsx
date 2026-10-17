import { QldhTransDonHangWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import moment from 'moment';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

type Props = {
  orderManagementDetails: QldhTransDonHangWithRelations;
};

function OrderManagementDetailInfo({
  orderManagementDetails: {
    ngayGiaoDuKien,
    donHangId,
    ngayDatHang,
    nguoiTao,
    nguoiYeuCau,
    ngayGiaoThucTe,
    khachHang,
    ghiChu,
  },
}: Readonly<Props>) {
  return (
    <Form>
      <Row>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Khách hàng
            </Label>
            <Col md="8">
              <Input type="text" value={khachHang?.tenKh ?? ''} disabled />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              ID đơn hàng
            </Label>
            <Col md="8">
              <Input type="text" value={donHangId ?? ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Vùng
            </Label>
            <Col md="8">
              <Input type="text" value={khachHang?.khuVucKh ?? ''} disabled />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Ngày đặt hàng
            </Label>
            <Col md="8">
              <DatePicker inputProps={{ disabled: true }} value={ngayDatHang ? moment(ngayDatHang) : undefined} />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Ngày Giao Hàng Dự Kiến
            </Label>
            <Col md="8">
              <DatePicker inputProps={{ disabled: true }} value={ngayGiaoDuKien ? moment(ngayGiaoDuKien) : undefined} />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Người tạo
            </Label>
            <Col md="8">
              <Input type="text" value={nguoiTao || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Ngày Giao Hàng thực tế
            </Label>
            <Col md="8">
              <DatePicker inputProps={{ disabled: true }} value={ngayGiaoThucTe ? moment(ngayGiaoThucTe) : undefined} />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Người yêu cầu
            </Label>
            <Col md="8">
              <Input type="text" value={nguoiYeuCau || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Ghi chú đơn hàng
            </Label>
            <Col md="8">
              <Input type="text" value={ghiChu ?? ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default OrderManagementDetailInfo;
