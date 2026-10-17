import saveAs from 'file-saver';
import { KhovtXuatNhapTonControllerFind200, KhovtXuatNhapTonControllerFind200DataItem } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectInventoryFilter,
  selectInventoryTableExcludeSelectedRows,
  updateInventoryTable,
} from 'main/redux/modules/supplies-store-inventory/supplies-store-inventory-list-slice';
import { exportCurrentDataOfKhoVatTuToExcel } from 'main/utils/excel-writer/supplies-store-excel-writer/suppiles-store-export-current-data-excel-writer';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import ExportSuppliesISOReportModal from './export-supplies-iso-report-modal';
import tableConfig from './table-config';

type Props = {
  data?: KhovtXuatNhapTonControllerFind200;
  dataIsLoading: boolean;
};

function SuppliesStoreInventoryTable({
  data: { data, count: dataCount } = { data: [], count: 0 },
  dataIsLoading,
}: Props) {
  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage } = useAppSelector(selectInventoryTableExcludeSelectedRows);
  const filter = useAppSelector(selectInventoryFilter);

  // React State
  const [isOpenExportModal, setOpenExportModal] = useState(false);

  // React Function
  const toggleExportModal = useCallback(() => setOpenExportModal((isOpenExportModal) => !isOpenExportModal), []);

  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<KhovtXuatNhapTonControllerFind200DataItem>) => {
      const { page, sizePerPage } = newState;

      dispatch(
        updateInventoryTable({
          page,
          sizePerPage,
        }),
      );
    },
    [dispatch],
  );

  const handleExportCurrentData = useCallback(async () => {
    try {
      const excelBuffer = await exportCurrentDataOfKhoVatTuToExcel(data, tableConfig.columns);
      if (excelBuffer) {
        const ngayBatDau = filter.startDate?.format(DateFormat.DATE_VN_NOSPACE) ?? 'Truoc';
        const ngayKetThuc = filter.endDate ? '-' + filter.endDate?.format(DateFormat.DATE_VN_NOSPACE) : '-Nay';
        const khoNhap = filter.suppliesStore && filter.suppliesStore !== '-1' ? '_KhoNhap' + filter.suppliesStore : '';
        const nhomVatTu = filter.suppliesGroup && filter.suppliesGroup !== '-1' ? '_nhomVT' + filter.suppliesGroup : '';
        const fileName = `Du lieu ton kho vat tu - ${ngayBatDau}${ngayKetThuc}${khoNhap}${nhomVatTu}.xlsx`;
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message || e.message);
    }
  }, [data, filter.endDate, filter.startDate, filter.suppliesGroup, filter.suppliesStore]);

  return (
    <ToolkitProvider
      data={data}
      keyField={`${FieldName.MA_NHOM}_${FieldName.MA_VT}_${FieldName.MA_KHO}`}
      columns={tableConfig.columns}>
      {(props: any) => (
        <>
          <div className="d-flex justify-content-end mb-4 pb-1">
            <Button color="primary" onClick={handleExportCurrentData}>
              Xuất dữ liệu đang hiển thị
            </Button>
            <Button color="primary" onClick={toggleExportModal}>
              Xuất file báo cáo
            </Button>
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
              onTableChange={handleTableChange}
              noDataIndication={() => (
                <div className="text-center">
                  {dataIsLoading ? <BasicSpinner /> : 'Không có kết quả nào được tìm thấy'}
                </div>
              )}
            />
          </div>
          <ExportSuppliesISOReportModal isOpen={isOpenExportModal} toggle={toggleExportModal} />
        </>
      )}
    </ToolkitProvider>
  );
}

export default SuppliesStoreInventoryTable;
