import { Formik } from 'formik';
import { KhotpMasterKhachHang } from 'main/apis/drc/models';
import { ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { ProductCustomerImportExcelReader } from 'main/utils/excel-reader';
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
  handleConfirmClickCallback: (customerList: KhotpMasterKhachHang[]) => void;
};

const CUSTOMER_EXCEL_FILE_ACCEPT =
  '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

function UploadCustomerExcelModal({ isOpen, toggle, handleConfirmClickCallback }: Props) {
  const customerExcelInitialValues: { customerExcelFile?: File } = {
    customerExcelFile: undefined,
  };

  const productStoreExceValidate = useCallback((values: typeof customerExcelInitialValues) => {
    if (!values.customerExcelFile) {
      return { customerExcelFile: ValidationMessage.REQUIRED };
    }
    if (values.customerExcelFile && !CUSTOMER_EXCEL_FILE_ACCEPT.includes(values.customerExcelFile.type)) {
      return { customerExcelFile: ValidationMessage.INVALID_EXCEL_FILE_TYPE };
    }
  }, []);

  const handleConfirmClick = useCallback(
    async (values: typeof customerExcelInitialValues) => {
      if (!values.customerExcelFile) {
        return;
      }

      try {
        // Transfrom customerExcelFile file
        const { khachHangs } = await new ProductCustomerImportExcelReader().readData(values.customerExcelFile);

        // Callback
        handleConfirmClickCallback(khachHangs);
      } catch (e) {
        toast.error((e as Error).message);
      }
    },
    [handleConfirmClickCallback],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <Formik
        initialValues={customerExcelInitialValues}
        validate={productStoreExceValidate}
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, setFieldValue }) => (
          <>
            <ModalHeader toggle={toggle}>UPLOAD KHÁCH HÀNG</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          File import khách hàng &nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="file"
                          accept={CUSTOMER_EXCEL_FILE_ACCEPT}
                          name={FieldName.CUSTOMER_EXCEL_FILE}
                          placeholder="Upload file import"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue(FieldName.CUSTOMER_EXCEL_FILE, e.currentTarget.files[0]);
                            }
                          }}
                          invalid={!!errors.customerExcelFile}
                          className="form-control form-control-lg"
                        />
                        {errors.customerExcelFile && <FormText color="danger">{errors.customerExcelFile}</FormText>}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
              <Row className="mt-2">
                <Col md="12">
                  <Label>
                    <i className="fa fa-info-circle text-info" /> &nbsp; Upload file dữ liệu khách hàng theo mẫu để thực
                    hiện import
                  </Label>
                  <br />
                  <a href={`${process.env.PUBLIC_URL}/assets/templates/import-danh-sach-khach-hang-template.xlsx`}>
                    <Button color="secondary" size="sm">
                      Tải File Template
                    </Button>
                  </a>
                </Col>
              </Row>
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

export default UploadCustomerExcelModal;
