import {
  useQldhTransDonHangControllerCount,
  useQldhTransDonHangControllerFind,
} from 'main/apis/drc/endpoints/qldh-trans-don-hang-controller/qldh-trans-don-hang-controller';
import { KhovtTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { NUOC_NGOAI_ID, NUOC_NGOAI_TEXT } from 'main/constants/enums/order-management';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  ImportFilter,
  resetOrderManagementListState,
  selectImportFilter,
  selectImportTable,
  selectImportTriggerFlag,
} from 'main/redux/modules/order-management/order-management-list-slice';
import { TableState } from 'main/types';
import { DateUtil } from 'main/utils';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import OrderManagementFilter from './sub-components/order-management-filter';
import OrderManagementTable from './sub-components/order-management-table/order-management-table';

function OrderManagementList() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectImportFilter);
  const table = useAppSelector(selectImportTable);
  const triggerFlag = useAppSelector(selectImportTriggerFlag);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const enableTongDonSearchMode = searchParams.get('enableTongDonSearchMode') === 'true';

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['ordersManagement'] });

    // Reset state
    dispatch(resetOrderManagementListState());
  }, [dispatch]);

  // React Query for orders
  const {
    data: ordersManagement,
    isLoading: orderManagementIsLoading,
    refetch: ordersManagementRefetch,
  } = useQldhTransDonHangControllerFind(
    getSuppliesImportBillsParams({ ...filter, enableTongDonSearchMode: enableTongDonSearchMode || undefined }, table),
    {
      query: {
        queryKey: [
          'ordersManagement',
          { ...filter, enableTongDonSearchMode: enableTongDonSearchMode || undefined },
          table,
          triggerFlag,
        ],
      },
    },
  );

  // React Query for count
  const {
    data: ordersCount,
    isLoading: ordersCountIsLoading,
    refetch: ordersCountRefetch,
  } = useQldhTransDonHangControllerCount(
    getSuppliesImportCountParams({ ...filter, enableTongDonSearchMode: enableTongDonSearchMode || undefined }, table),
    {
      query: {
        queryKey: [
          'ordersCount',
          { ...filter, enableTongDonSearchMode: enableTongDonSearchMode || undefined },
          table,
          triggerFlag,
        ],
      },
    },
  );

  // React Query
  // const {
  //   data: ordersManagement,
  //   isLoading: orderManagementIsLoading,
  //   refetch: suppliesImportBillsRefetch,
  // } = useQldhTransDonHangControllerSearchItems(
  //   getSuppliesImportBillsParams({ ...filter, enableTongDonSearchMode: enableTongDonSearchMode || undefined }, table),
  //   {
  //     query: {
  //       queryKey: [
  //         'ordersManagement',
  //         { ...filter, enableTongDonSearchMode: enableTongDonSearchMode || undefined },
  //         table,
  //         triggerFlag,
  //       ],
  //     },
  //   },
  // );

  // React Function
  const handleRefreshTable = useCallback(() => {
    ordersManagementRefetch();
    ordersCountRefetch();
  }, [ordersManagementRefetch, ordersCountRefetch]);

  return (
    <BasicTemplate
      pageCategory={Page.ORDER_MANAGEMENT_LIST.CATEGORY}
      pageTitle={Page.ORDER_MANAGEMENT_LIST.TITLE}
      pageName={Page.ORDER_MANAGEMENT_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <OrderManagementFilter />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <OrderManagementTable
              data={ordersManagement}
              dataIsLoading={orderManagementIsLoading || ordersCountIsLoading}
              handleRefreshTable={handleRefreshTable}
              dataCount={ordersCount}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getSuppliesImportCountParams = (
  filter: ImportFilter,
  table: TableState<KhovtTransPhieuNhapControllerFindDetail200DataItem>,
) => {
  const where = getOrderManagementCountParams(filter).where;
  const { page, sizePerPage, sortField, sortOrder } = table;

  return {
    skip: (page - 1) * sizePerPage,
    limit: sizePerPage,
    order: sortField ? `${sortField} ${sortOrder?.toUpperCase()}` : undefined,
    where,
  };
};

const getSuppliesImportBillsParams = (
  filter: ImportFilter,
  table: TableState<KhovtTransPhieuNhapControllerFindDetail200DataItem>,
) => {
  const where = getOrderManagementCountParams(filter).where;
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

const getOrderManagementCountParams = (filter: ImportFilter) => {
  const { startDate, endDate, importStore, origin, searchField, searchKey, importStatus, enableTongDonSearchMode } =
    filter;

  // Build search like
  let searchPredicate = {};
  if (searchField) {
    if (searchField !== FieldName.TEN_SAN_PHAM) {
      searchPredicate = {
        [searchField]: searchKey ? searchKey : undefined,
      };
    } else {
      searchPredicate = {
        [searchField]: { like: searchKey ? searchKey : undefined },
      };
    }
  }

  return {
    where: {
      maKH: importStore && importStore !== '-1' ? importStore : undefined,
      enableTongDonSearchMode: enableTongDonSearchMode ? true : undefined,
      ngayDatHang:
        startDate && endDate
          ? { gte: DateUtil.toISOString(startDate.startOf('day')), lte: DateUtil.toISOString(endDate.endOf('day')) }
          : undefined,
      trangThai: importStatus && importStatus !== '-1' ? importStatus : undefined,
      khuVucKH:
        origin && origin !== '-1'
          ? {
              ilike: origin === NUOC_NGOAI_ID ? NUOC_NGOAI_TEXT : undefined,
              inotlike: origin !== NUOC_NGOAI_ID ? NUOC_NGOAI_TEXT : undefined,
            }
          : undefined,
      ...searchPredicate,
    },
  };
};

export default OrderManagementList;
