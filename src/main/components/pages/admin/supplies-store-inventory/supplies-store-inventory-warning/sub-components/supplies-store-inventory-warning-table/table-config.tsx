import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { cellDateFormatter, generateColumnStyle } from 'main/utils';

const columns = [
  {
    dataField: FieldName.SO_PHIEU_NHAP,
    text: 'Số phiếu nhập',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGAY_NHAP,
    text: 'Ngày nhập',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.NGAY_THI_NGHIEM,
    text: 'Ngày BCCL',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.TEN_NHA_SX,
    text: 'Đơn vị cung cấp',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TEN_KHO,
    text: 'Kho',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.MA_VT,
    text: 'Mã vật tư',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TEN_VT,
    text: 'Tên vật tư',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.DVT,
    text: 'Đơn vị tính',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.SO_LO,
    text: 'Mã số lô',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGAY_HET_HAN,
    text: 'Hạn sử dụng',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.NGAY_HET_HAN_LK,
    text: 'Hạn lưu kho',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.SO_LUONG,
    text: 'Số lượng tồn kho',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.STATUS,
    text: 'Trạng thái',
    sort: true,
    ...generateColumnStyle(),
  },
];

const tableConfig = {
  columns,
};

export default tableConfig;
