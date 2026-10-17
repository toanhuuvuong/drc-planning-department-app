import ExcelJS from 'exceljs';
import { KhovtXuatNhapTonControllerFindDetailBySoPhieu200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import { DateFormat } from 'main/constants';
import moment, { Moment } from 'moment';

const SHEET_RANGE_CONSTANTS = {
  originCell: [7, 1],
  columns: {
    'Ngày giao dịch': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'Số phiếu': {},
    'Diễn giải': {},
    Nhập: { alignment: { horizontal: 'right', vertical: 'middle' } },
    Xuất: { alignment: { horizontal: 'right', vertical: 'middle' } },
    Tồn: { alignment: { horizontal: 'right', vertical: 'middle' } },
  },
};

type JsonDataType = {
  [key in keyof typeof SHEET_RANGE_CONSTANTS.columns]: any;
};

type JsonDataMapInfoType = {
  Org: string | undefined;
  Sub: string | undefined;
  'Mã vật tư': string | undefined;
  'Tên vật tư': string | undefined;
  'Đơn vị tính': string | undefined;
};

type JsonDataMapSumInfoType = {
  'Tồn đầu': number;
  'Tồn cuối kỳ': number;
  'Tổng phát sinh': number; // Tổng nhập - Tổng xuất
};

type JsonDataMapType = {
  [keyMap: string]: JsonDataMapInfoType &
    JsonDataMapSumInfoType & {
      items: JsonDataType[];
    };
};

export function writeDataSheetTheKho(
  workbook: ExcelJS.Workbook,
  data?: {
    filter?: ExportSuppliesISOReportFilter;
    items?: KhovtXuatNhapTonControllerFindDetailBySoPhieu200DataItem[];
  },
): void {
  if (!data) {
    return;
  }
  const { filter, items } = data;
  const sheetName = 'Thẻ Kho';
  const worksheet = workbook.getWorksheet(sheetName);
  const originCell = SHEET_RANGE_CONSTANTS.originCell;
  const columns = SHEET_RANGE_CONSTANTS.columns;
  const jsonDataMap = transformData(items);
  const headers = Object.keys(Object.values(jsonDataMap)[0].items[0]);

  if (!worksheet || !filter) {
    throw new Error('Invalid template');
  }
  // Write data
  writeSectionFromToDate(worksheet, filter.startDate, filter.endDate);
  const lastRowMapIndex = writeSectionJsonDataMap(worksheet, originCell, headers, columns, jsonDataMap);
  writeSectionFooter(worksheet, [lastRowMapIndex + 1, originCell[1]]);
}

function transformData(data?: KhovtXuatNhapTonControllerFindDetailBySoPhieu200DataItem[]): JsonDataMapType {
  if (!data || data.length < 1) {
    throw new Error('Không tìm thấy');
  }

  // Group data by MÃ VT & MÃ KHO
  const dataMap: JsonDataMapType = {};
  for (const item of data) {
    const mapKey = `${item.maVt}_${item.maKho}`;
    if (!dataMap.hasOwnProperty(mapKey)) {
      const sumTonKhoFromTo = { current: Number(item.tonKhoDauKy) };
      // Add new group info
      dataMap[mapKey] = {
        Org: '110 - Tổng kho vật tư công ty',
        Sub: `${item.maKhoNhapXuat} - ${item.tenKho}`,
        'Mã vật tư': item.maVt,
        'Tên vật tư': item.tenVt,
        'Đơn vị tính': item.dvt,
        'Tồn đầu': Number(item.tonKhoDauKy),
        'Tồn cuối kỳ': Number(item.tonKhoCuoiKy),
        'Tổng phát sinh': Number(item.tongPhatSinh),
        items:
          item.xntDetails?.map((xntDetail) => {
            sumTonKhoFromTo.current += Number(xntDetail.tonKhoFromTo);
            return {
              'Ngày giao dịch': moment(xntDetail.ngayNhapXuat).format(DateFormat.DATE_ONLY_VN),
              'Số phiếu': xntDetail.soPhieuNhapXuat,
              'Diễn giải': '',
              Nhập: xntDetail.soLuongNhapFromTo,
              Xuất: xntDetail.soLuongXuatFromTo,
              Tồn: sumTonKhoFromTo.current,
            };
          }) || [],
      };
    }
  }

  return dataMap;
}

function writeSectionFromToDate(worksheet: ExcelJS.Worksheet, fromDate?: Moment, toDate?: Moment) {
  const cell = worksheet.getCell('A5');
  cell.value = `Từ ngày ${fromDate?.format(DateFormat.DATE_ONLY_VN)} đến ngày ${toDate?.format(DateFormat.DATE_ONLY_VN)}`;
}

function writeSectionJsonDataMap(
  worksheet: ExcelJS.Worksheet,
  originCell: number[],
  headers: any[],
  columns: any,
  jsonDataMap: JsonDataMapType,
) {
  let currentRowMapIndex = originCell[0];
  for (const dataMapKey in jsonDataMap) {
    const {
      items: dataMapItems,
      'Tồn đầu': tonDau,
      'Tồn cuối kỳ': tonCuoiKy,
      'Tổng phát sinh': tongPhatSinh,
      ...dataMapInfo
    } = jsonDataMap[dataMapKey];

    // Write group info
    writeSectionJsonDataMapInfo(worksheet, [currentRowMapIndex, originCell[1]], dataMapInfo);

    // Write group item data
    writeSectionJsonDataMapItems(
      worksheet,
      [currentRowMapIndex + 6, originCell[1]],
      headers,
      columns,
      { 'Tồn đầu': tonDau, 'Tồn cuối kỳ': tonCuoiKy, 'Tổng phát sinh': tongPhatSinh },
      dataMapItems,
    );

    // Go to next group index
    currentRowMapIndex += dataMapItems.length + 11;
  }
  return currentRowMapIndex;
}

function writeSectionJsonDataMapInfo(
  worksheet: ExcelJS.Worksheet,
  originCell: number[],
  dataMapInfo: JsonDataMapInfoType,
) {
  let rowIndex = 0;
  for (const key in dataMapInfo) {
    const cellColIndex = originCell[1];
    const cellRowIndex = originCell[0] + rowIndex++;
    worksheet.mergeCells(cellRowIndex, cellColIndex, cellRowIndex, cellColIndex + 5);
    const cell = worksheet.getCell(cellRowIndex, cellColIndex);
    cell.value = `${key}: ${dataMapInfo[key as keyof typeof dataMapInfo]}`;
    cell.font = { size: 11 };
  }
}

function writeSectionJsonDataMapItems(
  worksheet: ExcelJS.Worksheet,
  originCell: number[],
  headers: any[],
  columns: any,
  dataMapInfo: JsonDataMapSumInfoType,
  dataMapItems: JsonDataType[],
) {
  // Table header
  writeSectionJsonDataMapHeader(worksheet, originCell, headers);

  // Tồn đầu kỳ
  writeSectionTonDauKy(worksheet, [originCell[0] + 2, originCell[1]], dataMapInfo['Tồn đầu']);

  // Table data
  writeSectionJsonDataItems(worksheet, [originCell[0] + 3, originCell[1]], headers, columns, dataMapItems);

  // Tổng phát sinh
  writeSectionTongPhatSinh(
    worksheet,
    [originCell[0] + dataMapItems.length + 3, originCell[1]],
    dataMapInfo['Tổng phát sinh'],
  );

  // Tồn cuối kỳ
  writeSectionTonCuoiKy(
    worksheet,
    [originCell[0] + dataMapItems.length + 4, originCell[1]],
    dataMapInfo['Tồn cuối kỳ'],
  );
}

function writeSectionJsonDataMapHeader(worksheet: ExcelJS.Worksheet, originCell: number[], headers: any[]) {
  headers.forEach((key, colIndex) => {
    const cellColIndex = originCell[1] + colIndex;
    const cellRowIndex = originCell[0];

    // Write header row 1
    if (['Ngày giao dịch', 'Diễn giải'].includes(key)) {
      worksheet.mergeCells(cellRowIndex, cellColIndex, cellRowIndex + 1, cellColIndex);
    } else if (key === 'Số phiếu') {
      writeSectionJsonDataMapHeaderItem(worksheet, [cellRowIndex, cellColIndex], 'Chứng từ');
    } else if (key === 'Nhập') {
      worksheet.mergeCells(cellRowIndex, cellColIndex, cellRowIndex, cellColIndex + 2);
      writeSectionJsonDataMapHeaderItem(worksheet, [cellRowIndex, cellColIndex], 'Số lượng');
    }

    // Write header row 2
    writeSectionJsonDataMapHeaderItem(worksheet, [cellRowIndex + 1, cellColIndex], key);
  });
}

function writeSectionJsonDataMapHeaderItem(
  worksheet: ExcelJS.Worksheet,
  originCell: number[],
  headerItemValue: string,
) {
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = headerItemValue;
  cell.style.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.font = { bold: true, size: 9 };
  cell.style.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'DDD9C3' },
  };
  cell.style.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

function writeSectionTonDauKy(worksheet: ExcelJS.Worksheet, originCell: number[], tonDauKyValue: any) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 5);
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = `Tồn đầu: ${tonDauKyValue}`;
  cell.font = { bold: true, size: 10 };
  cell.style.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

function writeSectionJsonDataItems(
  worksheet: ExcelJS.Worksheet,
  originCell: number[],
  headers: any[],
  columns: any,
  dataMapItems: JsonDataType[],
) {
  dataMapItems.forEach((data, rowIndex) => {
    headers.forEach((key, colIndex) => {
      const cellColIndex = originCell[1] + colIndex;
      const cellRowIndex = originCell[0] + rowIndex;
      const cell = worksheet.getCell(cellRowIndex, cellColIndex);
      cell.value = data[key as keyof typeof data];
      const alignment = columns[key as keyof typeof columns].alignment;
      if (alignment) {
        cell.style.alignment = alignment as Partial<ExcelJS.Alignment>;
      }
      cell.font = { size: 10 };
      cell.style.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });
}

function writeSectionTongPhatSinh(worksheet: ExcelJS.Worksheet, originCell: number[], tongPhatSinhValue: any) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 4);
  const cellLabel = worksheet.getCell(originCell[0], originCell[1]);
  cellLabel.value = 'Tổng phát sinh:';
  cellLabel.font = { bold: true, size: 10 };
  cellLabel.style.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const cellValue = worksheet.getCell(originCell[0], originCell[1] + 5);
  cellValue.value = tongPhatSinhValue;
  cellValue.alignment = { horizontal: 'right', vertical: 'middle' };
  cellValue.font = { bold: true, size: 10 };
  cellValue.style.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

function writeSectionTonCuoiKy(worksheet: ExcelJS.Worksheet, originCell: number[], tonCuoiKyValue: any) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 4);
  const cellLabel = worksheet.getCell(originCell[0], originCell[1]);
  cellLabel.value = 'Tồn cuối kỳ:';
  cellLabel.font = { bold: true, size: 10 };
  cellLabel.style.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const cellValue = worksheet.getCell(originCell[0], originCell[1] + 5);
  cellValue.value = tonCuoiKyValue;
  cellValue.alignment = { horizontal: 'right', vertical: 'middle' };
  cellValue.font = { bold: true, size: 10 };
  cellValue.style.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

function writeSectionFooter(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  writeSectionFooterExportDate(worksheet, [originCell[0], originCell[1] + 4], moment());
  writeSectionFooterKeToan(worksheet, [originCell[0] + 1, originCell[1]]);
  writeSectionFooterThuKho(worksheet, [originCell[0] + 1, originCell[1] + 4]);
  writeSectionFooterPrintDate(worksheet, [originCell[0] + 8, originCell[1]], moment());
}

function writeSectionFooterExportDate(worksheet: ExcelJS.Worksheet, originCell: number[], exportDate: Moment) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 1);
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = exportDate.format(DateFormat.LONG_DATE_ONLY_VN);
  cell.style.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.font = { bold: true, size: 11 };
}

function writeSectionFooterKeToan(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 1);
  const cellKeToan = worksheet.getCell(originCell[0], originCell[1]);
  cellKeToan.value = 'Kế toán';
  cellKeToan.style.alignment = { horizontal: 'center', vertical: 'middle' };
  cellKeToan.font = { bold: true, size: 11 };

  worksheet.mergeCells(originCell[0] + 1, originCell[1], originCell[0] + 1, originCell[1] + 1);
  const cellKyTen = worksheet.getCell(originCell[0] + 1, originCell[1]);
  cellKyTen.value = '(Ký, họ tên)';
  cellKyTen.style.alignment = { horizontal: 'center', vertical: 'middle' };
  cellKyTen.font = { size: 11 };
}

function writeSectionFooterThuKho(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 1);
  const cellKeToan = worksheet.getCell(originCell[0], originCell[1]);
  cellKeToan.value = 'Thủ kho';
  cellKeToan.style.alignment = { horizontal: 'center', vertical: 'middle' };
  cellKeToan.font = { bold: true, size: 11 };

  worksheet.mergeCells(originCell[0] + 1, originCell[1], originCell[0] + 1, originCell[1] + 1);
  const cellKyTen = worksheet.getCell(originCell[0] + 1, originCell[1]);
  cellKyTen.value = '(Ký, họ tên)';
  cellKyTen.style.alignment = { horizontal: 'center', vertical: 'middle' };
  cellKyTen.font = { size: 11 };
}

function writeSectionFooterPrintDate(worksheet: ExcelJS.Worksheet, originCell: number[], printDate: Moment) {
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = `IN0104 Ver 1.0 In ngày ${printDate.format(DateFormat.DATE_TIME_VN_12)}`;
  cell.font = { italic: true, size: 9 };
}
