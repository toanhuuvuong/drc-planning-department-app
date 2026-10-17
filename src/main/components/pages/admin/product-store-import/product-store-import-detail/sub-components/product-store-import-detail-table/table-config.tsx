import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { cellDateFormatter, generateColumnStyle } from 'main/utils';

const columns = [
  {
    dataField: FieldName.SO_LO,
    text: 'Mã số lô',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.MA_SAN_PHAM,
    text: 'Mã sản phẩm',
    ...generateColumnStyle(undefined, true),
  },
  /*
  {
    dataField: FieldName.TEN_SAN_PHAM,
    text: 'Tên sản phẩm',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.TEN_GOI_NHO,
    text: 'Tên gợi nhớ',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.DVT,
    text: 'Đơn vị tính',
    ...generateColumnStyle(undefined, true),
  },
  */
  {
    dataField: FieldName.SO_LUONG,
    text: 'Số lượng',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.THOI_HAN_LUU_KHO,
    text: 'Hạn lưu kho',
    formatter: cellDateFormatter(DateFormat.MM_YYYY_VN),
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.GHI_CHU,
    text: 'Ghi chú',
    ...generateColumnStyle(undefined, true),
  },
];

const tableConfig = { columns };

export default tableConfig;
