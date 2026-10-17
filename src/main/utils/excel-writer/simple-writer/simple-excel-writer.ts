import ExcelJS from 'exceljs';
import moment from 'moment';

/**
 * Xuất dữ liệu JSON ra file Excel.
 * @param {Array} jsonData - Dữ liệu JSON từ API (danh sách các đối tượng).
 * @param apiFields - Các field dữ liệu trong jsonData không muốn xuất ra file Excel.
 * @param columnNames - Tên các cột header trong file Excel mapping với api fields.
 */
async function exportJsonToExcel(
  jsonData: Array<Record<string, any>> | undefined,
  apiFields: string[],
  columnNames: string[],
) {
  // Tạo workbook và worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  if (!jsonData || jsonData.length === 0) {
    throw new Error('Không có dữ liệu để xuất file');
  }

  // Tạo tiêu đề cột từ danh sách fields cố định
  const columns = columnNames.map((name) => ({
    header: name,
    key: name,
    width: 20,
    style: name.toLowerCase().includes('ngay') ? { numFmt: 'dd-mm-yyyy' } : {}, // Định dạng ngày nếu cần
  }));

  try {
    // Thêm tiêu đề cột vào worksheet
    worksheet.columns = columns;

    // In đậm header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };

    // Lấy data theo fields được yêu cầu xuất
    for (const item of jsonData) {
      const row = columnNames.reduce(
        (accumulator, columnName, index) => {
          const apiField = apiFields[index]; // Map field từ API với tên cột
          accumulator[columnName] =
            apiField.toLowerCase().includes('ngay') && moment(item[apiField]).isValid()
              ? moment(item[apiField]).toDate() // Định dạng lại cho kiểu ngày
              : item[apiField];
          return accumulator;
        },
        {} as Record<string, any>,
      );
      // Thêm dữ liệu từng hàng vào worksheet
      worksheet.addRow(row);
    }

    // Ghi dữ liệu ra buffer
    return await workbook.xlsx.writeBuffer();
  } catch (error: any) {
    throw new Error(`Lỗi khi xuất file: ${error?.message}`);
  }
}

export default exportJsonToExcel;
