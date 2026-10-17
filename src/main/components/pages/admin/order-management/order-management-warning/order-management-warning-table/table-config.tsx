import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { cellDateFormatter, generateColumnStyle } from 'main/utils';

const columns = [
  {
    dataField: FieldName.STT,
    text: 'STT',
    ...generateColumnStyle(),
    formatter: (_cell: any, _row: any, rowIndex: number) => rowIndex + 1,
  },
  {
    dataField: FieldName.DON_HANG_ID,
    text: 'ID đơn hàng',
    ...generateColumnStyle(),
  },
  {
    dataField: 'tenKH',
    text: 'Tên NPP',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGAY_DAT_HANG,
    text: 'Ngày đặt hàng',
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.MM_YYYY_VN),
  },
  {
    dataField: FieldName.NGAY_GIAO_THUC_TE,
    text: 'Ngày giao hàng thực tế',
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.MM_YYYY_VN),
  },
  {
    dataField: FieldName.SO_LUONG,
    text: 'Số lượng đặt hàng',
    ...generateColumnStyle(),
  },
  {
    dataField: 'trangThai',
    text: 'Trạng thái',
    ...generateColumnStyle(),
  },
];

const tableConfig = {
  columns,
};

export default tableConfig;
