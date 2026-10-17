interface ExportStatus {
  id?: string;
  text: string;
}

const ProductExportStatus: ExportStatus[] = [
  { id: 'in', text: 'Chờ xuất hàng' },
  { id: 'in-lated', text: 'Chậm luân chuyển - Chờ xuất' },
  { id: 'in-expired', text: 'Quá hạn lưu kho' },
  { id: 'in-wait', text: 'Chờ kiểm định lại' },
  { id: 'in-selloff', text: 'Chờ thanh lý' },
  { id: 'out', text: 'Đã xuất hàng' },
];

const ProductCommandExportStatus = {
  '0': { id: '0', text: 'Chưa xuất hàng' },
  '1': { id: '1', text: 'Đang xuất hàng' },
  '2': { id: '2', text: 'Đã xuất hàng' },
};

const ProductExportWarehouses: ExportStatus[] = [
  { id: 'A70', text: 'A70 - DL - Kho xử lý XN Đắp lốp' },
  { id: 'A71', text: 'A71 - OT - Kho xử lý XN Ôtô' },
  { id: 'A73', text: 'A73 - A73- KCS- Kho xử lý P.KCS' },
  { id: 'TP01', text: 'A49: Khuyến mại A Tài 0905.212.402' },
  { id: 'TP02', text: 'A51: TP săm lốp ô tô a Minh 0905.315.400' },
  { id: 'TP03', text: 'A61: TP săm lốp ô tô a Kháng 0989.441.433' },
  { id: 'TP04', text: 'A53: TP săm lốp ô tô a Hoàng 0983.055.003' },
  { id: 'TP05', text: 'A54: TP săm lốp ô tô a Hùng 0983.840.081' },
  { id: 'TP06', text: 'A55: TP săm lốp ô tô a Tài 0905.212.402' },
  { id: 'TP08', text: 'A58: TP Lốp đắp A. Điệp 0914.206.009' },
  { id: 'TP09', text: 'A63: TP săm lốp xe máy A Phúc 0935512301' },
  { id: 'TP10', text: 'A52: TP săm lốp xe đạp Chương 0914333213' },
  { id: 'TP11', text: 'A62: TP Cao su kỹ thuật A.Điệp 0914206009' },
  { id: 'TP12', text: 'A91: TP Trung tâm miền Trung' },
  { id: 'TP13', text: 'A92: TP Kho Cảng Chu Lai Trường Hải' },
  { id: 'TP15', text: 'A93 : Kho Miền Nam' },
  { id: 'TP20', text: 'A59: TP Lốp sau Bảo hành Thiện 0905.451.550' },
  { id: 'TP21', text: 'A60: TP thứ cấp A Thiện 0905.451.550' },
  { id: 'TP22', text: 'A56: TP săm lốp ô tô a Thịnh 077.639.4870' },
  { id: 'TP24', text: 'A67 TP săm lốp ô tô A Sự -0902530636' },
  { id: 'TP25', text: 'A68 TP Săm lốp ô tô Thiện 0905.451.550' },
  { id: 'TP26', text: 'A70 Khuyến mãi PBH' },
  { id: 'TP27', text: 'A57 TP XDXM lắp ráp, XK- A Thắng 0914104257' },
  { id: 'TP69', text: 'A69 Kho Xuất khẩu Miền Nam' },
];

export { ProductExportStatus, ProductExportWarehouses, ProductCommandExportStatus };
export type { ExportStatus };
