import React, { useEffect, useState } from 'react';
import { useTable, usePagination, useRowState, useBlockLayout } from 'react-table';
import EditableCell from './EditableCell';

const defaultColumn = {
  Cell: EditableCell,
};
function Table({ columns, data, updateMyData, skipPageReset, isPagination }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      // autoResetPage: !skipPageReset,
      updateMyData,
    },
    usePagination,
    useRowState,
    useBlockLayout,
  );

  return (
    <>
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => {
                  let ComponentChild = () => cell.render('Cell');
                  if (cell?.column?.disabled) {
                    ComponentChild = () => cell.render(() => <input disabled value={cell?.value} />);
                  } else if (cell?.column?.isValidate) {
                    ComponentChild = () =>
                      cell.render('Cell', {
                        isValidate: true,
                      });
                  }
                  return (
                    <div {...cell.getCellProps()} className="td">
                      <ComponentChild />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {isPagination ? (
        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}>
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      ) : (
        ''
      )}
    </>
  );
}

export default Table;
