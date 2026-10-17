import { Formik } from 'formik';
import { useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

export interface SuppliesGroupFilter {
  searchName: string;
}

interface SuppliesGroupFilterProps {
  initialFilter: SuppliesGroupFilter;
  onFilterChange: (filter: SuppliesGroupFilter) => void;
}

function SuppliesGroupFilter({ initialFilter, onFilterChange }: SuppliesGroupFilterProps) {
  // React Function
  const handleSearchClick = useCallback(
    (newFilter: SuppliesGroupFilter) => {
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
      {({ values, handleChange }) => (
        <Form>
          <Row>
            <Col md={12}>
              <FormGroup className="row">
                <Label className="form-control-label" md="1" for="searchName">
                  Nhóm vật tư
                </Label>
                <Col md="11">
                  <Input
                    type="text"
                    id="searchName"
                    name="searchName"
                    value={values.searchName}
                    onChange={handleChange}
                    placeholder="Nhập Tên Nhóm Vật Tư"
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

export default SuppliesGroupFilter;
