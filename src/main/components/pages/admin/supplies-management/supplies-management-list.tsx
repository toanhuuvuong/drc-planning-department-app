import {
  useKhovtMasterVtControllerCount,
  useKhovtMasterVtControllerCreate,
  useKhovtMasterVtControllerDeleteById,
  useKhovtMasterVtControllerFind,
  useKhovtMasterVtControllerImport,
  useKhovtMasterVtControllerUpdateById,
} from 'main/apis/drc/endpoints/khovt-master-vt-controller/khovt-master-vt-controller';
import { useKhovtNhomControllerFind } from 'main/apis/drc/endpoints/khovt-nhom-controller/khovt-nhom-controller';
import { KhovtMasterNhomWithRelations, KhovtMasterVt, KhovtMasterVtWithRelations } from 'main/apis/drc/models';
import { TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import DeleteModal from 'main/components/organisms/modal/delete-modal';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ToastMessage } from 'main/constants';
import { useSuppliesGroupOptions } from 'main/hooks';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import React, { useCallback, useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Col, Container, Input } from 'reactstrap';
import AddEditItemModal from './supplies-management-add-edit';
import SuppliesManagementFilter, { SuppliesFilter } from './supplies-management-filter';
import UploadSuppliesExcelModal from './upload-supplies-excel-modal';

const SuppliesManagementExportList: React.FC = () => {
  const permissionAction = usePermissionAction();
  const [items, setItems] = useState<KhovtMasterVtWithRelations[]>([]);
  const [modal, setModal] = useState(false);
  const [addEditModal, setAddEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<KhovtMasterVtWithRelations | null>(null);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [dataNhomVT, setDataNhomVT] = useState<KhovtMasterNhomWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);

  // Filter state
  const [filterValues, setFilterValues] = useState<SuppliesFilter>({
    searchName: '',
    searchNhom: '-1',
  });

  const [filter, setFilter] = useState({
    where: {} as any,
    fields: {
      ghiChu: true,
      dvt: true,
      maVt: true,
      tenVt: true,
      maNhom: true,
      tenGoiNho: true,
      thoiHanLuuKho: true,
    },
    limit: sizePerPage,
    skip: (page - 1) * sizePerPage,
  });

  const { data, refetch } = useKhovtMasterVtControllerFind(
    {
      filter: filter,
    },
    {
      query: {
        staleTime: 0,
      },
    },
  );

  const { data: countItems, refetch: refetchCount } = useKhovtMasterVtControllerCount({
    where: filter.where,
  });

  const { data: nhomData, refetch: refetchNhom } = useKhovtNhomControllerFind({});

  const deleteMutation = useKhovtMasterVtControllerDeleteById();
  const updateMutation = useKhovtMasterVtControllerUpdateById();
  const createMutation = useKhovtMasterVtControllerCreate();
  const { suppliesGroupOptions } = useSuppliesGroupOptions(true);

  const { mutateAsync: importedSuppliesMutateAsync, isPending: importedSuppliesIsPending } =
    useKhovtMasterVtControllerImport();

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
    if (nhomData) {
      setDataNhomVT(nhomData);
    }
  }, [nhomData]);

  useEffect(() => {
    refetchNhom().finally(() => setLoading(false));
  }, [refetchNhom]);

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

  const toggleUploadModal = useCallback(() => setOpenUploadModal((isOpenUploadModal) => !isOpenUploadModal), []);

  const handleShowDeleteModal = (item: KhovtMasterVtWithRelations) => {
    setCurrentItem(item);
    toggleModal();
  };

  const handleShowEditModal = (item: KhovtMasterVtWithRelations) => {
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
        { id: String(currentItem.maVt) },
        {
          onSuccess: () => {
            setFilterValues({
              searchName: '',
              searchNhom: '-1',
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

  const updateItem = async (maVt: string, updatedItem: Partial<KhovtMasterVtWithRelations>) => {
    updateMutation.mutate(
      { id: maVt, data: updatedItem },
      {
        onSuccess: () => {
          setItems(items.map((item) => (item.maVt === maVt ? { ...item, ...updatedItem } : item)));
          refetch();
        },
        onError: (error) => {
          toast.error((error as any)?.response?.data?.error?.message || error.message);
        },
      },
    );
  };

  const handleAddNewItem = async (item: {
    maVt: string;
    tenVt: string;
    ghiChu: string;
    dvt: string;
    maNhom: string;
    tenGoiNho: string;
    thoiHanLuuKho: number;
  }) => {
    createMutation.mutate(
      { data: item },
      {
        onSuccess: (newItem) => {
          setFilterValues({
            searchName: '',
            searchNhom: '-1',
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
    (newFilter: SuppliesFilter) => {
      setFilterValues(newFilter);

      const newWhere: any = {};
      if (newFilter.searchName) {
        newWhere.tenVt = { like: `%${newFilter.searchName}%` };
      }
      if (newFilter.searchNhom !== '-1') {
        newWhere.maNhom = newFilter.searchNhom;
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

  const handleUploadModalConfirmClickCallback = useCallback(
    (suppliesList: KhovtMasterVt[]) => {
      // Close modal
      toggleUploadModal();

      // Create new product store excel
      importedSuppliesMutateAsync({
        data: suppliesList,
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
    [importedSuppliesMutateAsync, refetch, refetchCount, toggleUploadModal],
  );

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

  const selectOptions = dataNhomVT.map((nhom) => ({ value: nhom.maNhom, label: nhom.tenNhom }));

  const fieldArray = [
    {
      dataField: 'maVt',
      text: 'Mã Vật Tư',
      sort: false,
      style: { width: '15%' },
    },
    {
      dataField: 'maNhom',
      text: 'Nhóm Vật Tư',
      sort: false,
      style: { width: '15%' },
      editorRenderer: (editorProps: any, value: any, row: any, column: any, rowIndex: any, columnIndex: any) => (
        <CustomSelectEditor {...editorProps} value={value} options={selectOptions} />
      ),
      formatter: (cell: any, row: KhovtMasterVtWithRelations) => {
        const nhom = dataNhomVT.find((nhom) => nhom.maNhom === cell);
        return nhom ? nhom.tenNhom : cell;
      },
    },
    {
      dataField: 'tenVt',
      text: 'Tên Vật Tư',
      sort: false,
      style: { width: '15%' },
    },
    {
      dataField: 'tenGoiNho',
      text: 'Tên Gợi Nhớ',
      sort: false,
      style: { width: '15%' },
    },
    {
      dataField: 'dvt',
      text: 'Đơn Vị Tính',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'thoiHanLuuKho',
      text: 'Thời Gian Lưu Kho (Tháng)',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'ghiChu',
      text: 'Ghi Chú',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'thaoTac',
      text: 'Thao Tác',
      editable: false,
      style: { width: '10%' },
      hidden: !permissionAction,
      formatter: (cell: any, row: KhovtMasterVtWithRelations) => (
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
      pageCategory={Page.SUPPLIES_MANAGEMENT_LIST.CATEGORY}
      pageTitle={Page.SUPPLIES_MANAGEMENT_LIST.TITLE}
      pageName={Page.SUPPLIES_MANAGEMENT_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <SuppliesManagementFilter initialFilter={filterValues} onFilterChange={handleFilterChange} />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ToolkitProvider data={items} keyField="maVt" columns={fieldArray} search>
              {(props: any) => (
                <>
                  <div className="d-flex justify-content-end mb-4 pb-1">
                    <EditPermissionAction>
                      <Button color="primary" onClick={toggleUploadModal}>
                        Import vật tư
                      </Button>
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
                        keyField="maVt"
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
                messageItem={currentItem.tenVt}
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
            <UploadSuppliesExcelModal
              isOpen={isOpenUploadModal}
              toggle={toggleUploadModal}
              handleConfirmClickCallback={handleUploadModalConfirmClickCallback}
            />
            {importedSuppliesIsPending && <TransparentSpinner />}
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

export default SuppliesManagementExportList;
