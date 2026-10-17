import { DmMasterBoDinhMuc } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { useRequirementsStandardSetTypeOptions } from 'main/hooks';
import moment from 'moment';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

type Props = {
  requirementsStandardSet: DmMasterBoDinhMuc;
};

function RequirementsStandardSetDetailInfo({
  requirementsStandardSet: { maBoDinhMuc, loaiBoDinhMuc, ngayCapNhat, ghiChu },
}: Props) {
  // React State
  const requirementsStandardSetTypeOptions = useRequirementsStandardSetTypeOptions(true);

  return (
    <Form>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Mã bộ định mức&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Input type="text" value={maBoDinhMuc || ''} disabled={true} />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Template&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn template' }}
                value={loaiBoDinhMuc}
                data={requirementsStandardSetTypeOptions}
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
              Ngày cập nhật&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <DatePicker inputProps={{ disabled: true }} value={ngayCapNhat ? moment(ngayCapNhat) : undefined} />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4" lg="2">
              Lý do cập nhật
            </Label>
            <Col md="8" lg="10">
              <Input type="textarea" value={ghiChu || ''} disabled={true} />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default RequirementsStandardSetDetailInfo;
