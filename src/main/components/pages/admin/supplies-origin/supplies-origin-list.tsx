import {
  useKhovtMasterNguonGocControllerCount,
  useKhovtMasterNguonGocControllerCreate,
  useKhovtMasterNguonGocControllerDeleteById,
  useKhovtMasterNguonGocControllerFind,
  useKhovtMasterNguonGocControllerFindNuoc,
  useKhovtMasterNguonGocControllerUpdateById,
} from 'main/apis/drc/endpoints/khovt-master-nguon-goc-controller/khovt-master-nguon-goc-controller';
import { KhoMasterNuoc, KhovtMasterNguonGocWithRelations } from 'main/apis/drc/models';
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
import { Button, Card, CardBody, Container, Input } from 'reactstrap';
import AddEditItemModal from './supplies-origin-add-edit';
import SuppliesOriginFilter, { SuppliesOriginFilter as FilterType } from './supplies-origin-filter';

const SuppliesOriginExportList: React.FC = () => {
  const permissionAction = usePermissionAction();
  const [items, setItems] = useState<KhovtMasterNguonGocWithRelations[]>([]);
  const [modal, setModal] = useState(false);
  const [addEditModal, setAddEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<KhovtMasterNguonGocWithRelations | null>(null);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [dataNuoc, setDataNuoc] = useState<KhoMasterNuoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filterValues, setFilterValues] = useState<FilterType>({
    searchNhaSX: '',
    searchNuoc: '-1',
  });

  const [filter, setFilter] = useState({
    where: {} as any,
    fields: {
      ghiChu: true,
      id: true,
      nuocId: true,
      tenNhaSx: true,
    },
    limit: sizePerPage,
    skip: (page - 1) * sizePerPage,
  });

  const { data, refetch } = useKhovtMasterNguonGocControllerFind(
    {
      filter: filter,
    },
    {
      query: {
        staleTime: 0,
      },
    },
  );

  const { data: countItems, refetch: refetchCount } = useKhovtMasterNguonGocControllerCount({
    where: filter.where,
  });

  const { data: nuocData, refetch: refetchNuoc } = useKhovtMasterNguonGocControllerFindNuoc({});

  const deleteMutation = useKhovtMasterNguonGocControllerDeleteById();
  const updateMutation = useKhovtMasterNguonGocControllerUpdateById();
  const createMutation = useKhovtMasterNguonGocControllerCreate();

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
    if (nuocData) {
      setDataNuoc(nuocData);
    }
  }, [nuocData]);

  useEffect(() => {
    refetchNuoc().finally(() => setLoading(false));
  }, [refetchNuoc]);

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

  const handleShowDeleteModal = (item: KhovtMasterNguonGocWithRelations) => {
    setCurrentItem(item);
    toggleModal();
  };

  const handleShowEditModal = (item: KhovtMasterNguonGocWithRelations) => {
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
              searchNhaSX: '',
              searchNuoc: '-1',
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

  const updateItem = async (id: number, updatedItem: Partial<KhovtMasterNguonGocWithRelations>) => {
    updateMutation.mutate(
      { id: id, data: updatedItem },
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

  const handleAddNewItem = async (item: { ghiChu: string; nuocId: string; tenNhaSx: string }) => {
    createMutation.mutate(
      { data: item },
      {
        onSuccess: (newItem) => {
          setFilterValues({
            searchNhaSX: '',
            searchNuoc: '-1',
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
      if (newFilter.searchNhaSX) {
        newWhere.tenNhaSx = { like: `%${newFilter.searchNhaSX}%` };
      }
      if (newFilter.searchNuoc !== '-1') {
        newWhere.nuocId = newFilter.searchNuoc;
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

  const selectOptions = dataNuoc.map((nuoc) => ({ value: nuoc.maNuoc, label: nuoc.tenNuocVn }));

  const fieldArray = [
    {
      dataField: FieldName.TEN_NHA_SX,
      text: 'Nhà cung cấp',
      sort: false,
      style: { width: '20%' },
    },
    {
      dataField: 'nuocId',
      text: 'Nước Sản Xuất',
      sort: false,
      style: { width: '30%' },
      editorRenderer: (editorProps: any, value: any, row: any, column: any, rowIndex: any, columnIndex: any) => (
        <CustomSelectEditor {...editorProps} value={value} options={selectOptions} />
      ),
      formatter: (cell: any, row: KhovtMasterNguonGocWithRelations) => {
        const nuoc = dataNuoc.find((nuoc) => nuoc.maNuoc === cell);
        return nuoc ? nuoc.tenNuocVn : cell;
      },
    },
    {
      dataField: FieldName.GHI_CHU,
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
      formatter: (cell: any, row: KhovtMasterNguonGocWithRelations) => (
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
      pageCategory={Page.SUPPLIES_ORIGIN_LIST.CATEGORY}
      pageTitle={Page.SUPPLIES_ORIGIN_LIST.TITLE}
      pageName={Page.SUPPLIES_ORIGIN_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <SuppliesOriginFilter initialFilter={filterValues} onFilterChange={handleFilterChange} />
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
                    {loading ? (
                      <div>Loading...</div>
                    ) : (
                      <BootstrapTable
                        {...props.baseProps}
                        bootstrap4={true}
                        keyField="id"
                        pagination={paginationOptions}
                        remote
                        onTableChange={handleTableChange}
                        bordered={false}
                      />
                    )}
                  </div>
                </>
              )}
            </ToolkitProvider>
            {currentItem && (
              <DeleteModal
                messageItem={currentItem.tenNhaSx}
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

const CustomSelectEditor: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onUpdate: (value: string) => void;
}> = ({ options, value, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(e.target.value);
  };

  return (
    <Input type="select" value={value} onChange={handleChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Input>
  );
};

export default SuppliesOriginExportList;
