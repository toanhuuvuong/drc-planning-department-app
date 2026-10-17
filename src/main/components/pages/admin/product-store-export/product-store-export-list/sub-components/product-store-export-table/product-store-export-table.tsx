import { useKhotpTransPhieuXuatControllerUploadPdfAndCreate } from 'main/apis/drc/endpoints/khotp-trans-phieu-xuat-controller/khotp-trans-phieu-xuat-controller';
import { CheckTonKhoErrorMessage, KhotpTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import UploadProductStoreExportFileModal from 'main/components/pages/admin/product-store-export/product-store-export-add/sub-components/add-product-modal/product-store-export-table/upload-product-store-export-file-modal';
import { Page } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { TableState } from 'main/types';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import tableConfig from './table-config';

type ProductStoreExportTableProps = {
  data?: KhotpTransPhieuXuatControllerFindDetail200DataItem[];
  dataIsLoading: boolean;
  deletedLoading: boolean;
  dataCount?: number;
  tableState: TableState<KhotpTransPhieuXuatControllerFindDetail200DataItem>;
  handleTableStateChange: (
    type: TableChangeType,
    newState: TableChangeState<KhotpTransPhieuXuatControllerFindDetail200DataItem>,
  ) => void;
  toggleCancelModal: (rowId?: String) => void;
};

function ProductStoreExportTable({
  data,
  dataCount,
  dataIsLoading,
  deletedLoading,
  tableState: { page, sizePerPage, sortField, sortOrder },
  handleTableStateChange,
  toggleCancelModal,
}: ProductStoreExportTableProps) {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isOpenUploadModal, setIsOpenUploadModal] = useState(false);
  const [importPdfErrors, setImportPdfErrors] = useState<CheckTonKhoErrorMessage[] | null>(null);

  const toggleUploadModal = useCallback(() => {
    setImportPdfErrors(null);
    setIsOpenUploadModal((isOpenUploadModal) => !isOpenUploadModal);
  }, []);
  const { mutateAsync: uploadPdfImportMutateAsync, isPending: isImportPdfPending } =
    useKhotpTransPhieuXuatControllerUploadPdfAndCreate();

  const handleTableChangeWrapper = (
    type: TableChangeType,
    newState: TableChangeState<KhotpTransPhieuXuatControllerFindDetail200DataItem>,
  ) => {
    if (data) {
      setSelectedRows(getSyncSelectedRows(selectedRows, data));
    }

    handleTableStateChange(type, newState);
  };

  const handleUploadModalConfirmClickCallback = useCallback(
    (file: File) => {
      setImportPdfErrors(null);
      uploadPdfImportMutateAsync({
        data: {
          file: file,
        },
      })
        .then((res) => {
          if ('id' in res) {
            toggleUploadModal();
            toast.success('Import thành công');
            navigate(Page.PRODUCT_STORE_EXPORT_DETAIL.PATH.replace(':id', String(res?.id)));
          } else {
            toast.error('Import thất bại');
            setImportPdfErrors(res as CheckTonKhoErrorMessage[]);
          }
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [uploadPdfImportMutateAsync, toggleUploadModal, navigate],
  );

  const actionFormatter = (_: any, row: KhotpTransPhieuXuatControllerFindDetail200DataItem) => (
    <div className="d-flex">
      <div className="px-2">
        <EditPermissionAction>
          <Link to={Page.PRODUCT_STORE_EXPORT_EDIT.PATH.replace(':id', String(row.masterId))}>
            <i className="fa-solid fa-pen-to-square" title="Sửa" />
          </Link>
        </EditPermissionAction>
      </div>
      <div className="px-2">
        <Link to={Page.PRODUCT_STORE_EXPORT_DETAIL.PATH.replace(':id', String(row.masterId))}>
          <i className="fa-solid fa-eye" title="Xem" />
        </Link>
      </div>
      <div className="px-2">
        <EditPermissionAction>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              toggleCancelModal(String(row.masterId));
            }}>
            <i className="fa-solid fa-trash" title="Huỷ phiếu xuất" />
          </Link>
        </EditPermissionAction>
      </div>
    </div>
  );

  return (
    <ToolkitProvider
      data={data || []}
      keyField={FieldName.ID}
      columns={tableConfig.columns.map((col) =>
        col.dataField === 'action' ? { ...col, formatter: actionFormatter } : col,
      )}
      exportCSV={tableConfig.exportCSV}>
      {(props: any) => (
        <>
          <div className="d-flex justify-content-end mb-4 pb-1">
            <EditPermissionAction>
              <Button color="primary" onClick={toggleUploadModal}>
                Import xuất kho sản phẩm
              </Button>
              <Button color="primary" onClick={() => navigate(Page.PRODUCT_STORE_EXPORT_ADD.PATH)}>
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
                page: page || 1,
                sizePerPage: sizePerPage || 10,
                totalSize: dataCount || 0,
              })}
              sort={sortField ? { dataField: sortField, order: sortOrder } : {}}
              onTableChange={handleTableChangeWrapper}
              noDataIndication={() => (
                <div className="text-center">
                  {dataIsLoading || deletedLoading ? <BasicSpinner /> : 'Không có kết quả nào được tìm thấy'}
                </div>
              )}
            />
          </div>
          <UploadProductStoreExportFileModal
            isOpen={isOpenUploadModal}
            isApiCalling={isImportPdfPending}
            errorMessages={importPdfErrors}
            toggle={toggleUploadModal}
            handleConfirmClickCallback={handleUploadModalConfirmClickCallback}
          />
        </>
      )}
    </ToolkitProvider>
  );
}

const getSyncSelectedRows = (selectedRows: number[], data: KhotpTransPhieuXuatControllerFindDetail200DataItem[]) => {
  const newSelectedRows = [...selectedRows];
  for (const selectedRow of selectedRows) {
    const rowDataIndex = data?.findIndex((item) => item.id === selectedRow);
    if (rowDataIndex === -1) {
      const removedIndex = newSelectedRows.indexOf(selectedRow);
      newSelectedRows.splice(removedIndex, 1);
    }
  }
  return newSelectedRows;
};

export default ProductStoreExportTable;
