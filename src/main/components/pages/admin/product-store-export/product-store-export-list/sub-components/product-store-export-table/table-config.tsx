import { KhotpTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Page } from 'main/constants';
import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils/generate-column-style';
import moment from 'moment';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom';

const columns = [
  {
    dataField: 'maPhieu',
    text: 'Mã phiếu xuất',
    sort: true,
  },
  {
    dataField: 'maKhoXuat',
    text: 'Kho xuất',
    sort: true,
  },
  {
    dataField: FieldName.VI_TRI,
    text: 'Vị trí lưu kho',
    sort: true,
  },
  {
    dataField: 'soChungTu',
    text: 'Số chứng từ',
    sort: true,
  },
  {
    dataField: 'maSanPham',
    text: 'Mã sản phẩm',
    sort: true,
  },
  {
    dataField: 'tenSanPham',
    text: 'Tên sản phẩm',
    sort: true,
  },
  {
    dataField: 'tenGoiNho',
    text: 'Tên gợi nhớ',
    sort: true,
  },
  {
    dataField: 'dvt',
    text: 'Đơn vị tính',
    sort: true,
  },
  {
    dataField: 'soLuongXuat',
    text: 'Số lượng',
    sort: true,
  },
  {
    dataField: 'DonViNhap',
    text: 'Đơn vị xuất',
    sort: true,
  },
  {
    dataField: 'ngayXuat',
    text: 'Ngày xuất',
    sort: true,
    formatter: (cell: string, _: any) => {
      if (!cell) {
        return null;
      }
      return <div>{moment(cell).format(DateFormat.DATE_ONLY_VN)}</div>;
    },
    ...generateColumnStyle(),
    ...generateColumnStyle(),
  },
  {
    dataField: 'ghiChu',
    text: 'Ghi chú',
    sort: true,
  },

  {
    dataField: 'action',
    isDummyField: true,
    text: 'Thao tác',
    csvExport: false,
    formatter: (_: any, row: KhotpTransPhieuXuatControllerFindDetail200DataItem) => {
      return (
        <div>
          <div>
            <Link to={Page.PRODUCT_STORE_EXPORT_DETAIL.PATH.replace(':id', String(row.id))}>
              <i className="fa-solid fa-eye" title="Xem" />
            </Link>
          </div>
          <div>
            <EditPermissionAction>
              <Link className="px-2" to={Page.PRODUCT_STORE_EXPORT_EDIT.PATH.replace(':id', String(row.id))}>
                <i className="fa-solid fa-pen-to-square" title="Sửa" />
              </Link>
            </EditPermissionAction>
          </div>
          <div></div>
        </div>
      );
    },
  },
];

const exportCSV = {
  fileName: `Danh-sách-phiếu-xuất.csv`,
  onlyExportSelection: true,
  exportAll: true,
  charset: 'utf-8',
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
      &nbsp;Hiển thị hàng {from} đến {to} trên {size}
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
  exportCSV,
  pagination,
  selectRow,
};

export default tableConfig;
