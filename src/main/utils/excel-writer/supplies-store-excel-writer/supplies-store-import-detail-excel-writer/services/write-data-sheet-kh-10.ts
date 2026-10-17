import ExcelJS from 'exceljs';
import { KhovtTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import { DateFormat } from 'main/constants';
import moment from 'moment';

const SHEET_RANGE_CONSTANTS = {
  originCell: [1, 1],
  columns: {
    STT: { alignment: { horizontal: 'center', vertical: 'middle' } },
    'TÊN VT': {},
    ĐVT: { alignment: { horizontal: 'center', vertical: 'middle' } },
    SL: { alignment: { horizontal: 'right', vertical: 'middle' } },
    'Mã số lô hàng': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'Ngày nhập': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'Nơi cung cấp': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'Nơi sản xuất': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'Về kho số': { alignment: { horizontal: 'center', vertical: 'middle' } },
    'Ghi Chú': {},
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

export function writeDataSheetKH10(
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
  const sheetName = 'KH.10';
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
    writeSectionDonVi(worksheet, [currentRowMapIndex + 1, originCell[1]]);
    writeSectionSoPhieuAndNgayNhap(worksheet, [currentRowMapIndex + 2, originCell[1]], dataMapInfo.ngayNhap);
    writeSectionTitle(worksheet, [currentRowMapIndex + 4, originCell[1]]);
    writeSectionSubtitle(worksheet, [currentRowMapIndex + 5, originCell[1]]);
    writeSectionPreDescription(worksheet, [currentRowMapIndex + 7, originCell[1]]);
    writeSectionJsonDataMapItems(worksheet, [currentRowMapIndex + 11, originCell[1]], headers, columns, dataMapItems);
    writeSectionFooter(worksheet, [currentRowMapIndex + dataMapItems.length + 12, originCell[1]], dataMapInfo);

    // Go to next group index
    currentRowMapIndex += dataMapItems.length + 37;
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
      'TÊN VT': item.tenVt || item.maVt,
      ĐVT: item.dvt,
      SL: item.soLuong,
      'Mã số lô hàng': item.soLo,
      'Ngày nhập': moment(item.ngayNhap).format(DateFormat.DATE_ONLY_VN),
      'Nơi cung cấp': item.donViNhap,
      'Nơi sản xuất': item.nguonGoc,
      'Về kho số': item.maKhoNhap,
      'Ghi Chú': item.ghiChu,
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
  cellCompany.value = 'CTY CP CAO SU ĐÀ NẴNG';
  cellCompany.font = { name: 'Times New Roman', size: 13 };

  const cellTemplateId = worksheet.getCell(originCell[0], originCell[1] + 9);
  cellTemplateId.value = 'KH.10/BH03';
  cellTemplateId.alignment = { horizontal: 'right', vertical: 'middle' };
  cellTemplateId.font = { name: 'Times New Roman', size: 13 };
}

function writeSectionDonVi(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = 'Đơn vị: Phòng Kế hoạch';
  cell.font = { name: 'Times New Roman', size: 13 };
}

function writeSectionSoPhieuAndNgayNhap(worksheet: ExcelJS.Worksheet, originCell: number[], ngayNhap?: string) {
  const cellSoPhieu = worksheet.getCell(originCell[0], originCell[1]);
  cellSoPhieu.value = 'Số: …../KH';
  cellSoPhieu.font = { name: 'Times New Roman', size: 13 };

  const cellNgayNhap = worksheet.getCell(originCell[0], originCell[1] + 9);
  cellNgayNhap.value = `Đà nẵng, ${ngayNhap?.toLowerCase()}`;
  cellNgayNhap.alignment = { horizontal: 'right', vertical: 'middle' };
  cellNgayNhap.font = { name: 'Times New Roman', size: 13 };
}

function writeSectionTitle(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 9);
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = 'GIẤY BÁO VẬT TƯ NHẬP VỀ';
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.font = { name: 'Times New Roman', bold: true, size: 20 };
}

function writeSectionSubtitle(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 9);
  const cell = worksheet.getCell(originCell[0], originCell[1]);
  cell.value = 'V/v: Yêu cầu kiểm tra';
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.font = { name: 'Times New Roman', bold: true, size: 13 };
}

function writeSectionPreDescription(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  const cellKinhGui = worksheet.getCell(originCell[0], originCell[1] + 3);
  cellKinhGui.value = 'Kính gửi:  Phòng Thử Nghiệm';
  cellKinhGui.font = { name: 'Times New Roman', size: 13 };

  const cellDescription = worksheet.getCell(originCell[0] + 2, originCell[1]);
  cellDescription.value = 'Phòng Kế hoạch đã nhận được vật tư phục vụ sản xuất tại kho công ty như sau:';
  cellDescription.font = { name: 'Times New Roman', size: 13 };
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
  writeSectionFooterDescription(worksheet, originCell);
  writeSectionFooterNoiNhan(worksheet, [originCell[0] + 3, originCell[1]]);
  writeSectionFooterThuKho(worksheet, [originCell[0] + 3, originCell[1] + 7], jsonDataMapInfo.thuKho);
}

function writeSectionFooterDescription(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  const cell1 = worksheet.getCell(originCell[0], originCell[1]);
  cell1.value = 'Đề nghị đơn vị lập biên bản lấy mẫu và kiểm tra để sớm đưa vào sản xuất.';
  cell1.font = { name: 'Times New Roman', size: 13 };

  const cell2 = worksheet.getCell(originCell[0] + 1, originCell[1]);
  cell2.value = '* Thời gian yêu cầu nhận kết quả kiểm tra:  03 Ngày';
  cell2.font = { name: 'Times New Roman', size: 13 };
}

function writeSectionFooterNoiNhan(worksheet: ExcelJS.Worksheet, originCell: number[]) {
  const cell1 = worksheet.getCell(originCell[0], originCell[1]);
  cell1.value = 'Nơi Nhận:';
  cell1.font = { name: 'Times New Roman', bold: true, size: 13 };

  const cell2 = worksheet.getCell(originCell[0] + 1, originCell[1]);
  cell2.value = '- Như trên';
  cell2.font = { name: 'Times New Roman', size: 13 };

  const cell3 = worksheet.getCell(originCell[0] + 2, originCell[1]);
  cell3.value = '- Lưu VT';
  cell3.font = { name: 'Times New Roman', size: 13 };
}

function writeSectionFooterThuKho(worksheet: ExcelJS.Worksheet, originCell: number[], thuKho?: string | null) {
  worksheet.mergeCells(originCell[0], originCell[1], originCell[0], originCell[1] + 2);
  const cellLabel = worksheet.getCell(originCell[0], originCell[1]);
  cellLabel.value = 'THỦ KHO';
  cellLabel.alignment = { horizontal: 'center', vertical: 'middle' };
  cellLabel.font = { name: 'Times New Roman', bold: true, size: 13 };

  worksheet.mergeCells(originCell[0] + 3, originCell[1], originCell[0] + 3, originCell[1] + 2);
  const cellValue = worksheet.getCell(originCell[0] + 3, originCell[1]);
  cellValue.value = thuKho;
  cellValue.alignment = { horizontal: 'center', vertical: 'middle' };
  cellValue.font = { name: 'Times New Roman', size: 13 };
}
