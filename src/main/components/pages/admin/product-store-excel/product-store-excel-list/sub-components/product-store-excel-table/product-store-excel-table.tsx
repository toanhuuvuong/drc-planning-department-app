import {
  useKhotpTransLenhNhapControllerCreate,
  useKhotpTransLenhNhapControllerDeleteById,
} from 'main/apis/drc/endpoints/khotp-trans-lenh-nhap-controller/khotp-trans-lenh-nhap-controller';
import {
  KhotpTransLenhNhap,
  KhotpTransLenhNhapRawDetailWithRelations,
  KhotpTransLenhNhapWithRelations,
} from 'main/apis/drc/models';
import { BasicSpinner, TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { DateFormat, Page, ToastMessage } from 'main/constants';
import { FieldName, ProductExcelStatus } from 'main/constants/enums';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectProductStoreExcelTable,
  updateProductStoreExcelTable,
} from 'main/redux/modules/product-store-excel/product-store-excel-list-slice';
import { DateUtil, generateColumnStyle } from 'main/utils';
import moment from 'moment';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import CancelProductStoreExcelModal from './cancel-product-store-excel-modal';
import tableConfig from './table-config';
import UploadProductStoreExcelModal from './upload-product-store-excel-modal';

type Props = {
  data?: KhotpTransLenhNhap[];
  dataIsLoading: boolean;
  dataCount?: number;
  dataCountIsLoading: boolean;
  handleRefreshTable: () => void;
};

function ProductStoreExcelTable({ data, dataIsLoading, dataCount, dataCountIsLoading, handleRefreshTable }: Props) {
  // React Router
  const navigate = useNavigate();
  const actionPermission = usePermissionAction();
  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage, sortField, sortOrder } = useAppSelector(selectProductStoreExcelTable);

  // React State/Ref
  const [isOpenCancelModal, setOpenCancelModal] = useState(false);
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<KhotpTransLenhNhap>();

  // React Query
  const { mutateAsync: deletedProductStoreExcelBillMutateAsync, isPending: deletedProductStoreExcelBillIsPending } =
    useKhotpTransLenhNhapControllerDeleteById();

  const { mutateAsync: createdProductStoreExcelMutateAsync, isPending: createdProductStoreExcelIsPending } =
    useKhotpTransLenhNhapControllerCreate();

  // React Function
  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<KhotpTransLenhNhap>) => {
      const { page, sizePerPage, sortField, sortOrder } = newState;

      dispatch(
        updateProductStoreExcelTable({
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
    (row: KhotpTransLenhNhap) => {
      setSelectedRow(row);
      toggleCancelModal();
    },
    [toggleCancelModal],
  );

  const handleCancelModalConfirmClick = useCallback(() => {
    // Close modal
    toggleCancelModal();

    // Delete product store excel
    deletedProductStoreExcelBillMutateAsync({ id: Number(selectedRow?.id) })
      .then((_) => {
        // Refresh table data
        handleRefreshTable();
        toast.success(ToastMessage.CANCEL_SUCCESS);
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [deletedProductStoreExcelBillMutateAsync, handleRefreshTable, selectedRow?.id, toggleCancelModal]);

  const handleUploadModalConfirmClickCallback = useCallback(
    (productStoreExcel: KhotpTransLenhNhapWithRelations) => {
      // Close modal
      toggleUploadModal();

      // Create new product store excel
      createdProductStoreExcelMutateAsync({
        data: {
          ...productStoreExcel,
          soChungTu: productStoreExcel.rawDetails?.[0]?.maPhieuXuat,
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
          hidden: !actionPermission,
          ...generateColumnStyle(),
          formatter: (_: any, row: KhotpTransLenhNhap) => {
            return (
              <div className="d-flex">
                <Link className="px-2" to={Page.PRODUCT_STORE_EXCEL_DETAIL.PATH.replace(':id', String(row.id))}>
                  <i className="fa-solid fa-eye" title="Xem" />
                </Link>
                {row.status !== ProductExcelStatus.complete.id && (
                  <EditPermissionAction>
                    <Link className="px-2" to={Page.PRODUCT_STORE_EXCEL_EDIT.PATH.replace(':id', String(row.id))}>
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
                Import lệnh nhập kho
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
          <CancelProductStoreExcelModal
            productStoreExcel={selectedRow}
            isOpen={isOpenCancelModal}
            toggle={toggleCancelModal}
            handleConfirmClick={handleCancelModalConfirmClick}
          />
          <UploadProductStoreExcelModal
            isOpen={isOpenUploadModal}
            toggle={toggleUploadModal}
            handleConfirmClickCallback={handleUploadModalConfirmClickCallback}
          />
          {(createdProductStoreExcelIsPending || deletedProductStoreExcelBillIsPending) && <TransparentSpinner />}
        </>
      )}
    </ToolkitProvider>
  );
}

const normalizeProductRawDetails = (productRawDetails?: KhotpTransLenhNhapRawDetailWithRelations[]) => {
  if (!productRawDetails) {
    return productRawDetails;
  }
  const list: KhotpTransLenhNhapRawDetailWithRelations[] = [];
  for (const productRawDetail of productRawDetails) {
    list.push({
      ...productRawDetail,
      soLuong: Number(productRawDetail.soLuong),
      ngayNhap: DateUtil.toDateISOString(productRawDetail.ngayNhap),
    });
  }
  return list;
};

const generateDefaultSoChungTu = () => {
  return `SCT-${moment().format(DateFormat.DATE_ONLY)}`;
};

export default ProductStoreExcelTable;
