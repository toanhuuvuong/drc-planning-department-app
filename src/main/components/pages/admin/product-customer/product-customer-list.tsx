import {
  useKhotpMasterKhachHangControllerCount,
  useKhotpMasterKhachHangControllerCreate,
  useKhotpMasterKhachHangControllerDeleteById,
  useKhotpMasterKhachHangControllerFind,
  useKhotpMasterKhachHangControllerImport,
  useKhotpMasterKhachHangControllerUpdateById,
} from 'main/apis/drc/endpoints/khotp-master-khach-hang-controller/khotp-master-khach-hang-controller';
import { KhotpMasterKhachHang, type KhotpMasterKhachHangFilter1 } from 'main/apis/drc/models';
import { KhotpMasterKhachHangWithRelations } from 'main/apis/drc/models/khotpMasterKhachHangWithRelations';
import { TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import DeleteModal from 'main/components/organisms/modal/delete-modal';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ToastMessage } from 'main/constants';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Container } from 'reactstrap';
import UploadCustomerExcelModal from './upload-customer-excel-modal';
import AddEditItemModal from '../product-customer/product-customer-add-edit';
import ProductCustomerFilter, { ProductCustomerFilter as FilterType } from './product-customer-filter';

const ProductCustomerExportList: React.FC = () => {
  const permissionAction = usePermissionAction();
  const [modal, setModal] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [addEditModal, setAddEditModal] = useState(false);
  const [items, setItems] = useState<KhotpMasterKhachHangWithRelations[]>([]);
  const [currentItem, setCurrentItem] = useState<KhotpMasterKhachHangWithRelations | null>(null);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [dataCustomer] = useState<string[]>([]);
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);

  // Filter state
  const [filterValues, setFilterValues] = useState<FilterType>({
    tenKh: '',
    maKh: '',
  });

  const deleteMutation = useKhotpMasterKhachHangControllerDeleteById();
  const createMutation = useKhotpMasterKhachHangControllerCreate();
  const updateMutation = useKhotpMasterKhachHangControllerUpdateById();

  const searchFilter: KhotpMasterKhachHangFilter1 = useMemo(
    () => ({
      fields: {
        diaChiKh: true,
        dtKh: true,
        ghiChu: true,
        khuVucKh: true,
        lienHeKh: true,
        maKh: true,
        tenKh: true,
        mstKh: true,
        faxKh: true,
      },
      where: {
        maKh: undefined,
        tenKh: undefined,
      },
      limit: sizePerPage,
      skip: (page - 1) * sizePerPage,
    }),
    [page, sizePerPage],
  );

  const { data: countItems, refetch: refetchCount } = useKhotpMasterKhachHangControllerCount({
    where: searchFilter.where,
  });

  const { data, refetch } = useKhotpMasterKhachHangControllerFind(
    {
      filter: searchFilter,
    },
    {
      query: {
        staleTime: 0,
      },
    },
  );

  const { mutateAsync: importedCustomerMutateAsync, isPending: importedCustomerIsPending } =
    useKhotpMasterKhachHangControllerImport();

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  useEffect(() => {
    if (countItems && countItems.count !== undefined) {
      setTotalItems(countItems.count);
    }
  }, [countItems]);

  const handleTableChange = (type: any, { page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
    refetch();
    refetchCount();
  };

  const updateItem = async (id: string, updatedItem: Partial<KhotpMasterKhachHangWithRelations>) => {
    updateMutation.mutate(
      { id: String(id), data: updatedItem },
      {
        onSuccess: () => {
          setItems(items.map((item) => (item.maKh === id ? { ...item, ...updatedItem } : item)));
          refetch();
        },
        onError: (error) => {
          toast.error((error as any)?.response?.data?.error?.message || error.message);
        },
      },
    );
  };

  const toggleModal = () => setModal(!modal);

  const toggleUploadModal = useCallback(() => setOpenUploadModal((isOpenUploadModal) => !isOpenUploadModal), []);

  const paginationOptions = paginationFactory({
    page,
    sizePerPage,
    totalSize: totalItems,
    showTotal: true,
    withFirstAndLast: true,
    alwaysShowAllBtns: true,
    sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
      <div className="dataTables_length" id="datatable-basic_length">
        <label>
          Hiển thị{' '}
          {
            <select
              name="datatable-basic_length"
              aria-controls="datatable-basic"
              className="form-control form-control-sm"
              value={currSizePerPage}
              onChange={(e) => onSizePerPageChange(Number(e.target.value))}>
              {options.map((option) => (
                <option key={option.text} value={option.page}>
                  {option.text}
                </option>
              ))}
            </select>
          }{' '}
          mục.
        </label>
      </div>
    ),
    paginationTotalRenderer: (from: number, to: number, size: number) => (
      <span className="react-bootstrap-table-pagination-total">
        &nbsp;Hiển thị hàng {from} đến {to} trên {size}
      </span>
    ),
    onPageChange: (page) => handleTableChange('pagination', { page, sizePerPage }),
    onSizePerPageChange: (sizePerPage, page) => handleTableChange('pagination', { page, sizePerPage }),
  });

  const handleAddNewModal = () => {
    setCurrentItem(null);
    setAddEditModal(true);
  };

  const handleShowEditModal = (item: KhotpMasterKhachHangWithRelations) => {
    setCurrentItem(item);
    setAddEditModal(true);
  };
  const handleShowDeleteModal = (item: KhotpMasterKhachHangWithRelations) => {
    setCurrentItem(item);
    toggleModal();
  };
  const handleDelete = async () => {
    if (currentItem) {
      deleteMutation.mutate(
        { id: String(currentItem.maKh) },
        {
          onSuccess: () => {
            setPage(1);
            refetch();
            refetchCount();
            toggleModal();
          },
          onError: (error) => {
            toast.error((error as any)?.response?.data?.error?.message || error.message);
          },
        },
      );
    }
  };

  const toggleAddEditModal = () => {
    setCurrentItem(null);
    setAddEditModal(!addEditModal);
  };

  const handleAddNewItem = async (item: {
    diaChiKh: string;
    dtKh: string;
    ghiChu: string;
    khuVucKh: string;
    lienHeKh: string;
    maKh: string;
    tenKh: string;
    mstKh: string;
    faxKh: string;
  }) => {
    createMutation.mutate(
      { data: item },
      {
        onSuccess: (newItem) => {
          setPage(1);
          refetch();
          refetchCount();
          toggleAddEditModal();
        },
        onError: (error) => {
          toast.error((error as any)?.response?.data?.error?.message || error.message);
        },
      },
    );
  };

  const handleUploadModalConfirmClickCallback = useCallback(
    (customerList: KhotpMasterKhachHang[]) => {
      // Close modal
      toggleUploadModal();

      // Import new customer
      importedCustomerMutateAsync({
        data: customerList,
      })
        .then((_) => {
          toast.success(ToastMessage.IMPORT_SUCCESS);
          refetch();
          refetchCount();
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [importedCustomerMutateAsync, refetch, refetchCount, toggleUploadModal],
  );

  const handleFilterChange = useCallback(
    (newFilter: FilterType) => {
      setFilterValues(newFilter);

      searchFilter.where = {
        or: [
          { maKh: newFilter.maKh ? { like: `%${newFilter.maKh.trim()}%` } : undefined },
          { tenKh: newFilter.tenKh ? { like: `%${newFilter.tenKh.trim()}%` } : undefined },
        ],
      };

      setPage(1);
      refetch();
      refetchCount();
    },
    [refetch, refetchCount, searchFilter],
  );

  const fieldArray = [
    {
      dataField: 'maKh',
      text: 'Mã khách hàng',
      sort: false,
      style: { width: '20%' },
    },
    {
      dataField: 'tenKh',
      text: 'Tên khách hàng',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'diaChiKh',
      text: 'Địa chỉ',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'mstKh',
      text: 'Mã số thuế',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'dtKh',
      text: 'Số điện thoại',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'lienHeKh',
      text: 'Người liên hệ',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'khuVucKh',
      text: 'Vùng',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'ghiChu',
      text: 'Ghi chú',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'thaoTac',
      text: 'Thao Tác',
      editable: false,
      style: { width: '10%' },
      hidden: !permissionAction,
      formatter: (cell: any, row: KhotpMasterKhachHangWithRelations) => (
        <EditPermissionAction>
          <Link className="px-3" to="#" onClick={() => handleShowEditModal(row)}>
            <i className="fa-solid fa-pen-to-square" title="Sửa" />
          </Link>
          <Link className="px-3" to="#" onClick={() => handleShowDeleteModal(row)}>
            <i className="fa-solid fa-trash" title="Xóa" />
          </Link>
        </EditPermissionAction>
      ),
    },
  ];

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCTS_CUSTOMER_LIST.CATEGORY}
      pageTitle={Page.PRODUCTS_CUSTOMER_LIST.TITLE}
      pageName={Page.PRODUCTS_CUSTOMER_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <ProductCustomerFilter initialFilter={filterValues} onFilterChange={handleFilterChange} />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ToolkitProvider data={items} keyField="maKh" columns={fieldArray} search>
              {(props: any) => (
                <>
                  <div className="d-flex justify-content-end mb-4 pb-1">
                    <EditPermissionAction>
                      <Button color="primary" onClick={toggleUploadModal}>
                        Import khách hàng
                      </Button>
                      <Button color="primary" onClick={handleAddNewModal}>
                        Thêm mới
                      </Button>
                    </EditPermissionAction>
                  </div>
                  <div className="table-responsive">
                    <BootstrapTable
                      {...props.baseProps}
                      bootstrap4={true}
                      pagination={paginationOptions}
                      remote
                      onTableChange={handleTableChange}
                      bordered={false}
                    />
                  </div>
                </>
              )}
            </ToolkitProvider>
            {currentItem && (
              <DeleteModal
                messageItem={currentItem.tenKh || ''}
                modal={modal}
                toggle={toggleModal}
                handleDelete={handleDelete}
              />
            )}
            <AddEditItemModal
              isOpen={addEditModal}
              toggle={toggleAddEditModal}
              handleAdd={handleAddNewItem}
              handleEdit={updateItem}
              currentItem={currentItem}
              dataNhomSP={dataCustomer}
            />
            <UploadCustomerExcelModal
              isOpen={isOpenUploadModal}
              toggle={toggleUploadModal}
              handleConfirmClickCallback={handleUploadModalConfirmClickCallback}
            />
            {importedCustomerIsPending && <TransparentSpinner />}
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
};

export default ProductCustomerExportList;
