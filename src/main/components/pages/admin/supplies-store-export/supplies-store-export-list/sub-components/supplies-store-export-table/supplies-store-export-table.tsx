import saveAs from 'file-saver';
import {
  KhovtTransPhieuXuatControllerFindDetail200,
  KhovtTransPhieuXuatControllerFindDetail200DataItem,
} from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
// import { DateFormat, Page } from 'main/constants';
import { DateFormat, Page } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import ExportStatus from 'main/constants/enums/export-status';
import { useTableDataWithUniqueKey } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectExportFilter,
  selectExportTableExcludeSelectedRows,
  updateExportTable,
} from 'main/redux/modules/supplies-store-export/supplies-store-export-list-slice';
import { generateColumnStyle } from 'main/utils';
// import moment from 'moment';
// import { useCallback, useState } from 'react';
import { exportCurrentDataOfKhoVatTuToExcel } from 'main/utils/excel-writer/supplies-store-excel-writer/suppiles-store-export-current-data-excel-writer';
import { useCallback } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
// import ReturnGoodsModal, { ReturnGoodsType } from './return-goods-modal/return-goods-modal';
import tableConfig from './table-config';

type Props = {
  data?: KhovtTransPhieuXuatControllerFindDetail200;
  dataIsLoading: boolean;
  handleRefreshTable: () => void;
};

function SuppliesStoreExportTable({
  data: { data, count: dataCount } = { data: [], count: 0 },
  dataIsLoading,
  handleRefreshTable,
}: Props) {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage, sortField, sortOrder } = useAppSelector(selectExportTableExcludeSelectedRows);
  const filter = useAppSelector(selectExportFilter);

  // React State
  const dataWithUniqueKey = useTableDataWithUniqueKey(data, FieldName.ID, FieldName.MA_VT);
  // const [isOpenReturnGoodsModal, setOpenReturnGoodsModal] = useState(false);
  // const [selectedRow, setSelectedRow] = useState<ReturnGoodsType>();

  // React Query
  // const { mutateAsync: returnGoodsMutateAsync } = useKhovtTransPhieuXuatControllerTraHang();

  /*const { refetch: suppliesExportReportRefetch } = useKhovtTransPhieuXuatControllerFindDetail(
    getSuppliesExportReportParams(filter),
    { query: { enabled: false } },
  );*/

  // React Function
  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<KhovtTransPhieuXuatControllerFindDetail200DataItem>) => {
      const { page, sizePerPage, sortField, sortOrder } = newState;

      dispatch(
        updateExportTable({
          page,
          sizePerPage,
          sortField,
          sortOrder,
        }),
      );
    },
    [dispatch],
  );

  // const toggleReturnGoodsModal = useCallback(
  //   () => setOpenReturnGoodsModal((isOpenReturnGoodsModal) => !isOpenReturnGoodsModal),
  //   [],
  // );

  // const handleReturnGoodsActionClick = useCallback(
  //   (row: KhovtTransPhieuXuatControllerFindDetail200DataItem) => {
  //     setSelectedRow({ ...row });
  //     toggleReturnGoodsModal();
  //   },
  //   [toggleReturnGoodsModal],
  // );

  // const handleReturnGoodsModalConfirmClick = useCallback(
  //   (returnGoods?: ReturnGoodsType) => {
  //     // Close modal
  //     toggleReturnGoodsModal();

  //     if (!returnGoods || !returnGoods.soLuongTraHang || returnGoods.soLuongTraHang <= 0) {
  //       return;
  //     }

  //     // Delete supplies import bill
  //     returnGoodsMutateAsync({
  //       data: {
  //         MaVt: String(selectedRow?.maVt),
  //         PhieuXuat_id: Number(selectedRow?.phieuXuatId),
  //         SoLuongTraHang: Number(returnGoods.soLuongTraHang),
  //         NgayTraHang: moment().format(DateFormat.DATE_ONLY),
  //         LyDoTraHang: String(returnGoods.lyDoTraHang),
  //         NguoiNhanHang: String(returnGoods.nguoiNhanHang),
  //       },
  //     })
  //       .then((_) => {
  //         // Refresh table data
  //         handleRefreshTable();

  //         toast.success('Trả hàng thành công!');
  //       })
  //       .catch((e) => {
  //         toast.error(e?.response?.data?.error?.message || e.message);
  //       });
  //   },
  //   [handleRefreshTable, returnGoodsMutateAsync, selectedRow?.maVt, selectedRow?.phieuXuatId, toggleReturnGoodsModal],
  // );

  const handleExportCurrentData = useCallback(async () => {
    try {
      const dataForExport = data?.map((row) => {
        return {
          ...row,
          status: ExportStatus[row.status as keyof typeof ExportStatus]?.text,
        };
      });
      const excelBuffer = await exportCurrentDataOfKhoVatTuToExcel(dataForExport, tableConfig.columns);
      if (excelBuffer) {
        const ngayBatDau = filter.startDate?.format(DateFormat.DATE_VN_NOSPACE) ?? 'Truoc';
        const ngayKetThuc = filter.endDate ? '-' + filter.endDate?.format(DateFormat.DATE_VN_NOSPACE) : '-Nay';
        const khoXuat = filter.exportStore && filter.exportStore !== '-1' ? '_KhoXuat' + filter.exportStore : '';
        const khoNhap = filter.importStore && filter.importStore !== '-1' ? '_KhoNhap' + filter.importStore : '';
        const fileName = `Du lieu xuat kho vat tu_${ngayBatDau}${ngayKetThuc}${khoXuat}${khoNhap}.xlsx`;
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message || e.message);
    }
  }, [data, filter.endDate, filter.exportStore, filter.importStore, filter.startDate]);

  /*const handleExportClick = useCallback(async () => {
    try {
      const exportData = await suppliesExportReportRefetch();
      // Create report file
      const excelBuffer = await new SuppliesStoreExportExcelWriter().writeData(
        `${process.env.PUBLIC_URL}/assets/templates/supplies-export-report-template.xlsx`,
        {
          filter: filter,
          content: {
            exportItems: exportData.data?.data || [],
          },
        },
      );
      // Auto download
      if (excelBuffer) {
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'Báo-cáo-Xuất-Vật-Tư.xlsx');
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message || e.message);
    }
  }, [filter, suppliesExportReportRefetch]);*/

  return (
    <ToolkitProvider
      data={dataWithUniqueKey}
      keyField={FieldName.UNIQUE_KEY}
      columns={[
        ...tableConfig.columns,
        {
          dataField: FieldName.ACTION,
          isDummyField: true,
          text: 'Thao tác',
          csvExport: false,
          ...generateColumnStyle(),
          formatter: (_: any, row: KhovtTransPhieuXuatControllerFindDetail200DataItem) => {
            return (
              <div className="d-flex">
                <Link className="px-2" to={Page.SUPPLIES_STORE_EXPORT_DETAIL.PATH.replace(':id', String(row.id))}>
                  <i className="fa-solid fa-eye" title="Xem" />
                </Link>
                {/* KAN-320 */}
                {/* <EditPermissionAction>
                  <Link
                    className="px-2"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleReturnGoodsActionClick(row);
                    }}>
                    <i className="fa fa-exchange" title="Trả hàng" />
                  </Link>
                </EditPermissionAction> */}
                {/* KAN-320 */}
              </div>
            );
          },
        },
      ]}
      exportCSV={tableConfig.exportCSV}>
      {(props: any) => (
        <>
          <div className="d-flex justify-content-end mb-4 pb-1">
            <Button color="primary" onClick={handleExportCurrentData}>
              Xuất dữ liệu đang hiển thị
            </Button>
            {/*
            <Button color="primary" onClick={handleExportClick}>
              Xuất file báo cáo
            </Button>
            */}
            <EditPermissionAction>
              <Button color="primary" onClick={() => navigate(Page.SUPPLIES_STORE_EXPORT_ADD.PATH)}>
                Tạo phiếu xuất
              </Button>
            </EditPermissionAction>
            {/*
            <ExportCSVButton color="primary" {...props.csvProps}>
              Tải phiếu xuất
            </ExportCSVButton>
            */}
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
          {/* <ReturnGoodsModal
            data={selectedRow}
            isOpen={isOpenReturnGoodsModal}
            toggle={toggleReturnGoodsModal}
            handleConfirmClick={handleReturnGoodsModalConfirmClick}
          /> */}
        </>
      )}
    </ToolkitProvider>
  );
}

/*const getSuppliesExportReportParams = (filter: ExportFilter): KhovtTransPhieuXuatControllerFindDetailParams => {
  const where = getSuppliesExportReportCountParams(filter).where;

  return {
    filter: {
      where,
    },
  };
};

const getSuppliesExportReportCountParams = (filter: ExportFilter) => {
  const { startDate, endDate, exportStore, importStore } = filter;

  return {
    where: {
      khoNhap: importStore && importStore !== '-1' ? importStore : undefined,
      khoXuat: exportStore && exportStore !== '-1' ? exportStore : undefined,
      ngayXuat:
        startDate && endDate
          ? { gte: DateUtil.toISOString(startDate.startOf('day')), lte: DateUtil.toISOString(endDate.endOf('day')) }
          : undefined,
    },
  };
};*/

export default SuppliesStoreExportTable;
