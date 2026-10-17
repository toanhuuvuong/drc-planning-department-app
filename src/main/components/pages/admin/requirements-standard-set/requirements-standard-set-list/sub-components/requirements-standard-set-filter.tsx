import { Formik } from 'formik';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useRequirementsStandardSetTypeOptions } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  clickSearchRequirementsStandardSet,
  RequirementsStandardSetFilter,
  selectRequirementsStandardSetFilter,
} from 'main/redux/modules/requirements-standard-set/requirements-standard-set-list-slice';
import moment, { Moment } from 'moment';
import { ChangeEvent, useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

function RequirementsStandardSetFilters() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectRequirementsStandardSetFilter);

  // React State
  const requirementsStandardSetTypeOptions = useRequirementsStandardSetTypeOptions(true);

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
        (fieldName === FieldName.UPDATE_START_DATE && endDate && endDate.toDate() < currentDate.toDate()) ||
        (fieldName === FieldName.UPDATE_END_DATE && startDate && startDate.toDate() > currentDate.toDate())
      ) {
        setFieldValue(FieldName.UPDATE_START_DATE, currentDate);
        setFieldValue(FieldName.UPDATE_END_DATE, currentDate);
      } else {
        setFieldValue(fieldName, currentDate);
      }
    },
    [],
  );

  const handleSearchClick = useCallback(
    (newFilter: RequirementsStandardSetFilter) => {
      dispatch(clickSearchRequirementsStandardSet(newFilter));
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
                  Cập nhật từ ngày
                </Label>
                <Col md="8">
                  <DatePicker
                    inputProps={{ placeholder: 'Chọn ngày' }}
                    hasCorrelationFromTo
                    value={values.updateStartDate}
                    startDate={values.updateStartDate}
                    endDate={values.updateEndDate}
                    onChange={(value) =>
                      handleDateChange(
                        FieldName.UPDATE_START_DATE,
                        setFieldValue,
                        value,
                        values.updateStartDate,
                        values.updateEndDate,
                      )
                    }
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Cập nhật đến ngày
                </Label>
                <Col md="8">
                  <DatePicker
                    inputProps={{ placeholder: 'Chọn ngày' }}
                    hasCorrelationFromTo
                    value={values.updateEndDate}
                    startDate={values.updateStartDate}
                    endDate={values.updateEndDate}
                    onChange={(value) =>
                      handleDateChange(
                        FieldName.UPDATE_END_DATE,
                        setFieldValue,
                        value,
                        values.updateStartDate,
                        values.updateEndDate,
                      )
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
                  Mã bộ định mức
                </Label>
                <Col md="8">
                  <Input
                    type="text"
                    name={FieldName.REQUIREMENTS_STANDARD_SET_CODE}
                    placeholder="Nhập mã bộ định mức"
                    value={values.requirementsStandardSetCode}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Template
                </Label>
                <Col md="8">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn template' }}
                    value={values.requirementsStandardSetType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.REQUIREMENTS_STANDARD_SET_TYPE, e.target.value)
                    }
                    data={requirementsStandardSetTypeOptions}
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

export default RequirementsStandardSetFilters;
