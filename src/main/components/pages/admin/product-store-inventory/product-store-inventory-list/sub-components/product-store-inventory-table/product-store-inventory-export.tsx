import ExcelJS, { Alignment, Borders, Font } from 'exceljs';
import { saveAs } from 'file-saver';
import { KhotpXuatNhapTonControllerSearchCanhBao200Item } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import moment from 'moment';

// Define reusable styles
const headerFont: Partial<Font> = { bold: true, name: 'Times New Roman', size: 13 };
const dataFont: Partial<Font> = { name: 'Times New Roman', size: 13 };
// Add a style for the group header
const groupHeaderFont: Partial<Font> = { bold: true, name: 'Times New Roman', size: 13 };
const centerMiddleAlignment: Partial<Alignment> = { vertical: 'middle', horizontal: 'center', wrapText: true };
const leftMiddleAlignment: Partial<Alignment> = { vertical: 'middle', horizontal: 'left', wrapText: true };
const rightMiddleAlignment: Partial<Alignment> = { vertical: 'middle', horizontal: 'right', wrapText: true };
const allThinBorders: Partial<Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

// Column definitions for better maintainability
const columnDefinitions = [
  { key: 'A', header: 'STT', width: 10, alignment: centerMiddleAlignment },
  // Remove KHO from individual rows as it's now a group header
  { key: 'B', header: 'KHO', width: 10, alignment: centerMiddleAlignment },
  { key: 'C', header: 'VỊ TRÍ', width: 10, alignment: centerMiddleAlignment },
  { key: 'D', header: 'MÃ SẢN PHẨM', width: 45, alignment: leftMiddleAlignment }, // Changed alignment
  { key: 'E', header: 'TÊN/QUY CÁCH SP', width: 50, alignment: leftMiddleAlignment }, // Changed alignment
  { key: 'F', header: 'ĐVT', width: 10, alignment: centerMiddleAlignment },
  { key: 'G', header: 'TP CLC', width: 15, alignment: rightMiddleAlignment },
  { key: 'H', header: 'THỜI ĐIỂM SẢN XUẤT', width: 25, alignment: centerMiddleAlignment },
  { key: 'I', header: 'NGUYÊN NHÂN CHẬM LUÂN CHUYỂN', width: 35, alignment: centerMiddleAlignment },
  { key: 'J', header: 'HƯỚNG XỬ LÝ CỦA CÁC PHÒNG BAN', width: 50, alignment: centerMiddleAlignment },
  { key: 'K', header: 'KẾT LUẬN CỦA TGĐ CUỘC HỌP', width: 50, alignment: centerMiddleAlignment },
];

// Helper function to apply common cell styles
const applyCellStyles = (
  cell: ExcelJS.Cell,
  options: {
    font?: Partial<Font>;
    alignment?: Partial<Alignment>;
    applyBorders?: boolean;
  },
) => {
  if (options.font) {
    cell.font = options.font;
  }
  if (options.alignment) {
    cell.alignment = options.alignment;
  }
  if (options.applyBorders) {
    cell.border = allThinBorders;
  }
};

const UroductStoreInventoryExport = async (data: KhotpXuatNhapTonControllerSearchCanhBao200Item[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('TH');

  // Set default properties
  worksheet.properties.defaultRowHeight = 18;
  worksheet.properties.outlineLevelRow = 0;

  // Set zoom scale to 80%
  worksheet.views = [
    {
      zoomScale: 80,
    },
  ];

  // --- Header Rows ---
  // Adjust merge range if columns changed (e.g., KHO removed)
  const lastColumnLetter = columnDefinitions[columnDefinitions.length - 1].key;
  const mergeRange = `A1:${lastColumnLetter}1`;
  const mergeRange2 = `A2:${lastColumnLetter}2`;
  const mergeRange3 = `A3:${lastColumnLetter}3`;

  // Row 1: Company Name
  worksheet.mergeCells(mergeRange);
  const row1 = worksheet.getCell('A1');
  row1.value = 'CÔNG TY CỔ PHẦN CAO SU ĐÀ NẴNG';
  applyCellStyles(row1, { font: headerFont, alignment: leftMiddleAlignment });
  worksheet.getRow(1).height = 20;

  // Row 2: Department
  worksheet.mergeCells(mergeRange2);
  const row2 = worksheet.getCell('A2');
  row2.value = 'BP. KHO VẬN - P. KẾ HOẠCH';
  applyCellStyles(row2, { font: headerFont, alignment: leftMiddleAlignment });
  worksheet.getRow(2).height = 20;

  // Row 3: Report Title
  worksheet.mergeCells(mergeRange3);
  const currentMonthYear = moment().format('MM/YYYY');
  const row3 = worksheet.getCell('A3');
  row3.value = `BẢNG KÊ THÀNH PHẨM CHẬM LUÂN CHUYỂN THÁNG ${currentMonthYear}`;
  applyCellStyles(row3, { font: { ...headerFont, size: 28 }, alignment: centerMiddleAlignment });
  worksheet.getRow(3).height = 35;

  // Set column widths based on definitions
  // Adjust column keys if needed
  worksheet.getColumn('A').width = columnDefinitions[0].width; // STT
  worksheet.getColumn('B').width = columnDefinitions[1].width; // KHO
  worksheet.getColumn('C').width = columnDefinitions[2].width; // VỊ TRÍ
  worksheet.getColumn('D').width = columnDefinitions[3].width; // MÃ SẢN PHẨM
  worksheet.getColumn('E').width = columnDefinitions[4].width; // TÊN/QUY CÁCH SP
  worksheet.getColumn('F').width = columnDefinitions[5].width; // ĐVT
  worksheet.getColumn('G').width = columnDefinitions[6].width; // TP CLC
  worksheet.getColumn('H').width = columnDefinitions[7].width; // THỜI ĐIỂM SẢN XUẤT
  worksheet.getColumn('I').width = columnDefinitions[8].width; // NGUYÊN NHÂN
  worksheet.getColumn('J').width = columnDefinitions[9].width; // HƯỚNG XỬ LÝ
  worksheet.getColumn('K').width = columnDefinitions[10].width; // KẾT LUẬN

  // Row 4: Column Headers
  const headerRow = worksheet.addRow(columnDefinitions.map((col) => col.header));
  headerRow.height = 30;
  headerRow.eachCell((cell, colIdx) => {
    // Adjust index for alignment lookup if columns changed
    applyCellStyles(cell, {
      font: headerFont,
      alignment: centerMiddleAlignment, // Added: Apply center alignment to all header cells
      applyBorders: true,
    });
  });

  // --- Group Data by Warehouse ---
  const groupedData = data.reduce(
    (acc, item) => {
      const warehouseName = item[FieldName.TEN_KHO] ?? 'Không xác định';
      if (!acc[warehouseName]) {
        acc[warehouseName] = [];
      }
      acc[warehouseName].push(item);
      return acc;
    },
    {} as Record<string, KhotpXuatNhapTonControllerSearchCanhBao200Item[]>,
  );

  // --- Data Rows with Grouping ---
  const warehouseNames = Object.keys(groupedData).sort(); // Sort warehouse names if needed

  warehouseNames.forEach((warehouseName) => {
    const itemsInGroup = groupedData[warehouseName];

    // Calculate the sum of SO_LUONG_TON for the group
    const groupSum = itemsInGroup.reduce((sum, item) => {
      const value = item[FieldName.SO_LUONG];
      // Ensure value is a number before adding
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);

    // Add Group Header Row
    const groupHeaderRowIndex = worksheet.rowCount + 1;
    // Merge cells for the group header text (Kho Name)
    worksheet.mergeCells(`A${groupHeaderRowIndex}:F${groupHeaderRowIndex}`);
    // Merge cells for the group sum
    worksheet.mergeCells(`G${groupHeaderRowIndex}:G${groupHeaderRowIndex}`);
    worksheet.mergeCells(`H${groupHeaderRowIndex}:K${groupHeaderRowIndex}`);

    // Set values for the merged cells
    worksheet.getCell(`A${groupHeaderRowIndex}`).value = `Kho: ${warehouseName}`;
    worksheet.getCell(`G${groupHeaderRowIndex}`).value = groupSum; // Display the calculated sum

    const groupHeaderRow = worksheet.getRow(groupHeaderRowIndex);
    groupHeaderRow.height = 22; // Slightly taller group header

    // Apply border, fill, font, and alignment to all cells in the group header row
    groupHeaderRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.border = allThinBorders;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' }, // Apply the desired background color
      };
      cell.font = groupHeaderFont;

      // Apply alignment based on the column/merged range
      if (colNumber >= 1 && colNumber <= 6) {
        // Kho Name part
        cell.alignment = centerMiddleAlignment; // Keep center alignment for Kho name part
      } else if (colNumber >= 7 && colNumber <= 11) {
        // Sum part
        cell.alignment = rightMiddleAlignment; // Apply right alignment for the sum
      }
    });

    // Add Data Rows for the current group
    let groupStt = 1; // Reset STT for each group
    itemsInGroup.forEach((item) => {
      const ngayNhap = item[FieldName.NGAY_NHAP];
      const formattedNgayNhap = ngayNhap ? moment(ngayNhap).format('DD-MM-YYYY') : '';

      const rowData = [
        groupStt++, // Use group-specific STT
        item[FieldName.MA_KHO_NHAP] ?? '', // KHO (Column B)
        item[FieldName.VI_TRI] ?? '', // VỊ TRÍ (Column C)
        item[FieldName.MA_SAN_PHAM] ?? '', // MÃ SẢN PHẨM (Column D)
        item[FieldName.TEN_SAN_PHAM] ?? '', // TÊN/QUY CÁCH SP (Column E)
        item[FieldName.DVT] ?? '', // ĐVT (Column F)
        item[FieldName.SO_LUONG] ?? 0, // TP CLC (Column G) - Use actual data, default to 0
        formattedNgayNhap, // THỜI ĐIỂM SẢN XUẤT (Column H) - Formatted date
        '', // Placeholder for NGUYÊN NHÂN (Column I)
        '', // Placeholder for HƯỚNG XỬ LÝ (Column J)
        '', // Placeholder for KẾT LUẬN (Column K)
      ];

      const dataRow = worksheet.addRow(rowData);
      dataRow.height = 18;

      dataRow.eachCell({ includeEmpty: true }, (cell, colIdx) => {
        // Adjust index for alignment lookup if columns changed
        applyCellStyles(cell, {
          font: dataFont,
          alignment: columnDefinitions[colIdx - 1].alignment, // Make sure this index is correct
          applyBorders: true,
        });
        // Ensure number format for the quantity column (G)
        if (colIdx === 7) {
          // Column G is TP CLC (SO_LUONG_TON)
          cell.numFmt = '#,##0'; // Optional: Apply number formatting
        }
      });
    });
  });

  // --- Add Grand Total Row ---
  const grandTotal = data.reduce((sum, item) => {
    const value = item[FieldName.SO_LUONG];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);

  const totalRowIndex = worksheet.rowCount + 1;

  // Set values for the merged cells
  worksheet.getCell(`G${totalRowIndex}`).value = grandTotal;
  worksheet.getCell(`G${totalRowIndex}`).numFmt = '#,##0'; // Apply number formatting
  worksheet.getCell(`G${totalRowIndex}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFC6E0B4' }, // A slightly different color for distinction, e.g., light green
  };
  worksheet.getCell(`G${totalRowIndex}`).alignment = centerMiddleAlignment;
  worksheet.getCell(`G${totalRowIndex}`).font = { ...groupHeaderFont, bold: true }; // Make total row font bold

  const totalRow = worksheet.getRow(totalRowIndex);
  totalRow.height = 22; // Set height similar to group header

  // --- Generate and Save File ---
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `BaoCaoTonKhoChamLuanChuyen_${moment().format('YYYYMMDD_HHmmss')}.xlsx`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating or saving Excel file:', error);
    throw error;
  }
};

export default UroductStoreInventoryExport;
