import { useAuthenticationControllerFetchByToken } from 'main/apis/drc/endpoints/authentication-controller/authentication-controller';
import AdminFooter from 'main/components/organisms/footer/admin-footer';
import AdminNavbar from 'main/components/organisms/navbar/admin-navbar';
import Sidebar from 'main/components/organisms/sidebar/sidebar';
import UsersManagementList from 'main/components/pages/admin/users-management/users-management-list';
import { Page } from 'main/constants';
import { getPermissionsByPath } from 'main/hooks/usePermissionAction';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import { setAuth } from 'main/redux/modules/auth/auth-slice';
import { AuthenticationUtil, getPathWithoutAdminPrefix } from 'main/utils';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { scrollTop } from './auth';

type Route = {
  collapse?: boolean;
  name: string;
  icon?: string;
  path?: string;
  miniName?: string;
  layout?: string;
  component?: ReactNode;
  state?: string;
  views?: Route[];
};

export const ADMIN_PATH = '/admin/';

const menuRoutes: Route[] = [
  {
    collapse: true,
    name: 'Quản lý Kho vật tư',
    icon: 'ni ni-single-copy-04 text-pink',
    state: 'suppliesStoreManagementCollapse',
    views: [
      {
        path: getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_IMPORT_LIST.PATH),
        name: 'Quản lý nhập kho vật tư',
        miniName: 'SI',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_EXPORT_LIST.PATH),
        name: 'Quản lý xuất kho vật tư',
        miniName: 'SE',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_INVENTORY_LIST.PATH),
        name: 'Quản lý tồn kho vật tư',
        miniName: 'SX',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.SUPPLIES_STORE_INVENTORY_WARNING.PATH),
        name: 'Cảnh báo hạn lưu kho',
        miniName: 'SW',
        layout: ADMIN_PATH,
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
        path: getPathWithoutAdminPrefix(Page.SUPPLIES_MANAGEMENT_LIST.PATH),
        name: 'Danh mục quản lý vật tư',
        miniName: 'M',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.SUPPLIES_WAREHOUSE_LIST.PATH),
        name: 'Danh mục kho vật tư',
        miniName: 'W',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.SUPPLIES_GROUP_LIST.PATH),
        name: 'Danh mục nhóm vật tư',
        miniName: 'G',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.SUPPLIES_ORIGIN_LIST.PATH),
        name: 'Danh mục nguồn gốc vật tư',
        miniName: 'O',
        layout: ADMIN_PATH,
      },
    ],
  },
  {
    collapse: true,
    name: 'Quản lý Kho sản phẩm',
    icon: 'ni ni-ungroup text-orange',
    state: 'productStoreManagementCollapse',
    views: [
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCT_STORE_IMPORT_LIST.PATH),
        name: 'Quản lý nhập kho sản phẩm',
        miniName: 'PI',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCT_STORE_EXCEL_LIST.PATH),
        name: 'Quản lý lệnh nhập kho',
        miniName: 'CI',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCT_STORE_EXPORT_LIST.PATH),
        name: 'Quản lý xuất kho sản phẩm',
        miniName: 'PE',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCT_COMMAND_EXPORT_LIST.PATH),
        name: 'Quản lý lệnh xuất kho',
        miniName: 'CE',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCT_STORE_INVENTORY_LIST.PATH),
        name: 'Quản lý tồn kho sản phẩm',
        miniName: 'PX',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCT_STORE_INVENTORY_WARNING.PATH),
        name: 'Cảnh báo hạn lưu kho',
        miniName: 'PW',
        layout: ADMIN_PATH,
      },
    ],
  },
  {
    collapse: true,
    name: 'Đơn đặt hàng',
    icon: 'ni ni-cart text-blue',
    state: 'productOrderManagementCollapse',
    views: [
      {
        path: getPathWithoutAdminPrefix(Page.ORDER_DASHBOARD.PATH),
        name: 'Dashboard đơn đặt hàng',
        miniName: 'OD',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.ORDER_MANAGEMENT_LIST.PATH),
        name: 'Quản lý đơn đặt hàng',
        miniName: 'OL',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.ORDER_MANAGEMENT_WARNING.PATH),
        name: 'Cảnh báo đơn đặt hàng',
        miniName: 'OW',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.ORDER_MANAGEMENT_ANALYTICS.PATH),
        name: 'Thống kê đơn đặt hàng',
        miniName: 'OA',
        layout: ADMIN_PATH,
      },
    ],
  },
  {
    collapse: true,
    name: 'Danh mục sản phẩm',
    icon: 'ni ni-align-left-2 text-default',
    state: 'productItemManagementCollapse',
    views: [
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCTS_WAREHOUSE_LIST.PATH),
        name: 'Danh mục kho thành phẩm',
        miniName: 'PI',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCTS_ENTERPRISE_LIST.PATH),
        name: 'Danh mục đơn vị xí nghiệp',
        miniName: 'PE',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCTS_GROUP_LIST.PATH),
        name: 'Danh mục nhóm sản phẩm',
        miniName: 'PG',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCTS_STOCKS_LIST.PATH),
        name: 'Danh mục sản phẩm',
        miniName: 'PP',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCTS_CUSTOMER_LIST.PATH),
        name: 'Danh mục khách hàng',
        miniName: 'PK',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCTS_SALES_GROUP_LIST.PATH),
        name: 'Danh mục nhóm BTP',
        miniName: 'SG',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.PRODUCTS_SEMI_FINISHED_LIST.PATH),
        name: 'Danh mục BTP',
        miniName: 'BTP',
        layout: ADMIN_PATH,
      },
    ],
  },
  {
    collapse: true,
    name: 'Quản lý Định mức',
    icon: 'ni ni-map-big text-primary',
    state: 'requirementsStandardManagementCollapse',
    views: [
      {
        path: getPathWithoutAdminPrefix(Page.REQUIREMENTS_STANDARD_SET_LIST.PATH),
        name: 'Quản lý bộ định mức',
        miniName: 'RS',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.REQUIREMENTS_STANDARD_SET_COMPARE.PATH),
        name: 'So sánh bộ định mức',
        miniName: 'CR',
        layout: ADMIN_PATH,
      },
    ],
  },
  {
    collapse: false,
    name: 'Quy định và hướng dẫn',
    icon: 'ni ni-calendar-grid-58 text-red',
    path: getPathWithoutAdminPrefix(Page.TERMS_AND_CONDITIONS_LIST.PATH),
    miniName: 'TC',
    layout: ADMIN_PATH,
  },
  {
    collapse: true,
    name: 'Quản lý hệ thống',
    icon: 'ni ni-settings text-purple',
    state: 'userManagementCollapse',
    views: [
      {
        path: getPathWithoutAdminPrefix(Page.USER_MANAGEMENT.PATH),
        name: 'Quản lý người dùng',
        miniName: 'USER',
        layout: ADMIN_PATH,
      },
      {
        path: getPathWithoutAdminPrefix(Page.TITLE_MANAGEMENT.PATH),
        name: 'Quản lý chức danh/quyền',
        miniName: 'ROLE',
        component: <UsersManagementList />,
        layout: ADMIN_PATH,
      },
    ],
  },
];

function filterRoutes(routes: Route[], predict: (path: string) => boolean): Route[] {
  return routes.reduce<Route[]>((acc, route) => {
    if (route.path && predict(route.path)) {
      acc.push(route);
    } else if (route.views) {
      const filteredViews = filterRoutes(route.views, predict);
      if (filteredViews.length > 0) {
        acc.push({
          ...route,
          views: filteredViews,
        });
      }
    }
    return acc;
  }, []);
}

function AdminLayout() {
  const [sidenavOpen, setSidenavOpen] = useState(true);
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [allowedRoutes, setAllowedRoutes] = useState<Route[]>([]);
  const authUser = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { data: user, isFetched } = useAuthenticationControllerFetchByToken(Number(AuthenticationUtil.getUserId()), {
    query: {
      enabled: !authUser.username || !authUser.userId,
    },
  });

  // Restore Auth-User information by auth-token if app refreshed
  useEffect(() => {
    const token = AuthenticationUtil.getAuthToken();
    if (token && isFetched && user) {
      dispatch(
        setAuth({
          userId: user.userId,
          username: user.username,
          controllerPermissions: user.controllerPermissions ?? [],
          dsKhoVtPermission: user.dsKhoVtPermission?.split(',').filter(Boolean).map(Number) ?? null,
          dsKhoTpPermission: user.dsKhoTpPermission?.split(',').filter(Boolean) ?? null,
        }),
      );
    }
  }, [dispatch, isFetched, user]);

  useEffect(() => {
    setAllowedRoutes(
      filterRoutes(menuRoutes, (path) => {
        const permissions = getPermissionsByPath(ADMIN_PATH + path, authUser.controllerPermissions);

        return permissions.view;
      }),
    );
  }, [authUser.controllerPermissions]);

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
        routes={allowedRoutes}
        toggleSidenav={toggleSidenav}
        sidenavOpen={sidenavOpen}
        logo={{
          innerLink: '/',
          imgSrc: `${process.env.PUBLIC_URL}/assets/img/logo-drc.png`,
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
