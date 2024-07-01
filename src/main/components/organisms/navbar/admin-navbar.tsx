import classnames from 'classnames';
import {
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Media,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  UncontrolledDropdown,
} from 'reactstrap';

type Props = {
  theme: 'dark' | 'light';
  sidenavOpen: boolean;
  toggleSidenav: () => void;
};

function AdminNavbar({ theme = 'dark', sidenavOpen = false, toggleSidenav = () => {} }: Props) {
  // function that on mobile devices makes the search open
  const openSearch = () => {
    document.body.classList.add('g-navbar-search-showing');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-showing');
      document.body.classList.add('g-navbar-search-show');
    }, 150);
    setTimeout(function () {
      document.body.classList.add('g-navbar-search-shown');
    }, 300);
  };

  // function that on mobile devices makes the search close
  const closeSearch = () => {
    document.body.classList.remove('g-navbar-search-shown');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-show');
      document.body.classList.add('g-navbar-search-hiding');
    }, 150);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hiding');
      document.body.classList.add('g-navbar-search-hidden');
    }, 300);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hidden');
    }, 500);
  };

  return (
    <Navbar
      className={classnames(
        'navbar-top navbar-expand border-bottom',
        { 'navbar-dark bg-info': theme === 'dark' },
        { 'navbar-light bg-secondary': theme === 'light' },
      )}>
      <Container fluid>
        <Collapse navbar isOpen={true}>
          <Form
            className={classnames(
              'navbar-search form-inline mr-sm-3',
              { 'navbar-search-light': theme === 'dark' },
              { 'navbar-search-dark': theme === 'light' },
            )}>
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative input-group-merge">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Tìm kiếm" type="text" />
              </InputGroup>
            </FormGroup>
            <button aria-label="Close" className="close" type="button" onClick={closeSearch}>
              <span aria-hidden={true}>×</span>
            </button>
          </Form>

          <Nav className="align-items-center ml-md-auto" navbar>
            <NavItem className="d-xl-none">
              <div
                className={classnames(
                  'pr-3 sidenav-toggler',
                  { active: sidenavOpen },
                  { 'sidenav-toggler-dark': theme === 'dark' },
                )}
                onClick={toggleSidenav}>
                <div className="sidenav-toggler-inner">
                  <i className="sidenav-toggler-line" />
                  <i className="sidenav-toggler-line" />
                  <i className="sidenav-toggler-line" />
                </div>
              </div>
            </NavItem>
            <NavItem className="d-sm-none">
              <NavLink onClick={openSearch}>
                <i className="ni ni-zoom-split-in" />
              </NavLink>
            </NavItem>
          </Nav>

          <Nav className="align-items-center ml-auto ml-md-0" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="nav-link pr-0" color="" tag="a">
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img alt="..." src={require('template/assets/img/theme/team-4.jpg')} />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">Vương Hữu Toàn</span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Xin chào!</h6>
                </DropdownItem>
                <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-single-02" />
                  <span>Thông tin của tôi</span>
                </DropdownItem>
                <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Thiết lập</span>
                </DropdownItem>
                <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Hoạt động</span>
                </DropdownItem>
                <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-support-16" />
                  <span>Hỗ trợ</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-user-run" />
                  <span>Đăng xuất</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;
