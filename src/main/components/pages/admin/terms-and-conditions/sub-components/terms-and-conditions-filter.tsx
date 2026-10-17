import { Formik } from 'formik';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  clickSearchDocument,
  DocumentFilter,
  selectDocumentFilter,
} from 'main/redux/modules/terms-and-conditions/terms-and-conditions-list-slice';
import { useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

function TermsAndConditionsFilter() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectDocumentFilter);

  // React Function
  const handleSearchClick = useCallback(
    (newFilter: DocumentFilter) => {
      dispatch(clickSearchDocument(newFilter));
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
      {({ values, handleChange }) => (
        <Form>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Tên tài liệu
                </Label>
                <Col md="8">
                  <Input
                    type="text"
                    name={FieldName.DOCUMENT_NAME}
                    placeholder="Nhập tên tài liệu"
                    value={values.documentName}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="4">
                  Mã tài liệu
                </Label>
                <Col md="8">
                  <Input
                    type="text"
                    name={FieldName.DOCUMENT_CODE}
                    placeholder="Nhập mã tài liệu"
                    value={values.documentCode}
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

export default TermsAndConditionsFilter;
