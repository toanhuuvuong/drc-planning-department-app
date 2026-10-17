import { Formik } from 'formik';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useProductStoreAndOriginOptions } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  clickSearchProductCommandExport,
  ProductCommandFilter,
  selectProductCommandFilter,
} from 'main/redux/modules/product-command-export/product-command-export-list-slice';
import moment, { Moment } from 'moment';
import { ChangeEvent, useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

function ProductCommandExportFilter() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectProductCommandFilter);

  // React State
  const { productStoreAndOriginOptions } = useProductStoreAndOriginOptions(true);

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
    (newFilter: ProductCommandFilter) => {
      dispatch(clickSearchProductCommandExport(newFilter));
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
                <Label className="form-control-label" md="5">
                  Từ ngày
                </Label>
                <Col md="7">
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
                <Label className="form-control-label" md="5">
                  Đến ngày
                </Label>
                <Col md="7">
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
                <Label className="form-control-label" md="5">
                  Kho xuất
                </Label>
                <Col md="7">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn kho xuất' }}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.EXPORT_STORE, e.target.value)
                    }
                    value={values.exportStore}
                    data={productStoreAndOriginOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="5">
                  Số chứng từ
                </Label>
                <Col md="7">
                  <Input
                    type="text"
                    name={FieldName.EXPORT_BILL_NO}
                    placeholder="Nhập số chứng từ"
                    value={values.exportBillNo}
                    onChange={handleChange}
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

export default ProductCommandExportFilter;
