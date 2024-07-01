import AdminFooter from 'main/components/organisms/footer/admin-footer';
import AdminNavbar from 'main/components/organisms/navbar/admin-navbar';
import Sidebar from 'main/components/organisms/sidebar/sidebar';
import Dashboard from 'main/components/pages/admin/dashboard/dashboard';
import SuppliesCategoryList from 'main/components/pages/admin/supplies-category/supplies-category-list';
import SuppliesStoreExportList from 'main/components/pages/admin/supplies-store-export/supplies-store-export-list/supplies-store-export-list';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { scrollTop } from './auth';

const menuRoutes = [
  {
    collapse: false,
    name: 'Dashboard',
    icon: 'ni ni-shop text-primary',
    state: 'dashboardManagementCollapse',
    views: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        miniName: 'D',
        component: <Dashboard />,
        layout: '/admin',
      },
    ],
  },
  {
    collapse: true,
    name: 'Quản lý Kho vật tư',
    icon: 'ni ni-single-copy-04 text-pink',
    state: 'suppliesStoreManagementCollapse',
    views: [
      {
        path: '/supplies-store-import/list',
        name: 'Quản lý nhập kho vật tư',
        miniName: 'I',
        component: <></>,
        layout: '/admin',
      },
      {
        path: '/supplies-store-export/list',
        name: 'Quản lý xuất kho vật tư',
        miniName: 'E',
        component: <SuppliesStoreExportList />,
        layout: '/admin',
      },
      {
        path: '/supplies-store-exit/list',
        name: 'Quản lý tồn kho vật tư',
        miniName: 'X',
        component: <></>,
        layout: '/admin',
      },
    ],
  },
  {
    collapse: true,
    name: 'Danh mục vật tư',
    icon: 'ni ni-ui-04 text-info',
    state: 'suppliesItemManagementCollapse',
    views: [
      {
        path: '/supplies-store/list',
        name: 'Danh mục kho vật tư',
        miniName: 'S',
        component: <></>,
        layout: '/admin',
      },
      {
        path: '/supplies-group/list',
        name: 'Danh mục nhóm vật tư',
        miniName: 'G',
        component: <></>,
        layout: '/admin',
      },
      {
        path: '/supplies-category/list',
        name: 'Danh mục loại vật tư',
        miniName: 'C',
        component: <SuppliesCategoryList />,
        layout: '/admin',
      },
      {
        path: '/supplies-source/list',
        name: 'Danh mục nguồn gốc',
        miniName: 'R',
        component: <></>,
        layout: '/admin',
      },
    ],
  },
];

function AdminLayout() {
  const [sidenavOpen, setSidenavOpen] = useState(true);
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollTop(mainContentRef);
  }, [location]);

  // toggles collapse between mini sidenav and normal
  const toggleSidenav = () => {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
    }
    setSidenavOpen(!sidenavOpen);
  };

  const getNavbarTheme = () => {
    return location.pathname.indexOf('admin/alternative-dashboard') === -1 ? 'dark' : 'light';
  };

  return (
    <>
      <Sidebar
        routes={menuRoutes}
        toggleSidenav={toggleSidenav}
        sidenavOpen={sidenavOpen}
        logo={{
          innerLink: '/',
          imgSrc: require('template/assets/img/brand/argon-react.png'),
          imgAlt: '...',
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminNavbar theme={getNavbarTheme()} toggleSidenav={toggleSidenav} sidenavOpen={sidenavOpen} />

        <Outlet />

        <AdminFooter />
      </div>
      {sidenavOpen ? <div className="backdrop d-xl-none" onClick={toggleSidenav} /> : null}
    </>
  );
}

export default AdminLayout;
