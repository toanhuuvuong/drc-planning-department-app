import { QldhTransDonHangItemWithRelations } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import tableConfig from './table-config';

type Props = {
  supplies?: QldhTransDonHangItemWithRelations[];
};

function SuppliesStoreImportDetailTable({ supplies }: Readonly<Props>) {
  return (
    <ToolkitProvider data={supplies || []} keyField={FieldName.DON_HANG_ID} columns={tableConfig.columns}>
      {(props: any) => (
        <div className="table-responsive">
          <BootstrapTable
            {...props.baseProps}
            bootstrap4={true}
            bordered={false}
            noDataIndication={() => <div className="text-center">Chưa có vật tư nào</div>}
          />
        </div>
      )}
    </ToolkitProvider>
  );
}

export default SuppliesStoreImportDetailTable;
