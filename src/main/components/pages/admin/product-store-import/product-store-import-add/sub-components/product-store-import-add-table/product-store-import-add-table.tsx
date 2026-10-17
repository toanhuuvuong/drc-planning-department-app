import { KhotpMasterSanPhamWithRelations, KhotpTransPhieuNhapDetailWithRelations } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  deleteProductDetail,
  insertNewProduct,
  selectProductDetails,
  updateProductDetail,
} from 'main/redux/modules/product-store-import/product-store-import-add-slice';
import { generateColumnStyle } from 'main/utils';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import AddProductModal from './add-product-modal/add-product-modal';
import tableConfig from './table-config';
import { ProductStoreImportInfo } from '../product-store-import-add-info';

type Props = {
  productStoreImportInfo: ProductStoreImportInfo;
};

function ProductStoreImportAddTable({ productStoreImportInfo }: Props) {
  // Redux
  const dispatch = useAppDispatch();
  const productDetails = useAppSelector(selectProductDetails);

  // React State
  const [isOpenAddProductModal, setOpenAddProductModal] = useState(false);

  // React function
  const toggleAddProductModal = useCallback(
    () => setOpenAddProductModal((isOpenAddProductModal) => !isOpenAddProductModal),
    [],
  );

  const handleAddProductModalConfirmClick = useCallback(
    (selectedProductRows?: KhotpMasterSanPhamWithRelations[]) => {
      // Update state
      dispatch(insertNewProduct({ selectedProductRows, productStoreImportInfo }));
    },
    [dispatch, productStoreImportInfo],
  );

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
    (type: TableChangeType, newState: TableChangeState<KhotpTransPhieuNhapDetailWithRelations>) => {
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
        data={productDetails}
        keyField={FieldName.MA_SAN_PHAM}
        columns={[
          ...tableConfig.columns,
          {
            dataField: FieldName.ACTION,
            isDummyField: true,
            text: 'Thao tác',
            editable: false,
            ...generateColumnStyle(),
            formatter: (_: any, row: KhotpTransPhieuNhapDetailWithRelations) => {
              return (
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
            <div className="d-flex justify-content-end pb-4">
              <Button color="primary" onClick={toggleAddProductModal}>
                Thêm sản phẩm
              </Button>
            </div>
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
      <AddProductModal
        isOpen={isOpenAddProductModal}
        toggle={toggleAddProductModal}
        handleConfirmClick={handleAddProductModalConfirmClick}
      />
    </>
  );
}

export default ProductStoreImportAddTable;
