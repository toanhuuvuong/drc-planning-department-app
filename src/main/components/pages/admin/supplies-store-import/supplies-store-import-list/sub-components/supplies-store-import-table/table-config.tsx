import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { cellDateFormatter, generateColumnStyle } from 'main/utils';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: FieldName.SO_PHIEU_NHAP,
    text: 'Phiếu nhập kho',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.MA_VT,
    text: 'Mã vật tư',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TEN_VT,
    text: 'Tên vật tư',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.DVT,
    text: 'Đơn vị tính',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.SO_LUONG,
    text: 'Số lượng',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.SO_LO,
    text: 'Mã số lô',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.DON_VI_NHAP,
    text: 'Nhà cung cấp',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TEN_KHO,
    text: 'Kho nhập',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGAY_NHAP,
    text: 'Ngày nhập',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.GHI_CHU,
    text: 'Ghi chú',
    ...generateColumnStyle(),
  },
  /*{
    dataField: FieldName.STATUS,
    text: 'Trạng thái',
    sort: true,
    ...generateColumnStyle(),
    formatter: (cell: string, _: any) => {
      if (!cell) {
        return null;
      }
      return <div>{ImportStatus[cell as keyof typeof ImportStatus]?.text}</div>;
    },
  },*/
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
