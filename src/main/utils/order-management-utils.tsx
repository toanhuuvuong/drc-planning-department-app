export const calculateTonKhoDuKien = (
  soLuong: number | undefined,
  soLuongGiuHang: number | undefined,
  tonKho: number | undefined,
): number => {
  const soLuongNum = soLuong ? Number(soLuong) : 0;
  const soLuongGiuHangNum = soLuongGiuHang ? Number(soLuongGiuHang) : 0;
  const tonKhoNum = tonKho ? Number(tonKho) : 0;

  if (tonKhoNum < soLuongNum + soLuongGiuHangNum) {
    return 0;
  }

  return tonKhoNum - soLuongNum - soLuongGiuHangNum;
};

export const calculateSoLuongThucTe = (soLuongThucTe: number | undefined, tonKho: number | undefined): number => {
  if (!soLuongThucTe || !tonKho) {
    return 0;
  }

  return Number(soLuongThucTe) > Number(tonKho) ? 0 : soLuongThucTe;
};
