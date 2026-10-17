import { Formik } from 'formik';
import { useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

export interface ProductCustomerFilter {
  tenKh: string;
  maKh: string;
}

interface ProductCustomerFilterProps {
  initialFilter: ProductCustomerFilter;
  onFilterChange: (filter: ProductCustomerFilter) => void;
}

function ProductCustomerFilter({ initialFilter, onFilterChange }: ProductCustomerFilterProps) {
  // React Function
  const handleSearchClick = useCallback(
    (newFilter: ProductCustomerFilter) => {
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
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3" for="tenKh">
                  Tên khách hàng
                </Label>
                <Col md="9">
                  <Input
                    type="text"
                    id="tenKh"
                    name="tenKh"
                    value={values.tenKh}
                    onChange={handleChange}
                    placeholder="Nhập tên khách hàng"
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3" for="maKh">
                  Mã khách hàng
                </Label>
                <Col md="9">
                  <Input
                    type="text"
                    id="maKh"
                    name="maKh"
                    value={values.maKh}
                    onChange={handleChange}
                    placeholder="Nhập mã khách hàng"
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

export default ProductCustomerFilter;
