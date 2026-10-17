const SuppliesISOReportTemplateType = {
  nxt: { id: 'nxt', text: '1. BẢNG TỔNG HỢP NHẬP XUẤT TỒN VẬT TƯ, NGUYÊN VẬT LIỆU' },
  'nxt-lo': { id: 'nxt-lo', text: '2. BẢNG TỔNG HỢP NXT THEO LÔ HÀNG' },
  'the-kho': { id: 'the-kho', text: '3. THẺ KHO' },
  'kh-03': { id: 'kh-03', text: '4. PHIẾU XUẤT VẬT TƯ, NGUYÊN LIỆU HẰNG NGÀY' },
  'kh-22': { id: 'kh-22', text: '5. PHIẾU BÁO NHẬP KHO' },
  'kh-10': { id: 'kh-10', text: '6. GIẤY BÁO VẬT TƯ NHẬP VỀ' },
};

export const getSuppliesISOReportTemplateTypeByText = (text: string) => {
  for (const key in SuppliesISOReportTemplateType) {
    const item = SuppliesISOReportTemplateType[key as keyof typeof SuppliesISOReportTemplateType];
    if (item.text === text) {
      return item;
    }
  }
  return null;
};

export default SuppliesISOReportTemplateType;
