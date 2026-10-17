import ExcelJS from 'exceljs';
abstract class AbstractExcelWriter<T> {
  protected data: T | undefined;
  protected workbook: ExcelJS.Workbook | undefined;

  async writeData(templatePath?: string, data?: T) {
    if (!data || !templatePath) {
      return null;
    }
    this.data = data;
    this.workbook = new ExcelJS.Workbook();
    const file = await fetch(templatePath);
    const buffer = await file.arrayBuffer();
    await this.workbook.xlsx.load(buffer);
    return this.writeDataImpl();
  }

  protected abstract writeDataImpl(): Promise<ExcelJS.Buffer>;
}

export default AbstractExcelWriter;
