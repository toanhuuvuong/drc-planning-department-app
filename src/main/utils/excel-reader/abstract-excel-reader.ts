import { read, WorkBook } from 'xlsx';
import FileUtil from '../file-util';

abstract class AbstractExcelReader<T> {
  protected workbook: WorkBook | undefined;
  protected sheetName: string = '';
  protected additionalProps: any | undefined;

  async readData(file: File) {
    const fileData = await FileUtil.fileToUint8Array(file);
    this.workbook = read(fileData, { type: 'array', cellDates: true });

    // Check sheetname
    if (!this.workbook.SheetNames || this.workbook.SheetNames.length < 1 || !this.workbook.SheetNames[0]) {
      throw new Error('Sheet names is required');
    }
    this.sheetName = this.workbook.SheetNames[0];

    return this.readDataImpl();
  }

  async readData2(sheetName: string, file: File) {
    const fileData = await FileUtil.fileToUint8Array(file);
    this.workbook = read(fileData, { type: 'array', cellDates: true });

    // Check sheetname
    if (!sheetName) {
      throw new Error('Sheet names is required');
    }
    this.sheetName = sheetName;

    return this.readDataImpl();
  }

  async readData3(file: File, additionalProps: any) {
    this.additionalProps = additionalProps;
    return this.readData(file);
  }

  protected abstract readDataImpl(): T;
}

export default AbstractExcelReader;
