import { KhovtTransPhieuXuatWithRelations } from 'main/apis/drc/models';
import { Page } from 'main/constants';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import tableConfig from './table-config';

const { ExportCSVButton } = CSVExport;

export type ExportTable = {
  page: number;
  sizePerPage: number;
  sortBy?: string;
  sortType?: string;
};

enum FieldName {
  ID = 'id',
  PAGE = 'page',
  SIZE_PER_PAGE = 'sizePerPage',
  SORT_BY = 'sortBy',
  SORT_TYPE = 'sortType',
}

type Props = {
  data?: KhovtTransPhieuXuatWithRelations[];
  dataIsLoading: boolean;
  tableState: ExportTable;
  handleTableStateChange: (fieldName: string, value: any) => void;
};

function SuppliesStoreExportTable({ data, dataIsLoading, tableState, handleTableStateChange }: Props) {
  // React Router
  const navigate = useNavigate();

  // React Function
  const handleTableSizePerPageChange = (sizePerPage: number, _: number) => {
    handleTableStateChange(FieldName.SIZE_PER_PAGE, sizePerPage);
  };

  const handleTablePageChange = (page: number, _: number) => {
    handleTableStateChange(FieldName.PAGE, page);
  };

  if (dataIsLoading || !data) {
    return null;
  }

  return (
    <ToolkitProvider
      data={data}
      keyField={FieldName.ID}
      columns={tableConfig.columns}
      exportCSV={tableConfig.exportCSV}>
      {(props: any) => (
        <div className="table-responsive py-4">
          <div className="d-flex justify-content-end mb-4 px-4 pb-1">
            <Button className="btn-neutral" onClick={() => navigate(Page.SUPPLIES_STORE_EXPORT_ADD.PATH)}>
              Thêm mới
            </Button>
            <ExportCSVButton className="btn-neutral" {...props.csvProps}>
              Tải phiếu xuất
            </ExportCSVButton>
          </div>
          <BootstrapTable
            {...props.baseProps}
            bootstrap4
            bordered={false}
            pagination={{
              ...tableConfig.pagination,
              page: tableState.page,
              sizePerPage: tableState.sizePerPage,
              onSizePerPageChange: handleTableSizePerPageChange,
              onPageChange: handleTablePageChange,
            }}
            cellEdit={tableConfig.cellEdit}
            selectRow={tableConfig.selectRow}
            noDataIndication="Không có kết quả nào được tìm thấy"
          />
        </div>
      )}
    </ToolkitProvider>
  );
}

export default SuppliesStoreExportTable;
