const ProductExcelTemplateType = {
  'luyen-bias': { id: 'luyen-bias', text: 'Bias' },
  'luyen-radial': { id: 'luyen-radial', text: 'Radial' },
  xdxm: { id: 'xdxm', text: 'XDXM' },
  'ton-kho': { id: 'ton-kho', text: 'TH' },
  'dap-lop': { id: 'dap-lop', text: 'Đắp Lốp' },
};

export const getProductExcelTemplateTypeByText = (text: string) => {
  for (const key in ProductExcelTemplateType) {
    const item = ProductExcelTemplateType[key as keyof typeof ProductExcelTemplateType];
    if (item.text === text) {
      return item;
    }
  }
  return null;
};

export default ProductExcelTemplateType;
