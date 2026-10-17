import {
  useKhotpMasterNhomBtpControllerCount,
  useKhotpMasterNhomBtpControllerCreate,
  useKhotpMasterNhomBtpControllerDeleteById,
  useKhotpMasterNhomBtpControllerFind,
  useKhotpMasterNhomBtpControllerUpdateById,
} from 'main/apis/drc/endpoints/khotp-master-nhom-btp-controller/khotp-master-nhom-btp-controller';
import { KhotpMasterNhomspWithRelations } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import DeleteModal from 'main/components/organisms/modal/delete-modal';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import ProductSalesGroupAddEdit from './product-semi-finished-group-add-edit';

const ProductSemiFinishedGroupList: React.FC = () => {
  const [modal, setModal] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [addEditModal, setAddEditModal] = useState(false);
  const [items, setItems] = useState<KhotpMasterNhomspWithRelations[]>([]);
  const [currentItem, setCurrentItem] = useState<KhotpMasterNhomspWithRelations | null>(null);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [page, setPage] = useState(1);

  const actionPermission = usePermissionAction();
  const deleteMutation = useKhotpMasterNhomBtpControllerDeleteById();
  const createMutation = useKhotpMasterNhomBtpControllerCreate();
  const updateMutation = useKhotpMasterNhomBtpControllerUpdateById();

  const [filter, setFilter] = useState({
    where: {} as any,
    // fields: {
    //   tenNhom: true,
    // },
    limit: sizePerPage,
    skip: (page - 1) * sizePerPage,
  });

  const { data: countItems, refetch: refetchCount } = useKhotpMasterNhomBtpControllerCount({
    where: filter.where,
  });

  const { data, refetch } = useKhotpMasterNhomBtpControllerFind(
    {
      filter: filter,
    },
    {
      query: {
        staleTime: 0,
      },
    },
  );

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

  const handleSearch = () => {
    const newWhere: any = {};
    if (searchCustomerName) {
      newWhere.tenNhom = { like: `%${searchCustomerName}%` };
    }
    setFilter((prevFilter) => ({
      ...prevFilter,
      where: newWhere,
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

  const updateItem = async (id: string, updatedItem: Partial<KhotpMasterNhomspWithRelations>) => {
    updateMutation.mutate(
      { id: String(id), data: updatedItem },
      {
        onSuccess: () => {
          setItems(items.map((item) => (item.maNhom === id ? { ...item, ...updatedItem } : item)));
          refetch();
        },
      },
    );
  };

  const toggleModal = () => setModal(!modal);

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

  const handleShowEditModal = (item: KhotpMasterNhomspWithRelations) => {
    setCurrentItem(item);
    setAddEditModal(true);
  };
  const handleShowDeleteModal = (item: KhotpMasterNhomspWithRelations) => {
    setCurrentItem(item);
    toggleModal();
  };
  const handleDelete = async () => {
    if (currentItem) {
      deleteMutation.mutate(
        { id: String(currentItem.maNhom) },
        {
          onSuccess: () => {
            setSearchCustomerName('');
            setFilter(filter);
            setPage(1);
            refetch();
            refetchCount();
            toggleModal();
          },
        },
      );
    }
  };

  const toggleAddEditModal = () => {
    setCurrentItem(null);
    setAddEditModal(!addEditModal);
  };

  const handleAddNewItem = async (item: { ghiChu: string; maNhom: string; tenNhom: string }) => {
    createMutation.mutate(
      { data: item },
      {
        onSuccess: (newItem) => {
          setSearchCustomerName('');
          setFilter(filter);
          setPage(1);
          refetch();
          refetchCount();
          toggleAddEditModal();
        },
      },
    );
  };

  const fieldArray = [
    {
      dataField: 'maNhom',
      text: 'Mã nhóm BTP',
      sort: false,
      style: { width: '20%' },
    },
    {
      dataField: 'tenNhom',
      text: 'Tên nhóm BTP',
      sort: false,
      style: { width: '35%' },
    },
    {
      dataField: 'ghiChu',
      text: 'Ghi chú',
      sort: false,
      style: { width: '35%' },
    },
    {
      dataField: 'thaoTac',
      text: 'Thao Tác',
      editable: false,
      style: { width: '10%' },
      hidden: !actionPermission,
      formatter: (cell: any, row: KhotpMasterNhomspWithRelations) => (
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
      pageCategory={Page.PRODUCTS_SALES_GROUP_LIST.CATEGORY}
      pageTitle={Page.PRODUCTS_SALES_GROUP_LIST.TITLE}
      pageName={Page.PRODUCTS_SALES_GROUP_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label for="tenKhachHangSearch">Tên Nhóm BTP</Label>
                  <Input
                    type="text"
                    id="tenKhachHangSearch"
                    value={searchCustomerName}
                    onChange={(e) => setSearchCustomerName(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-end">
              <Col md={2} className="d-flex justify-content-end">
                <Button color="primary" onClick={handleSearch}>
                  Lọc dữ liệu
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ToolkitProvider data={items} keyField="maNhom" columns={fieldArray} search>
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
                messageItem={currentItem.tenNhom || ''}
                modal={modal}
                toggle={toggleModal}
                handleDelete={handleDelete}
              />
            )}
            <ProductSalesGroupAddEdit
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

export default ProductSemiFinishedGroupList;
