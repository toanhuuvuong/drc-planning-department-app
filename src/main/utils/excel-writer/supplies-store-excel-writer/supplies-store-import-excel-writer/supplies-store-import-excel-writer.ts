import ExcelJS from 'exceljs';
import { KhovtTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { ExportSuppliesISOReportFilter } from 'main/components/pages/admin/supplies-store-inventory/supplies-store-inventory-list/sub-components/supplies-store-inventory-table/export-supplies-iso-report-modal';
import AbstractExcelWriter from 'main/utils/excel-writer/abstract-excel-writer';
import { writeDataSheetKH22 } from './services';

class SuppliesStoreImportExcelWriter extends AbstractExcelWriter<{
  filter: ExportSuppliesISOReportFilter;
  content: {
    importItems: KhovtTransPhieuNhapControllerFindDetail200DataItem[];
  };
}> {
  protected async writeDataImpl(): Promise<ExcelJS.Buffer> {
    const workbook = this.workbook;
    if (!workbook) {
      throw new Error('Invalid template');
    }

    // 5. Sheet[KH.22]
    this.writeDataSheetKH22(workbook);

    return await workbook.xlsx.writeBuffer();
  }

  private writeDataSheetKH22(workbook: ExcelJS.Workbook): void {
    writeDataSheetKH22(workbook, { filter: this.data?.filter, items: this.data?.content.importItems });
  }
}

export default SuppliesStoreImportExcelWriter;
