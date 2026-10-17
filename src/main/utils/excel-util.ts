import moment from 'moment';
import { WorkBook, utils } from 'xlsx';

const ExcelUtil = {
  normalizeCellData(data?: string, dateNF?: string) {
    const normalizedData = data ? String(data).trim() : '';
    if (!dateNF) {
      return normalizedData;
    }
    return normalizedData ? moment(normalizedData).format(dateNF).toString() : '';
  },
  getSheetRange(workbook: WorkBook, sheetName: string) {
    const worksheet = workbook.Sheets[sheetName];
    const sheetRange = worksheet?.['!ref'];
    if (!sheetRange) {
      throw new Error('Can not get sheet range, please check the input data file.');
    }
    return utils.decode_range(sheetRange);
  },
  loadDataByRange(
    workbook: WorkBook,
    sheetName: string,
    range: {
      colBeginIndex: number;
      rowBeginIndex: number;
      colEndIndex: number;
      rowEndIndex: number;
    },
  ): string[][] {
    const worksheet = workbook.Sheets[sheetName];
    return utils.sheet_to_json(worksheet, {
      range: {
        s: { c: range.colBeginIndex, r: range.rowBeginIndex },
        e: { c: range.colEndIndex, r: range.rowEndIndex },
      },
      raw: true,
      rawNumbers: true,
      header: 1,
      defval: null,
    });
  },
  columnToLetter(column: number) {
    let temp;
    let letter = '';
    while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = (column - temp - 1) / 26;
    }
    return letter;
  },
  letterToColumn(letter: string) {
    let column = 0;
    const length = letter.length;
    for (let i = 0; i < length; i++) {
      column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
  },
};

export default ExcelUtil;
