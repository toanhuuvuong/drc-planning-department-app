import { QldhTransDonHangControllerSearchThongKe200Item } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';

const columns = [
  {
    dataField: FieldName.STT,
    text: 'STT',
    ...generateColumnStyle(),
    formatter: (_cell: any, _row: any, rowIndex: number) => rowIndex + 1,
  },
  {
    dataField: 'maSanPham',
    text: 'MÃ QC',
    ...generateColumnStyle(),
  },
  {
    dataField: 'tonKho',
    text: 'Tổng Tồn Kho',
    ...generateColumnStyle(),
  },
  {
    dataField: 'tenKhoXuat',
    text: 'Kho',
    ...generateColumnStyle(),
    formatter: (_: string, row: QldhTransDonHangControllerSearchThongKe200Item) => {
      return `${row.maKhoXuat || ''}:${row.tenKhoXuat || ''}`;
    },
  },
  {
    dataField: 'soLuong',
    text: 'Số lượng Tổng Đặt Hàng',
    ...generateColumnStyle(),
  },
  {
    dataField: 'soLuongGiuHang',
    text: 'Số lượng giữ hàng',
    ...generateColumnStyle(),
  },
  {
    dataField: 'tonDuKien',
    text: 'Tồn Dự Kiến',
    ...generateColumnStyle(),
  },
  {
    dataField: 'soLuongSanXuatThem',
    text: 'Số Lượng SX thêm',
    ...generateColumnStyle(),
  },
  {
    dataField: 'soLuongSanXuatBu',
    isDummyField: true,
    text: 'Số Lượng SX bù',
    ...generateColumnStyle(),
    formatter: (_: string, row: QldhTransDonHangControllerSearchThongKe200Item) => {
      const soLuong = Number(row.soLuong);
      const tonKho = Number(row.tonKho);
      return `${soLuong > tonKho ? soLuong - tonKho : 0}`;
    },
  },
  {
    dataField: 'soLuongNoiDia',
    text: 'Nội địa',
    ...generateColumnStyle(),
  },
  {
    dataField: 'soLuongNuocNgoai',
    text: 'Quốc tế',
    ...generateColumnStyle(),
  },
  {
    dataField: 'soLuongDonHangItem',
    text: 'Có bao nhiêu đơn hàng',
    ...generateColumnStyle(),
  },
  {
    dataField: 'soLuongNpp',
    text: 'Có bao nhiêu NPP',
    ...generateColumnStyle(),
  },
];

const tableConfig = {
  columns,
};

export default tableConfig;
