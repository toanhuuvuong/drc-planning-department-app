import { Formik } from 'formik';
import { KhotpTransLenhNhapWithRelations } from 'main/apis/drc/models';
import { Select2Box } from 'main/components/molecules/selectbox';
import { ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { useProductExcelTemplateTypeOptions } from 'main/hooks';
import { ProductStoreImportExcelReader } from 'main/utils/excel-reader';
import { ChangeEvent, useCallback } from 'react';
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

const PRODUCT_STORE_EXCEL_FILE_ACCEPT =
  '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

function UploadProductStoreExcelModal({ isOpen, toggle, handleConfirmClickCallback }: Props) {
  // React State
  const productExcelTemplateTypeOptions = useProductExcelTemplateTypeOptions();
  const productStoreExcelInitialValues: { productExcelTemplateType?: string; productStoreExcelFile?: File } = {
    productExcelTemplateType: undefined,
    productStoreExcelFile: undefined,
  };

  // React Function
  const productStoreExceValidate = useCallback((values: typeof productStoreExcelInitialValues) => {
    if (!values.productExcelTemplateType) {
      return { productExcelTemplateType: ValidationMessage.REQUIRED };
    }
    if (!values.productStoreExcelFile) {
      return { productStoreExcelFile: ValidationMessage.REQUIRED };
    }
    if (values.productStoreExcelFile && !PRODUCT_STORE_EXCEL_FILE_ACCEPT.includes(values.productStoreExcelFile.type)) {
      return { productStoreExcelFile: ValidationMessage.INVALID_EXCEL_FILE_TYPE };
    }
  }, []);

  const handleConfirmClick = useCallback(
    async ({ productExcelTemplateType, productStoreExcelFile }: typeof productStoreExcelInitialValues) => {
      if (!productExcelTemplateType || !productStoreExcelFile) {
        return;
      }

      try {
        // Transfrom productStoreExcelFile file
        const productStoreExcel = await new ProductStoreImportExcelReader().readData2(
          productExcelTemplateType,
          productStoreExcelFile,
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
        initialValues={productStoreExcelInitialValues}
        validate={productStoreExceValidate}
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, setFieldValue }) => (
          <>
            <ModalHeader toggle={toggle}>UPLOAD LỆNH NHẬP KHO</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={6}>
                    <FormGroup className="row">
                      <Label className="form-control-label" md="5">
                        Template
                      </Label>
                      <Col md="7">
                        <Select2Box
                          className="form-control"
                          options={{ placeholder: 'Chọn template' }}
                          value={values.productExcelTemplateType}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setFieldValue(FieldName.PRODUCT_EXCEL_TEMPLATE_TYPE, e.target.value)
                          }
                          data={productExcelTemplateTypeOptions}
                          invalid={!!errors.productExcelTemplateType}
                        />
                        {errors.productExcelTemplateType && (
                          <FormText color="danger">{errors.productExcelTemplateType}</FormText>
                        )}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          File import lệnh nhập &nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="file"
                          accept={PRODUCT_STORE_EXCEL_FILE_ACCEPT}
                          name={FieldName.PRODUCT_STORE_EXCEL_FILE}
                          placeholder="Upload file import"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue(FieldName.PRODUCT_STORE_EXCEL_FILE, e.currentTarget.files[0]);
                            }
                          }}
                          invalid={!!errors.productStoreExcelFile}
                        />
                        {errors.productStoreExcelFile && (
                          <FormText color="danger">{errors.productStoreExcelFile}</FormText>
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

export default UploadProductStoreExcelModal;
