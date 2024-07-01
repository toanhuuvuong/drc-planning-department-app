import classnames from 'classnames';
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link, NavLink as NavLinkRRD, useLocation } from 'react-router-dom';
import { Collapse, Nav, NavItem, NavLink, Navbar, NavbarBrand } from 'reactstrap';

type Props = {
  toggleSidenav: () => void;
  sidenavOpen: boolean;
  routes: any[];
  logo: {
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink?: string;
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink?: string;
    // the image src of the logo
    imgSrc: string;
    // the alt for the img
    imgAlt: string;
  };
  rtlActive?: boolean;
};

function Sidebar({ toggleSidenav = () => {}, sidenavOpen = false, routes, logo, rtlActive = false }: Props) {
  const [state, setState] = React.useState({});
  const location = useLocation();

  React.useEffect(() => {
    setState(getCollapseStates(routes));
    // eslint-disable-next-line
  }, []);

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return location.pathname.indexOf(routeName) > -1 ? 'active' : '';
  };

  // makes the sidenav normal on hover (actually when mouse enters on it)
  const onMouseEnterSidenav = () => {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.add('g-sidenav-show');
    }
  };

  // makes the sidenav mini on hover (actually when mouse leaves from it)
  const onMouseLeaveSidenav = () => {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-show');
    }
  };

  // this creates the intial state of this component based on the collapse routes
  // that it gets through routes
  const getCollapseStates = (routes: any[]) => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: getCollapseInitialState(prop.views),
          ...getCollapseStates(prop.views),
          ...initialState,
        };
      }
      return null;
    });
    return initialState;
  };

  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.js - route /admin/regular-forms
  const getCollapseInitialState = (routes: any) => {
    for (const route of routes) {
      if (route.collapse && getCollapseInitialState(route.views)) {
        return true;
      }
      if (location.pathname.indexOf(route.path) !== -1) {
        return true;
      }
    }
    return false;
  };

  // this is used on mobile devices, when a user navigates
  // the sidebar will autoclose
  const closeSidenav = () => {
    if (window.innerWidth < 1200) {
      toggleSidenav();
    }
  };

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes: any[]) => {
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.collapse) {
        let st = {};
        const stateValue = state[prop.state as keyof typeof state];
        const propValue = prop['state'];
        st[propValue as keyof typeof st] = !stateValue as never;
        return (
          <NavItem key={key}>
            <NavLink
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={stateValue}
              className={classnames({
                active: getCollapseInitialState(prop.views),
              })}
              onClick={(e) => {
                e.preventDefault();
                setState(st);
              }}>
              {prop.icon ? (
                <>
                  <i className={prop.icon} />
                  <span className="nav-link-text">{prop.name}</span>
                </>
              ) : prop.miniName ? (
                <>
                  <span className="sidenav-mini-icon"> {prop.miniName} </span>
                  <span className="sidenav-normal"> {prop.name} </span>
                </>
              ) : null}
            </NavLink>
            <Collapse isOpen={stateValue}>
              <Nav className="nav-sm flex-column">{createLinks(prop.views)}</Nav>
            </Collapse>
          </NavItem>
        );
      }
      return (
        <NavItem className={activeRoute(prop.layout + prop.path)} key={key}>
          <NavLink to={prop.layout + prop.path} onClick={closeSidenav} tag={NavLinkRRD}>
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <span className="nav-link-text">{prop.name}</span>
              </>
            ) : prop.miniName !== undefined ? (
              <>
                <span className="sidenav-mini-icon"> {prop.miniName} </span>
                <span className="sidenav-normal"> {prop.name} </span>
              </>
            ) : (
              prop.name
            )}
          </NavLink>
        </NavItem>
      );
    });
  };

  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: '_blank',
    };
  }
  const scrollBarInner = (
    <div className="scrollbar-inner">
      <div className="sidenav-header d-flex align-items-center">
        {logo ? (
          <NavbarBrand {...navbarBrandProps}>
            <img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
          </NavbarBrand>
        ) : null}
        <div className="ml-auto">
          <div
            className={classnames('sidenav-toggler d-none d-xl-block', {
              active: sidenavOpen,
            })}
            onClick={toggleSidenav}>
            <div className="sidenav-toggler-inner">
              <i className="sidenav-toggler-line" />
              <i className="sidenav-toggler-line" />
              <i className="sidenav-toggler-line" />
            </div>
          </div>
        </div>
      </div>
      <div className="navbar-inner">
        <Collapse navbar isOpen={true}>
          <Nav navbar>{createLinks(routes)}</Nav>
        </Collapse>
      </div>
    </div>
  );

  return (
    <Navbar
      className={'sidenav navbar-vertical navbar-expand-xs navbar-light bg-white ' + (rtlActive ? '' : 'fixed-left')}
      onMouseEnter={onMouseEnterSidenav}
      onMouseLeave={onMouseLeaveSidenav}>
      {navigator.platform.indexOf('Win') > -1 ? <PerfectScrollbar>{scrollBarInner}</PerfectScrollbar> : scrollBarInner}
    </Navbar>
  );
}

export default Sidebar;
