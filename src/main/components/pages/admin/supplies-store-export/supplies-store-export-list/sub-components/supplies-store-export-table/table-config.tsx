import { DateFormat } from 'main/constants';
import { ExportStatus, FieldName } from 'main/constants/enums';
import { cellDateFormatter, generateColumnStyle } from 'main/utils';
import moment from 'moment';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: FieldName.UNIQUE_KEY,
    hidden: true,
    csvExport: false,
  },
  {
    dataField: FieldName.ID,
    hidden: true,
    csvExport: false,
  },
  {
    dataField: FieldName.SO_PHIEU,
    text: 'Số phiếu xuất',
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
    dataField: FieldName.TEN_KHO,
    text: 'Kho xuất',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TEN_DON_VI,
    text: 'Đơn vị nhận',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.SO_LUONG_YEU_CAU,
    text: 'Số lượng yêu cầu',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.SO_LUONG_THUC_TE,
    text: 'Số lượng thực xuất',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGUOI_TAO_PHIEU,
    text: 'Người tạo phiếu',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGAY_XUAT,
    text: 'Ngày xuất kho',
    sort: true,
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
    csvFormatter: (cell: string, _: any) => {
      if (!cell) {
        return null;
      }
      return moment(cell).format(DateFormat.DATE_ONLY_VN);
    },
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.STATUS,
    text: 'Trạng thái',
    sort: true,
    formatter: (cell: string, _: any) => {
      if (!cell) {
        return null;
      }
      return <div>{ExportStatus[cell as keyof typeof ExportStatus]?.text}</div>;
    },
    csvFormatter: (cell: string, _: any) => {
      if (!cell) {
        return null;
      }
      return ExportStatus[cell as keyof typeof ExportStatus]?.text;
    },
    ...generateColumnStyle(),
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
  exportCSV,
  pagination,
};

export default tableConfig;
