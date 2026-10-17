import ExcelJS from 'exceljs';
import { KhovtTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import { AbstractExcelWriter } from 'main/utils/excel-writer';
import { writeDataSheetKH03 } from './services';

class SuppliesStoreExportExcelWriter extends AbstractExcelWriter<{
  filter: ExportSuppliesISOReportFilter;
  content: {
    exportItems: KhovtTransPhieuXuatControllerFindDetail200DataItem[];
  };
}> {
  protected async writeDataImpl(): Promise<ExcelJS.Buffer> {
    const workbook = this.workbook;
    if (!workbook) {
      throw new Error('Invalid template');
    }

    // 4. Sheet[KH.03]
    this.writeDataSheetKH03(workbook);

    return await workbook.xlsx.writeBuffer();
  }

  private writeDataSheetKH03(workbook: ExcelJS.Workbook): void {
    writeDataSheetKH03(workbook, { filter: this.data?.filter, items: this.data?.content.exportItems });
  }
}

export default SuppliesStoreExportExcelWriter;
