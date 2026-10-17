import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { cellDateFormatter, cellDateValidator, cellQuantityValidator, generateColumnStyle } from 'main/utils';
import { Type } from 'react-bootstrap-table2-editor';

const columns = [
  {
    dataField: FieldName.MA_VT,
    text: 'Mã vật tư',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.TEN_VT,
    text: 'Tên vật tư',
    editable: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.DVT,
    text: 'Đơn vị tính',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.NGAY_SX,
    text: 'Ngày sản xuất',
    ...generateColumnStyle(),
    validator: cellDateValidator(false, DateFormat.DATE_ONLY),
    editor: {
      type: Type.DATE,
    },
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.NGAY_HET_HAN,
    text: 'Hạn sử dụng',
    ...generateColumnStyle(),
    validator: cellDateValidator(true, DateFormat.DATE_ONLY),
    editor: {
      type: Type.DATE,
    },
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  // {
  //   dataField: FieldName.NGAY_THI_NGHIEM,
  //   text: 'Hạn thí nghiệm',
  //   ...generateColumnStyle(),
  //   validator: cellDateValidator(false, DateFormat.DATE_ONLY),
  //   editor: {
  //     type: Type.DATE,
  //   },
  //   formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  // },
  {
    dataField: FieldName.NGAY_HET_HAN_LK,
    text: 'Hạn lưu kho',
    ...generateColumnStyle(),
    validator: cellDateValidator(false, DateFormat.DATE_ONLY),
    editor: {
      type: Type.DATE,
    },
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.SO_LUONG,
    text: 'Số lượng',
    ...generateColumnStyle(),
    validator: cellQuantityValidator(true),
  },
  {
    dataField: FieldName.SO_LO,
    text: 'Mã lô',
    // editable: false, ticket KAN-376: V/v Loại bỏ đánh mã số lô tự động kho vật tư
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.GHI_CHU,
    text: 'Ghi chú 1',
    editor: {
      type: Type.TEXTAREA,
    },
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.GHI_CHU_2,
    text: 'Ghi chú 2',
    editor: {
      type: Type.TEXTAREA,
    },
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.GHI_CHU_3,
    text: 'Ghi chú 3',
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
