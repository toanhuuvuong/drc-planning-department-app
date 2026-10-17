import { KhovtMasterVt } from 'main/apis/drc/models';
import { AbstractExcelReader } from '.';
import { ExcelUtil } from '..';

const SHEET_RANGE_CONSTANTS: {
  ROW_DATA_BEGGIN_INDEX: number;
  ATTRIBUTE_INDEXS: {
    maVt: number;
    tenVt: number;
    dvt: number;
  };
} = {
  ROW_DATA_BEGGIN_INDEX: 6,
  ATTRIBUTE_INDEXS: {
    maVt: 1,
    tenVt: 2,
    dvt: 3,
  },
};

class SuppliesImportExcelReader extends AbstractExcelReader<{ vatTus: KhovtMasterVt[] }> {
  protected readDataImpl(): { vatTus: KhovtMasterVt[] } {
    if (!this.workbook) {
      throw new Error('Invalid template');
    }

    const dto: { vatTus: KhovtMasterVt[] } = {
      vatTus: [],
    };

    for (const sheetName of this.workbook.SheetNames) {
      if (sheetName.includes('DS') || sheetName.includes('Thủ kho')) {
        continue;
      }

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
        if (recordsRawData[recordIndex][attributeIndexs.maVt]) {
          // Convert to detail dto
          const recordDto: KhovtMasterVt = {
            maVt: '',
            tenVt: '',
            dvt: '',
          };
          recordDto.maVt = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maVt]);
          recordDto.tenVt = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.tenVt]);
          recordDto.dvt = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.dvt]);

          // Add vatTu to array
          dto.vatTus?.push(recordDto);
        }
      }
    }

    return dto;
  }
}

export default SuppliesImportExcelReader;
