import saveAs from 'file-saver';
import {
  KhovtTransPhieuNhapControllerFindDetail200,
  KhovtTransPhieuNhapControllerFindDetail200DataItem,
} from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
// import { Page, ToastMessage } from 'main/constants';
// import { FieldName, ImportStatus } from 'main/constants/enums';
import { DateFormat, Page, ToastMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectImportFilter,
  selectImportTable,
  updateImportTable,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-list-slice';
import { generateColumnStyle } from 'main/utils';
import { exportCurrentDataOfKhoVatTuToExcel } from 'main/utils/excel-writer/supplies-store-excel-writer/suppiles-store-export-current-data-excel-writer';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import CancelImportBillModal from './cancel-import-bill-modal';
// import LiquidationTransferImportBillModal from './liquidation-transfer-import-bill-modal';
// import RequestRecheckImportBillModal from './request-recheck-import-bill-modal';
import tableConfig from './table-config';
import ViewPdfImportBillModal from './view-pdf-import-bill-modal';
// import ViewPdfKH22ImportBillModal from './view-pdf-kh22-import-bill-modal';
import { useKhovtTransPhieuNhapControllerDeleteById } from 'main/apis/drc/endpoints/khovt-trans-phieu-nhap-controller/khovt-trans-phieu-nhap-controller';

type Props = {
  data?: KhovtTransPhieuNhapControllerFindDetail200;
  dataIsLoading: boolean;
  handleRefreshTable: () => void;
};

function SuppliesStoreImportTable({
  data: { data, count: dataCount } = { data: [], count: 0 },
  dataIsLoading,
  handleRefreshTable,
}: Props) {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage, sortField, sortOrder } = useAppSelector(selectImportTable);
  const filter = useAppSelector(selectImportFilter);

  // React State/Ref
  const [isOpenViewPdfModal, setOpenViewPdfModal] = useState(false);
  // const [isOpenViewPdfKH22BillModal, setOpenViewPdfKH22BillModal] = useState(false);
  const [isOpenCancelModal, setOpenCancelModal] = useState(false);
  // const [isOpenLiquidationTransferModal, setOpenLiquidationTransferModal] = useState(false);
  // const [isOpenRequestRecheckModal, setOpenRequestRecheckModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<KhovtTransPhieuNhapControllerFindDetail200DataItem>();

  // React Query
  const { mutateAsync: deletedSuppliesImportBillMutateAsync, isPending: deletedOrderPendin } =
    useKhovtTransPhieuNhapControllerDeleteById();

  // const { mutateAsync: updatedSuppliesImportBillMutateAsync } = useKhovtTransPhieuNhapControllerUpdateById();

  /*const { refetch: suppliesImportReportRefetch } = useKhovtTransPhieuNhapControllerFindDetail(
    getSuppliesImportReportParams(filter),
    { query: { enabled: false } },
  );*/

  // React Function
  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<KhovtTransPhieuNhapControllerFindDetail200DataItem>) => {
      const { page, sizePerPage, sortField, sortOrder } = newState;

      dispatch(
        updateImportTable({
          page,
          sizePerPage,
          sortField,
          sortOrder,
        }),
      );
    },
    [dispatch],
  );

  const toggleViewPdfModal = useCallback(() => setOpenViewPdfModal((isOpenViewPdfModal) => !isOpenViewPdfModal), []);

  // const toggleViewPdfKH22BillModal = useCallback(
  //   () => setOpenViewPdfKH22BillModal((isOpenViewPdfKH22BillModal) => !isOpenViewPdfKH22BillModal),
  //   [],
  // );

  const toggleCancelModal = useCallback(() => setOpenCancelModal((isOpenCancelModal) => !isOpenCancelModal), []);

  // const toggleLiquidationTransferModal = useCallback(
  //   () => setOpenLiquidationTransferModal((isOpenLiquidationTransferModal) => !isOpenLiquidationTransferModal),
  //   [],
  // );

  // const toggleRequestRecheckModal = useCallback(
  //   () => setOpenRequestRecheckModal((isOpenRequestRecheckModal) => !isOpenRequestRecheckModal),
  //   [],
  // );

  // const handleViewPdfKH22BillActionClick = useCallback(
  //   (row: KhovtTransPhieuNhapControllerFindDetail200DataItem) => {
  //     setSelectedRow(row);
  //     toggleViewPdfKH22BillModal();
  //   },
  //   [toggleViewPdfKH22BillModal],
  // );

  const handleCancelActionClick = useCallback(
    (row: KhovtTransPhieuNhapControllerFindDetail200DataItem) => {
      setSelectedRow(row);
      toggleCancelModal();
    },
    [toggleCancelModal],
  );

  // const handleRequestRecheckActionClick = useCallback(
  //   (row: KhovtTransPhieuNhapControllerFindDetail200DataItem) => {
  //     setSelectedRow(row);
  //     toggleRequestRecheckModal();
  //   },
  //   [toggleRequestRecheckModal],
  // );

  // const handleLiquidationTransferActionClick = useCallback(
  //   (row: KhovtTransPhieuNhapControllerFindDetail200DataItem) => {
  //     setSelectedRow(row);
  //     toggleLiquidationTransferModal();
  //   },
  //   [toggleLiquidationTransferModal],
  // );

  const handleCancelModalConfirmClick = useCallback(() => {
    // Close modal
    toggleCancelModal();
    // Delete supplies import bill
    deletedSuppliesImportBillMutateAsync({ id: Number(selectedRow?.phieuNhapId) })
      .then((_: unknown) => {
        // Refresh table data
        handleRefreshTable();
        toast.success(ToastMessage.CANCEL_SUCCESS);
      })
      .catch((e: { response?: { data?: { error?: { message?: string } } }; message: string }) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [deletedSuppliesImportBillMutateAsync, handleRefreshTable, selectedRow?.phieuNhapId, toggleCancelModal]);

  // const handleLiquidationTransferModalConfirmClick = useCallback(() => {
  //   // Close modal
  //   toggleLiquidationTransferModal();

  //   // Update supplies import bill
  //   updatedSuppliesImportBillMutateAsync({
  //     id: Number(selectedRow?.phieuNhapId),
  //     data: {
  //       details: [
  //         {
  //           maVt: String(selectedRow?.maVt),
  //           status: ImportStatus.Disposal.id,
  //         },
  //       ],
  //     },
  //   })
  //     .then((_) => {
  //       // Refresh table data
  //       handleRefreshTable();
  //       toast.success(ToastMessage.LIQUIDATION_TRANSFER_SUCCESS);
  //     })
  //     .catch((e) => {
  //       toast.error(e?.response?.data?.error?.message || e.message);
  //     });
  // }, [
  //   toggleLiquidationTransferModal,
  //   updatedSuppliesImportBillMutateAsync,
  //   selectedRow?.phieuNhapId,
  //   selectedRow?.maVt,
  //   handleRefreshTable,
  // ]);

  // const handleRequestRecheckModalConfirmClick = useCallback(() => {
  //   // Close modal
  //   toggleRequestRecheckModal();

  //   // Update supplies import bill
  //   updatedSuppliesImportBillMutateAsync({
  //     id: Number(selectedRow?.phieuNhapId),
  //     data: {
  //       details: [
  //         {
  //           maVt: String(selectedRow?.maVt),
  //           status: ImportStatus.Wait.id,
  //         },
  //       ],
  //     },
  //   })
  //     .then((_) => {
  //       // Refresh table data
  //       handleRefreshTable();
  //       toast.success(ToastMessage.REQUEST_RECHECK_SUCCESS);
  //     })
  //     .catch((e) => {
  //       toast.error(e?.response?.data?.error?.message || e.message);
  //     });
  // }, [
  //   toggleRequestRecheckModal,
  //   updatedSuppliesImportBillMutateAsync,
  //   selectedRow?.phieuNhapId,
  //   selectedRow?.maVt,
  //   handleRefreshTable,
  // ]);

  const handleExportCurrentData = useCallback(async () => {
    try {
      const excelBuffer = await exportCurrentDataOfKhoVatTuToExcel(data, tableConfig.columns);
      if (excelBuffer) {
        const ngayBatDau = filter.startDate?.format(DateFormat.DATE_VN_NOSPACE) ?? 'Truoc';
        const ngayKetThuc = filter.endDate ? '-' + filter.endDate?.format(DateFormat.DATE_VN_NOSPACE) : '-Nay';
        const khoNhap = filter.importStore && filter.importStore !== '-1' ? '_KhoNhap' + filter.importStore : '';
        const nhaCungCap = filter.origin && filter.origin !== '-1' ? '_NCC' + filter.origin : '';
        const fileName = `Du lieu nhap kho vat tu_${ngayBatDau}${ngayKetThuc}${khoNhap}${nhaCungCap}.xlsx`;
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message || e.message);
    }
  }, [data, filter.endDate, filter.importStore, filter.origin, filter.startDate]);

  /*const handleExportClick = useCallback(async () => {
    try {
      const importData = await suppliesImportReportRefetch();
      // Create report file
      const excelBuffer = await new SuppliesStoreImportExcelWriter().writeData(
        `${process.env.PUBLIC_URL}/assets/templates/supplies-import-report-template.xlsx`,
        {
          filter: filter,
          content: {
            importItems: importData.data?.data || [],
          },
        },
      );
      // Auto download
      if (excelBuffer) {
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'Báo-cáo-Nhập-Vật-Tư.xlsx');
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message || e.message);
    }
  }, [filter, suppliesImportReportRefetch]);*/

  return (
    <ToolkitProvider
      data={data || []}
      keyField={`${FieldName.ID}_${FieldName.MA_VT}`}
      columns={[
        ...tableConfig.columns,
        {
          dataField: FieldName.ACTION,
          isDummyField: true,
          text: 'Thao tác',
          ...generateColumnStyle(),
          formatter: (_: any, row: KhovtTransPhieuNhapControllerFindDetail200DataItem) => {
            return (
              <div className="d-flex">
                <Link
                  className="px-2"
                  to={Page.SUPPLIES_STORE_IMPORT_DETAIL.PATH.replace(':id', String(row.phieuNhapId))}>
                  <i className="fa-solid fa-eye" title="Xem" />
                </Link>
                {/* KAN-320 */}
                {/* <Link
                  className="px-2"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewPdfKH22BillActionClick(row);
                  }}>
                  <i className="fas fa-file-invoice" title="Xem phiếu kết quả kiểm tra KH22" />
                </Link> */}
                <EditPermissionAction>
                  <Link
                    className="px-2"
                    to={Page.SUPPLIES_STORE_IMPORT_EDIT.PATH.replace(':id', String(row.phieuNhapId))}>
                    <i className="fa-solid fa-pen-to-square" title="Sửa" />
                  </Link>
                  <Link
                    className="px-2"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelActionClick(row);
                    }}>
                    <i className="fa-solid fa-trash" title="Xóa" />
                  </Link>
                  {/* <Link
                    className="px-2"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRequestRecheckActionClick(row);
                    }}>
                    <i className="fa-solid fa-check-double" title="Yêu cầu kiểm tra lại" />
                  </Link> */}
                  {/* <Link
                    className="px-2"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLiquidationTransferActionClick(row);
                    }}>
                    <i className="fa fa-exchange" title="Chuyển thanh lý" />
                  </Link> */}
                  {/* KAN-320 */}
                </EditPermissionAction>
              </div>
            );
          },
        },
      ]}>
      {(props: any) => (
        <>
          <div className="d-flex justify-content-end mb-4 pb-1">
            {/*
              <Button color="primary" onClick={toggleViewPdfModal}>
                Xem sổ theo dõi chứng từ nhập về
              </Button>
            */}
            <Button color="primary" onClick={handleExportCurrentData}>
              Xuất dữ liệu đang hiển thị
            </Button>
            {/*
            <Button color="primary" onClick={handleExportClick}>
              Xuất file báo cáo
            </Button>
            */}
            <EditPermissionAction>
              <Button color="primary" onClick={() => navigate(Page.SUPPLIES_STORE_IMPORT_ADD.PATH)}>
                Tạo phiếu nhập
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
          <ViewPdfImportBillModal isOpen={isOpenViewPdfModal} toggle={toggleViewPdfModal} suppliesImportBills={data} />
          <CancelImportBillModal
            suppliesImportBill={selectedRow}
            isOpen={isOpenCancelModal}
            toggle={toggleCancelModal}
            handleConfirmClick={handleCancelModalConfirmClick}
          />
          {/* <ViewPdfKH22ImportBillModal
            isOpen={isOpenViewPdfKH22BillModal}
            toggle={toggleViewPdfKH22BillModal}
            suppliesImportBill={{ ...selectedRow }}
          />
          <LiquidationTransferImportBillModal
            suppliesImportBill={selectedRow}
            isOpen={isOpenLiquidationTransferModal}
            toggle={toggleLiquidationTransferModal}
            handleConfirmClick={handleLiquidationTransferModalConfirmClick}
          />
          <RequestRecheckImportBillModal
            suppliesImportBill={selectedRow}
            isOpen={isOpenRequestRecheckModal}
            toggle={toggleRequestRecheckModal}
            handleConfirmClick={handleRequestRecheckModalConfirmClick}
          /> */}
        </>
      )}
    </ToolkitProvider>
  );
}

/*const getSuppliesImportReportParams = (filter: ImportFilter): KhovtTransPhieuNhapControllerFindDetailParams => {
  const where = getSuppliesImportReportCountParams(filter).where;

  return {
    filter: {
      where,
    },
  };
};

const getSuppliesImportReportCountParams = (filter: ImportFilter) => {
  const { startDate, endDate, importStore, searchField, searchKey } = filter;

  // Build search like for maVt
  let searchPredicate = {};
  if (searchField) {
    if (searchField !== FieldName.MA_VT) {
      searchPredicate = {
        [searchField]: { like: searchKey ? searchKey : undefined },
      };
    }
  }

  return {
    where: {
      maKho: importStore && importStore !== '-1' ? importStore : undefined,
      ngayNhap:
        startDate && endDate
          ? { gte: DateUtil.toISOString(startDate.startOf('day')), lte: DateUtil.toISOString(endDate.endOf('day')) }
          : undefined,
      ...searchPredicate,
    },
  };
};*/

export default SuppliesStoreImportTable;
