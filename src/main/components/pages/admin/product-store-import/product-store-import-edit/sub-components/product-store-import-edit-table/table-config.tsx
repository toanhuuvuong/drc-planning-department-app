import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { cellDateFormatter, cellQuantityValidator, generateColumnStyle } from 'main/utils';
import { Type } from 'react-bootstrap-table2-editor';

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
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  /*
  {
    dataField: FieldName.TEN_SAN_PHAM,
    text: 'Tên sản phẩm',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.TEN_GOI_NHO,
    text: 'Tên gợi nhớ',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.DVT,
    text: 'Đơn vị tính',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  */
  {
    dataField: FieldName.SO_LUONG,
    text: 'Số lượng',
    ...generateColumnStyle(),
    validator: cellQuantityValidator(true),
  },
  {
    dataField: FieldName.THOI_HAN_LUU_KHO,
    text: 'Hạn lưu kho',
    //validator: cellDateValidator(true, DateFormat.DATE_ONLY),
    //editor: {
    //  type: Type.DATE,
    //},
    formatter: cellDateFormatter(DateFormat.MM_YYYY_VN),
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
  mode: 'dbclick',
  blurToSave: true,
};

const tableConfig = {
  columns,
  selectRow,
  cellEdit,
};

export default tableConfig;
