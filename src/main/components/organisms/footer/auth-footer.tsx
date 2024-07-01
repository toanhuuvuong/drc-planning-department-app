import { Col, Container, Nav, NavItem, NavLink, Row } from 'reactstrap';

function AuthFooter() {
  return (
    <footer className="py-5" id="footer-main">
      <Container>
        <Row className="align-items-center justify-content-xl-between">
          <Col xl="6">
            <div className="copyright text-center text-xl-left text-muted">
              © {new Date().getFullYear()}{' '}
              <a className="font-weight-bold ml-1" href="https://drc.com.vn" target="_blank" rel="noreferrer">
                DRC
              </a>
            </div>
          </Col>
          <Col xl="6">
            <Nav className="nav-footer justify-content-center justify-content-xl-end">
              <NavItem>
                <NavLink href="https://drc.com.vn" target="_blank">
                  Công ty DRC
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" target="_blank">
                  Về chúng tôi
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default AuthFooter;
