const ValidationMessage = {
  REQUIRED: 'Trường này là bắt buộc',
  INVALID_NUMBER: 'Trường này phải là số',
  INVALID_POSITIVE_NUMBER: 'Trường này phải là số > 0',
  INVALID_DATE: 'Ngày không hợp lệ',
  INVALID_SO_LUONG_TRA_HANG: 'Số lượng trả hàng phải bé hơn số lượng đã xuất',
  INVALID_SO_LUONG_THUC_XUAT: 'Số lượng thực xuất phải bé hơn tồn kho hiện tại',
  INVALID_SO_LUONG_DON_HANG: 'Số lượng đặt hàng + Số lượng giữ hàng phải bé hơn hoặc bằng Số lượng tồn kho',
  INVALID_PDF_FILE_TYPE: 'Loại file không hợp lệ, vui lòng upload file dạng pdf',
  INVALID_EXCEL_FILE_TYPE: 'Loại file không hợp lệ, vui lòng upload file dạng excel',
};

const ToastMessage = {
  CANCEL_SUCCESS: 'Hủy thành công',
  DELETE_SUCCESS: 'Xóa thành công',
  UPDATE_SUCCESS: 'Cập nhật thành công',
  CREATE_SUCCESS: 'Thêm thành công',
  IMPORT_SUCCESS: 'Import thành công',
  LIQUIDATION_TRANSFER_SUCCESS: 'Chuyển thanh lý thành công',
  REQUEST_RECHECK_SUCCESS: 'Yêu cầu kiểm tra lại thành công',
};

export { ToastMessage, ValidationMessage };
