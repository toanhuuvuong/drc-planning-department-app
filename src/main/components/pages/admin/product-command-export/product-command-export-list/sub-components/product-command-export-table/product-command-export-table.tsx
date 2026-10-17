import {
  useKhotpTransLenhXuatControllerDeleteById,
  useKhotpTransLenhXuatControllerUploadPdfAndCreate,
} from 'main/apis/drc/endpoints/khotp-trans-lenh-xuat-controller/khotp-trans-lenh-xuat-controller';
import { KhotpTransLenhXuat } from 'main/apis/drc/models';
import { BasicSpinner, TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Page, ToastMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectProductCommandExportTable,
  updateProductCommandExportTable,
} from 'main/redux/modules/product-command-export/product-command-export-list-slice';
import { generateColumnStyle } from 'main/utils';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import CancelCommandExportModal from './cancel-command-export-modal';
import tableConfig from './table-config';
import UploadProductCommandFileModal from './upload-product-command-file-modal';

type Props = {
  data?: KhotpTransLenhXuat[];
  dataIsLoading: boolean;
  dataCount?: number;
  dataCountIsLoading: boolean;
  handleRefreshTable: () => void;
};

function ProductCommandExportTable({ data, dataIsLoading, dataCount, dataCountIsLoading, handleRefreshTable }: Props) {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage, sortField, sortOrder } = useAppSelector(selectProductCommandExportTable);

  // React State/Ref
  const [isOpenCancelModal, setOpenCancelModal] = useState(false);
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<KhotpTransLenhXuat>();

  // React Query
  const { mutateAsync: deletedProductCommandExportBillMutateAsync } = useKhotpTransLenhXuatControllerDeleteById();

  const {
    mutateAsync: uploadedProductCommandExportFileMutateAsync,
    isPending: uploadedProductCommandExportFileIsPending,
  } = useKhotpTransLenhXuatControllerUploadPdfAndCreate();

  // React Function
  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<KhotpTransLenhXuat>) => {
      const { page, sizePerPage, sortField, sortOrder } = newState;

      dispatch(
        updateProductCommandExportTable({
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

  const toggleUploadModal = useCallback(() => setOpenUploadModal((isOpenUploadModal) => !isOpenUploadModal), []);

  const handleCancelActionClick = useCallback(
    (row: KhotpTransLenhXuat) => {
      setSelectedRow(row);
      toggleCancelModal();
    },
    [toggleCancelModal],
  );

  const handleCancelModalConfirmClick = useCallback(() => {
    // Close modal
    toggleCancelModal();

    // Delete product command export bill
    deletedProductCommandExportBillMutateAsync({ id: Number(selectedRow?.id) })
      .then((_) => {
        // Refresh table data
        handleRefreshTable();
        toast.success(ToastMessage.CANCEL_SUCCESS);
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [deletedProductCommandExportBillMutateAsync, handleRefreshTable, selectedRow?.id, toggleCancelModal]);

  const handleUploadModalConfirmClickCallback = useCallback(
    (productCommandExportFile: File) => {
      // Close modal
      toggleUploadModal();

      // Create new product command export
      uploadedProductCommandExportFileMutateAsync({
        data: {
          file: productCommandExportFile,
        },
      })
        .then((newProductCommandExportFile) => {
          navigate(Page.PRODUCT_COMMAND_EXPORT_EDIT.PATH.replace(':id', String(newProductCommandExportFile?.id)));
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [uploadedProductCommandExportFileMutateAsync, navigate, toggleUploadModal],
  );

  return (
    <ToolkitProvider
      data={data || []}
      keyField={FieldName.ID}
      columns={[
        ...tableConfig.columns,
        {
          dataField: FieldName.ACTION,
          isDummyField: true,
          text: 'Thao tác',
          ...generateColumnStyle(),
          formatter: (_: any, row: KhotpTransLenhXuat) => {
            return (
              <div className="d-flex">
                <Link className="px-2" to={Page.PRODUCT_COMMAND_EXPORT_DETAIL.PATH.replace(':id', String(row.id))}>
                  <i className="fa-solid fa-eye" title="Xem" />
                </Link>
                {row.status === '1' && (
                  <EditPermissionAction>
                    <Link className="px-2" to={Page.PRODUCT_COMMAND_EXPORT_EDIT.PATH.replace(':id', String(row.id))}>
                      <i className="fa-solid fa-pen-to-square" title="Sửa" />
                    </Link>
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
                )}
              </div>
            );
          },
        },
      ]}>
      {(props: any) => (
        <>
          <div className="d-flex justify-content-end mb-4 pb-1">
            <EditPermissionAction>
              <Button color="primary" onClick={toggleUploadModal}>
                Import lệnh xuất kho
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
                  {dataIsLoading || dataCountIsLoading ? <BasicSpinner /> : 'Không có kết quả nào được tìm thấy'}
                </div>
              )}
            />
          </div>
          <CancelCommandExportModal
            productCommandExportBill={selectedRow}
            isOpen={isOpenCancelModal}
            toggle={toggleCancelModal}
            handleConfirmClick={handleCancelModalConfirmClick}
          />
          <UploadProductCommandFileModal
            isOpen={isOpenUploadModal}
            toggle={toggleUploadModal}
            handleConfirmClickCallback={handleUploadModalConfirmClickCallback}
          />
          {uploadedProductCommandExportFileIsPending && <TransparentSpinner />}
        </>
      )}
    </ToolkitProvider>
  );
}

export default ProductCommandExportTable;
