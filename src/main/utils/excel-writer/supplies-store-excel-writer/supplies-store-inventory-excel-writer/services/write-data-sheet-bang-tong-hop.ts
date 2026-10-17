import ExcelJS from 'exceljs';
import { KhovtXuatNhapTonControllerFind200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import { DateFormat } from 'main/constants';
import { Moment } from 'moment';

const SHEET_RANGE_CONSTANTS = {
  originCell: [9, 1],
  columns: {
    STT: { alignment: { horizontal: 'center', vertical: 'middle' } },
    'MÃ VT': {},
    'TÊN VẬT TƯ': {},
    ĐVT: { alignment: { horizontal: 'center', vertical: 'middle' } },
    'Tồn Đầu Kỳ': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'Nhập Trong Kỳ': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'Xuất Trong Kỳ': { cellColIndex: 13, alignment: { horizontal: 'right', vertical: 'middle' } },
    'Tồn Cuối Kỳ': { cellColIndex: 20, alignment: { horizontal: 'right', vertical: 'middle' } },
    'Ghi chú': { cellColIndex: 21 },
  },
};

type JsonDataType = {
  [key in keyof typeof SHEET_RANGE_CONSTANTS.columns]: any;
};

export function writeDataSheetBangTongHop(
  workbook: ExcelJS.Workbook,
  data?: {
    filter?: ExportSuppliesISOReportFilter;
    items?: KhovtXuatNhapTonControllerFind200DataItem[];
  },
): void {
  if (!data) {
    return;
  }
  const { filter, items } = data;
  const sheetName = 'Bang Tong Hop';
  const worksheet = workbook.getWorksheet(sheetName);
  const originCell = SHEET_RANGE_CONSTANTS.originCell;
  const columns = SHEET_RANGE_CONSTANTS.columns;
  const jsonData = transformData(items);
  const headers = Object.keys(jsonData[0]);

  if (!worksheet || !filter) {
    throw new Error('Invalid template');
  }
  // Write data
  writeSectionSuppliesStore(worksheet, items?.[0]?.tenKho);
  writeSectionFromToDate(worksheet, filter.startDate, filter.endDate);
  writeSectionJsonData(worksheet, originCell, headers, columns, jsonData);
  writeSectionSumData(worksheet, originCell, columns, jsonData);
}

function transformData(data?: KhovtXuatNhapTonControllerFind200DataItem[]): JsonDataType[] {
  if (!data || data.length < 1) {
    throw new Error('Không tìm thấy');
  }
  return data.map((item, index) => ({
    STT: index + 1,
    'MÃ VT': item.maVt,
    'TÊN VẬT TƯ': item.tenVt,
    ĐVT: item.dvt,
    'Tồn Đầu Kỳ': item.tonKhoDauKy,
    'Nhập Trong Kỳ': item.soLuongNhapFromTo,
    'Xuất Trong Kỳ': item.soLuongXuatFromTo,
    'Tồn Cuối Kỳ': item.tonKhoCuoiKy,
    'Ghi chú': '',
  }));
}

function writeSectionSuppliesStore(worksheet: ExcelJS.Worksheet, suppliesStoreName?: string) {
  const cell = worksheet.getCell('A5');
  cell.value = `Tại: ${suppliesStoreName}`;
}

function writeSectionFromToDate(worksheet: ExcelJS.Worksheet, fromDate?: Moment, toDate?: Moment) {
  const fromDateCell = worksheet.getCell('E5');
  fromDateCell.value = fromDate?.format(DateFormat.DATE_ONLY_VN);
  const toDateCell = worksheet.getCell('M5');
  toDateCell.value = toDate?.format(DateFormat.DATE_ONLY_VN);
}

function writeSectionJsonData(
  worksheet: ExcelJS.Worksheet,
  originCell: number[],
  headers: any[],
  columns: any,
  jsonData: JsonDataType[],
) {
  jsonData.forEach((data, rowIndex) => {
    headers.forEach((key, colIndex) => {
      const cellColIndex = columns[key as keyof typeof columns].cellColIndex || originCell[1] + colIndex;
      const cellRowIndex = originCell[0] + rowIndex;
      const cell = worksheet.getCell(cellRowIndex, cellColIndex);
      cell.value = data[key as keyof typeof data];
      const alignment = columns[key as keyof typeof columns].alignment;
      if (alignment) {
        cell.style.alignment = alignment as Partial<ExcelJS.Alignment>;
      }
      cell.font = { bold: false };
      cell.style.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });
}

function writeSectionSumData(
  worksheet: ExcelJS.Worksheet,
  originCell: number[],
  columns: any,
  jsonData: JsonDataType[],
) {
  const cellSumNhapTrongKyColIndex = 6;
  const cellSumXuatTrongKyColIndex = 13;
  const cellSumRowIndex = originCell[0] + jsonData.length;

  // Sum Nhập Trong Kỳ
  const cellSumNhapTrongKy = worksheet.getCell(cellSumRowIndex, cellSumNhapTrongKyColIndex);
  cellSumNhapTrongKy.value = jsonData.reduce((sum, currentData) => sum + currentData['Nhập Trong Kỳ'], 0);
  cellSumNhapTrongKy.style.alignment = columns['Nhập Trong Kỳ'].alignment as Partial<ExcelJS.Alignment>;
  cellSumNhapTrongKy.font = { bold: true };
  cellSumNhapTrongKy.style.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  // Sum Xuất Trong Kỳ
  const cellSumXuatTrongKy = worksheet.getCell(cellSumRowIndex, cellSumXuatTrongKyColIndex);
  cellSumXuatTrongKy.value = jsonData.reduce((sum, currentData) => sum + currentData['Xuất Trong Kỳ'], 0);
  cellSumXuatTrongKy.style.alignment = columns['Xuất Trong Kỳ'].alignment as Partial<ExcelJS.Alignment>;
  cellSumXuatTrongKy.font = { bold: true };
  cellSumXuatTrongKy.style.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}
