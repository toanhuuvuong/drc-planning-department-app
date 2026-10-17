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
    dataField: FieldName.MA_PHIEU,
    text: 'Mã phiếu nhập',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.MA_KHO_NHAP,
    text: 'Kho nhập',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.SO_CHUNG_TU,
    text: 'Số chứng từ',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.MA_SAN_PHAM,
    text: 'Mã sản phẩm',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TEN_SAN_PHAM,
    text: 'Tên sản phẩm',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TEN_GOI_NHO,
    text: 'Tên gợi nhớ',
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
    dataField: FieldName.KHO_XUAT_2,
    text: 'Kho xuất',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGAY_NHAP,
    text: 'Tháng nhập',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.MM_YYYY_VN),
  },
  {
    dataField: FieldName.THOI_HAN_LUU_KHO_2,
    text: 'Hạn lưu kho',
    sort: true,
    ...generateColumnStyle(),
    //formatter: cellDateFormatter(DateFormat.MM_YYYY_VN),
  },
  {
    dataField: FieldName.VI_TRI,
    text: 'Vị trí lưu kho',
    ...generateColumnStyle(),
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
    formatter: (cell: string, _: KhotpTransPhieuNhapControllerFindDetail200DataItem) => {
      if (!cell) {
        return null;
      }
      return <div>{ProductImportStatus[cell as keyof typeof ProductImportStatus]?.text}</div>;
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
