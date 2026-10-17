import { KhotpTransLenhXuatDetailWithRelations } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  deleteProductDetail,
  selectProductCommandExportDetails,
  updateProductDetail,
} from 'main/redux/modules/product-command-export/product-command-export-edit-slice';
import { generateColumnStyle } from 'main/utils';
import { useCallback } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import tableConfig from './table-config';

function ProductCommandExportEditTable() {
  // Redux
  const dispatch = useAppDispatch();
  const productCommandExportDetails = useAppSelector(selectProductCommandExportDetails);

  // React function
  const handleDeleteProductDetails = useCallback(
    (maSanPham?: string | null) => {
      if (!maSanPham) {
        return;
      }
      dispatch(deleteProductDetail(maSanPham));
    },
    [dispatch],
  );

  const handleTableChange = useCallback(
    (type: TableChangeType, newState: TableChangeState<KhotpTransLenhXuatDetailWithRelations>) => {
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
        data={productCommandExportDetails}
        keyField={FieldName.MA_SAN_PHAM}
        columns={[
          ...tableConfig.columns,
          {
            dataField: FieldName.ACTION,
            isDummyField: true,
            text: 'Thao tác',
            editable: false,
            headerStyle: generateColumnStyle().headerStyle,
            style: (cell: string, row: KhotpTransLenhXuatDetailWithRelations, rowIndex: number, colIndex: number) =>
              row.id ? generateColumnStyle(undefined, true).style : generateColumnStyle().style,
            formatter: (_: any, row: KhotpTransLenhXuatDetailWithRelations) => {
              return row.id ? (
                <span
                  onClick={(e) => {
                    e.preventDefault();
                  }}>
                  <i className="fa-solid fa-trash" title="Xóa" />
                </span>
              ) : (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteProductDetails(row.maSanPham);
                  }}>
                  <i className="fa-solid fa-trash" title="Xóa" />
                </Link>
              );
            },
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
                noDataIndication={() => <div className="text-center">Chưa có sản phẩm nào</div>}
              />
            </div>
          </>
        )}
      </ToolkitProvider>
    </>
  );
}

export default ProductCommandExportEditTable;
