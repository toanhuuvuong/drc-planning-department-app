const NUOC_NGOAI_ID = 'nuoc-ngoai';
const NUOC_NGOAI_TEXT = 'Nước ngoài';

const NhomKhachHangOptions = [
  { id: '-1', text: 'Tất cả' },
  { id: NUOC_NGOAI_ID, text: NUOC_NGOAI_TEXT },
  { id: 'noi-dia', text: 'Nội địa' },
];

const TrangThaiDonHang = {
  DANG_TIEN_HANH: 'dang-tien-hanh',
  TAM_DUNG: 'tam-dung',
  HOAN_THANH: 'hoan-thanh',
};

const OrderStatusOptions = [
  { id: TrangThaiDonHang.DANG_TIEN_HANH, text: 'Đang tiến hành' },
  { id: TrangThaiDonHang.TAM_DUNG, text: 'Tạm dừng' },
  { id: TrangThaiDonHang.HOAN_THANH, text: 'Hoàn thành' },
];

const getOrderStatusText = (statusId: string): string => {
  const statusOption = OrderStatusOptions.find((option) => option.id === statusId);
  return statusOption ? statusOption.text : 'Tất cả';
};

const YeuCauGiuHangOptions = [
  { id: 'giu-hang', text: 'Giữ hàng' },
  { id: 'khong-giu-hang', text: 'Không giữ hàng' },
];

export {
  getOrderStatusText,
  NhomKhachHangOptions,
  NUOC_NGOAI_ID,
  NUOC_NGOAI_TEXT,
  OrderStatusOptions,
  TrangThaiDonHang,
  YeuCauGiuHangOptions,
};
