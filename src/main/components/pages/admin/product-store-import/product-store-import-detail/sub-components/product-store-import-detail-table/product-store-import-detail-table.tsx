import { KhotpTransPhieuNhapDetailWithRelations } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import tableConfig from './table-config';

type Props = {
  product?: KhotpTransPhieuNhapDetailWithRelations[];
};

function ProductStoreImportDetailTable({ product }: Props) {
  return (
    <ToolkitProvider data={product || []} keyField={FieldName.MA_SAN_PHAM} columns={tableConfig.columns}>
      {(props: any) => (
        <div className="table-responsive">
          <BootstrapTable
            {...props.baseProps}
            bootstrap4={true}
            bordered={false}
            noDataIndication={() => <div className="text-center">Chưa có sản phẩm nào</div>}
          />
        </div>
      )}
    </ToolkitProvider>
  );
}

export default ProductStoreImportDetailTable;
