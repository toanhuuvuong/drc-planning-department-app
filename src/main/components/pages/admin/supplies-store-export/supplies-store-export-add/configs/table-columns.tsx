import { Button } from 'reactstrap';
import { suppliesExportBillVatTus } from '../supplies-store-export-add';

const tableColumns = [
  {
    dataField: 'maVatTu',
    text: 'Mã vật tư',
  },
  {
    dataField: 'tenVatTu',
    text: 'Tên vật tư',
  },
  {
    dataField: 'maSoLo',
    text: 'Mã số lô',
  },
  {
    dataField: 'nguonGoc',
    text: 'Nguồn gốc',
  },
  {
    dataField: 'soLuongYeuCau',
    text: 'Số lượng yêu cầu',
  },
  {
    dataField: 'soLuongThucXuat',
    text: 'Số lượng thực xuất',
  },
  {
    dataField: 'tonKhoHienTai',
    text: 'Tồn kho hiện tại',
  },
  {
    dataField: 'tonKhoDuKien',
    text: 'Tồn kho dự kiến',
  },
  {
    dataField: 'ngaySanXuat',
    text: 'Ngày sản xuất',
  },
  {
    dataField: 'hanSuDung',
    text: 'Hạn sử dụng',
  },
];

export const addSuppliesModalTableColumns = [
  {
    dataField: 'maNhom',
    text: 'Nhóm vật tư',
  },
  {
    dataField: 'maVatTu',
    text: 'Mã vật tư',
  },
  {
    dataField: 'dvt',
    text: 'Đơn vị tính',
  },
  {
    dataField: 'maLo',
    text: 'Mã lô',
  },
  {
    dataField: 'ngaySanXuat',
    text: 'Ngày sản xuất',
  },
  {
    dataField: 'hanSuDung',
    text: 'Hạn sử dụng',
  },
  {
    dataField: 'nguonGoc',
    text: 'Nguồn gốc',
  },
  {
    dataField: 'ngayNhapKho',
    text: 'Ngày nhập kho',
  },
  {
    dataField: 'thoiHanLuuKho',
    text: 'Thời hạn lưu kho',
  },
  {
    dataField: 'tonKhoHienTai',
    text: 'Tồn kho hiện tại',
  },
];

export default tableColumns;
