import {
  useKhotpMasterKhoControllerCount,
  useKhotpMasterKhoControllerCreate,
  useKhotpMasterKhoControllerDeleteById,
  useKhotpMasterKhoControllerFind,
  useKhotpMasterKhoControllerUpdateById,
} from 'main/apis/drc/endpoints/khotp-master-kho-controller/khotp-master-kho-controller';
import { KhotpMasterKhoWithRelations } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import DeleteModal from 'main/components/organisms/modal/delete-modal';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import { useCallback, useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Container } from 'reactstrap';
import AddEditItemModal from './product-warehouse-add-edit';
import ProductWarehouseFilter, { ProductWarehouseFilter as FilterType } from './product-warehouse-filter';

const ProductWarehouseExportList: React.FC = () => {
  const permissionAction = usePermissionAction();
  const [items, setItems] = useState<KhotpMasterKhoWithRelations[]>([]);
  const [modal, setModal] = useState(false);
  const [addEditModal, setAddEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<KhotpMasterKhoWithRelations | null>(null);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Filter state
  const [filterValues, setFilterValues] = useState<FilterType>({
    searchName: '',
  });

  const [filter, setFilter] = useState({
    where: {} as any,
    fields: {
      ghiChu: true,
      maKho: true,
      tenKho: true,
    },
    limit: sizePerPage,
    skip: (page - 1) * sizePerPage,
  });

  const { data, refetch } = useKhotpMasterKhoControllerFind(
    {
      filter: filter,
    },
    {
      query: {
        staleTime: 0,
      },
    },
  );

  const { data: countItems, refetch: refetchCount } = useKhotpMasterKhoControllerCount({
    where: filter.where,
  });

  const deleteMutation = useKhotpMasterKhoControllerDeleteById();
  const updateMutation = useKhotpMasterKhoControllerUpdateById();
  const createMutation = useKhotpMasterKhoControllerCreate();

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

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      limit: sizePerPage,
      skip: (page - 1) * sizePerPage,
    }));
    refetch();
    refetchCount();
  }, [page, refetch, refetchCount, sizePerPage]);

  const toggleModal = () => setModal(!modal);
  const toggleAddEditModal = () => {
    setCurrentItem(null);
    setAddEditModal(!addEditModal);
  };

  const handleShowDeleteModal = (item: KhotpMasterKhoWithRelations) => {
    setCurrentItem(item);
    toggleModal();
  };

  const handleShowEditModal = (item: KhotpMasterKhoWithRelations) => {
    setCurrentItem(item);
    setAddEditModal(true);
  };

  const handleAddNewModal = () => {
    setCurrentItem(null);
    setAddEditModal(true);
  };

  const handleDelete = async () => {
    if (currentItem) {
      deleteMutation.mutate(
        { id: String(currentItem.maKho) },
        {
          onSuccess: () => {
            setFilterValues({
              searchName: '',
            });
            setFilter((prevFilter) => ({
              ...prevFilter,
              where: {},
              skip: 0,
            }));
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

  const updateItem = async (id: String, updatedItem: Partial<KhotpMasterKhoWithRelations>) => {
    updateMutation.mutate(
      { id: String(id), data: updatedItem },
      {
        onSuccess: () => {
          setItems(items.map((item) => (item.maKho === id ? { ...item, ...updatedItem } : item)));
          refetch();
        },
        onError: (error) => {
          toast.error((error as any)?.response?.data?.error?.message || error.message);
        },
      },
    );
  };

  const handleAddNewItem = async (item: { maKho: string; tenKho: string; ghiChu: string }) => {
    createMutation.mutate(
      { data: item },
      {
        onSuccess: (newItem) => {
          setFilterValues({
            searchName: '',
          });
          setFilter((prevFilter) => ({
            ...prevFilter,
            where: {},
            skip: 0,
          }));
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

  const handleFilterChange = useCallback(
    (newFilter: FilterType) => {
      setFilterValues(newFilter);

      const newWhere: any = {};
      if (newFilter.searchName) {
        newWhere.tenKho = { like: `%${newFilter.searchName}%` };
      }

      setFilter((prevFilter) => ({
        ...prevFilter,
        where: newWhere,
        skip: 0,
      }));

      setPage(1);
      refetch();
      refetchCount();
    },
    [refetch, refetchCount],
  );

  const handleTableChange = (type: any, { page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

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

  const fieldArray = [
    {
      dataField: 'maKho',
      text: 'Mã Kho',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'tenKho',
      text: 'Tên Kho',
      sort: false,
      style: { width: '20%' },
    },
    {
      dataField: 'ghiChu',
      text: 'Ghi Chú',
      sort: false,
      style: { width: '30%' },
    },
    {
      dataField: FieldName.KHO_AND_VI_TRIS,
      isDummyField: true,
      text: 'Vị trí lưu kho',
      editable: false,
      formatter: (_: any, row: KhotpMasterKhoWithRelations) => {
        const viTriLuuKhoCell = row.khoAndViTris
          ? row.khoAndViTris.map((khoAndViTri) => khoAndViTri.maViTriKho).join(', ')
          : '';
        return <div>{viTriLuuKhoCell}</div>;
      },
      style: { width: '30%' },
    },
    {
      dataField: 'thaoTac',
      text: 'Thao Tác',
      editable: false,
      style: { width: '10%' },
      hidden: !permissionAction,
      formatter: (cell: any, row: KhotpMasterKhoWithRelations) => (
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
      pageCategory={Page.PRODUCTS_WAREHOUSE_LIST.CATEGORY}
      pageTitle={Page.PRODUCTS_WAREHOUSE_LIST.TITLE}
      pageName={Page.PRODUCTS_WAREHOUSE_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <ProductWarehouseFilter initialFilter={filterValues} onFilterChange={handleFilterChange} />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ToolkitProvider data={items} keyField="maKho" columns={fieldArray} search>
              {(props: any) => (
                <>
                  <div className="d-flex justify-content-end mb-4 pb-1">
                    <EditPermissionAction>
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
                messageItem={currentItem.tenKho || ''}
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
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
};

export default ProductWarehouseExportList;
