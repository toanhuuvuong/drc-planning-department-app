import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';
import { Type } from 'react-bootstrap-table2-editor';

const columns = [
  {
    dataField: FieldName.ID,
    hidden: true,
  },
  {
    dataField: FieldName.MA_SAN_PHAM,
    text: 'Mã sản phẩm',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.SO_LUONG,
    text: 'Số lượng',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.GHI_CHU,
    text: 'Ghi chú',
    editor: {
      type: Type.TEXTAREA,
    },
    ...generateColumnStyle(),
  },
];

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  clickToEdit: true,
  style: { backgroundColor: '#c8e6c9' },
};

const cellEdit = {
  mode: 'click',
  blurToSave: true,
};

const tableConfig = {
  columns,
  selectRow,
  cellEdit,
};

export default tableConfig;
