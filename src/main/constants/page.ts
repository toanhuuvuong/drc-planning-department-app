const Page = {
  /** Dashboard Pages */
  DASHBOARD: {
    NAME: 'Dashboard',
    PATH: '/admin/dashboard',
  },
  /** Supplies Store Export Pages */
  SUPPLIES_STORE_EXPORT_LIST: {
    TITLE: 'Quản lý xuất kho vật tư',
    NAME: 'Tổng hợp xuất vật tư',
    PATH: '/admin/supplies-store-export/list',
  },
  SUPPLIES_STORE_EXPORT_ADD: {
    TITLE: 'Quản lý xuất kho vật tư',
    NAME: 'Tạo phiếu xuất',
    PATH: '/admin/supplies-store-export/add',
  },
  SUPPLIES_STORE_EXPORT_DETAIL: {
    TITLE: 'Quản lý xuất kho vật tư',
    NAME: 'Chi tiết phiếu xuất',
    PATH: '/admin/supplies-store-export/detail/:id',
  },
  /** Supplies Category Pages */
  SUPPLIES_CATEGORY_LIST: {
    NAME: 'Quản lý loại vật tư',
    PATH: '/admin/supplies-category/list',
  },
  SUPPLIES_CATEGORY_EDIT: {
    NAME: 'Quản lý loại vật tư',
    PATH: '/admin/supplies-category/edit',
  },
  /** Authentication Pages */
  LOGIN: {
    NAME: 'Đăng nhập',
    PATH: '/auth/login',
  },
  REGISTER: {
    NAME: 'Đăng ký',
    PATH: '/auth/register',
  },
  /** Error Pages */
  SYSTEM_ERROR: {
    NAME: 'Lỗi',
    PATH: '/error/system-error',
  },
  URL_NOT_FOUND: {
    NAME: 'Lỗi',
    PATH: '/error/url-not-found',
  },
};

export default Page;
