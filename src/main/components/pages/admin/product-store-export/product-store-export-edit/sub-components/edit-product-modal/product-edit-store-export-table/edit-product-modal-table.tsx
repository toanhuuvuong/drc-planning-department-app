import { BasicSpinner } from 'main/components/atoms/spiner';
import { ProductStoreExportInfo } from 'main/components/pages/admin/product-store-export/product-store-export-add/use-product-store-export-add';
import { FieldName } from 'main/constants/enums';
import { TableState } from 'main/types';
import { useCallback, useMemo } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import tableConfig from './table-config';

type Props = {
  data?: ProductStoreExportInfo[];
  dataIsLoading: boolean;
  dataCount?: number;
  tableState: TableState<ProductStoreExportInfo>;
  handleTableStateChange: (type: TableChangeType, newState: TableChangeState<ProductStoreExportInfo>) => void;
  handleSelectedRowsChange: (newSelectedRows: ProductStoreExportInfo[]) => void;
  selectedRows: ProductStoreExportInfo[];
};

function EditProductModalTable({
  data,
  dataIsLoading,
  selectedRows,
  dataCount,
  tableState: { page, sizePerPage, sortField, sortOrder },
  handleTableStateChange,
  handleSelectedRowsChange,
}: Props) {
  // React State
  const selectedRowIds = useMemo(() => {
    const rowId = selectedRows?.map((row) => row.id);
    return rowId;
  }, [selectedRows]);

  // select checkbox
  const handleOnSelect = useCallback(
    (row: ProductStoreExportInfo, isSelect: boolean) => {
      if (!row || !row.id || !data) {
        return;
      }

      // Sync selected rows with data table
      const newSelectedRows = getSyncSelectedRows(data, selectedRows);

      if (isSelect) {
        handleSelectedRowsChange([...newSelectedRows, row]);
      } else {
        handleSelectedRowsChange(newSelectedRows.filter((item) => item.id !== row.id));
      }
    },
    [data, handleSelectedRowsChange, selectedRows],
  );

  // select all
  const handleOnSelectAll = (isSelect: boolean, rows: ProductStoreExportInfo[]) => {
    if (isSelect) {
      handleSelectedRowsChange(rows);
    } else {
      handleSelectedRowsChange([]);
    }
  };

  const handleTableChange = (type: TableChangeType, newState: TableChangeState<ProductStoreExportInfo>) => {
    if (data) {
      const selectTeddd = getSyncSelectedRows(data, selectedRows);

      handleSelectedRowsChange(selectTeddd);
    }

    handleTableStateChange(type, newState);
  };

  return (
    <ToolkitProvider data={data || []} keyField={FieldName.ID} columns={tableConfig.columns}>
      {(props: any) => (
        <div className="table-responsive">
          <BootstrapTable
            {...props.baseProps}
            remote
            bootstrap4
            bordered={false}
            pagination={paginationFactory({
              ...tableConfig.pagination,
              page: page,
              sizePerPage: sizePerPage,
              totalSize: dataCount,
            })}
            sort={
              sortField
                ? {
                    dataField: sortField,
                    order: sortOrder,
                  }
                : {}
            }
            selectRow={{
              ...tableConfig.selectRow,
              selected: selectedRowIds,
              onSelect: handleOnSelect,
              onSelectAll: handleOnSelectAll,
            }}
            onTableChange={handleTableChange}
            noDataIndication={() => (
              <div className="text-center">
                {dataIsLoading ? <BasicSpinner /> : 'Không có kết quả nào được tìm thấy'}
              </div>
            )}
          />
        </div>
      )}
    </ToolkitProvider>
  );
}

const getSyncSelectedRows = (data?: ProductStoreExportInfo[], selectedRows?: ProductStoreExportInfo[]) => {
  if (!selectedRows || !data) {
    return [];
  }
  const newSelectedRows = [...selectedRows];
  for (const selectedRow of selectedRows) {
    const rowDataIndex = data.findIndex((item) => item.id === selectedRow.id);
    if (rowDataIndex === -1) {
      const removedIndex = newSelectedRows.findIndex((item) => selectedRow.id === item.id);
      newSelectedRows.splice(removedIndex, 1);
    }
  }
  return newSelectedRows;
};

export default EditProductModalTable;
