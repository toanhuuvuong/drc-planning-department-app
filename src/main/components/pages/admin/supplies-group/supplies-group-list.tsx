import {
  useKhovtNhomControllerCount,
  useKhovtNhomControllerCreate,
  useKhovtNhomControllerDeleteById,
  useKhovtNhomControllerFind,
  useKhovtNhomControllerUpdateById,
} from 'main/apis/drc/endpoints/khovt-nhom-controller/khovt-nhom-controller';
import { KhovtMasterNhomWithRelations } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import DeleteModal from 'main/components/organisms/modal/delete-modal';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import { useCallback, useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Container } from 'reactstrap';
import AddEditItemModal from './supplies-group-add-edit';
import SuppliesGroupFilter, { SuppliesGroupFilter as FilterType } from './supplies-group-filter';

const SuppliesGroupExportList: React.FC = () => {
  const permissionAction = usePermissionAction();
  const [items, setItems] = useState<KhovtMasterNhomWithRelations[]>([]);
  const [modal, setModal] = useState(false);
  const [addEditModal, setAddEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<KhovtMasterNhomWithRelations | null>(null);
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
      id: true,
      maNhom: true,
      tenNhom: true,
    },
    limit: sizePerPage,
    skip: (page - 1) * sizePerPage,
  });

  const { data, refetch } = useKhovtNhomControllerFind(
    {
      filter: filter,
    },
    {
      query: {
        staleTime: 0,
      },
    },
  );

  const { data: countItems, refetch: refetchCount } = useKhovtNhomControllerCount({
    where: filter.where,
  });

  const deleteMutation = useKhovtNhomControllerDeleteById();
  const updateMutation = useKhovtNhomControllerUpdateById();
  const createMutation = useKhovtNhomControllerCreate();

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

  const handleShowDeleteModal = (item: KhovtMasterNhomWithRelations) => {
    setCurrentItem(item);
    toggleModal();
  };

  const handleShowEditModal = (item: KhovtMasterNhomWithRelations) => {
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
        { id: Number(currentItem.id) },
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

  const updateItem = async (id: number, updatedItem: Partial<KhovtMasterNhomWithRelations>) => {
    updateMutation.mutate(
      { id: Number(id), data: updatedItem },
      {
        onSuccess: () => {
          setItems(items.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)));
          refetch();
        },
        onError: (error) => {
          toast.error((error as any)?.response?.data?.error?.message || error.message);
        },
      },
    );
  };

  const handleAddNewItem = async (item: { maNhom: string; tenNhom: string; ghiChu: string }) => {
    createMutation.mutate(
      { data: item },
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
        newWhere.tenNhom = { like: `%${newFilter.searchName}%` };
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
      dataField: 'maNhom',
      text: 'Mã Nhóm Vật Tư',
      sort: false,
      style: { width: '20%' },
    },
    {
      dataField: 'tenNhom',
      text: 'Tên Nhóm Vật Tư',
      sort: false,
      style: { width: '30%' },
    },
    {
      dataField: 'ghiChu',
      text: 'Ghi Chú',
      sort: false,
      style: { width: '30%' },
    },
    {
      dataField: 'thaoTac',
      text: 'Thao Tác',
      editable: false,
      style: { width: '20%' },
      hidden: !permissionAction,
      formatter: (cell: any, row: KhovtMasterNhomWithRelations) => (
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
      pageCategory={Page.SUPPLIES_GROUP_LIST.CATEGORY}
      pageTitle={Page.SUPPLIES_GROUP_LIST.TITLE}
      pageName={Page.SUPPLIES_GROUP_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <SuppliesGroupFilter initialFilter={filterValues} onFilterChange={handleFilterChange} />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ToolkitProvider data={items} keyField="id" columns={fieldArray} search>
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
                messageItem={currentItem.tenNhom}
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

export default SuppliesGroupExportList;
