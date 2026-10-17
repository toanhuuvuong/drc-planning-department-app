import { DateFormat, ValidationMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { cellQuantityValidator, generateColumnStyle } from 'main/utils';
import { cellRequiredValidator } from 'main/utils/cell-validator';
import moment from 'moment';
import { Type } from 'react-bootstrap-table2-editor';

const columns = [
  {
    dataField: FieldName.ID,
    hidden: true,
  },
  {
    dataField: FieldName.MA_VT,
    text: 'Mã vật tư',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.SO_LUONG_THUC_TE,
    text: 'Số lượng đã xuất',
    editable: false,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.SO_LUONG_TRA_HANG,
    text: 'Số lượng trả hàng',
    ...generateColumnStyle(),
    validator: (newValue: string, row: any, column: any) => {
      const quantityValidationResult = cellQuantityValidator(true)(newValue, row, column);
      if (quantityValidationResult !== true) {
        return quantityValidationResult;
      }

      if (Number(newValue) > Number(row.soLuongThucTe)) {
        return {
          valid: false,
          message: ValidationMessage.INVALID_SO_LUONG_TRA_HANG,
        };
      }

      return true;
    },
  },
  {
    dataField: FieldName.NGUOI_NHAN_HANG,
    text: 'Người nhận hàng',
    ...generateColumnStyle(),
    validator: cellRequiredValidator,
  },
  {
    dataField: FieldName.NGAY_TRA_HANG,
    text: 'Ngày trả hàng',
    formatter: (cell: string, _: any) => {
      return <div>{moment().format(DateFormat.DATE_ONLY_VN)}</div>;
    },
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.LY_DO_TRA_HANG,
    text: 'Lý do trả hàng',
    ...generateColumnStyle(),
    validator: cellRequiredValidator,
    editor: {
      type: Type.TEXTAREA,
    },
  },
];

const cellEdit = {
  mode: 'dbclick',
  blurToSave: true,
};

const tableConfig = {
  cellEdit,
  columns,
};

export default tableConfig;
