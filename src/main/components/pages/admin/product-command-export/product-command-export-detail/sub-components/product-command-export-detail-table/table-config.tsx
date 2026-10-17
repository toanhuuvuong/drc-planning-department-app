import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';

const columns = [
  {
    dataField: FieldName.MA_SAN_PHAM,
    text: 'Mã sản phẩm',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.DVT,
    text: 'Đơn vị tính',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.YEU_CAU_XUAT,
    text: 'Yêu cầu',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.THUC_XUAT,
    text: 'Thực xuất',
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
