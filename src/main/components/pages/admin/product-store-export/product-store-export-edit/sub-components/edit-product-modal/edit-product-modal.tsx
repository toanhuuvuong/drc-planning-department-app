import { useKhotpTransPhieuNhapControllerFindDetailForXuat } from 'main/apis/drc/endpoints/khotp-trans-phieu-nhap-controller/khotp-trans-phieu-nhap-controller';
import { ProductStoreExportInfo } from 'main/components/pages/admin/product-store-export/product-store-export-add/use-product-store-export-add';
import { TableState } from 'main/types';
import { DateUtil } from 'main/utils';
import { useEffect, useState } from 'react';
import { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import EditProductModalFilter, { EditProductFilter } from './edit-product-modal-filter';
import EditProductModalTable from './product-edit-store-export-table/edit-product-modal-table';

type Props = {
  isOpen: boolean;
  toggle: () => void;
  handleConfirmAddProduct: (selectedProductList?: ProductStoreExportInfo[]) => void;
  maKho?: string;
};

function EditProductModal({ isOpen, toggle, handleConfirmAddProduct, maKho }: Props) {
  // React State
  const [filter, setFilter] = useState<EditProductFilter>({
    maSanPham: '',
    tenSanPham: '',
    // soChungTu: '',
    tenGoiNho: '',
    ThoiHanLuuKho: '',
    // ngayNhap: '',
    ngayNhap: null,
    maKho: maKho || '',
  });
  const [table, setTable] = useState<TableState<ProductStoreExportInfo>>({
    page: 1,
    sizePerPage: 10,
  });

  const [selectedRows, setSelectedRows] = useState<ProductStoreExportInfo[]>([]);

  // React Query
  const { data: productDetails, isLoading: productIsLoading } = useKhotpTransPhieuNhapControllerFindDetailForXuat(
    getProductParams(filter, table),
  );

  // React fucnction
  const handleSearchSanPham = (newFilter: EditProductFilter) => {
    setFilter(newFilter);

    // Reset table state
    setTable({ ...table, page: 1, sortField: undefined, sortOrder: undefined });
  };

  const handleTableChange = (_: TableChangeType, newState: TableChangeState<ProductStoreExportInfo>) => {
    const { page, sizePerPage, sortField, sortOrder } = newState;

    // Update state
    setTable({ ...table, page, sizePerPage, sortOrder, sortField });
  };

  const handleSelectedRowsChange = (newSelectedRows: ProductStoreExportInfo[]) => {
    setSelectedRows(newSelectedRows);

    setTable({ ...table, selectedRows: newSelectedRows });
  };

  useEffect(() => {
    if (maKho && isOpen) {
      setFilter({
        maSanPham: '',
        tenSanPham: '',
        // soChungTu: '',
        tenGoiNho: '',
        ThoiHanLuuKho: '',
        ngayNhap: null,
        maKho: maKho,
      });
      setTable({
        page: 1,
        sizePerPage: 10,
      });
    }
  }, [maKho, isOpen]);

  // useEffect(() => {
  //   if (isOpen) {
  //     // Reset filter and table state when modal opens
  //     setFilter({
  //       maSanPham: '',
  //       tenSanPham: '',
  //       soChungTu: '',
  //       tenGoiNho: '',
  //       ThoiHanLuuKho: '',
  //       ngayNhap: '',
  //       maKhoXuat: '',
  //     });
  //     setTable({
  //       page: 1,
  //       sizePerPage: 10,
  //     });
  //   }
  // }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="xl">
      <ModalHeader toggle={toggle}>Thêm sản phẩm</ModalHeader>
      <ModalBody>
        <EditProductModalFilter filter={filter} handleSearchClick={handleSearchSanPham} />
        <hr />
        <EditProductModalTable
          data={productDetails?.data as ProductStoreExportInfo[]}
          dataCount={productDetails?.count}
          dataIsLoading={productIsLoading}
          handleSelectedRowsChange={handleSelectedRowsChange}
          handleTableStateChange={handleTableChange}
          selectedRows={selectedRows}
          tableState={table}
        />
      </ModalBody>
      <ModalFooter className="">
        <Button color="primary" onClick={() => handleConfirmAddProduct(selectedRows)}>
          Thêm
        </Button>
        <Button color="secondary" onClick={toggle}>
          Đóng
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const getProductParams = (filter: EditProductFilter, table: TableState<ProductStoreExportInfo>) => {
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

const getProductCountParams = (filter: EditProductFilter) => {
  const { maSanPham, tenSanPham, tenGoiNho, ThoiHanLuuKho, ngayNhap, maKho } = filter;

  return {
    where: {
      maSanPham: maSanPham ? maSanPham : undefined,
      tenSanPham: tenSanPham ? { like: `%${tenSanPham}%` } : undefined,
      // soChungTu: soChungTu ? { like: `%${soChungTu}%` } : undefined,
      tenGoiNho: tenGoiNho ? { like: `%${tenGoiNho}%` } : undefined,
      ThoiHanLuuKho: ThoiHanLuuKho ? ThoiHanLuuKho : undefined,
      // ngayNhap: ngayNhap ? ngayNhap : undefined,
      ngayNhap: DateUtil.toDateISOString(ngayNhap),
      maKho: maKho ? maKho : undefined,
    },
  };
};

export default EditProductModal;
