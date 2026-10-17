const Page = {
  /** Dashboard Pages */
  DASHBOARD: {
    NAME: 'Dashboard',
    PATH: '/admin/dashboard',
  },

  /** Authentication Pages */
  LOGIN: {
    TITLE: 'Đăng nhập',
    NAME: 'Đăng nhập',
    PATH: '/auth/login',
  },

  /** Supplies Store Import Pages */
  SUPPLIES_STORE_IMPORT_LIST: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Quản lý nhập kho vật tư',
    NAME: 'Tổng hợp nhập vật tư',
    PATH: '/admin/supplies-store-import/list',
  },
  SUPPLIES_STORE_IMPORT_ADD: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Quản lý nhập kho vật tư',
    NAME: 'Tạo phiếu nhập',
    PATH: '/admin/supplies-store-import/add',
  },
  SUPPLIES_STORE_IMPORT_DETAIL: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Quản lý nhập kho vật tư',
    NAME: 'Chi tiết phiếu nhập',
    PATH: '/admin/supplies-store-import/detail/:id',
  },
  SUPPLIES_STORE_IMPORT_EDIT: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Quản lý nhập kho vật tư',
    NAME: 'Sửa phiếu nhập',
    PATH: '/admin/supplies-store-import/edit/:id',
  },

  /** Supplies Store Export Pages */
  SUPPLIES_STORE_EXPORT_LIST: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Quản lý xuất kho vật tư',
    NAME: 'Tổng hợp xuất vật tư',
    PATH: '/admin/supplies-store-export/list',
  },
  SUPPLIES_STORE_EXPORT_ADD: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Quản lý xuất kho vật tư',
    NAME: 'Tạo phiếu xuất',
    PATH: '/admin/supplies-store-export/add',
  },
  SUPPLIES_STORE_EXPORT_DETAIL: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Quản lý xuất kho vật tư',
    NAME: 'Chi tiết phiếu xuất',
    PATH: '/admin/supplies-store-export/detail/:id',
  },

  /** Supplies Store Inventory Pages */
  SUPPLIES_STORE_INVENTORY_LIST: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Quản lý tồn kho vật tư',
    NAME: 'Tổng hợp xuất nhập tồn',
    PATH: '/admin/supplies-store-inventory/list',
  },
  SUPPLIES_STORE_INVENTORY_WARNING: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Cảnh báo hạn lưu kho',
    NAME: 'Cảnh báo hạn lưu kho',
    PATH: '/admin/supplies-store-inventory/warning',
  },
  SUPPLIES_STORE_INVENTORY_DASHBOARD: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Quản lý tồn kho vật tư',
    NAME: 'Dashboard tổng hợp tồn kho',
    PATH: '/admin/supplies-store-inventory/dashboard',
  },
  SUPPLIES_STORE_INVENTORY_CARD: {
    CATEGORY: 'Quản lý kho vật tư',
    TITLE: 'Quản lý tồn kho vật tư',
    NAME: 'Tổng hợp thẻ kho',
    PATH: '/admin/supplies-store-inventory/card',
  },

  /** Supplies Management Pages */
  SUPPLIES_MANAGEMENT_LIST: {
    CATEGORY: 'Danh mục vật tư',
    TITLE: 'Quản lý vật tư',
    NAME: 'Quản lý vật tư',
    PATH: '/admin/supplies-management/list',
  },

  /** Supplies WareHouse Pages */
  SUPPLIES_WAREHOUSE_LIST: {
    CATEGORY: 'Danh mục vật tư',
    TITLE: 'Quản lý kho vật tư',
    NAME: 'Quản lý kho vật tư',
    PATH: '/admin/supplies-warehouse/list',
  },

  /** Supplies Group Pages */
  SUPPLIES_GROUP_LIST: {
    CATEGORY: 'Danh mục vật tư',
    TITLE: 'Quản lý nhóm vật tư',
    NAME: 'Quản lý nhóm vật tư',
    PATH: '/admin/supplies-group/list',
  },

  /** Supplies Origin Pages */
  SUPPLIES_ORIGIN_LIST: {
    CATEGORY: 'Danh mục vật tư',
    TITLE: 'Quản lý nhà cung cấp',
    NAME: 'Quản lý nhà cung cấp',
    PATH: '/admin/supplies-origin/list',
  },

  /** Product Store Import Pages */
  PRODUCT_STORE_IMPORT_LIST: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý nhập kho sản phẩm',
    NAME: 'Tổng hợp nhập sản phẩm',
    PATH: '/admin/product-store-import/list',
  },
  PRODUCT_STORE_IMPORT_ADD: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý nhập kho sản phẩm',
    NAME: 'Tạo phiếu nhập',
    PATH: '/admin/product-store-import/add',
  },
  PRODUCT_STORE_IMPORT_DETAIL: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý nhập kho sản phẩm',
    NAME: 'Chi tiết phiếu nhập',
    PATH: '/admin/product-store-import/detail/:id',
  },
  PRODUCT_STORE_IMPORT_EDIT: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý nhập kho sản phẩm',
    NAME: 'Sửa phiếu nhập',
    PATH: '/admin/product-store-import/edit/:id',
  },

  /** Product Store Excel Pages */
  PRODUCT_STORE_EXCEL_LIST: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý lệnh nhập kho',
    NAME: 'Tổng hợp lệnh nhập',
    PATH: '/admin/product-store-excel/list',
  },
  PRODUCT_STORE_EXCEL_DETAIL: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý lệnh nhập kho',
    NAME: 'Chi tiết lệnh nhập',
    PATH: '/admin/product-store-excel/detail/:id',
  },
  PRODUCT_STORE_EXCEL_EDIT: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý lệnh nhập kho',
    NAME: 'Sửa lệnh nhập',
    PATH: '/admin/product-store-excel/edit/:id',
  },

  /** Product Store Export Pages */
  PRODUCT_STORE_EXPORT_LIST: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Tổng hợp xuất sản phẩm',
    NAME: 'Danh sách sản phẩm',
    PATH: '/admin/product-store-export/list',
  },
  PRODUCT_STORE_EXPORT_ADD: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Tổng hợp xuất sản phẩm',
    NAME: 'Tạo phiếu xuất',
    PATH: '/admin/product-store-export/add',
  },
  PRODUCT_STORE_EXPORT_DETAIL: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Tổng hợp xuất sản phẩm',
    NAME: 'Chi tiết phiếu xuất',
    PATH: '/admin/product-store-export/detail/:id',
  },
  PRODUCT_STORE_EXPORT_EDIT: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Tổng hợp xuất sản phẩm',
    NAME: 'Sửa phiếu xuất',
    PATH: '/admin/product-store-export/edit/:id',
  },

  /** Product Command Export Pages */
  PRODUCT_COMMAND_EXPORT_LIST: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý lệnh xuất kho',
    NAME: 'Tổng hợp lệnh xuất',
    PATH: '/admin/product-command-export/list',
  },
  PRODUCT_COMMAND_EXPORT_DETAIL: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý lệnh xuất kho',
    NAME: 'Chi tiết lệnh xuất',
    PATH: '/admin/product-command-export/detail/:id',
  },
  PRODUCT_COMMAND_EXPORT_EDIT: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý lệnh xuất kho',
    NAME: 'Sửa lệnh xuất',
    PATH: '/admin/product-command-export/edit/:id',
  },

  /** Product Store Inventory Pages */
  PRODUCT_STORE_INVENTORY_LIST: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Quản lý tồn kho sản phẩm',
    NAME: 'Tổng hợp xuất nhập tồn',
    PATH: '/admin/product-store-inventory/list',
  },
  PRODUCT_STORE_INVENTORY_WARNING: {
    CATEGORY: 'Quản lý kho sản phẩm',
    TITLE: 'Cảnh báo hạn lưu kho',
    NAME: 'Cảnh báo hạn lưu kho',
    PATH: '/admin/product-store-inventory/warning',
  },

  /** Order Management Pages */
  ORDER_DASHBOARD: {
    CATEGORY: 'Đơn đặt hàng',
    TITLE: 'Dashboard đơn đặt hàng',
    NAME: 'Dashboard đơn đặt hàng',
    PATH: '/admin/order-management/dashboard',
  },
  ORDER_MANAGEMENT_LIST: {
    CATEGORY: 'Đơn đặt hàng',
    TITLE: 'Quản lý đơn hàng',
    NAME: 'Quản lý đơn hàng',
    PATH: '/admin/order-management/list',
  },
  ORDER_MANAGEMENT_WARNING: {
    CATEGORY: 'Đơn đặt hàng',
    TITLE: 'Cảnh báo đơn hàng',
    NAME: 'Cảnh báo đơn hàng',
    PATH: '/admin/order-management/warning',
  },
  ORDER_MANAGEMENT_ANALYTICS: {
    CATEGORY: 'Đơn đặt hàng',
    TITLE: 'Thống kê đơn hàng',
    NAME: 'Thống kê đơn hàng',
    PATH: '/admin/order-management/analytics',
  },
  ORDER_MANAGEMENT_ADD: {
    CATEGORY: 'Đơn đặt hàng',
    TITLE: 'Quản lý đơn hàng',
    NAME: 'Tạo đơn hàng',
    PATH: '/admin/order-management/add',
  },
  ORDER_MANAGEMENT_DETAIL: {
    CATEGORY: 'Đơn đặt hàng',
    TITLE: 'Quản lý đơn hàng',
    NAME: 'Xem đơn hàng',
    PATH: '/admin/order-management/detail/:id',
  },
  ORDER_MANAGEMENT_EDIT: {
    CATEGORY: 'Đơn đặt hàng',
    TITLE: 'Quản lý đơn hàng',
    NAME: 'Sửa đơn hàng',
    PATH: '/admin/order-management/edit/:id',
  },

  /** Product WareHouse Pages */
  PRODUCTS_WAREHOUSE_LIST: {
    CATEGORY: 'Danh mục sản phẩm',
    TITLE: 'Quản lý kho thành phẩm',
    NAME: 'Quản lý kho thành phẩm',
    PATH: '/admin/product-warehouse/list',
  },

  /** Product Enterprise Pages */
  PRODUCTS_ENTERPRISE_LIST: {
    CATEGORY: 'Danh mục sản phẩm',
    TITLE: 'Quản lý đơn vị xí nhiệp',
    NAME: 'Quản lý đơn vị xí nhiệp',
    PATH: '/admin/product-enterprise/list',
  },

  /** Product Group Pages */
  PRODUCTS_GROUP_LIST: {
    CATEGORY: 'Danh mục sản phẩm',
    TITLE: 'Quản lý nhóm sản phẩm',
    NAME: 'Quản lý nhóm sản phẩm',
    PATH: '/admin/product-group/list',
  },

  /** Product Stocks Pages */
  PRODUCTS_STOCKS_LIST: {
    CATEGORY: 'Danh mục sản phẩm',
    TITLE: 'Quản lý sản phẩm',
    NAME: 'Quản lý sản phẩm',
    PATH: '/admin/product/list',
  },

  /** Product Customer Pages */
  PRODUCTS_CUSTOMER_LIST: {
    CATEGORY: 'Danh mục sản phẩm',
    TITLE: 'Quản lý khách hàng',
    NAME: 'Quản lý khách hàng',
    PATH: '/admin/product-customer/list',
  },

  /** Product sales product Pages */
  PRODUCTS_SALES_GROUP_LIST: {
    CATEGORY: 'Danh mục sản phẩm',
    TITLE: 'Quản lý nhóm bán thành phẩm',
    NAME: 'Quản lý nhóm bán thành phẩm',
    PATH: '/admin/product-semi-finished-group/list',
  },

  PRODUCTS_SEMI_FINISHED_LIST: {
    CATEGORY: 'Danh mục sản phẩm',
    TITLE: 'Quản lý bán thành phẩm',
    NAME: 'Quản lý bán thành phẩm',
    PATH: '/admin/product-semi-finished/list',
  },

  /** Requirements Standard Set Pages */
  REQUIREMENTS_STANDARD_SET_LIST: {
    CATEGORY: 'Quản lý định mức',
    TITLE: 'Quản lý định mức',
    NAME: 'Quản lý bộ định mức',
    PATH: '/admin/requirements-standard-set/list',
  },
  REQUIREMENTS_STANDARD_SET_COMPARE: {
    CATEGORY: 'Quản lý định mức',
    TITLE: 'Quản lý định mức',
    NAME: 'So sánh bộ định mức',
    PATH: '/admin/requirements-standard-set/compare',
  },
  REQUIREMENTS_STANDARD_SET_DETAIL: {
    CATEGORY: 'Quản lý định mức',
    TITLE: 'Quản lý định mức',
    NAME: 'Chi tiết bộ định mức',
    PATH: '/admin/requirements-standard-set/detail/:id',
  },

  /** Terms And Conditions Pages */
  TERMS_AND_CONDITIONS_LIST: {
    CATEGORY: 'Quy đinh - Hướng dẫn',
    TITLE: 'Quy định và hướng dẫn sử dụng',
    NAME: 'Quy định và hướng dẫn sử dụng',
    PATH: '/admin/terms-and-conditions/list',
  },

  /** User Pages */
  USER_MANAGEMENT: {
    CATEGORY: 'Hệ thống',
    TITLE: 'Quản lý người dùng',
    NAME: 'Quản lý người dùng',
    PATH: '/admin/system/user',
  },

  /** Title Pages */
  TITLE_MANAGEMENT: {
    CATEGORY: 'Hệ thống',
    TITLE: 'Quản lý chức danh',
    NAME: 'Quản lý chức danh',
    PATH: '/admin/system/title',
  },

  /** My-Profile Pages */
  MY_PROFILE: {
    CATEGORY: 'Hệ thống',
    TITLE: 'Hồ sơ của tôi',
    NAME: 'Hồ sơ của tôi',
    PATH: '/admin/my-profile',
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
  ACCESS_DENIED: {
    NAME: 'Lỗi',
    PATH: '/error/access-denied',
  },
};

export default Page;
