import { ProductStoreExportInfo } from 'main/components/pages/admin/product-store-export/product-store-export-add/use-product-store-export-add';
import { Color, ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';

const disableColumnStyle = () => ({
  backgroundColor: Color.LIGHT_GRAY,
});

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    editable: false,
    style: disableColumnStyle,
  },
  {
    dataField: FieldName.MA_SAN_PHAM,
    text: 'Mã sản phẩm',
    editable: false,
    style: disableColumnStyle,
  },
  {
    dataField: FieldName.TEN_SAN_PHAM,
    text: 'Tên sản phẩm',
    editable: false,
    style: disableColumnStyle,
  },
  {
    dataField: FieldName.DVT,
    // dataField: 'donViTinh',
    text: 'Đơn vị tính',
    editable: false,
    style: disableColumnStyle,
  },

  // {
  //   dataField: 'soLuongYc',
  //   text: 'Yêu cầu',
  // },
  // {
  //   dataField: 'soLuongXuat',
  //   text: 'Thực xuất',
  //   editable: true,
  // },
  {
    dataField: 'soLuongYc',
    text: 'Yêu cầu',
    validator: (newValue: string, row: any, column: any) => {
      if (!newValue) {
        return {
          valid: false,
          message: ValidationMessage.REQUIRED,
        };
      }

      const numberValue = Number(newValue);
      if (Number.isNaN(numberValue) || numberValue <= 0) {
        return {
          valid: false,
          message: ValidationMessage.INVALID_POSITIVE_NUMBER,
        };
      }
      return true;
    },
  },
  {
    dataField: 'soLuongXuat',
    text: 'Thực xuất',
    validator: (newValue: string, row: any, column: any) => {
      if (!newValue) {
        return {
          valid: false,
          message: ValidationMessage.REQUIRED,
        };
      }

      const numberValue = Number(newValue);
      if (Number.isNaN(numberValue) || numberValue <= 0) {
        return {
          valid: false,
          message: ValidationMessage.INVALID_POSITIVE_NUMBER,
        };
      }

      //TODO add
      if (numberValue > Number(row.tonHienTai)) {
        return {
          valid: false,
          message: ValidationMessage.INVALID_SO_LUONG_THUC_XUAT,
        };
      }

      return true;
    },
  },

  {
    dataField: 'tonHienTai',
    text: 'Tồn kho hiện tại',
    editable: false,
    style: disableColumnStyle,
  },
  {
    dataField: 'tonKho',
    text: 'Tồn kho dự kiến',
    editable: false,
    style: disableColumnStyle,
    formatter: (_: string, row: ProductStoreExportInfo) => {
      return `${Number(row.tonHienTai) - Number(row.soLuongXuat)}`;
    },
  },
  {
    dataField: FieldName.VI_TRI,
    text: 'Vị trí lưu kho',
    editable: false,
    style: disableColumnStyle,
  },
  {
    dataField: 'ngayNhap',
    text: 'Tháng nhập kho',
    editable: false,
    style: disableColumnStyle,
    // formatter: (cell: string, _: any) => {
    //   if (!cell) {
    //     return null;
    //   }
    //   return <div>{moment(cell).format(DateFormat.MM_YYYY_VN)}</div>;
    // },
    // ...generateColumnStyle(),
  },
  {
    // dataField: 'ThoiHanLuuKho',
    dataField: 'ThoiHanLuuKho',
    text: 'Hạn lưu kho',
    editable: false,
    style: disableColumnStyle,
    // formatter: (cell: string, _: any) => {
    //   if (!cell) {
    //     return null;
    //   }
    //   return <div>{moment(cell).format(DateFormat.MM_YYYY_VN)}</div>;
    // },
    // ...generateColumnStyle(),
  },
  {
    dataField: 'ghiChu',
    text: 'Ghi chú',
  },
];

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  clickToEdit: true,
  style: { backgroundColor: '#c8e6c9' },
};

const cellEdit = {
  mode: 'dbclick',
  blurToSave: true,
};

const tableConfig = {
  columns,
  selectRow,
  cellEdit,
};

export default tableConfig;
