import { Formik } from 'formik';
import { KhotpMasterSanPhamWithRelations } from 'main/apis/drc/models';
import { ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { ProductImportExcelReader } from 'main/utils/excel-reader';
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
  handleConfirmClickCallback: (productList: KhotpMasterSanPhamWithRelations[]) => void;
};

const PRODUCT_EXCEL_FILE_ACCEPT =
  '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

function UploadProductExcelModal({ isOpen, toggle, handleConfirmClickCallback }: Props) {
  const productExcelInitialValues: { productExcelFile?: File } = {
    productExcelFile: undefined,
  };

  const productStoreExceValidate = useCallback((values: typeof productExcelInitialValues) => {
    if (!values.productExcelFile) {
      return { productExcelFile: ValidationMessage.REQUIRED };
    }
    if (values.productExcelFile && !PRODUCT_EXCEL_FILE_ACCEPT.includes(values.productExcelFile.type)) {
      return { productExcelFile: ValidationMessage.INVALID_EXCEL_FILE_TYPE };
    }
  }, []);

  const handleConfirmClick = useCallback(
    async (values: typeof productExcelInitialValues) => {
      if (!values.productExcelFile) {
        return;
      }

      try {
        // Transfrom productExcelFile file
        const { sanPhams } = await new ProductImportExcelReader().readData(values.productExcelFile);

        // Callback
        handleConfirmClickCallback(sanPhams);
      } catch (e) {
        toast.error((e as Error).message);
      }
    },
    [handleConfirmClickCallback],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <Formik
        initialValues={productExcelInitialValues}
        validate={productStoreExceValidate}
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, setFieldValue }) => (
          <>
            <ModalHeader toggle={toggle}>UPLOAD SẢN PHẨM</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          File import sản phẩm &nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="file"
                          accept={PRODUCT_EXCEL_FILE_ACCEPT}
                          name={FieldName.PRODUCT_EXCEL_FILE}
                          placeholder="Upload file import"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue(FieldName.PRODUCT_EXCEL_FILE, e.currentTarget.files[0]);
                            }
                          }}
                          invalid={!!errors.productExcelFile}
                        />
                        {errors.productExcelFile && <FormText color="danger">{errors.productExcelFile}</FormText>}
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

export default UploadProductExcelModal;
