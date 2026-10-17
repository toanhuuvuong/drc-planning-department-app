import { concat, omit } from 'lodash';
import { ProductStoreExportInfo } from 'main/components/pages/admin/product-store-export/product-store-export-add/use-product-store-export-add';
import { FieldName } from 'main/constants/enums';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import tableConfig from './table-config';
import EditProductModal from '../edit-product-modal/edit-product-modal';

type Props = {
  productList: ProductStoreExportInfo[];
  handleAddProductToTable: (newProductList: ProductStoreExportInfo[]) => void;
  updateNewDataArray: (newState: TableChangeState<ProductStoreExportInfo>) => void;
  maKhoXuat?: string;
};

function ProductStoreExportEditTable({ productList, handleAddProductToTable, updateNewDataArray, maKhoXuat }: Props) {
  // React State
  const [isOpenEditProductModal, setOpenEditProductModal] = useState(false);

  // React function
  const toggleEditProductModal = () => setOpenEditProductModal(!isOpenEditProductModal);

  const handleDeleteProduct = (productId?: number | null) => {
    handleAddProductToTable(productList.filter((item) => item.id !== productId));
  };

  const handleEditProductModalConfirm = (selectedProductList?: ProductStoreExportInfo[]) => {
    if (!selectedProductList) {
      return;
    }

    // Convert to details
    const newProductList: ProductStoreExportInfo[] = [];
    const newProductList1 = selectedProductList.map((item) => ({
      ...item,
      soLuongXuat: 0,
      soLuongYc: 0,
      typeAdd: 'ADD',
    }));

    for (const selectedProduct of selectedProductList) {
      const newProduct = omit(selectedProduct, ['masterId', 'id']);
      newProductList.push(newProduct as ProductStoreExportInfo);
    }

    // Merge and deduplicate
    // const updatedProductList = unionBy(productList, newProductList, FieldName.ID);

    // handleAddProductToTable(concat(productList, newProductList));
    handleAddProductToTable(concat(productList, newProductList1));
    toggleEditProductModal();
  };

  const handleTableChange = useCallback(
    (type: TableChangeType, newState: TableChangeState<ProductStoreExportInfo>) => {
      if (type === 'cellEdit') {
        updateNewDataArray(newState);
      }
    },
    [updateNewDataArray],
  );

  return (
    <>
      <ToolkitProvider
        data={productList}
        keyField={FieldName.ID}
        columns={[
          ...tableConfig.columns,
          {
            dataField: FieldName.ACTION,
            isDummyField: true,
            text: 'Thao tác',
            formatter: (_: any, row: ProductStoreExportInfo) => {
              return (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteProduct(row?.id);
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
              <Button color="primary" onClick={toggleEditProductModal} disabled={!maKhoXuat}>
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
                noDataIndication={() => <div className="text-center">Chưa có phiếu xuất nào</div>}
              />
            </div>

            {maKhoXuat && isOpenEditProductModal ? (
              <EditProductModal
                isOpen={isOpenEditProductModal}
                toggle={toggleEditProductModal}
                handleConfirmAddProduct={handleEditProductModalConfirm}
                maKho={maKhoXuat}
              />
            ) : null}
          </>
        )}
      </ToolkitProvider>
    </>
  );
}

export default ProductStoreExportEditTable;
