import { useQldhTransDonHangControllerSearchItems } from 'main/apis/drc/endpoints/qldh-trans-don-hang-controller/qldh-trans-don-hang-controller';
import { QldhTransDonHangControllerSearchItems200DataItem } from 'main/apis/drc/models';
import { queryClient } from 'main/configs/react-query';
import { useAppSelector } from 'main/redux/hooks';

import {
  OrderItemFilter,
  selectOrderItemFilter,
  selectOrderItemTable,
  selectOrderItemTriggerFlag,
} from 'main/redux/modules/order-management/order-analytics-slice';
import { TableState } from 'main/types';
import { useCallback, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import OrderItemListModalFilter from './sub-components/order-item-list-modal-filter';
import OrderItemListModalTable from './sub-components/order-item-list-table/order-item-list-modal-table';

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

function OrderItemListModal({ isOpen, toggle }: Props) {
  // Redux
  const filter = useAppSelector(selectOrderItemFilter);
  const table = useAppSelector(selectOrderItemTable);
  const triggerFlag = useAppSelector(selectOrderItemTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['orderItemsData'] });
  }, []);

  // React Query
  const {
    data: orderItemsData,
    isLoading: orderItemsDataIsLoading,
    refetch: orderItemsDataRefetch,
  } = useQldhTransDonHangControllerSearchItems(getOrderItemsParams(filter, table), {
    query: {
      queryKey: ['orderItemsData', filter, table, triggerFlag],
      enabled: isOpen,
    },
  });

  // React Function
  const handleRefreshTable = useCallback(() => {
    orderItemsDataRefetch();
  }, [orderItemsDataRefetch]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="xl">
      <ModalHeader toggle={toggle}>POPUP THỐNG KÊ ĐƠN HÀNG</ModalHeader>
      <ModalBody>
        <OrderItemListModalFilter />
        <hr />
        <OrderItemListModalTable
          data={orderItemsData}
          dataIsLoading={orderItemsDataIsLoading}
          handleRefreshTable={handleRefreshTable}
        />
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <Button color="secondary" onClick={toggle}>
          Quay lại
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const getOrderItemsParams = (
  filter: OrderItemFilter,
  table: TableState<QldhTransDonHangControllerSearchItems200DataItem>,
) => {
  const where = getOrderItemsCountParams(filter).where;
  const { page, sizePerPage, sortField, sortOrder } = table;

  return {
    filter: {
      skip: (page - 1) * sizePerPage,
      limit: sizePerPage,
      order: sortField ? `${sortField} ${sortOrder?.toUpperCase()}` : undefined,
      where,
    },
  };
};

const getOrderItemsCountParams = (filter: OrderItemFilter) => {
  const { orderItemProductCode, orderItemStoreCode } = filter;

  return {
    where: {
      maSanPham: orderItemProductCode ? orderItemProductCode : undefined,
      maKhoXuat: orderItemStoreCode && orderItemStoreCode !== '-1' ? orderItemStoreCode : undefined,
    },
  };
};

export default OrderItemListModal;
