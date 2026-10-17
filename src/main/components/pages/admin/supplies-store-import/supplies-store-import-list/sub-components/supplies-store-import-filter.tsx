import { Formik } from 'formik';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useSuppliesOriginOptions, useSuppliesStoreOptions } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  clickSearchImport,
  ImportFilter,
  selectImportFilter,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-list-slice';
import moment, { Moment } from 'moment';
import { ChangeEvent, useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

function SuppliesStoreImportFilter() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectImportFilter);

  // React State
  const { suppliesStoreOptions } = useSuppliesStoreOptions(true);
  const { suppliesOriginOptions } = useSuppliesOriginOptions(true);
  // const importStatusOptions = useImportStatusOptions(true);

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
    (newFilter: ImportFilter) => {
      dispatch(clickSearchImport(newFilter));
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
                  Kho nhập
                </Label>
                <Col md="8">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn kho nhập' }}
                    value={values.importStore}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.IMPORT_STORE, e.target.value)
                    }
                    data={suppliesStoreOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Nhà cung cấp
                </Label>
                <Col md="8">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn nhà cung cấp' }}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.ORIGIN, e.target.value)}
                    value={values.origin}
                    data={suppliesOriginOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
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
                <Col className="form-control-label" md="4">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn tiêu chí tìm kiếm' }}
                    value={values.searchField}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.SEARCH_FIELD, e.target.value)
                    }
                    data={[
                      { id: FieldName.MA_VT, text: 'Mã vật tư' },
                      { id: FieldName.TEN_VT, text: 'Tên vật tư' },
                      { id: FieldName.SO_LO, text: 'Mã số lô' },
                      { id: FieldName.MA_NHOM, text: 'Nhóm vật tư' },
                    ]}
                  />
                </Col>
                <Col md="8">
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
                <Label className="form-control-label" md="4">
                  Trạng thái lô hàng
                </Label>
                <Col md="8">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn trạng thái' }}
                    value={values.importStatus}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.IMPORT_STATUS, e.target.value)
                    }
                    data={importStatusOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            */}
          </Row>
          <div className="d-flex justify-content-end">
            <Button color="primary" onClick={() => handleSearchClick(values)}>
              Tìm kiếm
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default SuppliesStoreImportFilter;
