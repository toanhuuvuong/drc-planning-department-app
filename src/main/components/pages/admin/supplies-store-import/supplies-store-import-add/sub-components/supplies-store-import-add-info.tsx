import { DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormikProps } from 'formik';
// KAN-376: Remove unused import
// import { useKhovtTransPhieuNhapControllerGetNextMaSoLo } from 'main/apis/drc/endpoints/khovt-trans-phieu-nhap-controller/khovt-trans-phieu-nhap-controller';
import { KhovtTransPhieuNhapWithRelations } from 'main/apis/drc/models';
import { Select2Box } from 'main/components/molecules/selectbox';
import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { useSuppliesOriginOptions, useSuppliesStoreOptions } from 'main/hooks';
// KAN-376: Remove unused import
// import { useAppDispatch } from 'main/redux/hooks';
// import { updateNextMaSoLo } from 'main/redux/modules/supplies-store-import/supplies-store-import-add-slice';
import moment from 'moment';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';

export type SuppliesStoreImportInfo = KhovtTransPhieuNhapWithRelations;

type Props = {
  formikProps: FormikProps<SuppliesStoreImportInfo>;
};

function SuppliesStoreImportAddInfo({
  formikProps: { values, errors, handleChange, setFieldValue, setValues },
}: Props) {
  // Redux
  // KAN-376: Remove unused dispatch
  // const dispatch = useAppDispatch();

  // React State
  const { suppliesStoreOptions, getSuppliesStoreOptionTextById, getSuppliesStoreOptionMaKhoById } =
    useSuppliesStoreOptions(false, true);
  const { suppliesOriginOptions } = useSuppliesOriginOptions(false);

  // KAN-376: V/v Loại bỏ đánh mã số lô tự động kho vật tư (Remove commented code)
  // const { data: nextMaSoLo, isLoading: nextMaSoLoIsLoading } = useKhovtTransPhieuNhapControllerGetNextMaSoLo(...)

  useEffect(() => {
    // Keep this effect for setting default values
    if (suppliesStoreOptions.length > 0 && !values.maKho) {
      const defaultMaKho = suppliesStoreOptions[0].id;
      // const defaultViTriLuuKho = getSuppliesStoreOptionTextById(Number(defaultMaKho));

      setValues({
        ...values,
        maKho: String(defaultMaKho),
        viTriLuuKho: '',
      });
    }
  }, [suppliesStoreOptions, values, setValues, getSuppliesStoreOptionTextById]);

  // KAN-376: V/v Loại bỏ đánh mã số lô tự động kho vật tư (Remove commented code)
  // useEffect(() => { ... });

  // React Function
  const handleInfoChange = useCallback(
    (fieldName: FieldName, newValue: string) => {
      let updatedValues: Partial<SuppliesStoreImportInfo> = { [fieldName]: newValue };
      let currentMaKho = fieldName === FieldName.MA_KHO ? newValue : values.maKho;
      let currentViTriLuuKho = fieldName === FieldName.VI_TRI_LUU_KHO ? newValue : values.viTriLuuKho;

      // KAN-376: Remove automatic update of viTriLuuKho based on maKho
      // if (fieldName === FieldName.MA_KHO) {
      //   // If maKho changes, update viTriLuuKho if it's empty or matches the old kho name
      //   const oldKhoName = getSuppliesStoreOptionTextById(Number(values.maKho));
      //   const newKhoName = getSuppliesStoreOptionTextById(Number(newValue));
      //   if (!currentViTriLuuKho || currentViTriLuuKho === oldKhoName) {
      //     updatedValues.viTriLuuKho = newKhoName;
      //     currentViTriLuuKho = newKhoName; // Update for ghiChu calculation
      //   }
      // }

      if (currentMaKho && currentViTriLuuKho) {
        const tenKho = getSuppliesStoreOptionTextById(Number(currentMaKho));
        updatedValues.ghiChu =
          tenKho !== currentViTriLuuKho ? `Đã sửa kho nhập từ [${tenKho}] thành [${currentViTriLuuKho}]` : '';
      }

      setValues({
        ...values,
        ...updatedValues,
      });
    },
    [getSuppliesStoreOptionTextById, setValues, values],
  );

  return (
    <Form>
      {/* Remove commented code */}
      {/* <h3 className="mb-2">Loại nhập</h3> */}
      {/* <Row> ... </Row> */}
      <h3 className="mb-2">Phiếu nhập kho</h3>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
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
        {/* Remove commented code */}
        {/* <Col md={12} lg={5}> ... Số phiếu nhập ... </Col> */}
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Vị trí lưu kho&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.VI_TRI_LUU_KHO}
                placeholder="Nhập vị trí lưu kho"
                // Fix: Use formik value
                value={values.viTriLuuKho || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  // Use centralized handler
                  handleInfoChange(FieldName.VI_TRI_LUU_KHO, e.target.value);
                }}
                invalid={errors.viTriLuuKho ? true : undefined}
              />
              {errors.viTriLuuKho && <FormText color="danger">{errors.viTriLuuKho}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
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
                  // Use centralized handler
                  handleInfoChange(FieldName.MA_KHO, e.target.value);
                }}
                invalid={errors.maKho ? 'true' : undefined}
                data={suppliesStoreOptions}
              />
              {errors.maKho && <FormText color="danger">{errors.maKho}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
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
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Nhà cung cấp&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn Nhà cung cấp' }}
                value={values.donViNhap}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.DON_VI_NHAP, e.target.value)}
                invalid={errors.donViNhap ? 'true' : undefined}
                data={suppliesOriginOptions}
              />
              {errors.donViNhap && <FormText color="danger">{errors.donViNhap}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <h3 className="mb-2">Sổ theo dõi chứng từ nhập</h3>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
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
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Số hóa đơn&nbsp;
              {/* <i className="fa fa-asterisk fa-sm text-danger" /> */}
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.SO_HOA_DON}
                placeholder="Nhập số hóa đơn"
                value={values.soHoaDon || ''}
                onChange={handleChange}
                // invalid={!!errors.soHoaDon}
              />
              {/* {errors.soHoaDon && <FormText color="danger">{errors.soHoaDon}</FormText>} */}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={2}></Col>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
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

export default SuppliesStoreImportAddInfo;
