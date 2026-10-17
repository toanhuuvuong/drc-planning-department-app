import { Formik } from 'formik';
import { KhotpTransLenhNhapWithRelations } from 'main/apis/drc/models';
import { ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { ProductInventoryImportExcelReader } from 'main/utils/excel-reader';
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
  handleConfirmClickCallback: (productStoreExcel: KhotpTransLenhNhapWithRelations) => void;
};

const PRODUCT_INVENTORY_EXCEL_FILE_ACCEPT =
  '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

function UploadProductInventoryExcelModal({ isOpen, toggle, handleConfirmClickCallback }: Props) {
  const productInventoryExcelInitialValues: {
    productInventoryExcelFile?: File;
    productInventoryQuantityColumn?: string;
  } = {
    productInventoryExcelFile: undefined,
    productInventoryQuantityColumn: undefined,
  };

  const productStoreExceValidate = useCallback((values: typeof productInventoryExcelInitialValues) => {
    if (!values.productInventoryExcelFile) {
      return { productInventoryExcelFile: ValidationMessage.REQUIRED };
    }
    if (
      values.productInventoryExcelFile &&
      !PRODUCT_INVENTORY_EXCEL_FILE_ACCEPT.includes(values.productInventoryExcelFile.type)
    ) {
      return { productInventoryExcelFile: ValidationMessage.INVALID_EXCEL_FILE_TYPE };
    }
  }, []);

  const handleConfirmClick = useCallback(
    async (values: typeof productInventoryExcelInitialValues) => {
      if (!values.productInventoryExcelFile) {
        return;
      }

      try {
        // Transfrom productInventoryExcelFile file
        const productStoreExcel = await new ProductInventoryImportExcelReader().readData3(
          values.productInventoryExcelFile,
          { quantityCol: values.productInventoryQuantityColumn },
        );

        // Callback
        handleConfirmClickCallback(productStoreExcel);
      } catch (e) {
        toast.error((e as Error).message);
      }
    },
    [handleConfirmClickCallback],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <Formik
        initialValues={productInventoryExcelInitialValues}
        validate={productStoreExceValidate}
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, setFieldValue, handleChange }) => (
          <>
            <ModalHeader toggle={toggle}>UPLOAD TỒN KHO THÀNH PHẨM</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          File import tồn kho thành phẩm &nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="file"
                          accept={PRODUCT_INVENTORY_EXCEL_FILE_ACCEPT}
                          name={FieldName.PRODUCT_INVENTORY_EXCEL_FILE}
                          placeholder="Upload file import"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue(FieldName.PRODUCT_INVENTORY_EXCEL_FILE, e.currentTarget.files[0]);
                            }
                          }}
                          invalid={!!errors.productInventoryExcelFile}
                        />
                        {errors.productInventoryExcelFile && (
                          <FormText color="danger">{errors.productInventoryExcelFile}</FormText>
                        )}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">Cột số lượng tồn kho &#40;mặc định là cột F&#41;</Label>
                        <Input
                          type="text"
                          name={FieldName.PRODUCT_INVENTORY_QUANTITY_COLUMN}
                          placeholder="Nhập cột"
                          value={values.productInventoryQuantityColumn}
                          onChange={handleChange}
                        />
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

export default UploadProductInventoryExcelModal;
