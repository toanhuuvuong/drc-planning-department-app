import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';

const columns = [
  {
    dataField: FieldName.ID,
    hidden: true,
  },
  {
    dataField: FieldName.MA_SAN_PHAM,
    text: 'Mã sản phẩm',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.SO_LUONG,
    text: 'Số lượng',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.GHI_CHU,
    text: 'Ghi chú',
    ...generateColumnStyle(undefined, true),
  },
];

const tableConfig = {
  columns,
};

export default tableConfig;
