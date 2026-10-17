import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'maSanPham',
    text: 'Mã sản phẩm',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'tenSanPham',
    text: 'Tên sản phẩm',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'dvt',
    text: 'Đơn vị tính',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'soLuongYc',
    text: 'Yêu cầu',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'soLuongXuat',
    text: 'Thực xuất',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'tonHienTai',
    text: 'Tồn kho hiện tại',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'tonKho',
    text: 'Tồn kho dự kiến',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.VI_TRI,
    text: 'Vị trí lưu kho',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'ngayNhap',
    text: 'Tháng sản xuất',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'thoiHanLuuKho',
    text: ' Thời hạn lưu kho',
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'ghiChu',
    text: 'Ghi chú',
    editable: false,
    ...generateColumnStyle(),
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
