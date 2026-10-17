import { Formik } from 'formik';
import { ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { useCallback } from 'react';
import { Form } from 'react-router-dom';
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
  handleConfirmClickCallback: (productCommandExportFile: File) => void;
};

const PRODUCT_COMMAND_EXPORT_FILE_ACCEPT = 'application/pdf';

function UploadProductCommandFileModal({ isOpen, toggle, handleConfirmClickCallback }: Props) {
  const productCommandExportInitialValues: { productCommandExportFile?: File } = {
    productCommandExportFile: undefined,
  };

  const productStoreExceValidate = useCallback((values: typeof productCommandExportInitialValues) => {
    if (!values.productCommandExportFile) {
      return { productCommandExportFile: ValidationMessage.REQUIRED };
    }
    if (
      values.productCommandExportFile &&
      !PRODUCT_COMMAND_EXPORT_FILE_ACCEPT.includes(values.productCommandExportFile.type)
    ) {
      return { productCommandExportFile: ValidationMessage.INVALID_PDF_FILE_TYPE };
    }
  }, []);

  const handleConfirmClick = useCallback(
    async (values: typeof productCommandExportInitialValues) => {
      if (!values.productCommandExportFile) {
        return;
      }

      // Callback
      handleConfirmClickCallback(values.productCommandExportFile);
    },
    [handleConfirmClickCallback],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <Formik
        initialValues={productCommandExportInitialValues}
        validate={productStoreExceValidate}
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, setFieldValue }) => (
          <>
            <ModalHeader toggle={toggle}>UPLOAD LỆNH XUẤT KHO</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          File import lệnh xuất &nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="file"
                          accept={PRODUCT_COMMAND_EXPORT_FILE_ACCEPT}
                          name={FieldName.PRODUCT_COMMAND_EXPORT_FILE}
                          placeholder="Upload file import lệnh xuất"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue(FieldName.PRODUCT_COMMAND_EXPORT_FILE, e.currentTarget.files[0]);
                            }
                          }}
                          invalid={!!errors.productCommandExportFile}
                        />
                        {errors.productCommandExportFile && (
                          <FormText color="danger">{errors.productCommandExportFile}</FormText>
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
                Xác nhận import lệnh xuất
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

export default UploadProductCommandFileModal;
