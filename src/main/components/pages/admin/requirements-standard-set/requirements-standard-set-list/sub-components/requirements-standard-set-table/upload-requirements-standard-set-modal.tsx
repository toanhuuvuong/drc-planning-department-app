import { Formik } from 'formik';
import { DmMasterBoDinhMucWithRelations } from 'main/apis/drc/models';
import { ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { RequirementsStandardSetExcelReader } from 'main/utils/excel-reader';
import { useCallback } from 'react';
import { Form } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Col,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClickCallback: (requirementsStandardSet: DmMasterBoDinhMucWithRelations) => void;
};

const REQUIREMENTS_STANDARD_SET_FILE_ACCEPT =
  '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

function UploadRequirementsStandardSetModal({ isOpen, toggle, handleConfirmClickCallback }: Props) {
  const requirementsStandardSetInitialValues: { requirementsStandardSetFile?: File } = {
    requirementsStandardSetFile: undefined,
  };

  const requirementsStandardSetValidate = useCallback((values: typeof requirementsStandardSetInitialValues) => {
    if (!values.requirementsStandardSetFile) {
      return { requirementsStandardSetFile: ValidationMessage.REQUIRED };
    }
    if (
      values.requirementsStandardSetFile &&
      !REQUIREMENTS_STANDARD_SET_FILE_ACCEPT.includes(values.requirementsStandardSetFile.type)
    ) {
      return { requirementsStandardSetFile: ValidationMessage.INVALID_EXCEL_FILE_TYPE };
    }
  }, []);

  const handleConfirmClick = useCallback(
    async (values: typeof requirementsStandardSetInitialValues) => {
      if (!values.requirementsStandardSetFile) {
        return;
      }

      try {
        // Transfrom requirementsStandardSetFile
        const requirementsStandardSet = await new RequirementsStandardSetExcelReader().readData(
          values.requirementsStandardSetFile,
        );

        // Callback
        handleConfirmClickCallback(requirementsStandardSet);
      } catch (e) {
        toast.error((e as Error).message);
      }
    },
    [handleConfirmClickCallback],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <Formik
        initialValues={requirementsStandardSetInitialValues}
        validate={requirementsStandardSetValidate}
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, setFieldValue }) => (
          <>
            <ModalHeader toggle={toggle}>UPLOAD BỘ ĐỊNH MỨC</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          File import bộ định mức &nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="file"
                          accept={REQUIREMENTS_STANDARD_SET_FILE_ACCEPT}
                          name={FieldName.REQUIREMENTS_STANDARD_SET_FILE}
                          placeholder="Upload file import"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue(FieldName.REQUIREMENTS_STANDARD_SET_FILE, e.currentTarget.files[0]);
                            }
                          }}
                          invalid={!!errors.requirementsStandardSetFile}
                        />
                        {errors.requirementsStandardSetFile && (
                          <FormText color="danger">{errors.requirementsStandardSetFile}</FormText>
                        )}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter className="justify-content-end">
              <Button
                color="primary"
                onClick={async () => await handleConfirmClick(values)}
                disabled={!dirty || !isValid}>
                Xác nhận import
              </Button>
              <Button color="secondary" onClick={toggle}>
                Hủy
              </Button>
            </ModalFooter>
          </>
        )}
      </Formik>
    </Modal>
  );
}

export default UploadRequirementsStandardSetModal;
