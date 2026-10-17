import { DateFormat } from 'main/constants';
import { FieldName, RequirementsStandardSetType } from 'main/constants/enums';
import { cellDateFormatter, generateColumnStyle } from 'main/utils';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: FieldName.ID,
    hidden: true,
    csvExport: false,
  },
  {
    dataField: FieldName.MA_BO_DINH_MUC,
    text: 'Mã bộ định mức',
    sort: true,
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.LOAI_BO_DINH_MUC,
    text: 'Template',
    sort: true,
    ...generateColumnStyle(),
    formatter: (cell: string, _: any) => {
      if (!cell) {
        return null;
      }
      return <div>{RequirementsStandardSetType[cell as keyof typeof RequirementsStandardSetType]?.text}</div>;
    },
  },
  {
    dataField: FieldName.NGAY_CAP_NHAT,
    text: 'Ngày cập nhật',
    sort: true,
    ...generateColumnStyle(),
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
  },
  {
    dataField: FieldName.GHI_CHU,
    text: 'Lý do cập nhật',
    sort: false,
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

const exportCSV = {
  fileName: `Danh-sách-bộ-định-mức.csv`,
  exportAll: true,
  charset: 'utf-8',
};

const tableConfig = {
  columns,
  exportCSV,
  pagination,
};

export default tableConfig;
