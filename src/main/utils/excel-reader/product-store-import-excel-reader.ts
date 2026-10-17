import { KhotpTransLenhNhapRawDetailWithRelations, KhotpTransLenhNhapWithRelations } from 'main/apis/drc/models';
import { ProductExcelTemplateType } from 'main/constants/enums';
import { AbstractExcelReader } from '.';
import { DateUtil, ExcelUtil } from '..';

type AttributeIndexsType = {
  maSanPham: number;
  soLuong?: number;
  maPhieuXuat?: number;
  barCode?: number;
  maKhoNhap?: number;
  maKhoXuat?: number;
  ngayNhap?: number;
  ghiChu?: number;
  viTri?: number;
};
const SHEET_RANGE_CONSTANTS: {
  [key: string]: {
    ROW_DATA_BEGGIN_INDEX: number;
    ATTRIBUTE_INDEXS: AttributeIndexsType;
    [additionalProps: string]: any;
  };
} = {
  [ProductExcelTemplateType['luyen-bias'].id]: {
    ROW_DATA_BEGGIN_INDEX: 1,
    ATTRIBUTE_INDEXS: {
      maSanPham: 2,
      maPhieuXuat: 3,
      maKhoNhap: 12,
      maKhoXuat: 8,
      barCode: 0,
      ngayNhap: 5,
    },
  },
  [ProductExcelTemplateType['luyen-radial'].id]: {
    ROW_DATA_BEGGIN_INDEX: 1,
    ATTRIBUTE_INDEXS: {
      maSanPham: 2,
      maPhieuXuat: 3,
      maKhoNhap: 13,
      maKhoXuat: 8,
      barCode: 0,
      ngayNhap: 5,
      ghiChu: 16,
    },
  },
  [ProductExcelTemplateType['xdxm'].id]: {
    ROW_DATA_BEGGIN_INDEX: 3,
    ATTRIBUTE_INDEXS: {
      maSanPham: 6,
      soLuong: 10,
      viTri: 14,
      maKhoNhap: 13,
    },
  },
  [ProductExcelTemplateType['dap-lop'].id]: {
    ROW_NGAY_NHAP_INDEX: 2,
    ROW_DATA_BEGGIN_INDEX: 4,
    ATTRIBUTE_INDEXS: {
      maSanPham: 2,
      ngayNhap: 8, // start index of array ngayNhaps & soLuongs
    },
  },
};

class ProductStoreImportExcelReader extends AbstractExcelReader<KhotpTransLenhNhapWithRelations> {
  protected readDataImpl(): KhotpTransLenhNhapWithRelations {
    if (!this.workbook) {
      throw new Error('Invalid template');
    }

    const sheetName = this.sheetName;
    const workbookSheetName = this.workbook.SheetNames[0];
    const sheetDataRange = ExcelUtil.getSheetRange(this.workbook, workbookSheetName);
    const colBeginIndex = 0;
    const colEndIndex = sheetDataRange.e.c;
    const rowBeginIndex = 0;
    const rowEndIndex = sheetDataRange.e.r;

    // Load records from excel
    const recordsRawData = ExcelUtil.loadDataByRange(this.workbook, workbookSheetName, {
      colBeginIndex,
      rowBeginIndex,
      colEndIndex,
      rowEndIndex,
    });

    // Load array ngayNhaps from excel (only for dap-lop template)
    let ngayNhapsDapLopRawData: string[][] = [];
    if (sheetName === ProductExcelTemplateType['dap-lop'].id) {
      ngayNhapsDapLopRawData = ExcelUtil.loadDataByRange(this.workbook, workbookSheetName, {
        colBeginIndex,
        rowBeginIndex: Number(SHEET_RANGE_CONSTANTS[sheetName].ROW_NGAY_NHAP_INDEX),
        colEndIndex,
        rowEndIndex: Number(SHEET_RANGE_CONSTANTS[sheetName].ROW_NGAY_NHAP_INDEX),
      });
    }

    // Convert raw data to dto
    const dto: KhotpTransLenhNhapWithRelations = {
      loaiLenhNhap: sheetName,
      rawDetails: [],
    };
    const rowDataBegginIndex = SHEET_RANGE_CONSTANTS[sheetName].ROW_DATA_BEGGIN_INDEX;
    const attributeIndexs = SHEET_RANGE_CONSTANTS[sheetName].ATTRIBUTE_INDEXS;

    // Convert rawDetails to dto
    if (sheetName === ProductExcelTemplateType['dap-lop'].id) {
      dto.rawDetails = this.readRawDetailsDapLop(
        rowDataBegginIndex,
        rowEndIndex,
        colEndIndex,
        ngayNhapsDapLopRawData,
        recordsRawData,
        attributeIndexs,
      );
    } else {
      dto.rawDetails = this.readRawDetails(rowDataBegginIndex, rowEndIndex, recordsRawData, attributeIndexs);
    }

    return dto;
  }

  private readRawDetailsDapLop(
    rowDataBegginIndex: number,
    rowEndIndex: number,
    colEndIndex: number,
    ngayNhapsRawData: string[][],
    recordsRawData: string[][],
    attributeIndexs: AttributeIndexsType,
  ) {
    const rawDetails = [];
    const colNgayNhapsBegginIndex = Number(attributeIndexs.ngayNhap);

    for (let recordIndex = rowDataBegginIndex; recordIndex <= rowEndIndex; recordIndex++) {
      const maSanPham = recordsRawData[recordIndex][attributeIndexs.maSanPham];
      if (maSanPham) {
        for (let ngayNhapIndex = colNgayNhapsBegginIndex; ngayNhapIndex <= colEndIndex; ngayNhapIndex++) {
          const soLuong = recordsRawData[recordIndex][ngayNhapIndex];
          if (soLuong) {
            // Convert to detail dto
            const recordDto: KhotpTransLenhNhapRawDetailWithRelations = {};
            recordDto.maSanPham = ExcelUtil.normalizeCellData(maSanPham);
            recordDto.soLuong = Number(ExcelUtil.normalizeCellData(soLuong));
            const ngayNhap = DateUtil.createDateWithDayOfMonth(
              Number(ExcelUtil.normalizeCellData(ngayNhapsRawData[0][ngayNhapIndex])),
            );
            recordDto.ngayNhap = DateUtil.toDateISOString(ngayNhap);

            // Add detail to array
            rawDetails.push(recordDto);
          }
        }
      }
    }

    return rawDetails;
  }

  private readRawDetails(
    rowDataBegginIndex: number,
    rowEndIndex: number,
    recordsRawData: string[][],
    attributeIndexs: AttributeIndexsType,
  ) {
    const rawDetails = [];

    for (let recordIndex = rowDataBegginIndex; recordIndex <= rowEndIndex; recordIndex++) {
      if (
        recordsRawData[recordIndex][attributeIndexs.maSanPham] &&
        ((attributeIndexs.soLuong !== undefined && recordsRawData[recordIndex][attributeIndexs.soLuong]) ||
          attributeIndexs.soLuong === undefined)
      ) {
        // Convert to detail dto
        const recordDto: KhotpTransLenhNhapRawDetailWithRelations = {};
        recordDto.maSanPham = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maSanPham]);
        if (attributeIndexs.soLuong !== undefined) {
          recordDto.soLuong = Number(ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.soLuong]));
        } else {
          recordDto.soLuong = 1;
        }
        if (attributeIndexs.maPhieuXuat !== undefined) {
          recordDto.maPhieuXuat = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maPhieuXuat]);
        }
        if (attributeIndexs.maKhoNhap !== undefined) {
          recordDto.maKhoNhap = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maKhoNhap]);
        }
        if (attributeIndexs.maKhoXuat !== undefined) {
          recordDto.maKhoXuat = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maKhoXuat]);
        }
        if (attributeIndexs.barCode !== undefined) {
          recordDto.barCode = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.barCode]);
        }
        if (attributeIndexs.ngayNhap !== undefined) {
          recordDto.ngayNhap = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.ngayNhap]);
        }
        if (attributeIndexs.ghiChu !== undefined) {
          recordDto.ghiChu = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.ghiChu]);
        }
        if (attributeIndexs.viTri !== undefined) {
          recordDto.viTri = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.viTri]);
        }

        // Add detail to array
        rawDetails.push(recordDto);
      }
    }

    return rawDetails;
  }
}

export default ProductStoreImportExcelReader;
