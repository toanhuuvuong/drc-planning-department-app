import {
  useKhotpMasterSanPhamControllerCount,
  useKhotpMasterSanPhamControllerFind,
} from 'main/apis/drc/endpoints/khotp-master-san-pham-controller/khotp-master-san-pham-controller';
import { KhotpMasterSanPhamWithRelations } from 'main/apis/drc/models';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  ProductFilter,
  resetProductFilterAndTable,
  selectProductFilter,
  selectProductTable,
  selectProductTableExcludeSelectedRows,
  selectProductTriggerFlag,
} from 'main/redux/modules/product-store-import/product-store-import-add-slice';
import { TableState } from 'main/types';
import { useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import AddProductModalFilter from './add-product-modal-filter';
import AddProductModalTable from './add-product-modal-table/add-product-modal-table';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleConfirmClick: (selectedProductRows?: KhotpMasterSanPhamWithRelations[]) => void;
};

function AddProductModal({ isOpen, toggle, handleConfirmClick }: Props) {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectProductFilter);
  const table = useAppSelector(selectProductTable);
  const tableExcludeSelectedRows = useAppSelector(selectProductTableExcludeSelectedRows);
  const triggerFlag = useAppSelector(selectProductTriggerFlag);

  // React Effect
  useEffect(() => {
    if (isOpen) {
      dispatch(resetProductFilterAndTable());
    }
  }, [dispatch, isOpen]);

  // React Query
  const { data: products, isLoading: productsIsLoading } = useKhotpMasterSanPhamControllerFind(
    getProductParams(filter, tableExcludeSelectedRows),
    {
      query: {
        queryKey: ['products', filter, tableExcludeSelectedRows, triggerFlag],
      },
    },
  );

  const { data: productsCount, isLoading: productsCountIsLoading } = useKhotpMasterSanPhamControllerCount(
    getProductCountParams(filter),
    {
      query: {
        queryKey: ['productsCount', filter, triggerFlag],
      },
    },
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="xl">
      <ModalHeader toggle={toggle}>Thêm sản phẩm</ModalHeader>
      <ModalBody>
        <AddProductModalFilter />
        <hr />
        <AddProductModalTable
          data={products}
          dataIsLoading={productsIsLoading}
          dataCount={productsCount?.count}
          dataCountIsLoading={productsCountIsLoading}
        />
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <Button color="primary" onClick={() => handleConfirmClick(table.selectedRows)}>
          Thêm
        </Button>
        <Button color="secondary" onClick={toggle}>
          Đóng
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const getProductParams = (filter: ProductFilter, table: TableState<KhotpMasterSanPhamWithRelations>) => {
  const where = getProductCountParams(filter).where;
  const { page, sizePerPage, sortField, sortOrder } = table;

  return {
    filter: {
      offset: (page - 1) * sizePerPage,
      limit: sizePerPage,
      order: sortField ? `${sortField} ${sortOrder?.toUpperCase()}` : undefined,
      where,
    },
  };
};

const getProductCountParams = (filter: ProductFilter) => {
  const { productGroup, productCode, productName, productSuggestiveName } = filter;
  return {
    where: {
      maNhom: productGroup && productGroup !== '-1' ? productGroup : undefined,
      maSanPham: productCode ? productCode : undefined,
      tenSanPham: { like: productName ? `%${productName}%` : undefined },
      tenGoiNho: { like: productSuggestiveName ? `%${productSuggestiveName}%` : undefined },
    },
  };
};

export default AddProductModal;
