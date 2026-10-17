import {
  DmMasterBoDinhMucWithRelations,
  DmTransDinhMucItemWithRelations,
  DmTransDinhMucWithRelations,
} from 'main/apis/drc/models';
import { RequirementsStandardSetType } from 'main/constants/enums';
import { getRequirementsStandardSetTypeByText } from 'main/constants/enums/requirements-standard-set-type';
import { AbstractExcelReader } from '.';
import { ExcelUtil } from '..';

const SHEET_RANGE_CONSTANTS: {
  [key: string]: {
    ROW_PRODUCT_INDEX: number;
    ROW_DATA_BEGGIN_INDEX: number;
    COL_DATA_BEGGIN_INDEX: number;
    ATTRIBUTE_INDEXS: {
      maItem: number;
    };
  };
} = {
  [RequirementsStandardSetType['luyen-bias'].text]: {
    ROW_PRODUCT_INDEX: 1,
    ROW_DATA_BEGGIN_INDEX: 6,
    COL_DATA_BEGGIN_INDEX: 4,
    ATTRIBUTE_INDEXS: {
      maItem: 2,
    },
  },
  [RequirementsStandardSetType['luyen-radial'].text]: {
    ROW_PRODUCT_INDEX: 0,
    ROW_DATA_BEGGIN_INDEX: 6,
    COL_DATA_BEGGIN_INDEX: 4,
    ATTRIBUTE_INDEXS: {
      maItem: 2,
    },
  },
  [RequirementsStandardSetType['tbb'].text]: {
    ROW_PRODUCT_INDEX: 1,
    ROW_DATA_BEGGIN_INDEX: 15,
    COL_DATA_BEGGIN_INDEX: 5,
    ATTRIBUTE_INDEXS: {
      maItem: 3,
    },
  },
  [RequirementsStandardSetType['tbr-without-sam'].text]: {
    ROW_PRODUCT_INDEX: 6,
    ROW_DATA_BEGGIN_INDEX: 18,
    COL_DATA_BEGGIN_INDEX: 6,
    ATTRIBUTE_INDEXS: {
      maItem: 1,
    },
  },
  [RequirementsStandardSetType['tbr-sam'].text]: {
    ROW_PRODUCT_INDEX: 1,
    ROW_DATA_BEGGIN_INDEX: 12,
    COL_DATA_BEGGIN_INDEX: 6,
    ATTRIBUTE_INDEXS: {
      maItem: 1,
    },
  },
  [RequirementsStandardSetType['dplus-atv'].text]: {
    ROW_PRODUCT_INDEX: 1,
    ROW_DATA_BEGGIN_INDEX: 15,
    COL_DATA_BEGGIN_INDEX: 5,
    ATTRIBUTE_INDEXS: {
      maItem: 3,
    },
  },
  [RequirementsStandardSetType['xdxm'].text]: {
    ROW_PRODUCT_INDEX: 1,
    ROW_DATA_BEGGIN_INDEX: 10,
    COL_DATA_BEGGIN_INDEX: 5,
    ATTRIBUTE_INDEXS: {
      maItem: 3,
    },
  },
  [RequirementsStandardSetType['ltr-prc-lt-10000c'].text]: {
    ROW_PRODUCT_INDEX: 1,
    ROW_DATA_BEGGIN_INDEX: 15,
    COL_DATA_BEGGIN_INDEX: 5,
    ATTRIBUTE_INDEXS: {
      maItem: 3,
    },
  },
  [RequirementsStandardSetType['ltr-prc-gt-1000c'].text]: {
    ROW_PRODUCT_INDEX: 1,
    ROW_DATA_BEGGIN_INDEX: 15,
    COL_DATA_BEGGIN_INDEX: 5,
    ATTRIBUTE_INDEXS: {
      maItem: 3,
    },
  },
  [RequirementsStandardSetType['sm'].text]: {
    ROW_PRODUCT_INDEX: 1,
    ROW_DATA_BEGGIN_INDEX: 13,
    COL_DATA_BEGGIN_INDEX: 5,
    ATTRIBUTE_INDEXS: {
      maItem: 3,
    },
  },
  [RequirementsStandardSetType['ibd-od-yem'].text]: {
    ROW_PRODUCT_INDEX: 1,
    ROW_DATA_BEGGIN_INDEX: 10,
    COL_DATA_BEGGIN_INDEX: 5,
    ATTRIBUTE_INDEXS: {
      maItem: 3,
    },
  },
  [RequirementsStandardSetType['dng'].text]: {
    ROW_PRODUCT_INDEX: 0,
    ROW_DATA_BEGGIN_INDEX: 6,
    COL_DATA_BEGGIN_INDEX: 4,
    ATTRIBUTE_INDEXS: {
      maItem: 2,
    },
  },
};

const IGNORE_KEYWORDS: string[] = [
  'TỔNG CỘNG',
  'Mã tanh →',
  'Vải thân 1→',
  'Vải thân 2→',
  'Vải thân 3→',
  'Bọc mũ 1→',
  'Bọc mũ 2→',
  'Bọc gót→',
  'Mã HX1',
  'Mã HX2',
  'TLg Hoãn xung 1',
  'TLg Hoãn xung 2',
  'Mã lưu hóa →',
  'TL Lốp sống',
  'TL BCP Tanh',
  'Thời gian lưu hóa',
  'Check trước khi gửi DM cho P.KH',
];

class RequirementsStandardSetExcelReader extends AbstractExcelReader<DmMasterBoDinhMucWithRelations> {
  protected readDataImpl(): DmMasterBoDinhMucWithRelations {
    if (!this.workbook) {
      throw new Error('Invalid template');
    }

    if (!(this.workbook.SheetNames[0] in SHEET_RANGE_CONSTANTS)) {
      throw new Error(`Invalid sheet names, sheet name must be in ${Object.keys(SHEET_RANGE_CONSTANTS)}`);
    }

    const sheetName = String(this.workbook.SheetNames[0] as keyof typeof SHEET_RANGE_CONSTANTS);
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
    const dto: DmMasterBoDinhMucWithRelations = {
      maBoDinhMuc: '',
      loaiBoDinhMuc: getRequirementsStandardSetTypeByText(sheetName)?.id,
      dinhMucs: [],
    };
    const rowProductIndex = SHEET_RANGE_CONSTANTS[sheetName].ROW_PRODUCT_INDEX;
    const rowDataBegginIndex = SHEET_RANGE_CONSTANTS[sheetName].ROW_DATA_BEGGIN_INDEX;
    const colDataBegginIndex = SHEET_RANGE_CONSTANTS[sheetName].COL_DATA_BEGGIN_INDEX;
    const attributeIndexs = SHEET_RANGE_CONSTANTS[sheetName].ATTRIBUTE_INDEXS;

    for (let colProductIndex = colDataBegginIndex; colProductIndex <= colEndIndex; colProductIndex++) {
      const maThanhPham = recordsRawData[rowProductIndex][colProductIndex];
      if (maThanhPham) {
        // Convert dinhMuc data
        const dinhMucDto: DmTransDinhMucWithRelations = {
          maThanhPham,
          dinhMucItems: [],
        };

        // Convert list dinhMucItems data
        for (let recordIndex = rowDataBegginIndex; recordIndex <= rowEndIndex; recordIndex++) {
          const maItem = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maItem]);
          const dinhMucValue = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][colProductIndex]);
          if (
            maItem &&
            !IGNORE_KEYWORDS.includes(maItem) &&
            dinhMucValue &&
            !Number.isNaN(dinhMucValue) &&
            Number(dinhMucValue) !== 0
          ) {
            // Convert dinhMucItem data
            const dinhMucItemDto: DmTransDinhMucItemWithRelations = { maItem, dinhMucValue: Number(dinhMucValue) };

            dinhMucDto.dinhMucItems?.push(dinhMucItemDto);
          }
        }

        dto.dinhMucs?.push(dinhMucDto);
      }
    }

    return dto;
  }
}

export default RequirementsStandardSetExcelReader;
