import { KhotpXuatNhapTonControllerSearchCanhBao200Item } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import ColumnFilterPopover from 'main/components/molecules/table-column-filter/table-column-filter';
import { FieldName } from 'main/constants/enums';
import { SelectOption } from 'main/types/select-option';
import { useMemo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { Comparator, customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import tableConfig from './table-config';

type Props = {
  data?: KhotpXuatNhapTonControllerSearchCanhBao200Item[];
  dataIsLoading: boolean;
};

const generateFilterOptions = (data: Props['data']): SelectOption[] => {
  if (!data) {
    return [];
  }
  return Array.from(new Set(data.map((item) => item.tenKho ?? '')).values()).map((id) => ({ id, text: id }));
};

function ProductStoreInventoryWarningTable({ data, dataIsLoading }: Readonly<Props>) {
  const khoFilterOptions = useMemo(() => {
    return generateFilterOptions(data || []);
  }, [data]);

  const columnsWithFilter = tableConfig.columns.map((col) =>
    col.dataField === FieldName.TEN_KHO
      ? {
          ...col,
          filter: customFilter({
            type: FILTER_TYPES.MULTISELECT,
            comparator: Comparator.EQ,
          }),
          filterRenderer: (onFilter: Function) => (
            <ColumnFilterPopover filterOptions={khoFilterOptions} onFilter={onFilter} filterName="Bộ lọc kho" />
          ),
        }
      : col,
  );

  return (
    <ToolkitProvider
      data={data || []}
      keyField={`${FieldName.SO_PHIEU_NHAP}_${FieldName.MA_SAN_PHAM}_${FieldName.SO_LO}`}
      columns={columnsWithFilter}>
      {(props: any) => (
        <div className="table-responsive">
          <BootstrapTable
            {...props.baseProps}
            bootstrap4
            bordered={false}
            filter={filterFactory()}
            filterPosition="top"
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

export default ProductStoreInventoryWarningTable;
