import ExcelJS from 'exceljs';
import { KhovtTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import { DateFormat } from 'main/constants';
import moment from 'moment';

const SHEET_RANGE_CONSTANTS = {
  originCell: [1, 1],
  columns: {
    STT: { alignment: { horizontal: 'center', vertical: 'middle' } },
    'MÃ VT': {},
    'TÊN VẬT TƯ': {},
    'MÃ LÔ': { alignment: { horizontal: 'center', vertical: 'middle' } },
    ĐVT: { alignment: { horizontal: 'center', vertical: 'middle' } },
    'SL YÊU CẦU': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'SL THỰC XUẤT': { alignment: { horizontal: 'right', vertical: 'middle' } },
    'GHI CHÚ': {},
  },
};

type JsonDataMapInfoType = {
  phieuXuatId: number | undefined;
  'Org xuất': string | undefined;
  'Sub xuất': string | undefined;
  ngayXuat: string | undefined;
  Số: string | undefined;
  'Đơn vị nhận hàng': string | undefined;
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

export function writeDataSheetKH03(
  workbook: ExcelJS.Workbook,
  data?: {
    filter?: ExportSuppliesISOReportFilter;
    items?: KhovtTransPhieuXuatControllerFindDetail200DataItem[];
  },
): void {
  if (!data) {
    return;
  }
  const { filter, items } = data;
  const sheetName = 'KH.03';
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
    writeSectionDonViNhanAndSoPhieu(
      worksheet,
      [currentRowMapIndex + 1, originCell[1]],
      dataMapInfo['Đơn vị nhận hàng'],
      dataMapInfo.Số,
    );
    writeSectionTitle(worksheet, [currentRowMapIndex + 3, originCell[1]]);
    writeSectionNgayXuat(worksheet, [currentRowMapIndex + 4, originCell[1]], dataMapInfo.ngayXuat);
    writeSectionOrgAndSub(
      worksheet,
      [currentRowMapIndex + 6, originCell[1]],
      dataMapInfo['Org xuất'],
      dataMapInfo['Sub xuất'],
    );
    writeSectionJsonDataMapItems(worksheet, [currentRowMapIndex + 7, originCell[1]], headers, columns, dataMapItems);
    writeSectionFooter(worksheet, [currentRowMapIndex + dataMapItems.length + 9, originCell[1]], dataMapInfo);

    // Go to next group index
    currentRowMapIndex += dataMapItems.length + 34;
  }
}

function transformData(data?: KhovtTransPhieuXuatControllerFindDetail200DataItem[]): JsonDataMapType {
  if (!data || data.length < 1) {
    throw new Error('Không tìm thấy');
  }

  // Group data by phieuXuatId
  const dataMap: JsonDataMapType = {};
  for (const item of data) {
    const mapKey = `${item.ngayXuat}_${item.phieuXuatId}`;
    const transformedDataItem = {
      STT: 1,
      'MÃ VT': item.maVt,
      'TÊN VẬT TƯ': item.tenVt,
      'MÃ LÔ': item.maLo,
      ĐVT: item.dvt,
      'SL YÊU CẦU': item.soLuongYeuCau,
      'SL THỰC XUẤT': item.soLuongThucTe,
      'GHI CHÚ': item.ghiChu,
    };

    if (!dataMap.hasOwnProperty(mapKey)) {
      // Add new group info
      dataMap[mapKey] = {
        phieuXuatId: item.phieuXuatId,
        'Org xuất': '110 Tổng kho vật tư công ty',
        'Sub xuất': `${item.maKho} - ${item.tenKho}`,
        'Đơn vị nhận hàng': item.tenDonVi,
        ngayXuat: moment(item.ngayXuat).format(DateFormat.LONG_DATE_ONLY_VN),
        Số: `${moment(item.ngayXuat).format(DateFormat.DATE_SHORT_ONLY_NOSPACE)}${item.maKho}`,
        thuKho: item.nguoiTaoPhieu,
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
  cellCompany.font = { name: 'Times New Roman', size: 13 };

  const cellTemplateId = worksheet.getCell(originCell[0], originCell[1] + 7);
  cellTemplateId.value = 'KH.13/BH03';
  cellTemplateId.alignment = { horizontal: 'right', vertical: 'middle' };
  cellTemplateId.font = { name: 'Times New Roman', size: 13 };
}

function writeSectionDonViNhanAndSoPhieu(
  worksheet: ExcelJS.Worksheet,
  originCell: number[],
  donViNhan?: string,
  soPhieuXuat?: string,
) {
  const cellDonViNhan = worksheet.getCell(originCell[0], originCell[1]);
  cellDonViNhan.value = `Đơn vị nhận hàng: ${donViNhan}`;
  cellDonViNhan.font = { name: 'Times New Roman', bold: true, size: 13 };

  const cellSoPhieu = worksheet.getCell(originCell[0], originCell[1] + 7);
  cellSoPhieu.value = `Số: ${soPhieuXuat}`;
  cellSoPhieu.alignment = { horizontal: 'right', vertical: 'middle' };
  cellSoPhieu.font = { name: 'Times New Roman', size: 13 };
}

function writeSectionTitle(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 7);
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = 'PHIẾU XUẤT VẬT TƯ, NGUYÊN LIỆU HẰNG NGÀY';
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.font = { name: 'Times New Roman', bold: true, size: 14 };
}

function writeSectionNgayXuat(worksheet: ExcelJS.Worksheet, originCell: number[], ngayXuat?: string) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 7);
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = ngayXuat;
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.font = { name: 'Times New Roman', bold: true, size: 13 };
}

function writeSectionOrgAndSub(worksheet: ExcelJS.Worksheet, originCell: number[], org?: string, sub?: string) {
  const cellOrg = worksheet.getCell(originCell[0], originCell[1]);
  cellOrg.value = `Org xuất: ${org}`;
  cellOrg.font = { name: 'Times New Roman', size: 13 };

  const cellSub = worksheet.getCell(originCell[0], originCell[1] + 7);
  cellSub.value = `Sub xuất: ${sub}`;
  cellSub.alignment = { horizontal: 'right', vertical: 'middle' };
  cellSub.font = { name: 'Times New Roman', size: 13 };
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
      cell.font = { name: 'Times New Roman', size: 13 };
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
    cell.font = { name: 'Times New Roman', bold: true, size: 13 };
    cell.style.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
}

function writeSectionFooter(worksheet: ExcelJS.Worksheet, originCell: number[], jsonDataMapInfo: JsonDataMapInfoType) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 7);
  const cellLabel = worksheet.getCell(originCell[0], originCell[1]);
  cellLabel.value =
    '          Phòng Kế Hoạch                  PT Đơn Vị Nhận                    Thủ Kho                         Người Nhận';
  cellLabel.alignment = { horizontal: 'center', vertical: 'middle' };
  cellLabel.font = { bold: true, size: 13 };

  worksheet.mergeCells(originCell[0] + 5, originCell[1] + 3, originCell[0] + 5, originCell[1] + 5);
  const cellThuKhoValue = worksheet.getCell(originCell[0] + 5, originCell[1] + 3);
  cellThuKhoValue.value = jsonDataMapInfo.thuKho;
  cellThuKhoValue.alignment = { horizontal: 'center', vertical: 'middle' };
  cellThuKhoValue.font = { size: 13 };
}
