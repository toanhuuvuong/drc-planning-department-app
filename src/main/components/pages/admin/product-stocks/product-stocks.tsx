import {
  useKhotpMasterSanPhamControllerCount,
  useKhotpMasterSanPhamControllerCreate,
  useKhotpMasterSanPhamControllerDeleteById,
  useKhotpMasterSanPhamControllerFind,
  useKhotpMasterSanPhamControllerImport,
  useKhotpMasterSanPhamControllerUpdateById,
} from 'main/apis/drc/endpoints/khotp-master-san-pham-controller/khotp-master-san-pham-controller';
import { KhotpMasterSanPhamWithRelations } from 'main/apis/drc/models';
import { TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Select2Box } from 'main/components/molecules/selectbox';
import DeleteModal from 'main/components/organisms/modal/delete-modal';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ToastMessage } from 'main/constants';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import useProductGroupOptions from 'main/hooks/useProductGroupOptions';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import AddEditItemModal from './product-stocks-add-edit';
import UploadProductExcelModal from './upload-product-excel-modal';

const ProductStocksExportList: React.FC = () => {
  const permissionAction = usePermissionAction();
  const [modal, setModal] = useState(false);
  const [addEditModal, setAddEditModal] = useState(false);
  const [searchNameProduct, setSearchProduct] = useState('');
  const [searchNameHints, setSearchHints] = useState('');
  const [searchNameGroupProduct, setSearchNameGroupProduct] = useState('');
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState<KhotpMasterSanPhamWithRelations[]>([]);
  const [currentItem, setCurrentItem] = useState<KhotpMasterSanPhamWithRelations | null>(null);
  const [dataNhomSP, setDataNhomSP] = useState<{ maNhom: string; tenNhom: string }[]>([]);
  const { productGroupOptions } = useProductGroupOptions(true);
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);

  const deleteMutation = useKhotpMasterSanPhamControllerDeleteById();
  const createMutation = useKhotpMasterSanPhamControllerCreate();
  const updateMutation = useKhotpMasterSanPhamControllerUpdateById();

  const defaultFilter = {
    where: {} as any,
    limit: sizePerPage,
    skip: (page - 1) * sizePerPage,
  };

  const [filter, setFilter] = useState(defaultFilter);

  const { data, refetch } = useKhotpMasterSanPhamControllerFind(
    {
      filter: filter,
    },
    {
      query: {
        staleTime: 0,
      },
    },
  );

  const { data: allData } = useKhotpMasterSanPhamControllerFind(
    {
      filter: {
        fields: {
          maNhom: true,
        },
      },
    },
    {
      query: {
        staleTime: 0,
      },
    },
  );

  const { data: countItems, refetch: refetchCount } = useKhotpMasterSanPhamControllerCount({
    where: filter.where,
  });

  const { mutateAsync: importedProductMutateAsync, isPending: importedProductIsPending } =
    useKhotpMasterSanPhamControllerImport();

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  useEffect(() => {
    if (allData) {
      const uniqueNhomMap: { [key: string]: { maNhom: string; tenNhom: string } } = {};

      allData.forEach((item) => {
        if (item.nhomsp) {
          const key = `${item.nhomsp.maNhom}-${item.nhomsp.tenNhom}`;
          if (!uniqueNhomMap[key]) {
            uniqueNhomMap[key] = {
              maNhom: item.nhomsp.maNhom || '',
              tenNhom: item.nhomsp.tenNhom || '',
            };
          }
        }
      });

      setDataNhomSP(Object.values(uniqueNhomMap));
    }
  }, [allData]);

  useEffect(() => {
    if (countItems && countItems.count !== undefined) {
      setTotalItems(countItems.count);
    }
  }, [countItems]);

  const handleDelete = async () => {
    if (currentItem) {
      const encodedId = encodeURIComponent(String(currentItem.maSanPham));
      deleteMutation.mutate(
        { id: encodedId },
        {
          onSuccess: () => {
            setSearchProduct('');
            setFilter(defaultFilter);
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

  const toggleModal = () => setModal(!modal);

  const toggleUploadModal = useCallback(() => setOpenUploadModal((isOpenUploadModal) => !isOpenUploadModal), []);

  const toggleAddEditModal = () => {
    setCurrentItem(null);
    setAddEditModal(!addEditModal);
  };

  const updateItem = async (id: string, updatedItem: Partial<KhotpMasterSanPhamWithRelations>) => {
    const encodedId = encodeURIComponent(String(id));
    updateMutation.mutate(
      { id: encodedId, data: updatedItem },
      {
        onSuccess: () => {
          setItems(items.map((item) => (item.maSanPham === id ? { ...item, ...updatedItem } : item)));
          refetch();
        },
        onError: (error) => {
          toast.error((error as any)?.response?.data?.error?.message || error.message);
        },
      },
    );
  };

  const handleAddNewItem = async (item: {
    ghiChu: string;
    maNhom: string;
    maSanPham: string;
    tenGoiNho: string;
    tenSanPham: string;
    thoiHanLuuKho: number;
    luuKho: number;
    dvt: string;
  }) => {
    createMutation.mutate(
      { data: item },
      {
        onSuccess: (newItem) => {
          setSearchProduct('');
          setFilter(defaultFilter);
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

  const handleSearch = () => {
    const newWhere: any = {};
    if (searchNameHints) {
      newWhere.tenGoiNho = { like: `%${searchNameHints}%` };
    }
    if (searchNameProduct) {
      newWhere.tenSanPham = { like: `%${searchNameProduct}%` };
    }
    if (searchNameGroupProduct !== '-1') {
      newWhere.maNhom = searchNameGroupProduct;
    }

    setFilter((prevFilter) => ({
      ...prevFilter,
      where: {
        maNhom: searchNameGroupProduct ? newWhere.maNhom : undefined,
        tenSanPham: searchNameProduct ? newWhere.tenSanPham : undefined,
        tenGoiNho: searchNameHints ? newWhere.tenGoiNho : undefined,
      },
      skip: 0,
    }));
    setPage(1);
    refetch();
    refetchCount();
  };

  const handleTableChange = (type: any, { page, sizePerPage }: any) => {
    setPage(page);
    setSizePerPage(sizePerPage);
    setFilter((prevFilter) => ({
      ...prevFilter,
      limit: sizePerPage,
      skip: (page - 1) * sizePerPage,
    }));
    refetch();
    refetchCount();
  };

  const handleShowEditModal = (item: KhotpMasterSanPhamWithRelations) => {
    setCurrentItem(item);
    setAddEditModal(true);
  };

  const handleShowDeleteModal = (item: KhotpMasterSanPhamWithRelations) => {
    setCurrentItem(item);
    toggleModal();
  };

  const handleAddNewModal = () => {
    setCurrentItem(null);
    setAddEditModal(true);
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

  const handleUploadModalConfirmClickCallback = useCallback(
    (productList: KhotpMasterSanPhamWithRelations[]) => {
      // Close modal
      toggleUploadModal();

      // Import new product
      importedProductMutateAsync({
        data: productList,
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
    [importedProductMutateAsync, refetch, refetchCount, toggleUploadModal],
  );

  const fieldArray = [
    {
      dataField: 'maNhom',
      text: 'Mã nhóm',
      sort: false,
      style: { width: '15%' },
    },
    {
      dataField: 'maSanPham',
      text: 'Mã sản phẩm',
      sort: false,
      style: { width: '20%' },
    },
    {
      dataField: 'tenSanPham',
      text: 'Tên sản phẩm',
      sort: false,
      style: { width: '15%' },
    },
    {
      dataField: 'tenGoiNho',
      text: 'Tên gợi nhớ',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'dvt',
      text: 'Đơn vị tính',
      sort: false,
      style: { width: '10%' },
    },
    {
      dataField: 'thoiHanLuuKho',
      text: 'Thời hạn lưu kho (Tháng)',
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
      formatter: (cell: any, row: KhotpMasterSanPhamWithRelations) => (
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
      pageCategory={Page.PRODUCTS_STOCKS_LIST.CATEGORY}
      pageTitle={Page.PRODUCTS_STOCKS_LIST.TITLE}
      pageName={Page.PRODUCTS_STOCKS_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="itemSelect">Nhóm sản phẩm</Label>
                  <Select2Box
                    id="itemSelect"
                    value={searchNameGroupProduct}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSearchNameGroupProduct(e.target.value)}
                    options={{ placeholder: 'Tất cả' }}
                    data={productGroupOptions}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="tenSanphamSearch">Tên sản phẩm</Label>
                  <Input
                    type="text"
                    id="tenSanphamSearch"
                    value={searchNameProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="tenGoiNhoSearch">Tên gợi Nhớ</Label>
                  <Input
                    type="text"
                    id="tenGoiNhoSearch"
                    value={searchNameHints}
                    onChange={(e) => setSearchHints(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-end">
              <Col md={2} className="d-flex justify-content-end">
                <Button color="primary" onClick={handleSearch}>
                  Tìm
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ToolkitProvider data={items} keyField="maSanPham" columns={fieldArray} search>
              {(props: any) => (
                <>
                  <div className="d-flex justify-content-end mb-4 pb-1">
                    <EditPermissionAction>
                      <Button color="primary" onClick={toggleUploadModal}>
                        Import sản phẩm
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
                messageItem={currentItem.tenSanPham || ''}
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
              dataNhomSP={dataNhomSP} // Pass the correctly formatted data here
            />
            <UploadProductExcelModal
              isOpen={isOpenUploadModal}
              toggle={toggleUploadModal}
              handleConfirmClickCallback={handleUploadModalConfirmClickCallback}
            />
            {importedProductIsPending && <TransparentSpinner />}
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
};

export default ProductStocksExportList;
