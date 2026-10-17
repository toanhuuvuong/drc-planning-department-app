import ExcelJS from 'exceljs';
import { KhovtXuatNhapTonControllerFindDetailBySoPhieu200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import { AbstractExcelWriter } from 'main/utils/excel-writer';
import { writeDataSheetTheKho } from './services';

class SuppliesStoreInventoryDetailBySoPhieuExcelWriter extends AbstractExcelWriter<{
  filter: ExportSuppliesISOReportFilter;
  content: {
    inventoryDetailBySoPhieuItems: KhovtXuatNhapTonControllerFindDetailBySoPhieu200DataItem[];
  };
}> {
  protected async writeDataImpl(): Promise<ExcelJS.Buffer> {
    const workbook = this.workbook;
    if (!workbook) {
      throw new Error('Invalid template');
    }

    // 3. Sheet[Thẻ Kho]
    this.writeDataSheetTheKho(workbook);

    return await workbook.xlsx.writeBuffer();
  }

  private writeDataSheetTheKho(workbook: ExcelJS.Workbook): void {
    writeDataSheetTheKho(workbook, {
      filter: this.data?.filter,
      items: this.data?.content.inventoryDetailBySoPhieuItems,
    });
  }
}

export default SuppliesStoreInventoryDetailBySoPhieuExcelWriter;
