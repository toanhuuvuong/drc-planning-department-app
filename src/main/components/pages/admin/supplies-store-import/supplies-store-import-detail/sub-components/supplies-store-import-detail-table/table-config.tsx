import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { cellDateFormatter, generateColumnStyle } from 'main/utils';

const columns = [
  {
    dataField: FieldName.MA_VT,
    text: 'Mã vật tư',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.TEN_VT,
    text: 'Tên vật tư',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.DVT,
    text: 'Đơn vị tính',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.NGAY_SX,
    text: 'Ngày sản xuất',
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.NGAY_HET_HAN,
    text: 'Hạn sử dụng',
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
    ...generateColumnStyle(undefined, true),
  },
  // {
  //   dataField: FieldName.NGAY_THI_NGHIEM,
  //   text: 'Hạn thí nghiệm',
  //   formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  //   ...generateColumnStyle(undefined, true),
  // },
  {
    dataField: FieldName.NGAY_HET_HAN_LK,
    text: 'Hạn lưu kho',
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.SO_LUONG,
    text: 'Số lượng',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.SO_LO,
    text: 'Mã số lô',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.GHI_CHU,
    text: 'Ghi chú 1',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.GHI_CHU_2,
    text: 'Ghi chú 2',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.GHI_CHU_3,
    text: 'Ghi chú 3',
    ...generateColumnStyle(undefined, true),
  },
];

const tableConfig = { columns };

export default tableConfig;
