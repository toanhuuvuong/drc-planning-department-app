import { Link } from 'react-router-dom';
import { Col, Container, Nav, NavItem, NavLink, Navbar, NavbarBrand, Row, UncontrolledCollapse } from 'reactstrap';

function AuthNavbar() {
  return (
    <Navbar className="navbar-horizontal navbar-main navbar-dark navbar-transparent" expand="lg" id="navbar-main">
      <Container>
        <NavbarBrand to="/" tag={Link}>
          <img alt="..." src={require('template/assets/img/brand/argon-react-white.png')} />
        </NavbarBrand>
        <button
          aria-controls="navbar-collapse"
          aria-expanded={false}
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-target="#navbar-collapse"
          data-toggle="collapse"
          id="navbar-collapse"
          type="button">
          <span className="navbar-toggler-icon" />
        </button>
        <UncontrolledCollapse className="navbar-custom-collapse" navbar toggler="#navbar-collapse">
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6">
                <Link to="/admin/dashboard">
                  <img alt="..." src={require('template/assets/img/brand/blue.png')} />
                </Link>
              </Col>
              <Col className="collapse-close" xs="6">
                <button
                  aria-controls="navbar-collapse"
                  aria-expanded={false}
                  aria-label="Toggle navigation"
                  className="navbar-toggler"
                  data-target="#navbar-collapse"
                  data-toggle="collapse"
                  id="navbar-collapse"
                  type="button">
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink to="/auth/login" tag={Link}>
                <span className="nav-link-inner--text">Đăng nhập</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/auth/register" tag={Link}>
                <span className="nav-link-inner--text">Đăng ký</span>
              </NavLink>
            </NavItem>
          </Nav>
        </UncontrolledCollapse>
      </Container>
    </Navbar>
  );
}

export default AuthNavbar;
