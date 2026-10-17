const ProductImportStatus = {
  in: { id: 'in', text: 'Chờ xuất hàng' },
  'in-lated': { id: 'in-lated', text: 'Chậm luân chuyển - Chờ xuất' },
  'in-expired': { id: 'in-expired', text: 'Quá hạn lưu kho' },
  //'in-wait': { id: 'in-wait', text: 'Chờ kiểm định lại' },
  //'in-selloff': { id: 'in-selloff', text: 'Chờ thanh lý' },
  out: { id: 'out', text: 'Đã xuất hàng' },
};

export default ProductImportStatus;
