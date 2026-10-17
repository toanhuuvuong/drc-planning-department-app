import { useFormik } from 'formik';
import { UserExcludingId, UserExcludingPassword, UserPartialExcludingIdUsername } from 'main/apis/drc/models';
import { Select2Box } from 'main/components/molecules/selectbox';
import { ValidationMessage } from 'main/constants';
import React, { useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
} from 'reactstrap';
import * as Yup from 'yup';

interface UserModalProps {
  isOpen: boolean;
  toggle: () => void;
  handleAdd: (newUser: UserExcludingId) => void;
  handleEdit: (id: number, newUser: UserPartialExcludingIdUsername) => void;
  departmentOptions: { id: string; text: string }[];
  titleOptions: { id: string; text: string }[];
  selectedUser?: UserExcludingPassword;
  isAddPending: boolean;
  isUpdatePending: boolean;
}

type UserFormData = {
  username: string;
  password: string | undefined;
  departmentId: string;
  titleId: string;
  selectedUser?: Object;
  isResetPass: boolean;
};

const initUserData: UserFormData = {
  selectedUser: undefined,
  username: '',
  password: undefined,
  departmentId: '-1',
  titleId: '-1',
  isResetPass: false,
};

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  toggle,
  handleAdd,
  handleEdit,
  selectedUser,
  departmentOptions,
  titleOptions,
  isAddPending,
  isUpdatePending,
}) => {
  const formik = useFormik({
    initialValues: initUserData,
    validationSchema: Yup.object().shape({
      isResetPass: Yup.boolean(),
      username: Yup.string().when(['selectedUser'], ([selectedUser], schema) => {
        if (!selectedUser) {
          return schema.required(ValidationMessage.REQUIRED);
        }
        return schema.notRequired();
      }),
      password: Yup.string().when(['selectedUser', 'isResetPass'], ([isEditMode, isResetPass], schema) => {
        if (!selectedUser || isResetPass) {
          return schema.required(ValidationMessage.REQUIRED);
        }
        return schema.notRequired();
      }),
      departmentId: Yup.string().nullable(),
      titleId: Yup.string().nullable(),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const resetForm = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  useEffect(() => {
    if (selectedUser) {
      formik.setValues({
        ...initUserData,
        selectedUser,
        username: selectedUser.username ?? '',
        password: undefined,
        departmentId: selectedUser.departmentId?.toString() ?? '-1',
        titleId: selectedUser.titleId?.toString() ?? '-1',
      });
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  const handleClickResetPass = useCallback(() => {
    formik.setFieldValue('isResetPass', !formik.values.isResetPass);
  }, [formik]);

  const handleSubmit = useCallback(
    (userData: typeof initUserData) => {
      if (selectedUser?.username) {
        // Mode: Update User
        const updatedUser: UserPartialExcludingIdUsername = {
          departmentId: userData.departmentId === '-1' ? null : Number(userData.departmentId),
          titleId: userData.titleId === '-1' ? null : Number(userData.titleId),
          password: userData.isResetPass ? userData.password : undefined,
        };
        handleEdit(selectedUser.id!, updatedUser);
      } else {
        // Mode: Add new User
        if (!userData.password) {
          return toast.error(
            <div>
              <b>Thất bại</b> <br /> Vui lòng điền thông tin mật khẩu.
            </div>,
          );
        }
        const newUser: UserExcludingId = {
          username: userData.username,
          password: userData.password,
          departmentId: userData.departmentId !== '-1' ? Number(userData.departmentId) : undefined,
          titleId: userData.titleId !== '-1' ? Number(userData.titleId) : undefined,
        };
        handleAdd(newUser);
      }
      resetForm();
      toggle();
    },
    [selectedUser?.id, selectedUser?.username, handleAdd, handleEdit, resetForm, toggle],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{selectedUser ? 'Chỉnh sửa' : 'Thêm Mới'}</ModalHeader>
      <ModalBody>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="username">
                  Username <i className="fa fa-asterisk fa-sm text-danger" />
                </Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  invalid={!!formik.errors.username && !formik.values.selectedUser}
                  readOnly={!!selectedUser}
                />
                {formik.errors.username && <FormFeedback>{formik.errors.username}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="department">Phòng ban</Label>
                <Select2Box
                  name="departmentId"
                  id="department"
                  className="form-control"
                  options={{ placeholder: 'Chọn Phòng ban' }}
                  value={formik.values.departmentId}
                  onChange={formik.handleChange}
                  data={departmentOptions}
                  invalid={!!formik.errors.departmentId}
                />
                {formik.errors.departmentId && (
                  <FormFeedback className="d-block">{formik.errors.departmentId}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="title">Chức danh</Label>
                <Select2Box
                  name="titleId"
                  id="title"
                  className="form-control"
                  options={{ placeholder: 'Chọn Chức danh' }}
                  value={formik.values.titleId}
                  onChange={formik.handleChange}
                  data={titleOptions}
                  invalid={!!formik.errors.titleId}
                />
                {formik.errors.titleId && <FormFeedback className="d-block">{formik.errors.titleId}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Label>
              {selectedUser && (
                <Button
                  type="button"
                  style={{ marginLeft: 16, marginBottom: 10 }}
                  color="warning"
                  size="sm"
                  onClick={handleClickResetPass}>
                  Đặt lại mật khẩu
                </Button>
              )}
            </Label>
            <Col md={12}>
              {(formik.values.isResetPass || !selectedUser) && (
                <FormGroup>
                  <Label for="password">
                    Mật khẩu <i className="fa fa-asterisk fa-sm text-danger" />
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    value={formik.values.password ?? ''}
                    onChange={formik.handleChange}
                    invalid={!!formik.errors.password}
                  />
                  {formik.errors.password && <FormFeedback>{formik.errors.password}</FormFeedback>}
                </FormGroup>
              )}
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => formik.submitForm()}
          color="primary"
          disabled={!formik.dirty || !formik.isValid || isAddPending || isUpdatePending}>
          {isAddPending || isUpdatePending ? 'Đang lưu...' : 'Lưu'}
        </Button>
        <Button type="reset" color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UserModal;
