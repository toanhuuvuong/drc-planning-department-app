import { Credentials } from 'main/apis/drc/models';
import AuthHeader from 'main/components/organisms/header/auth-header';
import { useAuth } from 'main/hooks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';

const Login = () => {
  const [credential, setCredential] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const navigate = useNavigate();
  const { login } = useAuth({
    onSuccess: () => navigate('/'),
    onError: (errorMessage) => {
      toast.error(
        <div>
          <b>Đăng nhập thất bại</b> <br />
          {errorMessage}
        </div>,
      );
    },
  });

  const isValidInput = () => {
    const newErrors: Credentials = { email: '', password: '' };

    if (!credential.email) {
      newErrors.email = 'Username là trường bắt buộc';
    }

    if (!credential.password) {
      newErrors.password = 'Mật khẩu là trường bắt buộc';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredential((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setCredential((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  function handleLogin() {
    if (isValidInput()) {
      login(credential);
    }
  }

  return (
    <>
      <AuthHeader title="Xin chào!" lead="Truy cập vào ứng dụng quản lý của DRC." />

      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="bg-secondary border-0 mb-0">
              <CardHeader className="bg-transparent pb-5">
                <div className="text-muted text-center">
                  <b>Đăng nhập để tiếp tục sử dụng</b>
                </div>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-4">
                <Form>
                  <FormGroup>
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-circle-08" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="email"
                        placeholder="Username"
                        type="text"
                        required
                        onChange={onInputChange}
                        onKeyDown={onEnter}
                        invalid={!!errors.email}
                        value={credential.email}
                      />
                      <FormFeedback className="d-block">{errors?.email}</FormFeedback>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="password"
                        placeholder="Mật khẩu"
                        type="password"
                        required
                        onChange={onInputChange}
                        onKeyDown={onEnter}
                        invalid={!!errors.password}
                        value={credential.password}
                      />
                      <FormFeedback className="d-block">{errors?.password}</FormFeedback>
                    </InputGroup>
                  </FormGroup>
                  <div className="text-center">
                    <Button onClick={handleLogin} color="primary" type="button">
                      Đăng nhập
                    </Button>
                  </div>
                </Form>
              </CardBody>
              <CardFooter>
                <Row>
                  <Col xs="12">
                    <small>
                      <i>Nếu bạn quên mật khẩu, hãy liên hệ Admin để thực hiện cấp lại mật khẩu cho bạn.</i>
                    </small>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
