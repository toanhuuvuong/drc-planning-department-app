import { DateFormat } from 'main/constants';
import { FieldName, ProductExcelStatus, ProductExcelTemplateType } from 'main/constants/enums';
import { cellDateFormatter, generateColumnStyle } from 'main/utils';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: FieldName.ID,
    hidden: true,
  },
  {
    dataField: FieldName.SO_CHUNG_TU,
    text: 'Số chứng từ',
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
  {
    dataField: FieldName.LOAI_LENH_NHAP,
    text: 'Template',
    sort: true,
    ...generateColumnStyle(),
    formatter: (cell: string, _: any) => {
      if (!cell) {
        return null;
      }
      return <div>{ProductExcelTemplateType[cell as keyof typeof ProductExcelTemplateType]?.text}</div>;
    },
  },
  {
    dataField: FieldName.STATUS,
    text: 'Trạng thái',
    sort: true,
    ...generateColumnStyle(),
    formatter: (cell: string, _: any) => {
      if (!cell) {
        return null;
      }
      return <div>{ProductExcelStatus[cell as keyof typeof ProductExcelStatus]?.text}</div>;
    },
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
