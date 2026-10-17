import { DmTransDinhMucCompareItem } from 'main/apis/drc/models';
import { Color } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';

const getColumns = (isLeft?: boolean) => [
  {
    dataField: FieldName.MA_THANH_PHAM,
    text: 'Mã thành phẩm',
    ...generateColumnStyle(undefined, true),
    formatter: (cell: string, row: DmTransDinhMucCompareItem) => {
      return formatCell(cell, row, isLeft);
    },
  },
  {
    dataField: FieldName.MA_ITEM,
    text: 'Mã NVL/BTP',
    ...generateColumnStyle(undefined, true),
    formatter: (cell: string, row: DmTransDinhMucCompareItem) => {
      return formatCell(cell, row, isLeft);
    },
  },
  {
    dataField: isLeft ? FieldName.DINH_MUC_VALUE1 : FieldName.DINH_MUC_VALUE2,
    text: 'Định mức',
    ...generateColumnStyle(undefined, true),
    formatter: (cell: string, row: DmTransDinhMucCompareItem) => {
      return formatCell(cell, row, isLeft);
    },
  },
];

const formatCell = (cellValue: any, compareItem: DmTransDinhMucCompareItem, isLeft?: boolean) => {
  const { dinhMucValue1, dinhMucValue2 } = compareItem;
  let cellColor;

  if (isLeft) {
    if (!dinhMucValue1) {
      return <div>-</div>;
    }
    if (!dinhMucValue2) {
      cellColor = Color.RED;
    } else if (dinhMucValue1 !== dinhMucValue2) {
      cellColor = Color.ORANGE;
    }
  } else {
    if (!dinhMucValue2) {
      return <div>-</div>;
    }
    if (!dinhMucValue1) {
      cellColor = Color.GREEN;
    } else if (dinhMucValue1 !== dinhMucValue2) {
      cellColor = Color.ORANGE;
    }
  }

  return <div style={{ color: cellColor, fontWeight: cellColor ? 'bold' : 'normal' }}>{cellValue}</div>;
};

const exportCSV = {
  fileName: `So-sánh-bộ-định-mức.csv`,
  exportAll: true,
  charset: 'utf-8',
};

const tableConfig = {
  getColumns,
  exportCSV,
};

export default tableConfig;
