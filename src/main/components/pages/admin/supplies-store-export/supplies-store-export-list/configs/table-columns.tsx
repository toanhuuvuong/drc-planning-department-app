import { KhovtTransPhieuXuatWithRelations } from 'main/apis/drc/models';
import { Page } from 'main/constants';
import { Link } from 'react-router-dom';

const tableColumns = [
  {
    dataField: 'soPhieu',
    text: 'Số phiếu xuất',
    sort: true,
  },
  {
    dataField: 'id',
    text: 'Mã vật tư',
    sort: true,
  },
  {
    dataField: 'khoXuat',
    text: 'Kho xuất',
    sort: true,
  },
  {
    dataField: 'khoNhap',
    text: 'Kho nhập',
    sort: true,
  },
  {
    dataField: 'nguoiTaoPhieu',
    text: 'Người tạo phiếu',
    sort: true,
  },
  {
    dataField: 'ngayXuat',
    text: 'Ngày xuất kho',
    sort: true,
  },
  {
    dataField: 'status',
    text: 'Trạng thái',
    sort: true,
  },
  {
    dataField: 'action',
    isDummyField: true,
    text: 'Thao tác',
    formatter: (_: any, row: KhovtTransPhieuXuatWithRelations) => {
      return <Link to={Page.SUPPLIES_STORE_EXPORT_DETAIL.PATH.replace(':id', String(row.id))}>Xem</Link>;
    },
  },
];

export default tableColumns;
