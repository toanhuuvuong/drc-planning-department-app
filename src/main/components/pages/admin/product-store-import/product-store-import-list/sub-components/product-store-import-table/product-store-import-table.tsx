import { useKhotpTransPhieuNhapControllerDeleteById } from 'main/apis/drc/endpoints/khotp-trans-phieu-nhap-controller/khotp-trans-phieu-nhap-controller';
import {
  KhotpTransPhieuNhapControllerFindDetail200,
  KhotpTransPhieuNhapControllerFindDetail200DataItem,
} from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Page, ToastMessage } from 'main/constants';
import { FieldName, ProductImportType } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectProductImportTable,
  updateProductImportTable,
} from 'main/redux/modules/product-store-import/product-store-import-list-slice';
import { generateColumnStyle } from 'main/utils';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import CancelImportBillModal from './cancel-import-bill-modal';
import tableConfig from './table-config';

type Props = {
  data?: KhotpTransPhieuNhapControllerFindDetail200;
  dataIsLoading: boolean;
  handleRefreshTable: () => void;
};

function ProductStoreImportTable({
  data: { data, count: dataCount } = { data: [], count: 0 },
  dataIsLoading,
  handleRefreshTable,
}: Props) {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage, sortField, sortOrder } = useAppSelector(selectProductImportTable);

  // React State/Ref
  const [isOpenCancelModal, setOpenCancelModal] = useState(false);
  //const [isOpenLiquidationTransferModal, setOpenLiquidationTransferModal] = useState(false);
  //const [isOpenRequestRecheckModal, setOpenRequestRecheckModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<KhotpTransPhieuNhapControllerFindDetail200DataItem>();

  // React Query
  const { mutateAsync: deletedProductImportBillMutateAsync } = useKhotpTransPhieuNhapControllerDeleteById();

  //const { mutateAsync: updatedProductImportBillMutateAsync } = useKhotpTransPhieuNhapControllerUpdateById();

  // React Function
  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<KhotpTransPhieuNhapControllerFindDetail200DataItem>) => {
      const { page, sizePerPage, sortField, sortOrder } = newState;

      dispatch(
        updateProductImportTable({
          page,
          sizePerPage,
          sortField,
          sortOrder,
        }),
      );
    },
    [dispatch],
  );

  const toggleCancelModal = useCallback(() => setOpenCancelModal((isOpenCancelModal) => !isOpenCancelModal), []);

  /*
  const toggleLiquidationTransferModal = useCallback(
    () => setOpenLiquidationTransferModal((isOpenLiquidationTransferModal) => !isOpenLiquidationTransferModal),
    [],
  );

  const toggleRequestRecheckModal = useCallback(
    () => setOpenRequestRecheckModal((isOpenRequestRecheckModal) => !isOpenRequestRecheckModal),
    [],
  );
  */

  const handleCancelActionClick = useCallback(
    (row: KhotpTransPhieuNhapControllerFindDetail200DataItem) => {
      setSelectedRow(row);
      toggleCancelModal();
    },
    [toggleCancelModal],
  );

  /*
  const handleRequestRecheckActionClick = useCallback(
    (row: KhotpTransPhieuNhapControllerFindDetail200DataItem) => {
      setSelectedRow(row);
      toggleRequestRecheckModal();
    },
    [toggleRequestRecheckModal],
  );

  const handleLiquidationTransferActionClick = useCallback(
    (row: KhotpTransPhieuNhapControllerFindDetail200DataItem) => {
      setSelectedRow(row);
      toggleLiquidationTransferModal();
    },
    [toggleLiquidationTransferModal],
  );
  */

  const handleCancelModalConfirmClick = useCallback(() => {
    // Close modal
    toggleCancelModal();

    // Delete product import bill
    deletedProductImportBillMutateAsync({ id: Number(selectedRow?.masterId) })
      .then((_) => {
        // Refresh table data
        handleRefreshTable();
        toast.success(ToastMessage.CANCEL_SUCCESS);
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [deletedProductImportBillMutateAsync, handleRefreshTable, selectedRow?.masterId, toggleCancelModal]);

  /*
  const handleLiquidationTransferModalConfirmClick = useCallback(() => {
    // Close modal
    toggleLiquidationTransferModal();

    // Update product import bill
    updatedProductImportBillMutateAsync({
      id: Number(selectedRow?.masterId),
      data: {
        details: [
          {
            maSanPham: selectedRow?.maSanPham,
            // status: ProductImportStatus['in-selloff'].id,
          },
        ],
      },
    })
      .then((_) => {
        // Refresh table data
        handleRefreshTable();
        toast.success(ToastMessage.LIQUIDATION_TRANSFER_SUCCESS);
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [
    toggleLiquidationTransferModal,
    updatedProductImportBillMutateAsync,
    selectedRow?.masterId,
    selectedRow?.maSanPham,
    handleRefreshTable,
  ]);

  const handleRequestRecheckModalConfirmClick = useCallback(() => {
    // Close modal
    toggleRequestRecheckModal();

    // Update product import bill
    updatedProductImportBillMutateAsync({
      id: Number(selectedRow?.masterId),
      data: {
        details: [
          {
            maSanPham: selectedRow?.maSanPham,
            // status: ProductImportStatus['in-wait'].id,
          },
        ],
      },
    })
      .then((_) => {
        // Refresh table data
        handleRefreshTable();
        toast.success(ToastMessage.REQUEST_RECHECK_SUCCESS);
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [
    toggleRequestRecheckModal,
    updatedProductImportBillMutateAsync,
    selectedRow?.masterId,
    selectedRow?.maSanPham,
    handleRefreshTable,
  ]);
  */

  return (
    <ToolkitProvider
      data={data || []}
      keyField={`${FieldName.ID}_${FieldName.MA_SAN_PHAM}`}
      columns={[
        ...tableConfig.columns,
        {
          dataField: FieldName.ACTION,
          isDummyField: true,
          text: 'Thao tác',
          ...generateColumnStyle(),
          formatter: (_: any, row: KhotpTransPhieuNhapControllerFindDetail200DataItem) => {
            return (
              <div className="d-flex">
                <Link className="px-2" to={Page.PRODUCT_STORE_IMPORT_DETAIL.PATH.replace(':id', String(row.masterId))}>
                  <i className="fa-solid fa-eye" title="Xem" />
                </Link>
                {
                  //productImportBillStatus !== ProductImportStatus.out.id && (
                  row.loaiPhieu !== ProductImportType.INTERNAL && (
                    <EditPermissionAction>
                      <Link
                        className="px-2"
                        to={Page.PRODUCT_STORE_IMPORT_EDIT.PATH.replace(':id', String(row.masterId))}>
                        <i className="fa-solid fa-pen-to-square" title="Sửa" />
                      </Link>
                    </EditPermissionAction>
                  )
                  //)
                }
                {
                  //productImportBillStatus !== ProductImportStatus.out.id && (
                  <EditPermissionAction>
                    <Link
                      className="px-2"
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCancelActionClick(row);
                      }}>
                      <i className="fa-solid fa-trash" title="Hủy" />
                    </Link>
                  </EditPermissionAction>
                  //)
                }
                {/*
                  //(productImportBillStatus !== ProductImportStatus.out.id &&
                  //productImportBillStatus !== ProductImportStatus['in-wait'].id) && (
                  <Link
                    className="px-2"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRequestRecheckActionClick(row);
                    }}>
                    <i className="fa-solid fa-check-double" title="Yêu cầu kiểm tra lại" />
                  </Link>
                  //)
                }
                {
                  //(productImportBillStatus === ProductImportStatus.in.id ||
                  //productImportBillStatus === ProductImportStatus['in-lated'].id) && (
                  <Link
                    className="px-2"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLiquidationTransferActionClick(row);
                    }}>
                    <i className="fa fa-exchange" title="Chuyển thanh lý" />
                  </Link>
                  //)
                */}
              </div>
            );
          },
        },
      ]}>
      {(props: any) => (
        <>
          <div className="d-flex justify-content-end mb-4 pb-1">
            <EditPermissionAction>
              <Button color="primary" onClick={() => navigate(Page.PRODUCT_STORE_IMPORT_ADD.PATH)}>
                Thêm mới
              </Button>
            </EditPermissionAction>
          </div>
          <div className="table-responsive">
            <BootstrapTable
              {...props.baseProps}
              remote
              bootstrap4
              bordered={false}
              pagination={paginationFactory({
                ...tableConfig.pagination,
                page: page,
                sizePerPage: sizePerPage,
                totalSize: dataCount,
              })}
              sort={
                sortField
                  ? {
                      dataField: sortField,
                      order: sortOrder,
                    }
                  : {}
              }
              onTableChange={handleTableChange}
              noDataIndication={() => (
                <div className="text-center">
                  {dataIsLoading ? <BasicSpinner /> : 'Không có kết quả nào được tìm thấy'}
                </div>
              )}
            />
          </div>
          <CancelImportBillModal
            productImportBill={selectedRow}
            isOpen={isOpenCancelModal}
            toggle={toggleCancelModal}
            handleConfirmClick={handleCancelModalConfirmClick}
          />
          {/*
          <LiquidationTransferImportBillModal
            productImportBill={selectedRow}
            isOpen={isOpenLiquidationTransferModal}
            toggle={toggleLiquidationTransferModal}
            handleConfirmClick={handleLiquidationTransferModalConfirmClick}
          />
          <RequestRecheckImportBillModal
            productImportBill={selectedRow}
            isOpen={isOpenRequestRecheckModal}
            toggle={toggleRequestRecheckModal}
            handleConfirmClick={handleRequestRecheckModalConfirmClick}
          />
          */}
        </>
      )}
    </ToolkitProvider>
  );
}

export default ProductStoreImportTable;
