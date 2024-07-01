import { Col, Container, Nav, NavItem, NavLink, Row } from 'reactstrap';

function AdminFooter() {
  return (
    <Container fluid>
      <footer className="footer pt-0">
        <Row className="align-items-center justify-content-lg-between">
          <Col lg="6">
            <div className="copyright text-center text-lg-left text-muted">
              © {new Date().getFullYear()}{' '}
              <a className="font-weight-bold ml-1" href="https://drc.com.vn" target="_blank" rel="noreferrer">
                DRC
              </a>
            </div>
          </Col>
          <Col lg="6">
            <Nav className="nav-footer justify-content-center justify-content-lg-end">
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
      </footer>
    </Container>
  );
}

export default AdminFooter;
