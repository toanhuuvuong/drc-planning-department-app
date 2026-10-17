import { FieldName } from 'main/constants/enums';
import { cellQuantityValidator, generateColumnStyle } from 'main/utils';
import { Type } from 'react-bootstrap-table2-editor';

const columns = [
  {
    dataField: FieldName.MA_SAN_PHAM,
    text: 'Mã sản phẩm',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.DVT,
    text: 'Đơn vị tính',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.YEU_CAU_XUAT,
    text: 'Yêu cầu',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.THUC_XUAT,
    text: 'Thực xuất',
    ...generateColumnStyle(),
    validator: cellQuantityValidator(false),
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
  mode: 'dbclick',
  blurToSave: true,
};

const tableConfig = {
  columns,
  selectRow,
  cellEdit,
};

export default tableConfig;
