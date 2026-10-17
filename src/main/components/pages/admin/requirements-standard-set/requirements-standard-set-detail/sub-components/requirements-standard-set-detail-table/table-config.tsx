import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: FieldName.ID,
    hidden: true,
  },
  {
    dataField: `${FieldName.DINH_MUC}.${FieldName.MA_THANH_PHAM}`,
    text: 'Mã thành phầm',
    sort: true,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.MA_ITEM,
    text: 'Mã NVL/BTP',
    sort: true,
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.DINH_MUC_VALUE,
    text: 'Định mức',
    sort: true,
    ...generateColumnStyle(undefined, true),
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
