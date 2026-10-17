import ExcelJS from 'exceljs';
import { KhovtXuatNhapTonControllerFindDetailByLoHang200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import { AbstractExcelWriter } from 'main/utils/excel-writer';
import { writeDataSheetBangTHChiTietTungLoHang } from './services';

class SuppliesStoreInventoryDetailByLoHangExcelWriter extends AbstractExcelWriter<{
  filter: ExportSuppliesISOReportFilter;
  content: {
    inventoryDetailByLoHangItems: KhovtXuatNhapTonControllerFindDetailByLoHang200DataItem[];
  };
}> {
  protected async writeDataImpl(): Promise<ExcelJS.Buffer> {
    const workbook = this.workbook;
    if (!workbook) {
      throw new Error('Invalid template');
    }

    // 2. Sheet[Bảng TH Chi tiết từng lô hàng]
    this.writeDataSheetBangTHChiTietTungLoHang(workbook);

    return await workbook.xlsx.writeBuffer();
  }

  private writeDataSheetBangTHChiTietTungLoHang(workbook: ExcelJS.Workbook): void {
    writeDataSheetBangTHChiTietTungLoHang(workbook, {
      filter: this.data?.filter,
      items: this.data?.content.inventoryDetailByLoHangItems,
    });
  }
}

export default SuppliesStoreInventoryDetailByLoHangExcelWriter;
