import { Autocomplete, TextField } from '@mui/material';
import { Formik } from 'formik';
import { DatePicker } from 'main/components/atoms/date';
import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import useProductExportStoreOptions from 'main/hooks/useProductExportStoreOptions';
import moment, { Moment } from 'moment';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

export type ProductFilter = {
  maSanPham: string;
  tenSanPham: string;
  // soChungTu: string;
  tenGoiNho: string;
  // ThoiHanLuuKho: string;
  ThoiHanLuuKho: string;
  ngayNhap: Moment | null;
  maKho: string;
};

type Props = {
  filter: ProductFilter;
  handleSearchClick: (newFilter: ProductFilter) => void;
  // productStoreOptions: { id: string; text: string }[];
};

function AddProductModalFilter({ filter, handleSearchClick }: Props) {
  // React State
  const { productStoreOptions } = useProductExportStoreOptions(false);

  return (
    <Formik
      initialValues={filter}
      enableReinitialize
      onSubmit={() => {
        // do nothing
      }}>
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Mã sản phẩm
                </Label>
                <Col md="9">
                  <Autocomplete
                    options={productStoreOptions}
                    getOptionLabel={(option) => option.text}
                    value={productStoreOptions.find((opt) => opt.id === values.maSanPham) || null}
                    onChange={(_, newValue) => {
                      setFieldValue(FieldName.MA_SAN_PHAM, newValue ? newValue.id : '');
                    }}
                    clearOnEscape
                    renderInput={(params) => (
                      <TextField {...params} label="Lọc theo mã sản phẩm" variant="outlined" fullWidth />
                    )}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Tháng Nhập
                </Label>
                <Col md="9">
                  <DatePicker
                    inputProps={{
                      placeholder: 'Chọn Tháng Nhập',
                      className: `form-control`,
                    }}
                    dateFormat={DateFormat.MM_YYYY_VN}
                    value={moment(values.ngayNhap) || undefined}
                    onChange={(e) => setFieldValue(FieldName.NGAY_NHAP, e ? moment(e) : undefined)}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Tên sản phẩm
                </Label>
                <Col md="9">
                  <Input
                    className="form-control"
                    placeholder="Nhập tên sản phẩm"
                    name={FieldName.TEN_SAN_PHAM}
                    value={values.tenSanPham}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Tên gợi nhớ
                </Label>
                <Col md="9">
                  <Input
                    className="form-control"
                    placeholder="Nhập tên gợi nhớ"
                    name={FieldName.TEN_GOI_NHO}
                    value={values.tenGoiNho}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                {/* <Label className="form-control-label" md="3">
                  Số chứng từ
                </Label>
                <Col md="9">
                  <Input
                    className="form-control"
                    placeholder="Nhập số chứng từ"
                    name={FieldName.SO_CHUNG_TU}
                    value={values.soChungTu}
                    onChange={handleChange}
                  />
                </Col> */}
              </FormGroup>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Hạn lưu kho
                </Label>
                <Col md="9">
                  <DatePicker
                    inputProps={{
                      placeholder: 'Chọn hạn lưu kho',
                      className: `form-control`,
                    }}
                    dateFormat={DateFormat.MM_YYYY_VN}
                    value={values.ThoiHanLuuKho}
                    onChange={(e) => setFieldValue(FieldName.THOI_HAN_LUU_KHO_2, e ? moment(e) : undefined)}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button color="primary" onClick={() => handleSearchClick(values)}>
              Lọc dữ liệu
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AddProductModalFilter;
