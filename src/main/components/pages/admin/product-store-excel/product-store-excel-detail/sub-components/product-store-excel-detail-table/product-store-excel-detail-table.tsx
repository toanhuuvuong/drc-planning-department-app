import { KhotpTransLenhNhapDetailWithRelations } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useProductStoreLocationOptions, useProductStoreOptions } from 'main/hooks';
import { generateColumnStyle } from 'main/utils';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import tableConfig from './table-config';

type Props = {
  productStoreExcelDetails?: KhotpTransLenhNhapDetailWithRelations[];
};

function ProductStoreExcelDetailTable({ productStoreExcelDetails }: Props) {
  // React State
  const { productStoreOptions, productStoresIsLoading } = useProductStoreOptions(false);
  const { productStoreLocationOptions, productStoreLocationsIsLoading } = useProductStoreLocationOptions(false);

  return (
    <>
      <ToolkitProvider
        data={productStoreExcelDetails || []}
        keyField={FieldName.ID}
        columns={[
          ...tableConfig.columns,
          {
            dataField: FieldName.VI_TRI,
            text: 'Vị trí lưu kho',
            editorRenderer: (editorProps: any, value: any) => (
              <Select2Box className="form-control" value={value} data={productStoreLocationOptions} disabled={true} />
            ),
            ...generateColumnStyle(undefined, true),
          },
          {
            dataField: FieldName.MA_KHO_NHAP,
            text: 'Kho nhập',
            editorRenderer: (editorProps: any, value: any) => (
              <Select2Box className="form-control" value={value} data={productStoreOptions} disabled={true} />
            ),
            ...generateColumnStyle(undefined, true),
          },
        ]}>
        {(props: any) => (
          <>
            <div className="table-responsive">
              <BootstrapTable
                {...props.baseProps}
                remote
                bootstrap4={true}
                bordered={false}
                noDataIndication={() => (
                  <div className="text-center">
                    {productStoresIsLoading || productStoreLocationsIsLoading ? (
                      <BasicSpinner />
                    ) : (
                      'Chưa có sản phẩm nào'
                    )}
                  </div>
                )}
              />
            </div>
          </>
        )}
      </ToolkitProvider>
    </>
  );
}

export default ProductStoreExcelDetailTable;
