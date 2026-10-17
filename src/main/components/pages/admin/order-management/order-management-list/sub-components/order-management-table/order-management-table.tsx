import {
  useQldhTransDonHangControllerDeleteById,
  useQldhTransDonHangControllerImport,
  useQldhTransDonHangControllerUpdateStatusById,
} from 'main/apis/drc/endpoints/qldh-trans-don-hang-controller/qldh-trans-don-hang-controller';
// import { useQldhTransYeuCauSanXuatControllerCreate } from 'main/apis/drc/endpoints/qldh-trans-yeu-cau-san-xuat-controller/qldh-trans-yeu-cau-san-xuat-controller';
import {
  LoopbackCount,
  QldhTransDonHang,
  QldhTransDonHangControllerSearchItems200DataItem,
  QldhTransDonHangItemWithRelations,
  QldhTransDonHangWithRelations,
} from 'main/apis/drc/models';
import { BasicSpinner, TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Page, ToastMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { TrangThaiDonHang } from 'main/constants/enums/order-management';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectImportTable,
  updateImportTable,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-list-slice';
import { DateUtil, generateColumnStyle } from 'main/utils';
import moment from 'moment';
import momentTz from 'moment-timezone';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
// import AddEditItemModal from './AddEditItemModal';
import tableConfig from './table-config';
import UploadOrderExcelModal from './upload-order-excel-modal';

type Props = {
  data?: QldhTransDonHang[];
  dataIsLoading: boolean;
  handleRefreshTable: () => void;
  dataCount: LoopbackCount | undefined;
};

function OrderManagementTable({ data = [], dataIsLoading, handleRefreshTable, dataCount }: Props) {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage, sortField, sortOrder } = useAppSelector(selectImportTable);
  const { mutateAsync: deleteOrderMutateAsync } = useQldhTransDonHangControllerDeleteById();
  const { mutateAsync: updatedStatusOrderManagementMutateAsync, isPending: updatedOrderManagementPending } =
    useQldhTransDonHangControllerUpdateStatusById();
  const { mutateAsync: importedOrdersMutateAsync, isPending: importedOrdersIsPending } =
    useQldhTransDonHangControllerImport();

  // React State/Ref
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);
  // const [currentItem, setCurrentItem] = useState<QldhTransDonHangControllerSearchItems200DataItem | null>(null);
  // const [isOpenAddSuppliesModal, setOpenAddSuppliesModal] = useState(false);

  // const toggleAddSuppliesModal = useCallback(
  //   () => setOpenAddSuppliesModal((isOpenAddSuppliesModal) => !isOpenAddSuppliesModal),
  //   [],
  // );

  // React Function
  const toggleUploadModal = useCallback(() => setOpenUploadModal((isOpenUploadModal) => !isOpenUploadModal), []);

  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<QldhTransDonHangControllerSearchItems200DataItem>) => {
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

  // const updateItem = async (updatedItem: QldhTransYeuCauSanXuatWithRelations) => {
  //   updateMutation.mutate(
  //     { data: updatedItem },
  //     {
  //       onSuccess: () => {
  //         toast.success(ToastMessage.UPDATE_SUCCESS);
  //       },
  //     },
  //   );
  // };

  // click complete
  const handleSaveConfirmClick = useCallback(
    (info: QldhTransDonHangControllerSearchItems200DataItem) => {
      // Create new bill
      updatedStatusOrderManagementMutateAsync({
        id: Number(info.id),
      })
        .then((updatedSuppliesImportBill) => {
          toast.success(ToastMessage.UPDATE_SUCCESS);
          navigate(Page.ORDER_MANAGEMENT_LIST.PATH);
          handleRefreshTable();
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [handleRefreshTable, navigate, updatedStatusOrderManagementMutateAsync],
  );

  const handleDeleteOrder = useCallback(
    (id: number) => {
      deleteOrderMutateAsync({ id: id })
        .then((_) => {
          handleRefreshTable();
          toast.success(ToastMessage.DELETE_SUCCESS);
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [deleteOrderMutateAsync, handleRefreshTable],
  );

  const handleUploadModalConfirmClickCallback = useCallback(
    (orders: QldhTransDonHangWithRelations[]) => {
      // Close modal
      toggleUploadModal();

      // Import list donHangs
      importedOrdersMutateAsync({
        data: normalizeOrders(orders),
      })
        .then((_) => {
          toast.success(ToastMessage.IMPORT_SUCCESS);
          handleRefreshTable();
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [handleRefreshTable, importedOrdersMutateAsync, toggleUploadModal],
  );

  return (
    <ToolkitProvider
      data={data || []}
      keyField={`${FieldName.ID}_${FieldName.DON_HANG_ID}`}
      columns={[
        ...tableConfig.columns,
        {
          dataField: FieldName.ACTION,
          isDummyField: true,
          text: 'Thao tác',
          ...generateColumnStyle(),
          formatter: (_: any, row: QldhTransDonHangControllerSearchItems200DataItem) => {
            return (
              <div className="d-flex">
                <Link className="px-2" to={Page.ORDER_MANAGEMENT_DETAIL.PATH.replace(':id', String(row.id))}>
                  <i className="fa-solid fa-eye" title="Xem" />
                </Link>
                {
                  <EditPermissionAction>
                    <Link className="px-2" to={Page.ORDER_MANAGEMENT_EDIT.PATH.replace(':id', String(row.id))}>
                      <i className="fa-solid fa-pen-to-square" title="Sửa" />
                    </Link>
                  </EditPermissionAction>
                }
                {/* {
                  <Link
                    className="px-2"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentItem(row);
                      toggleAddSuppliesModal();
                    }}>
                    <i className="fa-solid fa-plus text-blue" title="Yêu cầu sản xuất thêm" />
                  </Link>
                } */}
                {
                  <EditPermissionAction>
                    {TrangThaiDonHang.DANG_TIEN_HANH === row.trangThai && (
                      <Link
                        className="px-2"
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveConfirmClick(row as any);
                        }}>
                        <i className="fa-solid fa-check-circle text-green" title="Hoàn thành đơn hàng" />
                      </Link>
                    )}
                  </EditPermissionAction>
                }
                <Link
                  className="px-2"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (row?.id !== undefined) {
                      handleDeleteOrder(row.id);
                    }
                  }}>
                  <i className="fa-solid fa-trash" title="Xóa" />
                </Link>
              </div>
            );
          },
        },
      ]}>
      {(props: any) => (
        <>
          <EditPermissionAction>
            <div className="d-flex justify-content-end mb-4 pb-1">
              <Button color="primary" onClick={toggleUploadModal}>
                Import đơn hàng
              </Button>
              <Button color="primary" onClick={() => navigate(Page.ORDER_MANAGEMENT_ADD.PATH)}>
                Thêm đơn hàng
              </Button>
            </div>
          </EditPermissionAction>
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
                totalSize: dataCount?.count || 0,
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
                  {dataIsLoading || updatedOrderManagementPending ? (
                    <BasicSpinner />
                  ) : (
                    'Không có kết quả nào được tìm thấy'
                  )}
                </div>
              )}
            />
          </div>
          {/* <AddEditItemModal
            isOpen={isOpenAddSuppliesModal}
            toggle={toggleAddSuppliesModal}
            handleEdit={updateItem}
            currentItem={currentItem as any}
          /> */}
          <UploadOrderExcelModal
            isOpen={isOpenUploadModal}
            toggle={toggleUploadModal}
            handleConfirmClickCallback={handleUploadModalConfirmClickCallback}
          />
          {importedOrdersIsPending && <TransparentSpinner />}
        </>
      )}
    </ToolkitProvider>
  );
}

const normalizeOrders = (orders?: QldhTransDonHangWithRelations[]) => {
  if (!orders) {
    return [];
  }
  const list: QldhTransDonHangWithRelations[] = [];
  for (const order of orders) {
    list.push({
      maKH: order.maKH,
      ngayDatHang: String(DateUtil.toDateISOString(moment())),
      ngayGiaoDuKien: String(DateUtil.toDateISOString(momentTz(order.ngayGiaoDuKien).tz('Asia/Hong_Kong'))),
      ngayGiaoThucTe: String(DateUtil.toDateISOString(momentTz(order.ngayGiaoThucTe).tz('Asia/Hong_Kong'))),
      nguoiTao: order.nguoiTao,
      nguoiYeuCau: order.nguoiYeuCau,
      ghiChu: order.ghiChu,
      donHangItems: normalizeOrderItems(order.donHangItems),
    });
  }
  return list;
};

const normalizeOrderItems = (orderItems?: QldhTransDonHangItemWithRelations[]) => {
  if (!orderItems) {
    return orderItems;
  }
  const list: QldhTransDonHangItemWithRelations[] = [];
  for (const orderItem of orderItems) {
    list.push({
      soLuong: Number(orderItem.soLuong) || 0,
      sanPham: orderItem.sanPham,
      maSanPham: orderItem.maSanPham,
      maKhoXuat: orderItem.maKhoXuat,
      yeuCauDongGoi: orderItem.yeuCauDongGoi,
      ghiChu: orderItem.ghiChu,
      soLuongGiuHang: Number(orderItem.soLuongGiuHang) || 0,
    });
  }
  return list;
};

export default OrderManagementTable;
