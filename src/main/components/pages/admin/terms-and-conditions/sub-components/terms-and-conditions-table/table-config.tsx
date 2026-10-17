import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { cellDateFormatter, generateColumnStyle } from 'main/utils';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: FieldName.ID,
    hidden: true,
  },
  {
    dataField: FieldName.MA_TAI_LIEU,
    text: 'Mã tài liệu',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGAY_BAN_HANH,
    text: 'Ngày ban hành',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.LAN_BAN_HANH,
    text: 'Lần ban hành/sửa đổi',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGUOI_BAN_HANH,
    text: 'Người/đơn vị ban hành',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGUOI_THUC_HIEN,
    text: 'Người/đơn vị thực hiện',
    sort: true,
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
      &nbsp;Hiển thị hàng {from} đến {to} trên {size}
    </span>
  ),
};

const tableConfig = {
  columns,
  pagination,
};

export default tableConfig;
