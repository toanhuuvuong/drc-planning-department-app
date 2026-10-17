import { QldhTransDonHangItemWithRelations, QldhTransDonHangWithRelations } from 'main/apis/drc/models';
import { AbstractExcelReader } from '.';
import { ExcelUtil } from '..';

const SHEET_RANGE_CONSTANTS: {
  ROW_DATA_BEGGIN_INDEX: number;
  ATTRIBUTE_INDEXS: {
    stt: number;
    maKH: number;
    ngayGiaoDuKien: number;
    ngayGiaoThucTe: number;
    nguoiTao: number;
    nguoiYeuCau: number;
    ghiChuDonHang: number;
    maKhoXuat: number;
    maSanPham: number;
    soLuong: number;
    soLuongGiuHang: number;
    yeuCauDongGoi: number;
    ghiChu: number;
  };
} = {
  ROW_DATA_BEGGIN_INDEX: 1,
  ATTRIBUTE_INDEXS: {
    stt: 0,
    maKH: 1,
    ngayGiaoDuKien: 2,
    ngayGiaoThucTe: 3,
    nguoiTao: 4,
    nguoiYeuCau: 5,
    ghiChuDonHang: 6,
    maKhoXuat: 1,
    maSanPham: 2,
    soLuong: 3,
    soLuongGiuHang: 4,
    yeuCauDongGoi: 5,
    ghiChu: 6,
  },
};

class OrderImportExcelReader extends AbstractExcelReader<{ donHangs: QldhTransDonHangWithRelations[] }> {
  protected readDataImpl(): { donHangs: QldhTransDonHangWithRelations[] } {
    if (!this.workbook) {
      throw new Error('Invalid template');
    }

    const dto: { donHangs: QldhTransDonHangWithRelations[] } = {
      donHangs: [],
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
      const recordDto: QldhTransDonHangWithRelations = {
        ngayGiaoDuKien: '',
        ngayGiaoThucTe: '',
        ngayDatHang: '',
        nguoiTao: '',
        nguoiYeuCau: '',
        donHangItems: [],
      };
      for (let recordIndex = rowDataBegginIndex; recordIndex <= rowEndIndex; recordIndex++) {
        if (recordIndex === rowDataBegginIndex) {
          recordDto.maKH = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maKH]);
          recordDto.ngayGiaoDuKien = ExcelUtil.normalizeCellData(
            recordsRawData[recordIndex][attributeIndexs.ngayGiaoDuKien],
          );
          recordDto.ngayGiaoThucTe = ExcelUtil.normalizeCellData(
            recordsRawData[recordIndex][attributeIndexs.ngayGiaoThucTe],
          );
          recordDto.nguoiTao = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.nguoiTao]);
          recordDto.nguoiYeuCau = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.nguoiYeuCau]);
          recordDto.ghiChu = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.ghiChuDonHang]);
        } else {
          if (
            recordsRawData[recordIndex][attributeIndexs.maSanPham] &&
            Number.isInteger(recordsRawData[recordIndex][attributeIndexs.stt])
          ) {
            const donHangItem: QldhTransDonHangItemWithRelations = {
              soLuong: 0,
            };

            donHangItem.maKhoXuat = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maKhoXuat]);
            donHangItem.maSanPham = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.maSanPham]);
            donHangItem.soLuong = Number(
              ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.soLuong]),
            );
            donHangItem.soLuongGiuHang = Number(
              ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.soLuongGiuHang]),
            );
            donHangItem.yeuCauDongGoi = ExcelUtil.normalizeCellData(
              recordsRawData[recordIndex][attributeIndexs.yeuCauDongGoi],
            );
            donHangItem.ghiChu = ExcelUtil.normalizeCellData(recordsRawData[recordIndex][attributeIndexs.ghiChu]);

            // Add donHangItems to donHang
            recordDto.donHangItems?.push(donHangItem);
          }
        }
      }

      // Add donHangs to array
      dto.donHangs?.push(recordDto);
    }

    return dto;
  }
}

export default OrderImportExcelReader;
