import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

type DataItem = {
  [key: string]: any;
};

export const exportToExcel = (data?: DataItem[], fileName: string = 'export.xlsx'): void => {
  // Chuyển đổi dữ liệu thành định dạng Sheet
  const worksheet = XLSX.utils.json_to_sheet(data || []);

  // Tạo Workbook và thêm Sheet vào Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Ghi Workbook thành file Excel dưới dạng buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Sử dụng `file-saver` để lưu file
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
};
