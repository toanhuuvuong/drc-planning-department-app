import classnames from 'classnames';
import page from 'main/constants/page';
import { useAuth } from 'main/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Media,
  Nav,
  NavItem,
  Navbar,
  UncontrolledDropdown,
} from 'reactstrap';

type Props = {
  theme: 'dark' | 'light';
  sidenavOpen: boolean;
  toggleSidenav: () => void;
};

function AdminNavbar({
  theme = 'dark',
  sidenavOpen = false,
  toggleSidenav = () => {
    // do nothing
  },
}: Readonly<Props>) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const location = useLocation();

  // Function to get current page category
  const getCurrentPageTitle = () => {
    // Get the current path without query parameters
    const currentPath = location.pathname;

    // Find the matching page in the page constant
    const pageEntries = Object.entries(page);
    for (const [key, value] of pageEntries) {
      if (value.PATH === currentPath) {
        return 'TITLE' in value && value.TITLE ? value.TITLE : 'Phòng kế hoạch - CÔNG TY CỔ PHẦN CAO SU ĐÀ NẴNG (DRC)';
      }
    }

    // If no exact match, try to match with paths that might have additional segments
    for (const [key, value] of pageEntries) {
      if (currentPath.startsWith(value.PATH) && value.PATH !== '/') {
        return 'TITLE' in value && value.TITLE ? value.TITLE : 'Phòng kế hoạch - CÔNG TY CỔ PHẦN CAO SU ĐÀ NẴNG (DRC)';
      }
    }

    // Return default if no match found
    return 'Phòng kế hoạch - CÔNG TY CỔ PHẦN CAO SU ĐÀ NẴNG (DRC)';
  };

  const handleLogout = () => {
    logout();
    navigate(page.LOGIN.PATH);
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
            <h2 className="text-white">{getCurrentPageTitle()}</h2>
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
          </Nav>

          <Nav className="align-items-center ml-auto ml-md-0" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="nav-link pr-0 cursor-pointer" color="" tag="a">
                <summary aria-expanded="true">
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img alt="avatar" src={`${process.env.PUBLIC_URL}/assets/img/logo-drc.png`} />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">{currentUser.username?.toUpperCase()}</span>
                    </Media>
                  </Media>
                </summary>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Xin chào!</h6>
                </DropdownItem>
                <DropdownItem onClick={(e) => navigate(page.MY_PROFILE.PATH)}>
                  <i className="ni ni-single-02" />
                  <span>Thông tin của tôi</span>
                </DropdownItem>
                <DropdownItem onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-support-16" />
                  <span>Hỗ trợ</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-user-run" />
                  <span onClick={handleLogout}>Đăng xuất</span>
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
