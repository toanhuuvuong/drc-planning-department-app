// External dependencies
import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import moment from 'moment';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button } from 'reactstrap';
import { toast } from 'react-toastify';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

// Internal modules (absolute imports)
import { useKhotpTransLenhNhapControllerCreate } from 'main/apis/drc/endpoints/khotp-trans-lenh-nhap-controller/khotp-trans-lenh-nhap-controller';
// Add import for the warning data hook
import { useKhotpXuatNhapTonControllerSearchCanhBao } from 'main/apis/drc/endpoints/khotp-xuat-nhap-ton-controller/khotp-xuat-nhap-ton-controller';
import {
  KhotpTransLenhNhapRawDetailWithRelations,
  KhotpTransLenhNhapWithRelations,
  KhotpXuatNhapTonControllerFind200,
  KhotpXuatNhapTonControllerSearchCanhBao200Item,
} from 'main/apis/drc/models';
import { BasicSpinner, TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Page } from 'main/constants';
import { FieldName, ProductExcelStatus } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectInventoryTableExcludeSelectedRows,
  updateInventoryTable,
} from 'main/redux/modules/product-store-inventory/product-store-inventory-list-slice';
import { DateUtil } from 'main/utils';

// Local imports (relative paths)
import ProductStoreInventoryExport from './product-store-inventory-export';
import tableConfig from './table-config';
import UploadProductInventoryExcelModal from './upload-product-inventory-excel-modal';

// Types
interface ProductStoreInventoryTableProps {
  data?: KhotpXuatNhapTonControllerFind200;
  dataIsLoading: boolean;
}

// Helper functions
const normalizeProductRawDetails = (productRawDetails?: KhotpTransLenhNhapRawDetailWithRelations[]) => {
  if (!productRawDetails) return productRawDetails;

  return productRawDetails.map((detail) => ({
    ...detail,
    soLuong: Number(detail.soLuong),
    ngayNhap: DateUtil.toDateISOString(detail.ngayNhap),
  }));
};

function ProductStoreInventoryTable({
  data: { data = [], count: dataCount = 0 } = { data: [], count: 0 },
  dataIsLoading,
}: ProductStoreInventoryTableProps) {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage } = useAppSelector(selectInventoryTableExcludeSelectedRows);

  // React State
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // State for export loading

  // React Query
  const { mutateAsync: createdProductStoreExcelMutateAsync, isPending: createdProductStoreExcelIsPending } =
    useKhotpTransLenhNhapControllerCreate();
  // Fetch warning data for export - disable automatic fetching
  const { refetch: refetchWarningData, isFetching: warningDataIsFetching } = useKhotpXuatNhapTonControllerSearchCanhBao(
    {
      query: {
        queryKey: ['productInventoryWarningsForExport'], // Use a distinct query key if needed
        enabled: false, // Disable automatic fetching on mount
      },
    },
  );

  // React Function
  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<KhotpXuatNhapTonControllerSearchCanhBao200Item>) => {
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

  const toggleUploadModal = useCallback(() => setOpenUploadModal((isOpenUploadModal) => !isOpenUploadModal), []);

  const handleUploadModalConfirmClickCallback = useCallback(
    (productStoreExcel: KhotpTransLenhNhapWithRelations) => {
      // Close modal
      toggleUploadModal();

      // Create new product store excel
      createdProductStoreExcelMutateAsync({
        data: {
          ...productStoreExcel,
          ngayNhap: DateUtil.toDateISOString(moment()),
          status: ProductExcelStatus.new.id,
          rawDetails: normalizeProductRawDetails(productStoreExcel.rawDetails),
        },
      })
        .then((newProductStoreExcel) => {
          navigate(Page.PRODUCT_STORE_EXCEL_EDIT.PATH.replace(':id', String(newProductStoreExcel?.id)));
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [createdProductStoreExcelMutateAsync, navigate, toggleUploadModal],
  );

  // Export button handler
  const handleExportClick = useCallback(async () => {
    setIsExporting(true);
    try {
      // Fetch data on click
      const { data: fetchedWarningData, isError, error } = await refetchWarningData();

      if (isError) {
        console.error('Failed to fetch warning data:', error);
        toast.error('Lấy dữ liệu cảnh báo thất bại. Vui lòng thử lại.');
        setIsExporting(false);
        return;
      }

      // Use fetchedWarningData for export
      if (!fetchedWarningData || fetchedWarningData.length === 0) {
        toast.warn('Không có dữ liệu cảnh báo chậm luân chuyển để xuất báo cáo.');
        setIsExporting(false);
        return;
      }

      // Pass fetchedWarningData to the export function
      await ProductStoreInventoryExport(fetchedWarningData as KhotpXuatNhapTonControllerSearchCanhBao200Item[]);
      toast.success('Xuất báo cáo thành công!');
    } catch (exportError) {
      console.error('Export failed:', exportError);
      toast.error('Xuất báo cáo thất bại. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  }, [refetchWarningData]); // Depend on refetch function

  return (
    <ToolkitProvider
      data={(data ?? []).map((item, index) => ({
        ...item,
        tableRowId: `${item[FieldName.TEN_NHOM]}_${item[FieldName.MA_SAN_PHAM]}_${item[FieldName.MA_KHO]}_${index}`,
      }))}
      keyField="tableRowId"
      columns={tableConfig.columns}>
      {(props: any) => (
        <>
          <div className="d-flex justify-content-end mb-4 pb-1 gap-2">
            {/* Update Export Button disabled state */}
            <Button color="primary" onClick={handleExportClick} disabled={isExporting}>
              {isExporting ? <BasicSpinner /> : 'Xuất báo cáo chậm luân chuyển'}
            </Button>
            <EditPermissionAction>
              <Button color="primary" onClick={toggleUploadModal}>
                Import tồn kho thành phẩm
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
              onTableChange={handleTableChange}
              noDataIndication={() => (
                <div className="text-center">
                  {dataIsLoading ? <BasicSpinner /> : 'Không có kết quả nào được tìm thấy'}
                </div>
              )}
            />
          </div>
          <UploadProductInventoryExcelModal
            isOpen={isOpenUploadModal}
            toggle={toggleUploadModal}
            handleConfirmClickCallback={handleUploadModalConfirmClickCallback}
          />
          {createdProductStoreExcelIsPending && <TransparentSpinner />}
          {/* Show spinner during export */}
          {isExporting && <TransparentSpinner />}
        </>
      )}
    </ToolkitProvider>
  );
}

export default ProductStoreInventoryTable;
