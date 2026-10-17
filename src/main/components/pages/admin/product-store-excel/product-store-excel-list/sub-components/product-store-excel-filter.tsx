import { Formik } from 'formik';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useProductExcelStatusOptions, useProductExcelTemplateTypeOptions } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  clickSearchProductStoreExcel,
  ProductExcelFilter,
  selectProductExcelFilter,
} from 'main/redux/modules/product-store-excel/product-store-excel-list-slice';
import moment, { Moment } from 'moment';
import { ChangeEvent, useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

function ProductStoreExcelFilter() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectProductExcelFilter);

  // React State
  const productExcelStatusOptions = useProductExcelStatusOptions(true);
  const productExcelTemplateTypeOptions = useProductExcelTemplateTypeOptions(true);

  // React Function
  const handleDateChange = useCallback(
    (
      fieldName: string,
      setFieldValue: (fieldName: string, value: any) => any,
      value?: string | Moment,
      startDate?: Moment,
      endDate?: Moment,
    ) => {
      if (!value) {
        setFieldValue(fieldName, undefined);
        return;
      }

      const currentDate = moment(value);
      if (
        (fieldName === FieldName.START_DATE && endDate && endDate.toDate() < currentDate.toDate()) ||
        (fieldName === FieldName.END_DATE && startDate && startDate.toDate() > currentDate.toDate())
      ) {
        setFieldValue(FieldName.START_DATE, currentDate);
        setFieldValue(FieldName.END_DATE, currentDate);
      } else {
        setFieldValue(fieldName, currentDate);
      }
    },
    [],
  );

  // React Function
  const handleSearchClick = useCallback(
    (newFilter: ProductExcelFilter) => {
      dispatch(clickSearchProductStoreExcel(newFilter));
    },
    [dispatch],
  );

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
                <Label className="form-control-label" md="4">
                  Từ ngày
                </Label>
                <Col md="8">
                  <DatePicker
                    inputProps={{ placeholder: 'Chọn ngày' }}
                    hasCorrelationFromTo
                    value={values.startDate}
                    startDate={values.startDate}
                    endDate={values.endDate}
                    onChange={(value) =>
                      handleDateChange(FieldName.START_DATE, setFieldValue, value, values.startDate, values.endDate)
                    }
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Đến ngày
                </Label>
                <Col md="8">
                  <DatePicker
                    inputProps={{ placeholder: 'Chọn ngày' }}
                    hasCorrelationFromTo
                    value={values.endDate}
                    startDate={values.startDate}
                    endDate={values.endDate}
                    onChange={(value) =>
                      handleDateChange(FieldName.END_DATE, setFieldValue, value, values.startDate, values.endDate)
                    }
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Số chứng từ
                </Label>
                <Col md="8">
                  <Input
                    type="text"
                    name={FieldName.PRODUCT_STORE_EXCEL_CODE}
                    placeholder="Nhập số chứng từ"
                    value={values.productStoreExcelCode}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Trạng thái
                </Label>
                <Col md="8">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn trạng thái' }}
                    value={values.status}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.STATUS, e.target.value)}
                    data={productExcelStatusOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Template
                </Label>
                <Col md="8">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn template' }}
                    value={values.productExcelTemplateType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.PRODUCT_EXCEL_TEMPLATE_TYPE, e.target.value)
                    }
                    data={productExcelTemplateTypeOptions}
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

export default ProductStoreExcelFilter;
