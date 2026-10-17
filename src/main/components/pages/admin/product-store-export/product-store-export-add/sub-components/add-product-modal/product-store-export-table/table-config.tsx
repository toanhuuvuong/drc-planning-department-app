import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils/generate-column-style';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: 'id',
    hidden: true,
  },
  {
    dataField: 'maSanPham',
    text: 'Mã sản phẩm',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: 'tenSanPham',
    text: 'Tên sản phẩm',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: 'tenGoiNho',
    text: 'Tên gợi nhớ',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: 'dvt',
    text: 'Đơn vị tính',
    sort: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'soLo',
    text: 'Số lô',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.VI_TRI,
    text: 'Vị trí lưu kho',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: 'tonKho',
    text: 'Tồn kho hiện tại',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: 'ngayNhap',
    text: 'Tháng nhập kho',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: 'ThoiHanLuuKho',
    text: 'Hạn lưu kho',
    sort: true,
    editable: false,
    ...generateColumnStyle(),
  },
];

const pagination = {
  page: 1,
  alwaysShowAllBtns: true,
  showTotal: true,
  withFirstAndLast: true,
  sizePerPageRenderer: ({ onSizePerPageChange }: SizePerPageRendererOptions) => (
    <div className="dataTables_length" id="datatable-basic_length">
      <label>
        Hiển thị&nbsp;
        {
          <select
            name="datatable-basic_length"
            aria-controls="datatable-basic"
            className="form-control form-control-sm"
            onChange={(e) => onSizePerPageChange(Number(e.target.value))}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        }
        &nbsp;mục.
      </label>
    </div>
  ),
  paginationTotalRenderer: (from: number, to: number, size: number) => (
    <span className="react-bootstrap-table-pagination-total">
      &nbsp;Hiển thị hàng {from} đến {to}
    </span>
  ),
};

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  clickToEdit: true,
  style: { backgroundColor: '#c8e6c9' },
};

const tableConfig = {
  columns,
  pagination,
  selectRow,
};

export default tableConfig;
