import { Formik } from 'formik';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  clickSearchRequirementsStandardItem,
  RequirementsStandardItemFilter,
  selectRequirementsStandardItemFilter,
} from 'main/redux/modules/requirements-standard-set/requirements-standard-set-detail-slice';
import { useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

function RequirementsStandardItemFilters() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectRequirementsStandardItemFilter);

  // React Function
  const handleSearchClick = useCallback(
    (newFilter: RequirementsStandardItemFilter) => {
      dispatch(clickSearchRequirementsStandardItem(newFilter));
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
                  Mã thành phẩm
                </Label>
                <Col md="8">
                  <Input
                    type="text"
                    name={FieldName.PRODUCT_CODE}
                    placeholder="Nhập mã thành phẩm"
                    value={values.productCode}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Mã NVL/BTP
                </Label>
                <Col md="8">
                  <Input
                    type="text"
                    name={FieldName.SUPPLIES_CODE}
                    placeholder="Nhập mã NVL/BTP"
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

export default RequirementsStandardItemFilters;
