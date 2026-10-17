import { FormikProps } from 'formik';
import { KhovtTransPhieuXuatWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useExportStatusOptions, useSuppliesStoreOptions, useSuppliesUnitAndOriginOptions } from 'main/hooks';
import { useAppDispatch } from 'main/redux/hooks';
import { syncSuppliesStoreCodeFilter } from 'main/redux/modules/supplies-store-export/supplies-store-export-add-slice';
import moment from 'moment';
import { ChangeEvent, useEffect } from 'react';
import { Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';

export type SuppliesStoreExportInfo = Omit<KhovtTransPhieuXuatWithRelations, 'id' | 'details'>;

type Props = {
  formikProps: FormikProps<SuppliesStoreExportInfo>;
};

function SuppliesStoreExportAddInfo({
  formikProps: { values, errors, setValues, handleChange, setFieldValue },
}: Props) {
  // Redux
  const dispatch = useAppDispatch();

  // React State
  const { suppliesStoreOptions, getSuppliesStoreOptionTextById } = useSuppliesStoreOptions(false);
  const { suppliesUnitAndOriginOptions } = useSuppliesUnitAndOriginOptions(false);
  const exportStatusOptions = useExportStatusOptions(false);

  useEffect(() => {
    if (suppliesStoreOptions.length > 0 && !values.khoXuat) {
      const defaultMaKho = suppliesStoreOptions[0].id;

      setValues({
        ...values,
        khoXuat: String(defaultMaKho),
      });
    }
  }, [suppliesStoreOptions, values, setValues, getSuppliesStoreOptionTextById]);

  return (
    <Form>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="3">
              Số phiếu xuất
            </Label>
            <Col md="9">
              <Input
                type="text"
                name={FieldName.SO_PHIEU}
                //placeholder="Nhập số phiếu xuất"
                value={values.soPhieu || ''}
                onChange={handleChange}
                invalid={!!errors.soPhieu}
                disabled
              />
              {errors.soPhieu && <FormText color="danger">{errors.soPhieu}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="3">
              Trạng thái
            </Label>
            <Col md="9">
              <Select2Box
                className="form-control"
                name={FieldName.STATUS}
                value={values.status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.STATUS, e.target.value)}
                data={exportStatusOptions}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="3">
              Kho xuất&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="9">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn kho xuất' }}
                value={values.khoXuat}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setFieldValue(FieldName.KHO_XUAT, e.target.value);
                  // Sync with search condition of AddSuppliesModal
                  dispatch(syncSuppliesStoreCodeFilter(e.target.value));
                }}
                data={suppliesStoreOptions}
                invalid={!!errors.khoXuat}
              />
              {errors.khoXuat && <FormText color="danger">{errors.khoXuat}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="3">
              Đơn vị nhận&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="9">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn Đơn vị nhận' }}
                value={values.khoNhap}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.KHO_NHAP, e.target.value)}
                invalid={!!errors.khoNhap}
                data={suppliesUnitAndOriginOptions}
              />
              {errors.khoNhap && <FormText color="danger">{errors.khoNhap}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="3">
              Người tạo phiếu&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="9">
              <Input
                type="text"
                name={FieldName.NGUOI_TAO_PHIEU}
                placeholder="Nhập người tạo phiếu"
                value={values.nguoiTaoPhieu || ''}
                onChange={handleChange}
                invalid={!!errors.nguoiTaoPhieu}
              />
              {errors.nguoiTaoPhieu && <FormText color="danger">{errors.nguoiTaoPhieu}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="3">
              Ngày xuất kho&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="9">
              <DatePicker
                inputProps={{
                  placeholder: 'Chọn ngày',
                  className: `form-control ${!!errors.ngayXuat ? 'is-invalid' : ''}`,
                }}
                value={values.ngayXuat ? moment(values.ngayXuat) : undefined}
                onChange={(e) => setFieldValue(FieldName.NGAY_XUAT, e ? moment(e) : undefined)}
              />
              {errors.ngayXuat && <FormText color="danger">{errors.ngayXuat}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label col-md-3 col-lg-1_5">Lý do xuất</Label>
            <div className="col-md-9 col-lg-10_5">
              <Input
                type="textarea"
                name={FieldName.LY_DO_XUAT}
                placeholder="Nhập lý do xuất"
                value={values.lyDoXuat || ''}
                onChange={handleChange}
              />
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label col-md-3 col-lg-1_5">Thông tin cảnh báo</Label>
            <div className="col-md-9 col-lg-10_5">
              <Input
                type="textarea"
                name={FieldName.THONG_TIN_CANH_BAO}
                placeholder="Nhập thông tin cảnh báo"
                value={values.thongTinCanhBao || ''}
                onChange={handleChange}
              />
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label col-md-3 col-lg-1_5">Ghi chú</Label>
            <div className="col-md-9 col-lg-10_5">
              <Input
                type="textarea"
                name={FieldName.GHI_CHU}
                placeholder="Nhập ghi chú"
                value={values.ghiChu || ''}
                onChange={handleChange}
              />
            </div>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default SuppliesStoreExportAddInfo;
