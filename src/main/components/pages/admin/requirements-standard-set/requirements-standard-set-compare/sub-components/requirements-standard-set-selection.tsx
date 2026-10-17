import { Formik } from 'formik';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useRequirementsStandardSetOptions } from 'main/hooks';
import { ChangeEvent } from 'react';
import { Button, Col, Form, FormGroup, Row, Label } from 'reactstrap';

type Props = {
  leftId: string;
  rightId: string;
  handleCompareClick: (selectedLeftId: string, selectedRightId: string) => void;
};

function RequirementsStandardSetSelection({ leftId, rightId, handleCompareClick }: Props) {
  // React State
  const { requirementsStandardSetOptions } = useRequirementsStandardSetOptions(false);

  return (
    <Formik
      initialValues={{
        leftId,
        rightId,
      }}
      enableReinitialize
      onSubmit={() => {
        // do nothing
      }}>
      {({ values, setFieldValue }) => (
        <Form>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Bộ định mức A
                </Label>
                <Col md="9">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn bộ định mức' }}
                    value={values.leftId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.LEFT_ID, e.target.value)}
                    data={requirementsStandardSetOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Bộ định mức B
                </Label>
                <Col md="9">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn bộ định mức' }}
                    value={values.rightId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.RIGHT_ID, e.target.value)}
                    data={requirementsStandardSetOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button color="primary" onClick={() => handleCompareClick(values.leftId, values.rightId)}>
              So sánh
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default RequirementsStandardSetSelection;
