import { KhotpTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import moment from 'moment';
import { useMemo } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

type Props = {
  productExportBill: KhotpTransPhieuXuatControllerFindDetail200DataItem;
};

function ProductStoreExportDetailInfo({ productExportBill }: Props) {
  const {
    ngayXuat,
    maKh,
    dtKh,
    diaChiKh,
    id,
    maKhoXuat,
    maSoThueKh,
    nguoiVanChuyen,
    nguoiXuatHang,
    soChungTu,
    soXe,
    loaiPhieu,
  } = productExportBill;

  const isLuanChuyenNoiBo = useMemo(() => (loaiPhieu === '1' ? true : false), [loaiPhieu]);

  return (
    <Form>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup check inline className="row">
            <Input type="checkbox" checked={isLuanChuyenNoiBo} disabled />
            <Label check className="form-control-label" md="9">
              Luân chuyển nội bộ
            </Label>
          </FormGroup>
        </Col>
      </Row>
      {isLuanChuyenNoiBo ? null : (
        <Row>
          <Col md={12} lg={6}>
            <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Khách hàng&nbsp;
              </Label>
              <Col md="9">
                <Input type="text" disabled value={maKh || ''} />
              </Col>
            </FormGroup>

            <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Mã số thuế
              </Label>
              <Col md="9">
                <Input type="text" disabled value={maSoThueKh || ''} />
              </Col>
            </FormGroup>
          </Col>
          <Col md={12} lg={6}>
            <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Địa chỉ
              </Label>
              <Col md="9">
                <Input type="text" disabled value={diaChiKh || ''} />
              </Col>
            </FormGroup>
            <FormGroup className="row">
              <Label className="form-control-label" md="3">
                Số điện thoại
              </Label>
              <Col md="9">
                <Input type="text" disabled value={dtKh || ''} />
              </Col>
            </FormGroup>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              ID phiếu xuất
            </Label>
            <Col md="9">
              <Input type="text" disabled value={id || ''} />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          {/* <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Ngày
            </Label>
            <Col md="9">
              <DatePicker
                inputProps={{
                  disabled: true,
                }}
                value={ngayXuat || ''}
              />
            </Col>
          </FormGroup> */}
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Người vận chuyển
            </Label>
            <Col md="9">
              <Input type="text" value={nguoiVanChuyen || ''} disabled />
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
              <Input type="text" value={soChungTu || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          {/* <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Người vận chuyển
            </Label>
            <Col md="9">
              <Input type="text" value={nguoiVanChuyen || ''} disabled />
            </Col>
          </FormGroup> */}
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Số xe
            </Label>
            <Col md="9">
              <Input type="text" value={soXe || ''} disabled />
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
              <Input type="text" value={maKhoXuat || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          {/* <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Số xe
            </Label>
            <Col md="9">
              <Input type="text" value={soXe || ''} disabled />
            </Col>
          </FormGroup> */}
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Người xuất hàng
            </Label>
            <Col md="9">
              <Input type="text" value={nguoiXuatHang || ''} disabled />
            </Col>
          </FormGroup>
        </Col>
      </Row>
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
                  disabled: true,
                }}
                value={ngayXuat ? moment(ngayXuat) : undefined}
              />
            </Col>
          </FormGroup>
        </Col>
        {/* <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="3">
              Người xuất hàng
            </Label>
            <Col md="9">
              <Input type="text" value={nguoiXuatHang || ''} disabled />
            </Col>
          </FormGroup>
        </Col> */}
      </Row>
    </Form>
  );
}

export default ProductStoreExportDetailInfo;
