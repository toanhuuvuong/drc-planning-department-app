import { Formik } from 'formik';
import { useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

export interface ProductWarehouseFilter {
  searchName: string;
}

interface ProductWarehouseFilterProps {
  initialFilter: ProductWarehouseFilter;
  onFilterChange: (filter: ProductWarehouseFilter) => void;
}

function ProductWarehouseFilter({ initialFilter, onFilterChange }: ProductWarehouseFilterProps) {
  // React Function
  const handleSearchClick = useCallback(
    (newFilter: ProductWarehouseFilter) => {
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
                  Tên Kho
                </Label>
                <Col md="11">
                  <Input
                    type="text"
                    id="searchName"
                    name="searchName"
                    value={values.searchName}
                    onChange={handleChange}
                    placeholder="Nhập Tên Kho Thành Phẩm"
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

export default ProductWarehouseFilter;
