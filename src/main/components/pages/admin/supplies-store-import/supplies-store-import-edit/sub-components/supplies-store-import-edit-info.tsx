import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { FormikProps } from 'formik';
import { Select2Box } from 'main/components/molecules/selectbox';
import { SuppliesStoreImportInfo } from 'main/components/pages/admin/supplies-store-import/supplies-store-import-add/sub-components/supplies-store-import-add-info';
// import { FieldName, ImportType } from 'main/constants/enums';
import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { useSuppliesOriginOptions, useSuppliesStoreOptions } from 'main/hooks';
import moment from 'moment';
import { ChangeEvent, useCallback } from 'react';
import { Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';

type Props = {
  formikProps: FormikProps<SuppliesStoreImportInfo>;
};

function SuppliesStoreImportEditInfo({
  formikProps: { values, errors, handleChange, setFieldValue, setValues },
}: Props) {
  // React State
  const { suppliesStoreOptions, suppliesStoresIsLoading, getSuppliesStoreOptionTextById } = useSuppliesStoreOptions(
    false,
    true,
  );
  const { suppliesOriginOptions, suppliesOriginsIsLoading } = useSuppliesOriginOptions(false);

  // React Function
  const syncUpdateNote = useCallback(
    (maKho: string, viTriLuuKho: string) => {
      const tenKho = getSuppliesStoreOptionTextById(Number(maKho));
      let ghiChu = '';
      if (tenKho !== viTriLuuKho) {
        ghiChu = `Đã sửa kho nhập từ [${tenKho}] thành [${viTriLuuKho}]`;
      }
      setValues({
        ...values,
        maKho,
        viTriLuuKho,
        ghiChu,
      });
    },
    [getSuppliesStoreOptionTextById, setValues, values],
  );

  if (suppliesStoresIsLoading || suppliesOriginsIsLoading || !values.typeNhap) {
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
              <Input
                type="checkbox"
                defaultChecked={values.typeNhap === ImportType.INTERNAL}
                onChange={() => {
                  setFieldValue(
                    FieldName.TYPE_NHAP,
                    values.typeNhap === ImportType.INTERNAL ? ImportType.EXTERNAL : ImportType.INTERNAL,
                  );
                }}
                disabled
              />
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
              Ngày nhập&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={values.ngayNhap ? moment(values.ngayNhap, DateFormat.ISO_8601_DATE_ONLY) : null}
                  format={DateFormat.DATE_ONLY_VN}
                  onChange={(newDate) => setFieldValue(FieldName.NGAY_NHAP, newDate ? moment(newDate) : undefined)}
                  onAccept={(newDate: any) => setFieldValue(FieldName.NGAY_NHAP, newDate ? moment(newDate) : undefined)}
                  reduceAnimations
                  slotProps={{ inputAdornment: { hidden: false }, textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
              {errors.ngayNhap && <FormText color="danger">{errors.ngayNhap}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Số phiếu nhập
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.SO_PHIEU_NHAP}
                placeholder="Nhập số phiếu nhập"
                value={String(values.soPhieuNhap)}
                onChange={handleChange}
                disabled
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Kho nhập&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn kho nhập' }}
                value={values.maKho}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const newValue = e.target.value;
                  if (values.viTriLuuKho) {
                    // Update ghiChu
                    syncUpdateNote(newValue, values.viTriLuuKho);
                  } else {
                    // Set default viTriLuuKho
                    setValues({
                      ...values,
                      maKho: newValue,
                      viTriLuuKho: getSuppliesStoreOptionTextById(Number(e.target.value)),
                    });
                  }
                }}
                invalid={!!errors.maKho}
                data={suppliesStoreOptions}
              />
              {errors.maKho && <FormText color="danger">{errors.maKho}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Vị trí lưu kho&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.VI_TRI_LUU_KHO}
                placeholder="Nhập vị trí lưu kho"
                value={values.viTriLuuKho || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newValue = e.target.value;
                  if (values.maKho) {
                    // Update ghiChu
                    syncUpdateNote(values.maKho, newValue);
                  } else {
                    // Update viTriLuuKho
                    setFieldValue(FieldName.VI_TRI_LUU_KHO, newValue);
                  }
                }}
                invalid={!!errors.viTriLuuKho}
              />
              {errors.viTriLuuKho && <FormText color="danger">{errors.viTriLuuKho}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Nhà cung cấp&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn nhà cung cấp' }}
                value={values.donViNhap}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.DON_VI_NHAP, e.target.value)}
                invalid={!!errors.donViNhap}
                data={suppliesOriginOptions}
              />
              {errors.donViNhap && <FormText color="danger">{errors.donViNhap}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Người nhập&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.NGUOI_NHAP}
                placeholder="Nhập người tạo phiếu"
                value={values.nguoiNhap || ''}
                onChange={handleChange}
                invalid={!!errors.nguoiNhap}
              />
              {errors.nguoiNhap && <FormText color="danger">{errors.nguoiNhap}</FormText>}
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
              <Input
                type="text"
                name={FieldName.XE_VAN_CHUYEN}
                placeholder="Nhập xe vận chuyển"
                value={values.xeVanChuyen || ''}
                onChange={handleChange}
              />
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Số hóa đơn
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.SO_HOA_DON}
                placeholder="Nhập số hóa đơn"
                value={values.soHoaDon || ''}
                onChange={handleChange}
                invalid={!!errors.soHoaDon}
              />
              {errors.soHoaDon && <FormText color="danger">{errors.soHoaDon}</FormText>}
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
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={values.ngayHoaDon ? moment(values.ngayHoaDon, DateFormat.ISO_8601_DATE_ONLY) : null}
                  format={DateFormat.DATE_ONLY_VN}
                  onChange={(newDate) => setFieldValue(FieldName.NGAY_HOA_DON, newDate ? moment(newDate) : undefined)}
                  onAccept={(newDate: any) =>
                    setFieldValue(FieldName.NGAY_HOA_DON, newDate ? moment(newDate) : undefined)
                  }
                  reduceAnimations
                  slotProps={{ inputAdornment: { hidden: false }, textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
              {errors.ngayHoaDon && <FormText color="danger">{errors.ngayHoaDon}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default SuppliesStoreImportEditInfo;
