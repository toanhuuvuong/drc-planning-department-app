import paginationFactory from 'react-bootstrap-table2-paginator';

const tablePagination = paginationFactory({
  page: 1,
  alwaysShowAllBtns: true,
  showTotal: true,
  withFirstAndLast: false,
  sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
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

export default tablePagination;
