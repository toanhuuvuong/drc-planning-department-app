import { Formik } from 'formik';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useSuppliesGroupOptions, useSuppliesStoreOptions } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  clickSearchInventory,
  InventoryFilter,
  selectInventoryFilter,
} from 'main/redux/modules/supplies-store-inventory/supplies-store-inventory-list-slice';
import moment, { Moment } from 'moment';
import { ChangeEvent, useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

function SuppliesStoreInventoryFilter() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectInventoryFilter);

  // React State
  const { suppliesStoreOptions } = useSuppliesStoreOptions(true);
  const { suppliesGroupOptions } = useSuppliesGroupOptions(true);

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

  const handleSearchClick = useCallback(
    (newFilter: InventoryFilter) => {
      dispatch(clickSearchInventory(newFilter));
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
                  Kho nhập xuất
                </Label>
                <Col md="8">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn kho' }}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.SUPPLIES_STORE, e.target.value)
                    }
                    value={values.suppliesStore}
                    data={suppliesStoreOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Nhóm vật tư
                </Label>
                <Col md="8">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn nhóm vật tư' }}
                    value={values.suppliesGroup}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.SUPPLIES_GROUP, e.target.value)
                    }
                    data={suppliesGroupOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Mã vật tư
                </Label>
                <Col md="8">
                  <Input
                    type="text"
                    name={FieldName.SUPPLIES_CODE}
                    placeholder="Nhập mã vật tư"
                    value={values.suppliesCode}
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

export default SuppliesStoreInventoryFilter;
