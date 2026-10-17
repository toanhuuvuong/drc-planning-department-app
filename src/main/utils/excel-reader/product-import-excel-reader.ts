import { KhotpMasterSanPhamWithRelations } from 'main/apis/drc/models';
import { AbstractExcelReader } from '.';
import { ExcelUtil } from '..';

const SHEET_RANGE_CONSTANTS: {
  ROW_DATA_BEGGIN_INDEX: number;
  ATTRIBUTE_INDEXS: {
    maSanPham: number;
    tenSanPham: number;
    dvt: number;
    maNhom: number;
    tenNhom: number;
  };
} = {
  ROW_DATA_BEGGIN_INDEX: 2,
  ATTRIBUTE_INDEXS: {
    maSanPham: 1,
    tenSanPham: 2,
    dvt: 3,
    maNhom: 5,
    tenNhom: 6,
  },
};

class ProductImportExcelReader extends AbstractExcelReader<{ sanPhams: KhotpMasterSanPhamWithRelations[] }> {
  protected readDataImpl(): { sanPhams: KhotpMasterSanPhamWithRelations[] } {
    if (!this.workbook) {
      throw new Error('Invalid template');
    }

    const dto: { sanPhams: KhotpMasterSanPhamWithRelations[] } = {
      sanPhams: [],
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
      for (let recordIndex = rowDataBegginIndex; recordIndex <= rowEndIndex; recordIndex++) {
        if (recordsRawData[recordIndex][attributeIndexs.maSanPham]) {
          // Convert to detail dto
          const recordDto: KhotpMasterSanPhamWithRelations = {
            maSanPham: '',
            tenSanPham: '',
            dvt: '',
            maNhom: '',
            nhomsp: {
              maNhom: '',
              tenNhom: '',
            },
          };
          recordDto.maSanPham = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maSanPham]);
          recordDto.tenSanPham = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.tenSanPham]);
          recordDto.dvt = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.dvt]);
          recordDto.maNhom = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maNhom]);
          if (recordDto.maNhom && recordDto.nhomsp) {
            recordDto.nhomsp.maNhom = recordDto.maNhom;
            recordDto.nhomsp.tenNhom = ExcelUtil.normalizeCellData(
              recordsRawData[recordIndex][attributeIndexs.tenNhom],
            );
          }

          // Add sanPham to array
          dto.sanPhams?.push(recordDto);
        }
      }
    }

    return dto;
  }
}

export default ProductImportExcelReader;
