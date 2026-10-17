import { DateFormat } from 'main/constants';
import { FieldName, getOrderStatusText } from 'main/constants/enums';
import { cellDateFormatter, generateColumnStyle } from 'main/utils';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: FieldName.STT,
    text: 'STT',
    ...generateColumnStyle(),
    formatter: (_cell: any, _row: any, rowIndex: number) => rowIndex + 1,
  },
  {
    dataField: FieldName.NGAY_GIAO_DU_KIEN,
    text: 'Ngày giao hàng',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.NGAY_GIAO_THUC_TE,
    text: 'Ngày giao hàng thực tế',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.TRANG_THAI,
    text: 'Trạng thái',
    sort: true,
    ...generateColumnStyle(),
    formatter: (cell: string, _: any) => {
      if (!cell) {
        return null;
      }
      return <div>{getOrderStatusText(cell)}</div>;
    },
  },
  {
    dataField: FieldName.DON_HANG_ID,
    text: 'ID đơn hàng',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TEN_KH_QL,
    text: 'Khách hàng',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGAY_DAT_HANG,
    text: 'Ngày đặt hàng',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.GHI_CHU,
    text: 'Ghi chú đơn hàng',
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
