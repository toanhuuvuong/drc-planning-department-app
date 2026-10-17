import ErrorTemplate from 'main/components/templates/error-template';
import { Error, Page } from 'main/constants';
import page from 'main/constants/page';
import { useAuth } from 'main/hooks';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';

function AccessDenied() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(page.LOGIN.PATH);
  };

  return (
    <>
      <ErrorTemplate
        pageTitle={Page.ACCESS_DENIED.NAME}
        heading={Error.ACCESS_DENIED.HEADING}
        message={Error.ACCESS_DENIED.MESSAGE}
      />
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col>
          <Button color="primary" onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
          <Button color="danger" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default AccessDenied;
