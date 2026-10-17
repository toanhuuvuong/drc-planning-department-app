import { useFormik } from 'formik';
import {
  useFUserControllerChangePasswordById,
  useFUserControllerFindById,
} from 'main/apis/drc/endpoints/fuser-controller/fuser-controller';
import { ChangePasswordModel } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { useAuth } from 'main/hooks';
import useDepartmentStoreOptions from 'main/hooks/useDepartmentStoreOptions';
import useTitleStoreOptions from 'main/hooks/useTitleStoreOptions';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Form, Row, Input, Label } from 'reactstrap';
import * as Yup from 'yup';

export default function MyProfile() {
  const { departmentStoreOptions: departments } = useDepartmentStoreOptions();
  const { titleStoreOptions: titles } = useTitleStoreOptions();
  const { currentUser } = useAuth();

  const { data: userData } = useFUserControllerFindById(Number(currentUser.userId));

  const { mutateAsync: changePasswordAsync, isPending: isUpdatePending } = useFUserControllerChangePasswordById();

  let titleName: string | undefined;
  let departmentName: string | undefined;

  if (userData?.titleId) {
    const userTitleId = userData?.titleId;
    titleName = titles.find((item) => item.id === userTitleId.toString())?.text;
  }

  if (userData?.departmentId) {
    const userDeptId = userData.departmentId;
    departmentName = departments.find((item) => item.id === userDeptId.toString())?.text;
  }

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Mật khẩu hiện tại là bắt buộc'),
    newPassword: Yup.string().min(6, 'Mật khẩu mới phải có tối thiểu 6 ký tự').required('Mật khẩu mới là bắt buộc'),
    reNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), undefined], 'Mật khẩu nhập lại không khớp')
      .required('Mật khẩu nhập lại là bắt buộc'),
  });

  const initChangePassData: ChangePasswordModel = {
    currentPassword: '',
    newPassword: '',
    reNewPassword: '',
  };

  const formik = useFormik({
    initialValues: initChangePassData,
    onSubmit: () => {
      if (userData?.id) {
        changePasswordAsync({ id: userData.id, data: formik.values })
          .then(() => {
            formik.resetForm();
            toast.success(
              <div>
                <b>Thành công</b> <br /> Đã thay đổi mật khẩu thành công.
              </div>,
            );
          })
          .catch((error) => {
            toast.error(
              <div>
                <b>Thất bại </b> <br /> Đã có lỗi xảy ra khi đổi mật khẩu.
                <br /> {error?.response?.data?.error?.message || error.message}
              </div>,
            );
          });
      }
    },
    validationSchema,
  });

  return (
    <BasicTemplate
      pageCategory={Page.MY_PROFILE.CATEGORY}
      pageTitle={Page.MY_PROFILE.TITLE}
      pageName={Page.MY_PROFILE.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardHeader>
            <Row className="align-items-center">
              <h3 className="mb-0">Hồ sơ của tôi</h3>
            </Row>
          </CardHeader>
          <CardBody>
            <h6 className="heading-small text-muted mb-4">Thông tin tài khoản</h6>
            <div className="pl-lg-4">
              <Row>
                <Col lg="12">
                  <div className="form-control-label">Username</div>
                  <p className=""> {userData?.username}</p>
                </Col>
                <Col lg="6">
                  <div className="form-control-label">Phòng ban</div>
                  <p>{departmentName ?? 'Chưa có phòng ban'}</p>
                </Col>
                <Col lg="6">
                  <div className="form-control-label">Chức danh</div>
                  <p> {titleName ?? 'Chưa có chức danh'} </p>
                </Col>
              </Row>
            </div>
            <hr className="my-4" />
            <h6 className="heading-small text-muted mb-4">Đổi mật khẩu</h6>
            <div className="pl-lg-4">
              <Form onSubmit={formik.handleSubmit}>
                <Input hidden type="text" autoComplete="username" value="{{...}}" />
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <Label className="form-control-label" htmlFor="input-old-password">
                        Mật khẩu hiện tại
                      </Label>
                      <Input
                        id="input-old-password"
                        placeholder="Nhập lại mật khẩu cũ"
                        type="password"
                        autoComplete="current-password"
                        {...formik.getFieldProps('currentPassword')}
                        invalid={!!formik.errors.currentPassword && !!formik.touched.currentPassword}
                      />
                      {formik.touched.currentPassword && formik.errors.currentPassword && (
                        <div className="invalid-feedback">{formik.errors.currentPassword}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <Label className="form-control-label" htmlFor="input-new-password">
                        Mật khẩu mới
                      </Label>
                      <Input
                        id="input-new-password"
                        placeholder="Nhập mật khẩu mới"
                        type="password"
                        autoComplete="new-password"
                        {...formik.getFieldProps('newPassword')}
                        invalid={!!formik.errors.newPassword && !!formik.touched.newPassword}
                      />
                      {formik.touched.newPassword && formik.errors.newPassword && (
                        <div className="invalid-feedback">{formik.errors.newPassword}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <Label className="form-control-label" htmlFor="input-re-new-password">
                        Nhập lại mật khẩu mới
                      </Label>
                      <Input
                        id="input-re-new-password"
                        placeholder="Nhập lại mật khẩu mới"
                        type="password"
                        autoComplete="new-password"
                        {...formik.getFieldProps('reNewPassword')}
                        invalid={!!formik.errors.reNewPassword && !!formik.touched.reNewPassword}
                      />
                      {formik.touched.reNewPassword && formik.errors.reNewPassword && (
                        <div className="invalid-feedback">{formik.errors.reNewPassword}</div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Button
                  color="primary"
                  type="submit"
                  size="md"
                  disabled={!formik.dirty || !formik.isValid || isUpdatePending}>
                  {isUpdatePending ? 'Đang lưu...' : 'Đổi mật khẩu'}
                </Button>
              </Form>
            </div>
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}
