import ExcelJS from 'exceljs';
import { KhovtXuatNhapTonControllerFindDetailByLoHang200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import { DateFormat } from 'main/constants';
import moment, { Moment } from 'moment';

const SHEET_RANGE_CONSTANTS = {
  originCell: [9, 1],
  columns: {
    TT: { alignment: { horizontal: 'center', vertical: 'middle' } },
    'MÃ VT': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'Tên Vật tư, NVL': {},
    'Kho Nhập': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'Vị Trí Lô Hàng': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'MÃ LÔ': { font: { bold: true } },
    'TỒN ĐẦU KỲ': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'NHẬP TRONG KỲ': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'XUẤT TRONG KỲ': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'TỒN CUỐI KỲ': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'Ngày Nhập Lô Hàng': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'Kết Quả Kiểm Tra': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'Nhà Cung cấp': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'Nhà Sản xuất': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'GHI CHÚ': {},
  },
};

type JsonDataType = {
  [key in keyof typeof SHEET_RANGE_CONSTANTS.columns]: any;
};

type JsonDataMapType = {
  [keyMap: string]: JsonDataType & {
    items: JsonDataType[];
  };
};

export function writeDataSheetBangTHChiTietTungLoHang(
  workbook: ExcelJS.Workbook,
  data?: {
    filter?: ExportSuppliesISOReportFilter;
    items?: KhovtXuatNhapTonControllerFindDetailByLoHang200DataItem[];
  },
): void {
  if (!data) {
    return;
  }
  const { filter, items } = data;
  const sheetName = 'Bảng TH Chi tiết từng lô hàng';
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
  writeSectionJsonDataMap(worksheet, originCell, headers, columns, jsonDataMap);
}

function transformData(data?: KhovtXuatNhapTonControllerFindDetailByLoHang200DataItem[]): JsonDataMapType {
  if (!data || data.length < 1) {
    throw new Error('Không tìm thấy');
  }

  // Group data by MÃ VT
  const dataMap: JsonDataMapType = {};
  let ttIndex = 0;
  for (const item of data) {
    const mapKey = String(item.maVt);
    const transformDataItem = {
      TT: '',
      'MÃ VT': item.maVt,
      'Tên Vật tư, NVL': `${item.tenVt} - ${item.tenNhaSX}`,
      'Kho Nhập': item.tenKho,
      'Vị Trí Lô Hàng': item.viTriLuuKho,
      'MÃ LÔ': item.soLo,
      'TỒN ĐẦU KỲ': item.tonKhoDauKy,
      'NHẬP TRONG KỲ': item.soLuongNhapFromTo,
      'XUẤT TRONG KỲ': item.soLuongXuatFromTo,
      'TỒN CUỐI KỲ': item.tonKhoCuoiKy,
      'Ngày Nhập Lô Hàng': moment(item.ngayNhap).format(DateFormat.DATE_ONLY_VN),
      'Kết Quả Kiểm Tra': 'Đạt',
      'Nhà Cung cấp': '',
      'Nhà Sản xuất': '',
      'GHI CHÚ': '',
    };

    if (!dataMap.hasOwnProperty(mapKey)) {
      // Init new group info
      dataMap[mapKey] = {
        TT: ++ttIndex,
        'MÃ VT': item.maVt,
        'Tên Vật tư, NVL': item.tenVt,
        'Kho Nhập': '',
        'Vị Trí Lô Hàng': '',
        'MÃ LÔ': '',
        'TỒN ĐẦU KỲ': item.tonKhoDauKy,
        'NHẬP TRONG KỲ': item.soLuongNhapFromTo,
        'XUẤT TRONG KỲ': item.soLuongXuatFromTo,
        'TỒN CUỐI KỲ': item.tonKhoCuoiKy,
        'Ngày Nhập Lô Hàng': '',
        'Kết Quả Kiểm Tra': '',
        'Nhà Cung cấp': '',
        'Nhà Sản xuất': '',
        'GHI CHÚ': '',
        items: [transformDataItem],
      };
    } else {
      // Re-calculate sum info
      dataMap[mapKey]['TỒN ĐẦU KỲ'] += item.tonKhoDauKy;
      dataMap[mapKey]['NHẬP TRONG KỲ'] += item.soLuongNhapFromTo;
      dataMap[mapKey]['XUẤT TRONG KỲ'] += item.soLuongXuatFromTo;
      dataMap[mapKey]['TỒN CUỐI KỲ'] += item.tonKhoCuoiKy;

      // Add new group item
      dataMap[mapKey].items.push(transformDataItem);
    }
  }

  return dataMap;
}

function writeSectionFromToDate(worksheet: ExcelJS.Worksheet, fromDate?: Moment, toDate?: Moment) {
  const fromDateCell = worksheet.getCell('E5');
  fromDateCell.value = fromDate?.format(DateFormat.DATE_ONLY_VN);
  const toDateCell = worksheet.getCell('G5');
  toDateCell.value = toDate?.format(DateFormat.DATE_ONLY_VN);
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
    const { items: dataMapItems, ...dataMapInfo } = jsonDataMap[dataMapKey];

    // Write group info
    writeSectionJsonDataMapInfo(worksheet, [currentRowMapIndex, originCell[1]], headers, columns, dataMapInfo);

    // Write group item data
    writeSectionJsonDataMapItems(worksheet, [currentRowMapIndex + 1, originCell[1]], headers, columns, dataMapItems);

    // Go to next group index
    currentRowMapIndex += dataMapItems.length + 1;
  }
}

function writeSectionJsonDataMapInfo(
  worksheet: ExcelJS.Worksheet,
  originCell: number[],
  headers: any[],
  columns: any,
  dataMapInfo: JsonDataType,
) {
  let colIndex = 0;
  for (const key of headers) {
    const cellColIndex = originCell[1] + colIndex++;
    const cellRowIndex = originCell[0];
    const cell = worksheet.getCell(cellRowIndex, cellColIndex);
    cell.value = dataMapInfo[key as keyof typeof dataMapInfo];
    const alignment = columns[key as keyof typeof columns].alignment;
    if (alignment) {
      cell.style.alignment = alignment as Partial<ExcelJS.Alignment>;
    }
    cell.font = {
      bold: true,
      underline: ['TỒN ĐẦU KỲ', 'NHẬP TRONG KỲ', 'XUẤT TRONG KỲ', 'TỒN CUỐI KỲ'].includes(key),
    };
    cell.style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'BFBFBF' },
    };
    cell.style.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }
}

function writeSectionJsonDataMapItems(
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
      const font = columns[key as keyof typeof columns].font;
      if (font) {
        cell.font = font as Partial<ExcelJS.Font>;
      }
      cell.style.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });
}
