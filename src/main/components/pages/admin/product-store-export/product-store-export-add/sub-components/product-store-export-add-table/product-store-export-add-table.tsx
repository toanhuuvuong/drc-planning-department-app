import { unionBy } from 'lodash';
import { ProductStoreExportInfo } from 'main/components/pages/admin/product-store-export/product-store-export-add/use-product-store-export-add';
import { FieldName } from 'main/constants/enums';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import tableConfig from './table-config';
import AddProductModal from '../add-product-modal/add-product-modal';

type Props = {
  productList: ProductStoreExportInfo[];
  handleAddProductToTable: (newProductList: ProductStoreExportInfo[]) => void;
  updateNewDataArray: (newState: TableChangeState<ProductStoreExportInfo>) => void;
  maKhoXuat?: string;
};

function ProductStoreExportAddTable({ productList, handleAddProductToTable, updateNewDataArray, maKhoXuat }: Props) {
  // React State
  const [isOpenAddProductModal, setOpenAddProductModal] = useState(false);

  // React function
  const toggleAddProductModal = () => setOpenAddProductModal(!isOpenAddProductModal);

  const handleDeleteProduct = (productId?: number | null) => {
    handleAddProductToTable(productList.filter((item) => item.id !== productId));
  };

  const handleAddProductModalConfirm = (selectedProductList?: ProductStoreExportInfo[]) => {
    if (!selectedProductList) {
      return;
    }

    // Convert to details
    const newProductList: ProductStoreExportInfo[] = [];
    for (const selectedProduct of selectedProductList) {
      const { soXe, soChungTu, nguoiXuatHang, nguoiVanChuyen } = selectedProduct;
      newProductList.push({
        ...selectedProduct,
        soXe: soXe,
        soChungTu: soChungTu,
        nguoiXuatHang: nguoiXuatHang,
        nguoiVanChuyen: nguoiVanChuyen,
        soLuongYc: 0,
        soLuongXuat: 0,
      });
    }

    // Merge and deduplicate
    const updatedProductList = unionBy(productList, newProductList, FieldName.ID);

    handleAddProductToTable(updatedProductList);
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
            <Button color="primary" onClick={toggleAddProductModal} disabled={!maKhoXuat}>
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
          {maKhoXuat && isOpenAddProductModal ? (
            <AddProductModal
              isOpen={isOpenAddProductModal}
              toggle={toggleAddProductModal}
              handleConfirmAddProduct={handleAddProductModalConfirm}
              maKho={maKhoXuat}
              productSelected={productList}
            />
          ) : null}
        </>
      )}
    </ToolkitProvider>
  );
}

export default ProductStoreExportAddTable;
