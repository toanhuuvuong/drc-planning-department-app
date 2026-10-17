import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';
import { calculateTonKhoDuKien } from 'main/utils/order-management-utils';

const columns = [
  {
    dataField: FieldName.MA_KHO_XUAT,
    text: 'Kho Xuất',
    width: 300,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.MA_SAN_PHAM,
    text: 'Mã sản phẩm',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.DVT,
    text: 'Đơn vị tính',
    ...generateColumnStyle(undefined, true),
    formatter: (_: string, row: any) => {
      return `${row?.sanPham?.dvt || ''}`;
    },
  },
  {
    dataField: FieldName.SO_LUONG,
    text: 'Số lượng',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.TON_KHO,
    text: 'Tồn kho hiện tại',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: 'soLuongGiuHang',
    text: 'Số lượng giữ hàng',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.TON_KHO_DU_KIEN,
    text: 'Tồn kho dự kiến',
    formatter: (_: string, row: any) => {
      return `${calculateTonKhoDuKien(row.soLuong, row.soLuongGiuHang, row.tonKho)}`;
    },
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.YEU_CAU_DONG_GOI,
    text: 'Yêu cầu đóng gói',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.GHI_CHU,
    text: 'Ghi chú đơn hàng',
    ...generateColumnStyle(undefined, true),
  },
];

const tableConfig = { columns };

export default tableConfig;
