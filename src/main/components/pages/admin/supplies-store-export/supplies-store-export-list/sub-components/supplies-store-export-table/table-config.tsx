import { KhovtTransPhieuXuatWithRelations } from 'main/apis/drc/models';
import { Page } from 'main/constants';
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from 'react-router-dom';

const cellEdit = cellEditFactory({
  mode: 'dbclick',
  blurToSave: true,
});

const columns = [
  {
    dataField: 'soPhieu',
    text: 'Số phiếu xuất',
    sort: true,
  },
  {
    dataField: 'id',
    text: 'Mã vật tư',
    sort: true,
  },
  {
    dataField: 'khoXuat',
    text: 'Kho xuất',
    sort: true,
  },
  {
    dataField: 'khoNhap',
    text: 'Kho nhập',
    sort: true,
  },
  {
    dataField: 'nguoiTaoPhieu',
    text: 'Người tạo phiếu',
    sort: true,
  },
  {
    dataField: 'ngayXuat',
    text: 'Ngày xuất kho',
    sort: true,
  },
  {
    dataField: 'status',
    text: 'Trạng thái',
    sort: true,
  },
  {
    dataField: 'action',
    isDummyField: true,
    text: 'Thao tác',
    formatter: (_: any, row: KhovtTransPhieuXuatWithRelations) => {
      return <Link to={Page.SUPPLIES_STORE_EXPORT_DETAIL.PATH.replace(':id', String(row.id))}>Xem</Link>;
    },
  },
];

const exportCSV = {
  fileName: `Danh_sách_phiếu_xuất.csv`,
  onlyExportSelection: true,
  exportAll: true,
};

const pagination = paginationFactory({
  page: 1,
  alwaysShowAllBtns: true,
  showTotal: true,
  withFirstAndLast: false,
  sizePerPageRenderer: ({ onSizePerPageChange }) => (
    <div className="dataTables_length" id="datatable-basic_length">
      <label>
        Hiển thị&nbsp;
        {
          <select
            name="datatable-basic_length"
            aria-controls="datatable-basic"
            className="form-control form-control-sm"
            onChange={(e) => onSizePerPageChange(Number(e.target.value))}>
            <option value="9">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        }
        &nbsp;mục.
      </label>
    </div>
  ),
  paginationTotalRenderer: (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      &nbsp;Hiển thị hàng {from} đến {to} trên {size}
    </span>
  ),
});

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  clickToEdit: true,
  style: { backgroundColor: '#c8e6c9' },
};

const tableConfig = {
  cellEdit,
  columns,
  exportCSV,
  pagination,
  selectRow,
};

export default tableConfig;
