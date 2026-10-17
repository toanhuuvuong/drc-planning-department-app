import { UserExcludingPassword } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { SelectOption } from 'main/types/select-option';
import React from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from 'react-router-dom';

const columns = (
  departmentOptions: SelectOption[],
  titleOptions: SelectOption[],
  showEdiModal: Function,
  showDeleteModal: Function,
  isShowActionCol: boolean,
) => {
  return [
    {
      dataField: 'username',
      text: 'Username',
      sort: false,
      style: { width: '15%' },
    },
    {
      dataField: 'departmentId',
      text: 'Phòng ban',
      sort: false,
      style: { width: '15%' },
      formatter: (cell: number) => {
        if (!cell) {
          return '-';
        }
        const foundedDep = departmentOptions.find((dep) => dep.id === cell.toString());
        return foundedDep ? foundedDep.text : `ID: ${cell}`;
      },
    },
    {
      dataField: 'titleId',
      text: 'Chức danh',
      sort: false,
      style: { width: '15%' },
      formatter: (cell: number) => {
        if (!cell) {
          return '-';
        }
        const foundedTitle = titleOptions?.find((title) => title.id === cell.toString());
        return foundedTitle ? foundedTitle.text : `ID: ${cell}`;
      },
    },
    {
      dataField: 'thaoTac',
      text: 'Thao Tác',
      editable: false,
      style: { width: '10%' },
      hidden: !isShowActionCol,
      formatter: (cell: any, row: UserExcludingPassword) => (
        <EditPermissionAction>
          <Link className="px-3" to="#" onClick={() => showEdiModal(row)}>
            <i className="fa-solid fa-pen-to-square" title="Sửa" />
          </Link>
          <Link className="px-3" to="#" onClick={() => showDeleteModal(row)}>
            <i className="fa-solid fa-trash" title="Xóa" />
          </Link>
        </EditPermissionAction>
      ),
    },
  ];
};

const pagination = (page: number, sizePerPage: number, itemTotal: number) => {
  return paginationFactory({
    page,
    sizePerPage,
    totalSize: itemTotal,
    showTotal: true,
    withFirstAndLast: true,
    alwaysShowAllBtns: true,
    sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
      <div className="dataTables_length" id="datatable-basic_length">
        <label>
          Hiển thị&nbsp;
          {
            <select
              name="datatable-basic_length"
              aria-controls="datatable-basic"
              className="form-control form-control-sm"
              value={currSizePerPage}
              onChange={(e) => onSizePerPageChange(Number(e.target.value))}>
              {options.map((option) => (
                <option key={option.text} value={option.page}>
                  {option.text}
                </option>
              ))}
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
  });
};

export const tableConfig = {
  columns,
  pagination,
};

export default tableConfig;
