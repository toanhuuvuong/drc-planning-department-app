import { KhotpTransLenhNhapDetailWithRelations } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useProductStoreOptions } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectProductStoreExcelDetails,
  updateProductDetail,
} from 'main/redux/modules/product-store-excel/product-store-excel-edit-slice';
import { generateColumnStyle } from 'main/utils';
import { ChangeEvent, useCallback } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import ProductStoreLocationCell from './product-store-location-cell';
import tableConfig from './table-config';

function ProductStoreExcelEditTable() {
  // Redux
  const dispatch = useAppDispatch();
  const productStoreExcelDetails = useAppSelector(selectProductStoreExcelDetails);

  // React State
  const { productStoreOptions, productStoresIsLoading } = useProductStoreOptions(false, true);

  // React function
  const handleTableChange = useCallback(
    (type: TableChangeType, newState: TableChangeState<KhotpTransLenhNhapDetailWithRelations>) => {
      if (type === 'cellEdit') {
        const {
          cellEdit: { dataField, newValue, rowId },
        } = newState;
        dispatch(updateProductDetail(rowId, dataField, newValue));
      }
    },
    [dispatch],
  );

  return (
    <>
      <ToolkitProvider
        data={productStoreExcelDetails}
        keyField={FieldName.ID}
        columns={[
          ...tableConfig.columns,
          {
            dataField: FieldName.VI_TRI,
            text: 'Vị trí lưu kho',
            editorRenderer: (editorProps: any, value: string, row: KhotpTransLenhNhapDetailWithRelations) => (
              <ProductStoreLocationCell editorProps={editorProps} value={value} productStoreCode={row.maKhoNhap} />
            ),
            ...generateColumnStyle(),
          },
          {
            dataField: FieldName.MA_KHO_NHAP,
            text: 'Kho nhập',
            editorRenderer: (editorProps: any, value: string) => (
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn kho nhập' }}
                value={value}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => editorProps.onUpdate(e.target.value)}
                data={productStoreOptions}
              />
            ),
            ...generateColumnStyle(),
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
                cellEdit={cellEditFactory(tableConfig.cellEdit)}
                onTableChange={handleTableChange}
                noDataIndication={() => (
                  <div className="text-center">
                    {productStoresIsLoading ? <BasicSpinner /> : 'Chưa có sản phẩm nào'}
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

export default ProductStoreExcelEditTable;
