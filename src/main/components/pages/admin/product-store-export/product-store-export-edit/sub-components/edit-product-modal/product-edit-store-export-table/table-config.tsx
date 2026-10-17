import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils/generate-column-style';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    sort: true,
    hidden: true,
  },
  {
    dataField: 'maSanPham',
    text: 'Mã sản phẩm',
    sort: true,
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'tenSanPham',
    text: 'Tên sản phẩm',
    sort: true,
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'tenGoiNho',
    text: 'Tên gợi nhớ',
    sort: true,
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'dvt',
    text: 'Đơn vị tính',
    sort: true,
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'soLo',
    text: 'Số lô',
    sort: true,
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'tonKho',
    text: 'Tồn kho hiện tại',
    sort: true,
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.VI_TRI,
    text: 'Vị trí lưu kho',
    sort: true,
    editable: false,
    ...generateColumnStyle(),
  },
  {
    dataField: 'ngayNhap',
    text: 'Tháng nhập kho',
    sort: true,
    editable: false,
    // formatter: (cell: string, _: any) => {
    //   if (!cell) {
    //     return null;
    //   }
    //   return <div>{moment(cell).format(DateFormat.MM_YYYY_VN)}</div>;
    // },
    ...generateColumnStyle(),
  },
  {
    dataField: 'ThoiHanLuuKho',
    text: 'Hạn lưu kho',
    sort: true,
    editable: false,
    // formatter: (cell: string, _: any) => {
    //   if (!cell) {
    //     return null;
    //   }
    //   return <div>{moment(cell).format(DateFormat.MM_YYYY_VN)}</div>;
    // },
    ...generateColumnStyle(),
  },
];

const cellEdit = {
  mode: 'dbclick',
  blurToSave: true,
};

const pagination = {
  page: 1,
  alwaysShowAllBtns: true,
  showTotal: true,
  withFirstAndLast: false,
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
  cellEdit,
  pagination,
  selectRow,
};

export default tableConfig;
