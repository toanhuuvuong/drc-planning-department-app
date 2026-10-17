import { KhotpMasterKhachHang } from 'main/apis/drc/models';
import { AbstractExcelReader } from '.';
import { ExcelUtil } from '..';

const SHEET_RANGE_CONSTANTS: {
  ROW_DATA_BEGGIN_INDEX: number;
  ATTRIBUTE_INDEXS: {
    maKh: number;
    tenKh: number;
    diaChiKh: number;
    mstKh: number;
    dtKh: number;
    faxKh: number;
    lienHeKh: number;
    khuVucKh: number;
  };
} = {
  ROW_DATA_BEGGIN_INDEX: 7,
  ATTRIBUTE_INDEXS: {
    maKh: 1,
    tenKh: 2,
    diaChiKh: 3,
    mstKh: 4,
    dtKh: 5,
    faxKh: 6,
    lienHeKh: 7,
    khuVucKh: 12,
  },
};

class ProductCustomerImportExcelReader extends AbstractExcelReader<{ khachHangs: KhotpMasterKhachHang[] }> {
  protected readDataImpl(): { khachHangs: KhotpMasterKhachHang[] } {
    if (!this.workbook) {
      throw new Error('Invalid template');
    }

    const dto: { khachHangs: KhotpMasterKhachHang[] } = {
      khachHangs: [],
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
        if (recordsRawData[recordIndex][attributeIndexs.maKh]) {
          // Convert to detail dto
          const recordDto: KhotpMasterKhachHang = {
            maKh: '',
            tenKh: '',
            diaChiKh: '',
            mstKh: '',
            dtKh: '',
            faxKh: '',
            lienHeKh: '',
            khuVucKh: '',
          };
          recordDto.maKh = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maKh]);
          recordDto.tenKh = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.tenKh]);
          recordDto.diaChiKh = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.diaChiKh]);
          recordDto.mstKh = ExcelUtil.normalizeCellData(
            normalizeCustomerFormulaCellData(recordsRawData[recordIndex][attributeIndexs.mstKh]),
          );
          recordDto.dtKh = ExcelUtil.normalizeCellData(
            normalizeCustomerFormulaCellData(recordsRawData[recordIndex][attributeIndexs.dtKh]),
          );
          recordDto.faxKh = ExcelUtil.normalizeCellData(
            normalizeCustomerFormulaCellData(recordsRawData[recordIndex][attributeIndexs.faxKh]),
          );
          recordDto.lienHeKh = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.lienHeKh]);
          recordDto.khuVucKh = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.khuVucKh]);

          // Add khachHang to array
          dto.khachHangs?.push(recordDto);
        }
      }
    }

    return dto;
  }
}

const normalizeCustomerFormulaCellData = (formulaData: string) => {
  if (!formulaData) {
    return '';
  }
  return formulaData.replaceAll('="', '').replaceAll('"', '');
};

export default ProductCustomerImportExcelReader;
