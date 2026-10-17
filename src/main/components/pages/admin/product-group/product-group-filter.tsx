import { Formik } from 'formik';
import { useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

export interface ProductGroupFilter {
  searchName: string;
}

interface ProductGroupFilterProps {
  initialFilter: ProductGroupFilter;
  onFilterChange: (filter: ProductGroupFilter) => void;
}

function ProductGroupFilter({ initialFilter, onFilterChange }: ProductGroupFilterProps) {
  // React Function
  const handleSearchClick = useCallback(
    (newFilter: ProductGroupFilter) => {
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
                <Label className="form-control-label" md="2" for="searchName">
                  Tên Nhóm Sản Phẩm
                </Label>
                <Col md="10">
                  <Input
                    type="text"
                    id="searchName"
                    name="searchName"
                    value={values.searchName}
                    onChange={handleChange}
                    placeholder="Nhập Tên Nhóm Thành Phẩm"
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

export default ProductGroupFilter;
