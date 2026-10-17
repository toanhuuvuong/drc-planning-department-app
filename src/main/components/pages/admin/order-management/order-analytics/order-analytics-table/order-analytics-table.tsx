import { QldhTransDonHangControllerSearchThongKe200Item } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch } from 'main/redux/hooks';
import { resetOrderAnalyticsState, searchOrderItem } from 'main/redux/modules/order-management/order-analytics-slice';
import { generateColumnStyle } from 'main/utils';
import { useCallback, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import tableConfig from './table-config';
import OrderItemListModal from '../order-item-list-modal/order-item-list-modal';

type Props = {
  data?: QldhTransDonHangControllerSearchThongKe200Item[];
  dataIsLoading: boolean;
};

function OrderAnalyticsTable({ data, dataIsLoading }: Props) {
  // Redux
  const dispatch = useAppDispatch();

  // React State
  const [isOpenOrderItemListModal, setOpenOrderItemListModal] = useState(false);

  // React function
  const toggleOrderItemListModal = useCallback(() => {
    const isCloseModal = isOpenOrderItemListModal;

    // Close modal
    setOpenOrderItemListModal((isOpenOrderItemListModal) => !isOpenOrderItemListModal);

    setTimeout(() => {
      if (isCloseModal) {
        // Reset state when close modal
        dispatch(resetOrderAnalyticsState());
      }
    }, 500);
  }, [dispatch, isOpenOrderItemListModal]);

  const handleViewActionClick = useCallback(
    (maSanPham?: string, maKhoXuat?: string) => {
      dispatch(
        searchOrderItem({
          orderItemProductCode: String(maSanPham),
          orderItemStoreCode: String(maKhoXuat),
        }),
      );
      toggleOrderItemListModal();
    },
    [dispatch, toggleOrderItemListModal],
  );

  return (
    <>
      <ToolkitProvider
        data={data || []}
        keyField={`${FieldName.MA_SAN_PHAM}_${FieldName.MA_KHO_XUAT}`}
        columns={[
          ...tableConfig.columns,
          {
            dataField: FieldName.ACTION,
            isDummyField: true,
            text: 'Thao tác',
            ...generateColumnStyle(),
            formatter: (_: any, row: QldhTransDonHangControllerSearchThongKe200Item) => {
              return (
                <div className="d-flex">
                  <Link
                    className="px-2"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewActionClick(row.maSanPham, row.maKhoXuat);
                    }}>
                    <i className="fa-solid fa-eye" title="Xem" />
                  </Link>
                </div>
              );
            },
          },
        ]}>
        {(props: any) => (
          <>
            <div className="table-responsive">
              <BootstrapTable
                {...props.baseProps}
                remote
                bootstrap4
                bordered={false}
                noDataIndication={() => (
                  <div className="text-center">
                    {dataIsLoading ? <BasicSpinner /> : 'Không có kết quả nào được tìm thấy'}
                  </div>
                )}
              />
            </div>
          </>
        )}
      </ToolkitProvider>
      {isOpenOrderItemListModal && (
        <OrderItemListModal isOpen={isOpenOrderItemListModal} toggle={toggleOrderItemListModal} />
      )}
    </>
  );
}

export default OrderAnalyticsTable;
