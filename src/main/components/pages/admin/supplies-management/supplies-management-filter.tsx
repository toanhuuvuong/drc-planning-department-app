import { Formik } from 'formik';
import { Select2Box } from 'main/components/molecules/selectbox';
import { useSuppliesGroupOptions } from 'main/hooks';
import { ChangeEvent, useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

export interface SuppliesFilter {
  searchName: string;
  searchNhom: string;
}

interface SuppliesManagementFilterProps {
  initialFilter: SuppliesFilter;
  onFilterChange: (filter: SuppliesFilter) => void;
}

function SuppliesManagementFilter({ initialFilter, onFilterChange }: SuppliesManagementFilterProps) {
  const { suppliesGroupOptions } = useSuppliesGroupOptions(true);

  // React Function
  const handleSearchClick = useCallback(
    (newFilter: SuppliesFilter) => {
      onFilterChange(newFilter);
    },
    [onFilterChange],
  );

  return (
    <Formik
      initialValues={initialFilter}
      enableReinitialize
      onSubmit={() => {
        // do nothing
      }}>
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3" for="searchName">
                  Tên Vật Tư
                </Label>
                <Col md="9">
                  <Input
                    type="text"
                    id="searchName"
                    name="searchName"
                    value={values.searchName}
                    onChange={handleChange}
                    placeholder="Nhập Tên Vật Tư"
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3" for="itemSelect">
                  Nhóm Vật Tư
                </Label>
                <Col md="9">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn nhóm vật tư' }}
                    value={values.searchNhom}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue('searchNhom', e.target.value)}
                    data={suppliesGroupOptions}
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

export default SuppliesManagementFilter;
