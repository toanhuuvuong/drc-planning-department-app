import { Formik } from 'formik';
import { Select2Box } from 'main/components/molecules/selectbox';
import { ChangeEvent, useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

export interface UsersManagementFilter {
  usernameSearch: string;
  titleId: string;
}

interface UsersManagementFilterProps {
  initialFilter: UsersManagementFilter;
  onFilterChange: (filter: UsersManagementFilter) => void;
  onResetFilter: () => void;
  titleOptions: Array<{ id: string; text: string }>;
}

function UsersManagementFilter({
  initialFilter,
  onFilterChange,
  onResetFilter,
  titleOptions,
}: UsersManagementFilterProps) {
  // React Function
  const handleSearchClick = useCallback(
    (newFilter: UsersManagementFilter) => {
      onFilterChange(newFilter);
    },
    [onFilterChange],
  );

  const handleResetClick = useCallback(() => {
    onResetFilter();
  }, [onResetFilter]);

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
                <Label className="form-control-label" md="4" for="titleId">
                  Lọc theo Chức danh
                </Label>
                <Col md="8">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Lọc theo Chức danh' }}
                    value={values.titleId}
                    name="titleId"
                    id="titleId"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue('titleId', e.target.value)}
                    data={titleOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4" for="usernameSearch">
                  Username
                </Label>
                <Col md="8">
                  <Input
                    type="text"
                    id="usernameSearch"
                    name="usernameSearch"
                    value={values.usernameSearch}
                    onChange={handleChange}
                    placeholder="Tìm theo username"
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            {/* <Button color="secondary" className="mr-2" onClick={handleResetClick}>
              Xóa bộ lọc
            </Button> */}
            <Button color="primary" onClick={() => handleSearchClick(values)}>
              Lọc dữ liệu
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default UsersManagementFilter;
