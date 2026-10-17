import { Page } from 'main/constants';

export type MenuPermission = {
  path: string;
  controller: string;
};

// Cần liệt kê hết các PATH ở được define ở router vào đây.
export const menuPermissions: MenuPermission[] = [
  /** Supplies Store Import Pages */
  { path: Page.SUPPLIES_STORE_IMPORT_LIST.PATH, controller: 'KhovtTransPhieuNhapController' },
  { path: Page.SUPPLIES_STORE_IMPORT_ADD.PATH, controller: 'KhovtTransPhieuNhapController' },
  { path: Page.SUPPLIES_STORE_IMPORT_DETAIL.PATH.replace('/:id', ''), controller: 'KhovtTransPhieuNhapController' },
  { path: Page.SUPPLIES_STORE_IMPORT_EDIT.PATH.replace('/:id', ''), controller: 'KhovtTransPhieuNhapController' },

  /** Supplies Store Export Pages */
  { path: Page.SUPPLIES_STORE_EXPORT_LIST.PATH, controller: 'KhovtTransPhieuXuatController' },
  { path: Page.SUPPLIES_STORE_EXPORT_ADD.PATH, controller: 'KhovtTransPhieuXuatController' },
  { path: Page.SUPPLIES_STORE_EXPORT_DETAIL.PATH.replace('/:id', ''), controller: 'KhovtTransPhieuXuatController' },

  /** Supplies Store Inventory Pages */
  { path: Page.SUPPLIES_STORE_INVENTORY_LIST.PATH, controller: 'KhovtXuatNhapTonController' },
  { path: Page.SUPPLIES_STORE_INVENTORY_WARNING.PATH, controller: 'KhovtXuatNhapTonController' },
  { path: Page.SUPPLIES_STORE_INVENTORY_DASHBOARD.PATH, controller: 'KhovtXuatNhapTonController' },
  { path: Page.SUPPLIES_STORE_INVENTORY_CARD.PATH, controller: 'KhovtXuatNhapTonController' },

  /** Supplies Management Pages */
  { path: Page.SUPPLIES_MANAGEMENT_LIST.PATH, controller: 'KhovtMasterVtController' },

  /** Supplies WareHouse Pages */
  { path: Page.SUPPLIES_WAREHOUSE_LIST.PATH, controller: 'KhovtMasterKhoController' },

  /** Supplies Group Pages */
  { path: Page.SUPPLIES_GROUP_LIST.PATH, controller: 'KhovtNhomController' },

  /** Supplies Origin Pages */
  { path: Page.SUPPLIES_ORIGIN_LIST.PATH, controller: 'KhovtMasterNguonGocController' },

  /** Product Store Import Pages */
  { path: Page.PRODUCT_STORE_IMPORT_LIST.PATH, controller: 'KhotpTransPhieuNhapController' },
  { path: Page.PRODUCT_STORE_IMPORT_ADD.PATH, controller: 'KhotpTransPhieuNhapController' },
  { path: Page.PRODUCT_STORE_IMPORT_DETAIL.PATH.replace('/:id', ''), controller: 'KhotpTransPhieuNhapController' },
  { path: Page.PRODUCT_STORE_IMPORT_EDIT.PATH.replace('/:id', ''), controller: 'KhotpTransPhieuNhapController' },

  /** Product Store Excel Pages */
  { path: Page.PRODUCT_STORE_EXCEL_LIST.PATH, controller: 'KhotpTransLenhNhapController' },
  { path: Page.PRODUCT_STORE_EXCEL_DETAIL.PATH.replace('/:id', ''), controller: 'KhotpTransLenhNhapController' },
  { path: Page.PRODUCT_STORE_EXCEL_EDIT.PATH.replace('/:id', ''), controller: 'KhotpTransLenhNhapController' },

  /** Product Store Export Pages */
  { path: Page.PRODUCT_STORE_EXPORT_LIST.PATH, controller: 'KhotpTransPhieuXuatController' },
  { path: Page.PRODUCT_STORE_EXPORT_ADD.PATH, controller: 'KhotpTransPhieuXuatController' },
  { path: Page.PRODUCT_STORE_EXPORT_DETAIL.PATH.replace('/:id', ''), controller: 'KhotpTransPhieuXuatController' },
  { path: Page.PRODUCT_STORE_EXPORT_EDIT.PATH.replace('/:id', ''), controller: 'KhotpTransPhieuXuatController' },

  /** Product Command Export Pages */
  { path: Page.PRODUCT_COMMAND_EXPORT_LIST.PATH, controller: 'KhotpTransLenhXuatController' },
  { path: Page.PRODUCT_COMMAND_EXPORT_DETAIL.PATH.replace('/:id', ''), controller: 'KhotpTransLenhXuatController' },
  { path: Page.PRODUCT_COMMAND_EXPORT_EDIT.PATH.replace('/:id', ''), controller: 'KhotpTransLenhXuatController' },

  /** Product Store Inventory Pages */
  { path: Page.PRODUCT_STORE_INVENTORY_LIST.PATH, controller: 'KhotpTransPhieuXuatController' },
  { path: Page.PRODUCT_STORE_INVENTORY_WARNING.PATH, controller: 'KhotpTransPhieuXuatController' },

  /** Order Management Pages */
  { path: Page.ORDER_DASHBOARD.PATH, controller: 'QldhTransDonHangController' },
  { path: Page.ORDER_MANAGEMENT_LIST.PATH, controller: 'QldhTransDonHangController' },
  { path: Page.ORDER_MANAGEMENT_WARNING.PATH, controller: 'QldhTransDonHangController' },
  { path: Page.ORDER_MANAGEMENT_ANALYTICS.PATH, controller: 'QldhTransDonHangController' },
  { path: Page.ORDER_MANAGEMENT_ADD.PATH, controller: 'QldhTransDonHangController' },
  { path: Page.ORDER_MANAGEMENT_DETAIL.PATH.replace('/:id', ''), controller: 'QldhTransDonHangController' },
  { path: Page.ORDER_MANAGEMENT_EDIT.PATH.replace('/:id', ''), controller: 'QldhTransDonHangController' },

  /** Product WareHouse Pages */
  { path: Page.PRODUCTS_WAREHOUSE_LIST.PATH, controller: 'KhotpMasterKhoController' },

  /** Product Enterprise Pages */
  { path: Page.PRODUCTS_ENTERPRISE_LIST.PATH, controller: 'KhotpMasterDonViController' },

  /** Product Group Pages */
  { path: Page.PRODUCTS_GROUP_LIST.PATH, controller: 'KhotpMasterNhomSpController' },

  /** Product Stocks Pages */
  { path: Page.PRODUCTS_STOCKS_LIST.PATH, controller: 'KhotpMasterSanPhamController' },

  /** Product Customer Pages */
  { path: Page.PRODUCTS_CUSTOMER_LIST.PATH, controller: 'KhotpMasterSanPhamController' },

  /** Product sales product Pages */
  { path: Page.PRODUCTS_SALES_GROUP_LIST.PATH, controller: 'KhotpMasterBtpController' },
  { path: Page.PRODUCTS_SEMI_FINISHED_LIST.PATH, controller: 'KhotpMasterNhomSpController' },

  /** Requirements Standard Set Pages */
  { path: Page.REQUIREMENTS_STANDARD_SET_LIST.PATH, controller: 'DmMasterBoDinhMucController' },
  { path: Page.REQUIREMENTS_STANDARD_SET_COMPARE.PATH, controller: 'DmMasterBoDinhMucController' },
  { path: Page.REQUIREMENTS_STANDARD_SET_DETAIL.PATH.replace('/:id', ''), controller: 'DmMasterBoDinhMucController' },

  /** Terms And Conditions Pages */
  { path: Page.TERMS_AND_CONDITIONS_LIST.PATH, controller: 'QdhdsdMasterTaiLieuController' },

  /** User Pages */
  { path: Page.USER_MANAGEMENT.PATH, controller: 'FUserController' },

  /** Title Pages */
  { path: Page.TITLE_MANAGEMENT.PATH, controller: 'FTitleController' },

  /** My-Profile Pages */
  { path: Page.MY_PROFILE.PATH, controller: 'FUserController' },
];
