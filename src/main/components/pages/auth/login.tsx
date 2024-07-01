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

function Login() {
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);

  return (
    <>
      <AuthHeader title="Xin chào!" lead="Truy cập vào ứng dụng quản lý của DRC." />

      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="bg-secondary border-0 mb-0">
              <CardHeader className="bg-transparent pb-5">
                <div className="text-muted text-center mt-2 mb-3">
                  <small>Đăng nhập với</small>
                </div>
                <div className="btn-wrapper text-center">
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
                  <small>Hoặc đăng nhập bằng thông tin</small>
                </div>
                <Form role="form">
                  <FormGroup
                    className={classnames('mb-3', {
                      focused: focusedEmail,
                    })}>
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="email"
                        onFocus={() => setFocusedEmail(true)}
                        onBlur={() => setFocusedEmail(true)}
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
                        onBlur={() => setFocusedPassword(true)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input className="custom-control-input" id=" customCheckLogin" type="checkbox" />
                    <label className="custom-control-label" htmlFor=" customCheckLogin">
                      <span className="text-muted">Nhớ mật khẩu</span>
                    </label>
                  </div>
                  <div className="text-center">
                    <Button className="my-4" color="info" type="button">
                      Đăng nhập
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <Row className="mt-3">
              <Col xs="6">
                <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
                  <small>Quên mật khẩu?</small>
                </a>
              </Col>
              <Col className="text-right" xs="6">
                <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
                  <small>Tạo tài khoản</small>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
