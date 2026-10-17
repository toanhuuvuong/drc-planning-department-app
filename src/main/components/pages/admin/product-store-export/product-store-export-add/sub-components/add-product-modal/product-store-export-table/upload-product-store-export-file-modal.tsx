import { Formik } from 'formik';
import { CheckTonKhoErrorMessage } from 'main/apis/drc/models';
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
  isApiCalling: boolean;
  errorMessages: CheckTonKhoErrorMessage[] | null;
  toggle: () => void;
  handleConfirmClickCallback: (file: File) => void;
};

const FILE_EXTENSION_FILE_ACCEPT = 'application/pdf';

function UploadProductStoreExportFileModal({
  isOpen,
  isApiCalling,
  toggle,
  errorMessages,
  handleConfirmClickCallback,
}: Readonly<Props>) {
  const productStoreExportInitialValues: { productStoreExportFile?: File } = {
    productStoreExportFile: undefined,
  };

  const validate = useCallback((values: typeof productStoreExportInitialValues) => {
    if (!values.productStoreExportFile) {
      return { file: ValidationMessage.REQUIRED };
    }
    if (values.productStoreExportFile && !FILE_EXTENSION_FILE_ACCEPT.includes(values.productStoreExportFile.type)) {
      return { file: ValidationMessage.INVALID_PDF_FILE_TYPE };
    }
  }, []);

  const handleConfirmClick = useCallback(
    async (values: typeof productStoreExportInitialValues) => {
      if (!values.productStoreExportFile) {
        return;
      }

      // Callback
      handleConfirmClickCallback(values.productStoreExportFile);
    },
    [handleConfirmClickCallback],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <Formik
        initialValues={productStoreExportInitialValues}
        validate={validate}
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, setFieldValue }) => (
          <>
            <ModalHeader toggle={toggle}>UPLOAD XUẤT KHO sẢN PHẨM</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          File import xuất kho sản phẩm&nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="file"
                          accept={FILE_EXTENSION_FILE_ACCEPT}
                          name={FieldName.PRODUCT_STORE_EXPORT_EXPORT_FILE}
                          placeholder="Upload file import xuất kho sản phẩm"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue(FieldName.PRODUCT_STORE_EXPORT_EXPORT_FILE, e.currentTarget.files[0]);
                            }
                          }}
                          invalid={!!errors.productStoreExportFile}
                        />
                        {errors.productStoreExportFile && (
                          <FormText color="danger">{errors.productStoreExportFile}</FormText>
                        )}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    {errorMessages && errorMessages.length > 0 && (
                      <div className="my-2">
                        <h4 className="text text-danger">Import thất bại - Chi tiết lỗi</h4>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Mã sản phẩm</th>
                              <th>Lỗi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {errorMessages.map((error, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{error.maSanPham}</td>
                                <td>{error.errorMessage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter className="justify-content-end">
              <Button
                color="primary"
                onClick={async () => await handleConfirmClick(values)}
                disabled={!dirty || !isValid || isApiCalling}>
                {isApiCalling ? (
                  <>
                    <i className="fa fa-spinner fa-spin" /> Đang xử lý
                  </>
                ) : (
                  'Thực hiện import'
                )}
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

export default UploadProductStoreExportFileModal;
