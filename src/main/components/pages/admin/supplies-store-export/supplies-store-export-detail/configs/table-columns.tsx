import { Button } from 'reactstrap';
import { suppliesExportBillVatTus } from '../supplies-store-export-detail';

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
  {
    dataField: 'action',
    isDummyField: true,
    text: 'Thao tác',
    formatter: (_: any, row: (typeof suppliesExportBillVatTus)[0]) => {
      return (
        <Button onClick={(e) => console.log(row.maVatTu)} size="sm">
          Xóa
        </Button>
      );
    },
  },
];

export default tableColumns;
