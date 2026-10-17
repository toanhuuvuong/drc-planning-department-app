import { useFormik } from 'formik';
import { FTitle, NewFTitle } from 'main/apis/drc/models';
import { AutoCompleteMultiSelect } from 'main/components/molecules/multi-select';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { ValidationMessage } from 'main/constants';
import { useProductStoreOptions, useSuppliesStoreOptions } from 'main/hooks';
import { useCallback } from 'react';
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';

interface UserModalProps {
  isOpen: boolean;
  toggle: () => void;
  handleAdd: (newTitle: NewFTitle) => void;
  handleEdit: (id: number, newTitle: FTitle) => void;
  selectedTitle?: FTitle;
  isAddPending: boolean;
  isUpdatePending: boolean;
  isEditPermission: boolean;
}

type TitleFormData = {
  titleName: string;
  dsKhoVtPermission: number[] | null;
  dsKhoTpPermission: string[] | null;
};

export default function TitleModal({
  isOpen,
  toggle,
  handleAdd,
  handleEdit,
  selectedTitle,
  isAddPending,
  isUpdatePending,
  isEditPermission,
}: Readonly<UserModalProps>) {
  const { suppliesStoreOptions } = useSuppliesStoreOptions(true);
  const { productStoreOptions } = useProductStoreOptions(true);

  const initTitleData: TitleFormData = {
    titleName: selectedTitle?.name ?? '',
    dsKhoVtPermission: selectedTitle?.dsKhoVtPermission?.split(',').filter(Boolean).map(Number) ?? [],
    dsKhoTpPermission: selectedTitle?.dsKhoTpPermission?.split(',').filter(Boolean) ?? [],
  };
  const formik = useFormik({
    initialValues: initTitleData,
    validationSchema: Yup.object().shape({
      titleName: Yup.string().required(ValidationMessage.REQUIRED),
      dsKhoVtPermission: Yup.array().nullable(),
      dsKhoTpPermission: Yup.array().nullable(),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = useCallback(
    (titleData: typeof initTitleData) => {
      if (selectedTitle?.name) {
        // Mode: Update Title
        const updatedTitle: FTitle = {
          id: selectedTitle.id,
          name: titleData.titleName.trim(),
          dsKhoVtPermission: titleData.dsKhoVtPermission?.join(',') ?? null,
          dsKhoTpPermission: titleData.dsKhoTpPermission?.join(',') ?? null,
        };
        handleEdit(selectedTitle.id!, updatedTitle);
      } else {
        // Mode: Add new Title
        const newTitle: NewFTitle = {
          name: titleData.titleName,
          dsKhoVtPermission: titleData.dsKhoVtPermission?.join(',') ?? null,
          dsKhoTpPermission: titleData.dsKhoTpPermission?.join(',') ?? null,
        };
        handleAdd(newTitle);
      }
      formik.resetForm();
      toggle();
    },
    [formik, handleAdd, handleEdit, selectedTitle?.id, selectedTitle?.name, toggle],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>{selectedTitle ? 'Chỉnh sửa' : 'Thêm Mới'}</ModalHeader>
      <ModalBody>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="titleName">
                  Chức danh <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  id="titleName"
                  readOnly={!isEditPermission}
                  {...formik.getFieldProps('titleName')}
                  invalid={!!formik.errors.titleName && !!formik.touched.titleName}
                />
                {formik.touched.titleName && formik.errors.titleName && (
                  <div className="invalid-feedback">{formik.errors.titleName}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label>Danh sách Kho vật tư được quyền thao tác</Label>
                <AutoCompleteMultiSelect
                  label="Kho vật tư"
                  placeholder="Mã kho"
                  optionData={suppliesStoreOptions}
                  value={formik.values.dsKhoVtPermission}
                  readOnly={!isEditPermission}
                  onChange={(newValues) => {
                    if (newValues?.includes(-1)) {
                      return formik.setFieldValue('dsKhoVtPermission', [-1]);
                    }
                    formik.setFieldValue('dsKhoVtPermission', newValues);
                  }}
                  renderOption={(option) => `${option.id === -1 ? 'ALL' : option.id} - ${option.text}`}
                  css={{ marginTop: '10px' }}
                />
                {formik.errors.dsKhoVtPermission && (
                  <FormFeedback className="d-block">{formik.errors.dsKhoVtPermission}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>Danh sách Kho sản phẩm được quyền thao tác</Label>
                <AutoCompleteMultiSelect
                  label="Kho sản phẩm"
                  placeholder="Mã kho"
                  optionData={productStoreOptions}
                  value={formik.values.dsKhoTpPermission}
                  readOnly={!isEditPermission}
                  onChange={(newValues) => {
                    if (newValues?.includes('-1')) {
                      return formik.setFieldValue('dsKhoTpPermission', ['-1']);
                    }
                    formik.setFieldValue('dsKhoTpPermission', newValues);
                  }}
                  renderOption={(option) => `${option.id === '-1' ? 'ALL' : option.id} - ${option.text}`}
                  css={{ marginTop: '10px' }}
                />
                {formik.errors.dsKhoTpPermission && (
                  <FormFeedback className="d-block">{formik.errors.dsKhoTpPermission}</FormFeedback>
                )}
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <EditPermissionAction>
          <Button
            onClick={formik.submitForm}
            color="primary"
            disabled={!formik.dirty || !formik.isValid || isAddPending || isUpdatePending}>
            {isAddPending || isUpdatePending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </EditPermissionAction>
        <Button type="reset" color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
}
