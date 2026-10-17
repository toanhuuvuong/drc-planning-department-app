import ExcelJS from 'exceljs';
import { KhovtTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import { DateFormat } from 'main/constants';
import moment from 'moment';

const SHEET_RANGE_CONSTANTS = {
  originCell: [1, 1],
  columns: {
    STT: { alignment: { horizontal: 'center', vertical: 'middle' } },
    'TÊN VẬT TƯ': {},
    ĐVT: { alignment: { horizontal: 'center', vertical: 'middle' } },
    'SỐ LƯỢNG': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'ĐƠN VỊ NHẬP': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'GHI CHÚ': {},
  },
};

type JsonDataMapInfoType = {
  phieuNhapId: number | undefined;
  ngayNhap: string | undefined;
  Số: string | undefined;
  thuKho: string | null | undefined;
};

type JsonDataMapType = {
  [keyMap: string]: JsonDataMapInfoType & {
    items: JsonDataType[];
  };
};

type JsonDataType = {
  [key in keyof typeof SHEET_RANGE_CONSTANTS.columns]: any;
};

export function writeDataSheetKH22(
  workbook: ExcelJS.Workbook,
  data?: {
    filter?: ExportSuppliesISOReportFilter;
    items?: KhovtTransPhieuNhapControllerFindDetail200DataItem[];
  },
): void {
  if (!data) {
    return;
  }
  const { filter, items } = data;
  const sheetName = 'KH.22';
  const worksheet = workbook.getWorksheet(sheetName);
  const originCell = SHEET_RANGE_CONSTANTS.originCell;
  const columns = SHEET_RANGE_CONSTANTS.columns;
  const jsonDataMap = transformData(items);
  const headers = Object.keys(columns);

  if (!worksheet || !filter || !items) {
    throw new Error('Invalid template');
  }

  // Write data
  let currentRowMapIndex = originCell[0];
  for (const dataMapKey in jsonDataMap) {
    const { items: dataMapItems, ...dataMapInfo } = jsonDataMap[dataMapKey];

    writeSectionCompanyAndTemplateId(worksheet, [currentRowMapIndex, originCell[1]]);
    writeSectionDiaChi(worksheet, [currentRowMapIndex + 1, originCell[1]]);
    writeSectionTitleAndSoPhieu(worksheet, [currentRowMapIndex + 2, originCell[1]]);
    writeSectionNgayNhap(worksheet, [currentRowMapIndex + 3, originCell[1]], dataMapInfo.ngayNhap);
    writeSectionJsonDataMapItems(worksheet, [currentRowMapIndex + 5, originCell[1]], headers, columns, dataMapItems);
    writeSectionFooter(worksheet, [currentRowMapIndex + dataMapItems.length + 7, originCell[1] + 3], dataMapInfo);

    // Go to next group index
    currentRowMapIndex += dataMapItems.length + 33;
  }
}

function transformData(data?: KhovtTransPhieuNhapControllerFindDetail200DataItem[]): JsonDataMapType {
  if (!data || data.length < 1) {
    throw new Error('Không tìm thấy');
  }

  // Group data by phieuNhapId
  const dataMap: JsonDataMapType = {};
  for (const item of data) {
    const mapKey = `${item.ngayNhap}_${item.phieuNhapId}`;
    const transformedDataItem = {
      STT: 1,
      'TÊN VẬT TƯ': item.tenVt || item.maVt,
      ĐVT: item.dvt,
      'SỐ LƯỢNG': item.soLuong,
      'ĐƠN VỊ NHẬP': item.donViNhap,
      'GHI CHÚ': item.ghiChu,
    };

    if (!dataMap.hasOwnProperty(mapKey)) {
      // Add new group info
      dataMap[mapKey] = {
        phieuNhapId: item.phieuNhapId,
        ngayNhap: moment(item.ngayNhap).format(DateFormat.LONG_DATE_ONLY_VN),
        Số: `${moment(item.ngayNhap).format(DateFormat.DATE_SHORT_ONLY_NOSPACE)}${item.maKho}`,
        thuKho: item.nguoiNhap,
        items: [transformedDataItem],
      };
    } else {
      // Add new item
      dataMap[mapKey].items.push({ ...transformedDataItem, STT: dataMap[mapKey].items.length + 1 });
    }
  }

  return dataMap;
}

function writeSectionCompanyAndTemplateId(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  const cellCompany = worksheet.getCell(originCell[0], originCell[1]);
  cellCompany.value = 'CÔNG TY CP CAO SU ĐÀ NẴNG';
  cellCompany.font = { bold: true, size: 13 };

  const cellTemplateId = worksheet.getCell(originCell[0], originCell[1] + 5);
  cellTemplateId.value = 'KH.22/BH03';
  cellTemplateId.alignment = { horizontal: 'right', vertical: 'middle' };
  cellTemplateId.font = { size: 13 };
}

function writeSectionDiaChi(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = 'ĐỊA CHỈ: P. Kế Hoạch';
  cell.font = { bold: true, size: 13 };
}

function writeSectionTitleAndSoPhieu(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 5);
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = '                                              PHIẾU BÁO NHẬP KHO                          Số:…………';
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.font = { bold: true, size: 18 };
}

function writeSectionNgayNhap(worksheet: ExcelJS.Worksheet, originCell: number[], ngayNhap?: string) {
  worksheet.getRow(originCell[0]).height = 32;
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 5);
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = ngayNhap;
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.font = { size: 13 };
}

function writeSectionJsonDataMapItems(
  worksheet: ExcelJS.Worksheet,
  originCell: number[],
  headers: any[],
  columns: any,
  dataMapItems: JsonDataType[],
) {
  // Table header
  writeSectionJsonDataMapHeader(worksheet, originCell, headers);

  // Table data
  dataMapItems.forEach((data, rowIndex) => {
    headers.forEach((key, colIndex) => {
      const cellColIndex = originCell[1] + colIndex;
      const cellRowIndex = originCell[0] + rowIndex + 1;
      const cell = worksheet.getCell(cellRowIndex, cellColIndex);
      cell.value = data[key as keyof typeof data];
      const alignment = columns[key as keyof typeof columns].alignment;
      if (alignment) {
        cell.style.alignment = alignment as Partial<ExcelJS.Alignment>;
      }
      cell.font = { size: 13 };
      cell.style.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });
}

function writeSectionJsonDataMapHeader(worksheet: ExcelJS.Worksheet, originCell: number[], headers: any[]) {
  worksheet.getRow(originCell[0]).height = 45;
  headers.forEach((key, colIndex) => {
    const cellColIndex = originCell[1] + colIndex;
    const cellRowIndex = originCell[0];
    const cell = worksheet.getCell(cellRowIndex, cellColIndex);
    cell.value = key;
    cell.style.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.font = { bold: true, size: 13 };
    cell.style.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
}

function writeSectionFooter(worksheet: ExcelJS.Worksheet, originCell: number[], jsonDataMapInfo?: JsonDataMapInfoType) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 2);
  const cellLabel = worksheet.getCell(originCell[0], originCell[1]);
  cellLabel.value = 'Thủ Kho';
  cellLabel.alignment = { horizontal: 'center', vertical: 'middle' };
  cellLabel.font = { bold: true, size: 13 };

  worksheet.mergeCells(originCell[0] + 5, originCell[1], originCell[0] + 5, originCell[1] + 2);
  const cellValue = worksheet.getCell(originCell[0] + 5, originCell[1]);
  cellValue.value = jsonDataMapInfo?.thuKho;
  cellValue.alignment = { horizontal: 'center', vertical: 'middle' };
  cellValue.font = { size: 13 };
}
