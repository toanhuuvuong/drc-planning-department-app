import { Formik } from 'formik';
import { QldhTransDonHangWithRelations } from 'main/apis/drc/models';
import { ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { OrderImportExcelReader } from 'main/utils/excel-reader';
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
  handleConfirmClickCallback: (orders: QldhTransDonHangWithRelations[]) => void;
};

const ORDER_EXCEL_FILE_ACCEPT =
  '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

function UploadOrderExcelModal({ isOpen, toggle, handleConfirmClickCallback }: Props) {
  const orderExcelInitialValues: {
    orderExcelFile?: File;
  } = {
    orderExcelFile: undefined,
  };

  const orderExceValidate = useCallback((values: typeof orderExcelInitialValues) => {
    if (!values.orderExcelFile) {
      return { orderExcelFile: ValidationMessage.REQUIRED };
    }
    if (values.orderExcelFile && !ORDER_EXCEL_FILE_ACCEPT.includes(values.orderExcelFile.type)) {
      return { orderExcelFile: ValidationMessage.INVALID_EXCEL_FILE_TYPE };
    }
  }, []);

  const handleConfirmClick = useCallback(
    async (values: typeof orderExcelInitialValues) => {
      if (!values.orderExcelFile) {
        return;
      }

      try {
        // Transfrom orderExcelFile file
        const { donHangs } = await new OrderImportExcelReader().readData(values.orderExcelFile);

        // Callback
        handleConfirmClickCallback(donHangs);
      } catch (e) {
        toast.error((e as Error).message);
      }
    },
    [handleConfirmClickCallback],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <Formik
        initialValues={orderExcelInitialValues}
        validate={orderExceValidate}
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, setFieldValue, handleChange }) => (
          <>
            <ModalHeader toggle={toggle}>UPLOAD ĐƠN HÀNG</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          File import đơn hàng &nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="file"
                          accept={ORDER_EXCEL_FILE_ACCEPT}
                          name={FieldName.ORDER_EXCEL_FILE}
                          placeholder="Upload file import"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue(FieldName.ORDER_EXCEL_FILE, e.currentTarget.files[0]);
                            }
                          }}
                          invalid={!!errors.orderExcelFile}
                        />
                        {errors.orderExcelFile && <FormText color="danger">{errors.orderExcelFile}</FormText>}
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

export default UploadOrderExcelModal;
