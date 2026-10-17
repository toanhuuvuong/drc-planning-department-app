import { Formik } from 'formik';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import useSuppliesNuocOptions from 'main/hooks/useSuppliesNuocOptions';
import { ChangeEvent, useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

export interface SuppliesOriginFilter {
  searchNhaSX: string;
  searchNuoc: string;
}

interface SuppliesOriginFilterProps {
  initialFilter: SuppliesOriginFilter;
  onFilterChange: (filter: SuppliesOriginFilter) => void;
}

function SuppliesOriginFilter({ initialFilter, onFilterChange }: SuppliesOriginFilterProps) {
  const { suppliesNuocOptions } = useSuppliesNuocOptions(true);

  // React Function
  const handleSearchClick = useCallback(
    (newFilter: SuppliesOriginFilter) => {
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
                <Label className="form-control-label" md="3" for="searchNhaSX">
                  Nhà cung cấp
                </Label>
                <Col md="9">
                  <Input
                    type="text"
                    id="searchNhaSX"
                    name="searchNhaSX"
                    value={values.searchNhaSX}
                    onChange={handleChange}
                    placeholder="Nhập Nhà cung cấp"
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3" for="searchNuoc">
                  Nước sản xuất
                </Label>
                <Col md="9">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn nước sản xuất' }}
                    value={values.searchNuoc}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue('searchNuoc', e.target.value)}
                    data={suppliesNuocOptions}
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

export default SuppliesOriginFilter;
