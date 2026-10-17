import { KhotpTransLenhNhapWithRelations } from 'main/apis/drc/models';
import { ProductExcelTemplateType } from 'main/constants/enums';
import moment from 'moment';
import { AbstractExcelReader } from '.';
import { DateUtil, ExcelUtil } from '..';

const SHEET_RANGE_CONSTANTS: {
  ROW_DATA_BEGGIN_INDEX: number;
  ATTRIBUTE_INDEXS: {
    viTri: number;
    maKhoNhap: number;
    maSanPham: number;
    tenSanPham: number;
    dvt: number;
    soLuong: number;
    ghiChu: number;
    ngaySx1: number;
    ngaySx2: number;
    ngaySx3: number;
    ngaySx4: number;
  };
} = {
  ROW_DATA_BEGGIN_INDEX: 4,
  ATTRIBUTE_INDEXS: {
    viTri: 0,
    maKhoNhap: 1,
    maSanPham: 2,
    tenSanPham: 3,
    dvt: 4,
    soLuong: 5, // default col
    ghiChu: 14,
    ngaySx1: 7,
    ngaySx2: 8,
    ngaySx3: 9,
    ngaySx4: 10,
  },
};

class ProductInventoryImportExcelReader extends AbstractExcelReader<KhotpTransLenhNhapWithRelations> {
  protected readDataImpl(): KhotpTransLenhNhapWithRelations {
    if (!this.workbook) {
      throw new Error('Invalid template');
    }

    const dto: KhotpTransLenhNhapWithRelations = {
      loaiLenhNhap: ProductExcelTemplateType['ton-kho'].id,
      rawDetails: [],
    };

    for (const sheetName of this.workbook.SheetNames) {
      const sheetDataRange = ExcelUtil.getSheetRange(this.workbook, sheetName);
      const colBeginIndex = 0;
      const colEndIndex = sheetDataRange.e.c;
      const rowBeginIndex = 0;
      const rowEndIndex = sheetDataRange.e.r;

      // Load records from excel
      const recordsRawData = ExcelUtil.loadDataByRange(this.workbook, sheetName, {
        colBeginIndex,
        rowBeginIndex,
        colEndIndex,
        rowEndIndex,
      });

      // Convert raw data to dto
      const rowDataBegginIndex = SHEET_RANGE_CONSTANTS.ROW_DATA_BEGGIN_INDEX;
      const attributeIndexs = SHEET_RANGE_CONSTANTS.ATTRIBUTE_INDEXS;
      const quantityCol = this.additionalProps?.quantityCol
        ? ExcelUtil.letterToColumn(this.additionalProps.quantityCol) - 1
        : attributeIndexs.soLuong;
      for (let recordIndex = rowDataBegginIndex; recordIndex <= rowEndIndex; recordIndex++) {
        if (
          recordsRawData[recordIndex][attributeIndexs.maSanPham] &&
          recordsRawData[recordIndex][attributeIndexs.tenSanPham]
        ) {
          // Convert to detail dto
          const recordDto: any = {};
          recordDto.viTri = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.viTri]);
          recordDto.maKhoNhap = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maKhoNhap]);
          recordDto.maSanPham = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maSanPham]);
          recordDto.tenSanPham = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.tenSanPham]);
          recordDto.dvt = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.dvt]);
          recordDto.soLuong = Number(ExcelUtil.normalizeCellData(recordsRawData[recordIndex][quantityCol]));
          recordDto.ghiChu = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.ghiChu]);

          const ngaySx1 = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.ngaySx1]);
          const ngaySx2 = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.ngaySx2]);
          const ngaySx3 = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.ngaySx3]);
          const ngaySx4 = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.ngaySx4]);
          const ngayNhap = createDateWithNgaySx(ngaySx1, ngaySx2, ngaySx3, ngaySx4);
          recordDto.ngayNhap = DateUtil.toDateISOString(ngayNhap);

          // Add detail to array
          dto.rawDetails?.push(recordDto);
        }
      }
    }

    return dto;
  }
}

function createDateWithNgaySx(ngaySx1?: string, ngaySx2?: string, ngaySx3?: string, ngaySx4?: string) {
  const ngayNhap = moment();
  let year = ngayNhap.year();
  let month = ngayNhap.month();

  if (ngaySx4) {
    [month, year] = getMonthAndYearFromNgaySx(ngaySx4, 2025);
  } else if (ngaySx3) {
    [month, year] = getMonthAndYearFromNgaySx(ngaySx3, 2024);
  } else if (ngaySx2) {
    [month, year] = getMonthAndYearFromNgaySx(ngaySx2, 2023);
  } else if (ngaySx1) {
    [month, year] = getMonthAndYearFromNgaySx(ngaySx1, 2022);
  }

  return ngayNhap.year(year).month(month).date(1);
}

function getMonthAndYearFromNgaySx(ngaySx: string, defaultYear: number) {
  let fromMonthIndex = ngaySx.indexOf('T') + 1;
  fromMonthIndex = fromMonthIndex !== 0 ? fromMonthIndex : ngaySx.indexOf('t') + 1;
  let toMonthIndex = fromMonthIndex + 1;
  if (toMonthIndex < ngaySx.length && Number.isInteger(ngaySx.charAt(toMonthIndex))) {
    toMonthIndex++;
  }

  const month = Number(ngaySx.slice(fromMonthIndex, toMonthIndex)) - 1;
  const year =
    toMonthIndex < ngaySx.length && ngaySx.charAt(toMonthIndex) === '/'
      ? 2000 + Number(ngaySx.slice(toMonthIndex + 1, toMonthIndex + 3))
      : defaultYear;

  return [month, year];
}

export default ProductInventoryImportExcelReader;
