import { Formik } from 'formik';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import useProductExportCustomerUnitOptions from 'main/hooks/useProductExportCustomerUnitOptions';
// import useProductExportStoreOptions from 'main/hooks/useProductExportStoreOptions';
import useProductStoreOptions from 'main/hooks/useProductStoreOptions';
import { Moment } from 'moment';
import { ChangeEvent } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
// import * as Yup from 'yup';

export type ProductExportFilter = {
  startDate?: Moment;
  endDate?: Moment;
  maKhoXuat?: string;
  maSanPham?: string;
  maKh?: string;
  status?: string;
  searchKey?: string;
  searchField?: string;
};

type Props = {
  filter: ProductExportFilter;
  handleSearchClick: (newFilter: ProductExportFilter) => void;
  handleDateChange: (
    fieldName: string,
    setFieldValue: (fieldName: string, value: any) => any,
    value?: string | Moment,
    startDate?: Moment,
    endDate?: Moment,
  ) => void;
};

// const infoValidationSchema = Yup.object().shape({
//   startDate: Yup.string().required('Trường này là bắt buộc'),
//   endDate: Yup.string().required('Trường này là bắt buộc'),
// });

function ProductStoreExportFilter({ filter, handleSearchClick, handleDateChange }: Props) {
  // React State
  // const productExportStoreOptions = useStatusOptions(true, ProductExportStatus);
  // const { productStoreOptions } = useProductExportStoreOptions(true);
  const { productStoreOptions } = useProductStoreOptions(true);
  // const { productExportCustomers } = useProductExportCustomerOptions(true);
  const { productExportCustomersUnitOptions } = useProductExportCustomerUnitOptions(true);

  return (
    <Formik
      initialValues={filter}
      // enableReinitialize
      // validationSchema={infoValidationSchema}
      onSubmit={() => {
        // do nothing
      }}>
      {({ values, handleChange, setFieldValue, validateForm }) => (
        <Form>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="5">
                  Từ ngày&nbsp;
                  {/* <i className="fa fa-asterisk fa-sm text-danger" /> */}
                </Label>
                <Col md="7">
                  <DatePicker
                    inputProps={{
                      placeholder: 'Chọn ngày',
                      // className: `form-control ${!!errors.startDate ? 'is-invalid' : ''}`,
                    }}
                    hasCorrelationFromTo
                    value={values.startDate}
                    startDate={values.startDate}
                    endDate={values.endDate}
                    onChange={(value) =>
                      handleDateChange(FieldName.START_DATE, setFieldValue, value, values.startDate, values.endDate)
                    }
                  />
                  {/* {errors.startDate && <FormText color="danger">{errors.startDate}</FormText>} */}
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="5">
                  Đến ngày&nbsp;
                  {/* <i className="fa fa-asterisk fa-sm text-danger" /> */}
                </Label>
                <Col md="7">
                  <DatePicker
                    inputProps={{
                      placeholder: 'Chọn ngày',
                      // className: `form-control ${!!errors.endDate ? 'is-invalid' : ''}`,
                    }}
                    hasCorrelationFromTo
                    value={values.endDate}
                    startDate={values.startDate}
                    endDate={values.endDate}
                    onChange={(value) =>
                      handleDateChange(FieldName.END_DATE, setFieldValue, value, values.startDate, values.endDate)
                    }
                  />
                  {/* {errors.endDate && <FormText color="danger">{errors.endDate}</FormText>} */}
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="5">
                  Kho xuất
                </Label>
                <Col md="7">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Tất cả' }}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.MA_KHO_XUAT, e.target.value)
                    }
                    value={values.maKhoXuat}
                    data={productStoreOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="5">
                  Khách hàng/Đơn vị/Kho sản phẩm
                </Label>
                <Col md="7">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Tất cả' }}
                    value={values.maKh}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.MA_KH, e.target.value)}
                    data={productExportCustomersUnitOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            {/* <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="5">
                  Chọn tiêu chí tìm kiếm
                </Label>
                <Col md="7">
                  <Input
                    type="text"
                    name={FieldName.SEARCH_KEY}
                    placeholder="Nhập từ khoá cần tìm..."
                    value={values.searchKey}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col> */}

            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Col className="form-control-label" md="5">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn tiêu chí tìm kiếm' }}
                    value={values.searchField}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.SEARCH_FIELD, e.target.value)
                    }
                    data={[
                      { id: FieldName.MA_SAN_PHAM, text: 'Mã sản phẩm' },
                      { id: FieldName.TEN_SAN_PHAM, text: 'Tên sản phẩm' },
                      { id: FieldName.TEN_GOI_NHO, text: 'Tên gợi nhớ' },
                      { id: FieldName.MA_NHOM, text: 'Nhóm sản phẩm' },
                      { id: FieldName.MA_PHIEU, text: 'Số chứng từ' },
                    ]}
                  />
                </Col>
                <Col md="7">
                  <Input
                    type="text"
                    name={FieldName.SEARCH_KEY}
                    placeholder="Nhập từ khóa"
                    value={values.searchKey}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
            {/**
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="5">
                  Trạng thái sản phẩm
                </Label>
                <Col md="7">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Tất cả' }}
                    value={values.status}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.STATUS, e.target.value)}
                    data={productExportStoreOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            */}
          </Row>
          <div className="d-flex justify-content-end">
            <Button
              color="primary"
              // onClick={() => {
              //   validateForm().then((formErrors) => {
              //     if (Object.keys(formErrors).length === 0) {
              //       handleSearchClick(values);
              //     }
              //   });
              // }}
              onClick={() => handleSearchClick(values)}>
              Lọc dữ liệu
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ProductStoreExportFilter;
