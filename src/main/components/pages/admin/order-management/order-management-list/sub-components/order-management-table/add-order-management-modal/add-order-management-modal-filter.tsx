import { Formik } from 'formik';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useSuppliesGroupOptions } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  clickSearchSupplies,
  selectSuppliesFilter,
  SuppliesFilter,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-add-slice';
import { ChangeEvent, useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

function AddOrderManagementModalFilter() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectSuppliesFilter);

  // React State
  const { suppliesGroupOptions } = useSuppliesGroupOptions(true);

  // React Function
  const handleSearchClick = useCallback(
    (newFilter: SuppliesFilter) => {
      dispatch(clickSearchSupplies(newFilter));
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
                <Label className="form-control-label" md="3">
                  Nhóm vật tư
                </Label>
                <Col md="9">
                  <Select2Box
                    className="form-control"
                    options={{
                      placeholder: 'Chọn nhóm vật tư',
                    }}
                    value={values.suppliesGroup}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.SUPPLIES_GROUP, e.target.value)
                    }
                    data={suppliesGroupOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Mã vật tư
                </Label>
                <Col md="9">
                  <Input
                    className="form-control"
                    placeholder="Nhập mã vật tư"
                    name={FieldName.SUPPLIES_CODE}
                    value={values.suppliesCode}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Tên vật tư
                </Label>
                <Col md="9">
                  <Input
                    className="form-control"
                    placeholder="Nhập tên vật tư"
                    name={FieldName.SUPPLIES_NAME}
                    value={values.suppliesName}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Tên gợi nhớ
                </Label>
                <Col md="9">
                  <Input
                    className="form-control"
                    placeholder="Nhập tên gợi nhớ"
                    name={FieldName.SUPPLIES_SUGGESTIVE_NAME}
                    value={values.suppliesSuggestiveName}
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

export default AddOrderManagementModalFilter;
