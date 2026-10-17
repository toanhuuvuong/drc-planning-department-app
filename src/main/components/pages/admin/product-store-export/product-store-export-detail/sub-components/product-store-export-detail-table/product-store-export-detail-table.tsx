import { KhovtTransPhieuXuatDetailWithRelations } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import tableConfig from './table-config';

type Props = {
  productList: KhovtTransPhieuXuatDetailWithRelations[];
};

function ProductStoreExportDetailTable({ productList }: Props) {
  return (
    <ToolkitProvider data={productList} keyField={FieldName.ID} columns={tableConfig.columns}>
      {(props: any) => (
        <div className="table-responsive">
          <BootstrapTable {...props.baseProps} bootstrap4={true} bordered={false} />
        </div>
      )}
    </ToolkitProvider>
  );
}

export default ProductStoreExportDetailTable;
