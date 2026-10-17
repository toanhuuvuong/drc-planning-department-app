import { Formik } from 'formik';
import { KhovtMasterVt } from 'main/apis/drc/models';
import { ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { SuppliesImportExcelReader } from 'main/utils/excel-reader';
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
  handleConfirmClickCallback: (suppliesList: KhovtMasterVt[]) => void;
};

const SUPPLIES_EXCEL_FILE_ACCEPT =
  '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

function UploadSuppliesExcelModal({ isOpen, toggle, handleConfirmClickCallback }: Props) {
  const suppliesExcelInitialValues: { suppliesExcelFile?: File } = {
    suppliesExcelFile: undefined,
  };

  const productStoreExceValidate = useCallback((values: typeof suppliesExcelInitialValues) => {
    if (!values.suppliesExcelFile) {
      return { suppliesExcelFile: ValidationMessage.REQUIRED };
    }
    if (values.suppliesExcelFile && !SUPPLIES_EXCEL_FILE_ACCEPT.includes(values.suppliesExcelFile.type)) {
      return { suppliesExcelFile: ValidationMessage.INVALID_EXCEL_FILE_TYPE };
    }
  }, []);

  const handleConfirmClick = useCallback(
    async (values: typeof suppliesExcelInitialValues) => {
      if (!values.suppliesExcelFile) {
        return;
      }

      try {
        // Transfrom suppliesExcelFile file
        const { vatTus } = await new SuppliesImportExcelReader().readData(values.suppliesExcelFile);

        // Callback
        handleConfirmClickCallback(vatTus);
      } catch (e) {
        toast.error((e as Error).message);
      }
    },
    [handleConfirmClickCallback],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <Formik
        initialValues={suppliesExcelInitialValues}
        validate={productStoreExceValidate}
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, setFieldValue }) => (
          <>
            <ModalHeader toggle={toggle}>UPLOAD VẬT TƯ</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          File import vật tư &nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="file"
                          accept={SUPPLIES_EXCEL_FILE_ACCEPT}
                          name={FieldName.SUPPLIES_EXCEL_FILE}
                          placeholder="Upload file import"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue(FieldName.SUPPLIES_EXCEL_FILE, e.currentTarget.files[0]);
                            }
                          }}
                          invalid={!!errors.suppliesExcelFile}
                        />
                        {errors.suppliesExcelFile && <FormText color="danger">{errors.suppliesExcelFile}</FormText>}
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

export default UploadSuppliesExcelModal;
