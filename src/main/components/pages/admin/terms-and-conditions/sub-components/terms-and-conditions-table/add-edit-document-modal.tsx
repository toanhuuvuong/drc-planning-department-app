import { Formik } from 'formik';
import { QdhdsdMasterTaiLieu } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import moment from 'moment';
import { useMemo } from 'react';
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
import * as Yup from 'yup';

const EXCEL_FILE_ACCEPT =
  '.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
const DOC_FILE_ACCEPT =
  '.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const IMAGE_FILE_ACCEPT = 'image/*';
const PDF_FILE_ACCEPT = 'application/pdf';
const TERMS_AND_CONDITIONS_FILE_ACCEPT = `${EXCEL_FILE_ACCEPT},${DOC_FILE_ACCEPT},${IMAGE_FILE_ACCEPT},${PDF_FILE_ACCEPT}`;

type Props = {
  document?: QdhdsdMasterTaiLieu;
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: (values: QdhdsdMasterTaiLieu & { fileTaiLieu?: File }) => void;
};

const documentValidationSchema = Yup.object().shape({
  maTaiLieu: Yup.string().required(ValidationMessage.REQUIRED),
  tenTaiLieu: Yup.string().required(ValidationMessage.REQUIRED),
  lanBanHanh: Yup.string().required(ValidationMessage.REQUIRED),
  ngayBanHanh: Yup.string().required(ValidationMessage.REQUIRED),
  nguoiBanHanh: Yup.string().required(ValidationMessage.REQUIRED),
  nguoiThucHien: Yup.string().required(ValidationMessage.REQUIRED),
});

function AddEditDocumentModal({ document, isOpen, toggle, handleConfirmClick }: Props) {
  const documentInitialValues = useMemo(
    () =>
      document
        ? {
            ...document,
            fileTaiLieu: undefined,
          }
        : {
            maTaiLieu: '',
            tenTaiLieu: '',
            lanBanHanh: '',
            ngayBanHanh: undefined,
            nguoiBanHanh: '',
            nguoiThucHien: '',
            fileTaiLieu: undefined,
          },
    [document],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <Formik
        initialValues={documentInitialValues}
        validationSchema={documentValidationSchema}
        enableReinitialize
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, handleChange, setFieldValue }) => (
          <>
            <ModalHeader toggle={toggle}>{document ? `SỬA TÀI LIỆU #${document.id}` : 'THÊM TÀI LIỆU'}</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={6}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          Mã tài liệu&nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="text"
                          name={FieldName.MA_TAI_LIEU}
                          placeholder="Nhập mã tài liệu"
                          value={values.maTaiLieu}
                          onChange={handleChange}
                          invalid={!!errors.maTaiLieu}
                        />
                        {errors.maTaiLieu && <FormText color="danger">{errors.maTaiLieu}</FormText>}
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md={12} lg={6}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          Tên tài liệu&nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="text"
                          name={FieldName.TEN_TAI_LIEU}
                          placeholder="Nhập tên tài liệu"
                          value={values.tenTaiLieu || ''}
                          onChange={handleChange}
                          invalid={!!errors.tenTaiLieu}
                        />
                        {errors.tenTaiLieu && <FormText color="danger">{errors.tenTaiLieu}</FormText>}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} lg={6}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          Ngày ban hành&nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <DatePicker
                          inputProps={{
                            placeholder: 'Chọn ngày',
                            className: `form-control ${!!errors.ngayBanHanh ? 'is-invalid' : ''}`,
                          }}
                          value={values.ngayBanHanh ? moment(values.ngayBanHanh) : undefined}
                          onChange={(e) => setFieldValue(FieldName.NGAY_BAN_HANH, e ? moment(e) : undefined)}
                        />
                        {errors.ngayBanHanh && <FormText color="danger">{errors.ngayBanHanh}</FormText>}
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md={12} lg={6}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          Lần ban hành/sửa đổi&nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="text"
                          name={FieldName.LAN_BAN_HANH}
                          placeholder="Nhập lần ban hành/sửa đổi"
                          value={values.lanBanHanh || ''}
                          onChange={handleChange}
                          invalid={!!errors.lanBanHanh}
                        />
                        {errors.lanBanHanh && <FormText color="danger">{errors.lanBanHanh}</FormText>}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} lg={6}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          Người/đơn vị ban hành&nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="text"
                          name={FieldName.NGUOI_BAN_HANH}
                          placeholder="Nhập người/đơn vị ban hành"
                          value={values.nguoiBanHanh || ''}
                          onChange={handleChange}
                          invalid={!!errors.nguoiBanHanh}
                        />
                        {errors.nguoiBanHanh && <FormText color="danger">{errors.nguoiBanHanh}</FormText>}
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md={12} lg={6}>
                    <FormGroup className="row">
                      <Col md="12">
                        <Label className="form-control-label">
                          Người/đơn vị thực hiện&nbsp;
                          <i className="fa fa-asterisk fa-sm text-danger" />
                        </Label>
                        <Input
                          type="text"
                          name={FieldName.NGUOI_THUC_HIEN}
                          placeholder="Nhập người/đơn vị thực hiện"
                          value={values.nguoiThucHien || ''}
                          onChange={handleChange}
                          invalid={!!errors.nguoiThucHien}
                        />
                        {errors.nguoiThucHien && <FormText color="danger">{errors.nguoiThucHien}</FormText>}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                {!document && (
                  <Row>
                    <Col md={12} lg={12}>
                      <FormGroup className="row">
                        <Col md="12">
                          <Label className="form-control-label">
                            File tài liệu&nbsp;
                            <i className="fa fa-asterisk fa-sm text-danger" />
                          </Label>
                          <Input
                            type="file"
                            accept={TERMS_AND_CONDITIONS_FILE_ACCEPT}
                            name={FieldName.FILE_TAI_LIEU}
                            placeholder="Upload tài liệu"
                            onChange={(e) => {
                              if (e.currentTarget.files) {
                                setFieldValue(FieldName.FILE_TAI_LIEU, e.currentTarget.files[0]);
                              }
                            }}
                            invalid={!!errors.fileTaiLieu}
                          />
                          {errors.fileTaiLieu && <FormText color="danger">{errors.fileTaiLieu}</FormText>}
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                )}
              </Form>
            </ModalBody>
            <ModalFooter className="justify-content-end">
              <Button
                color="primary"
                onClick={() => handleConfirmClick(values)}
                disabled={
                  !dirty || !isValid
                  //createdDocumentIsPending ||
                  //updatedDocumentIsPending ||
                }>
                {document ? 'Sửa' : 'Thêm'}
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

export default AddEditDocumentModal;
