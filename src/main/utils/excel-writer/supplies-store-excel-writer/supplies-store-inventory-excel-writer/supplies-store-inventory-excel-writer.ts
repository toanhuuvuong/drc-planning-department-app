import ExcelJS from 'exceljs';
import { KhovtXuatNhapTonControllerFind200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import { AbstractExcelWriter } from 'main/utils/excel-writer';
import { writeDataSheetBangTongHop } from './services';

class SuppliesStoreInventoryExcelWriter extends AbstractExcelWriter<{
  filter: ExportSuppliesISOReportFilter;
  content: {
    inventoryItems: KhovtXuatNhapTonControllerFind200DataItem[];
  };
}> {
  protected async writeDataImpl(): Promise<ExcelJS.Buffer> {
    const workbook = this.workbook;
    if (!workbook) {
      throw new Error('Invalid template');
    }

    // 1. Sheet[Bang Tong Hop]
    this.writeDataSheetBangTongHop(workbook);

    return await workbook.xlsx.writeBuffer();
  }

  private writeDataSheetBangTongHop(workbook: ExcelJS.Workbook): void {
    writeDataSheetBangTongHop(workbook, { filter: this.data?.filter, items: this.data?.content.inventoryItems });
  }
}

export default SuppliesStoreInventoryExcelWriter;
