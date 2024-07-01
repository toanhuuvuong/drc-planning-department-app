import classnames from 'classnames';
import AuthHeader from 'main/components/organisms/header/auth-header';
import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';

function Register() {
  const [focusedName, setFocusedName] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);

  return (
    <>
      <AuthHeader
        title="Tạo tài khoản"
        lead="Tài khoản DRC cung cấp cho bạn quyền truy cập vào ứng dụng quản lý của DRC."
      />
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="6" md="8">
            <Card className="bg-secondary border-0">
              <CardHeader className="bg-transparent pb-5">
                <div className="text-muted text-center mt-2 mb-4">
                  <small>Đăng ký với</small>
                </div>
                <div className="text-center">
                  <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}>
                    <span className="btn-inner--icon mr-1">
                      <img alt="..." src={require('template/assets/img/icons/common/google.svg').default} />
                    </span>
                    <span className="btn-inner--text">Google</span>
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>Hoặc đăng ký bằng thông tin</small>
                </div>
                <Form role="form">
                  <FormGroup
                    className={classnames({
                      focused: focusedName,
                    })}>
                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Họ tên"
                        type="text"
                        onFocus={() => setFocusedName(true)}
                        onBlur={() => setFocusedName(false)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedEmail,
                    })}>
                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="email"
                        onFocus={() => setFocusedEmail(true)}
                        onBlur={() => setFocusedEmail(false)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedPassword,
                    })}>
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Mật khẩu"
                        type="password"
                        onFocus={() => setFocusedPassword(true)}
                        onBlur={() => setFocusedPassword(false)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="text-muted font-italic">
                    <small>
                      Độ bảo mật của mật khẩu: <span className="text-success font-weight-700">mạnh</span>
                    </small>
                  </div>
                  <Row className="my-4">
                    <Col xs="12">
                      <div className="custom-control custom-control-alternative custom-checkbox">
                        <input className="custom-control-input" id="customCheckRegister" type="checkbox" />
                        <label className="custom-control-label" htmlFor="customCheckRegister">
                          <span className="text-muted">
                            Tôi đồng ý với{' '}
                            <a href="#pablo" onClick={(e) => e.preventDefault()}>
                              Chính sách bảo mật
                            </a>
                          </span>
                        </label>
                      </div>
                    </Col>
                  </Row>
                  <div className="text-center">
                    <Button className="mt-4" color="info" type="button">
                      Tạo tài khoản
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Register;
