import { useKhovtXuatNhapTonControllerFind } from 'main/apis/drc/endpoints/khovt-xuat-nhap-ton-controller/khovt-xuat-nhap-ton-controller';
import { KhovtXuatNhapTonControllerFind200DataItem, KhovtXuatNhapTonControllerFindParams } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { DateFormat, Page } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  InventoryFilter,
  resetSuppliesStoreInventoryListState,
  selectInventoryFilter,
  selectInventoryTableExcludeSelectedRows,
  selectInventoryTriggerFlag,
} from 'main/redux/modules/supplies-store-inventory/supplies-store-inventory-list-slice';
import { TableState } from 'main/types';
import { useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import SuppliesStoreInventoryFilter from './sub-components/supplies-store-inventory-filter';
import SuppliesStoreInventoryTable from './sub-components/supplies-store-inventory-table/supplies-store-inventory-table';

function SuppliesStoreInventoryList() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectInventoryFilter);
  const table = useAppSelector(selectInventoryTableExcludeSelectedRows);
  const triggerFlag = useAppSelector(selectInventoryTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['suppliesInventoryBills', 'suppliesInventoryReport'] });

    // Reset state
    dispatch(resetSuppliesStoreInventoryListState());
  }, [dispatch]);

  // React Query
  const { data: suppliesInventoryBills, isLoading: suppliesInventoryBillsIsLoading } =
    useKhovtXuatNhapTonControllerFind(getSuppliesInventoryBillsParams(filter, table), {
      query: {
        queryKey: ['suppliesInventoryBills', filter, table, triggerFlag],
      },
    });

  return (
    <BasicTemplate
      pageCategory={Page.SUPPLIES_STORE_INVENTORY_LIST.CATEGORY}
      pageTitle={Page.SUPPLIES_STORE_INVENTORY_LIST.TITLE}
      pageName={Page.SUPPLIES_STORE_INVENTORY_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <SuppliesStoreInventoryFilter />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <SuppliesStoreInventoryTable
              data={suppliesInventoryBills}
              dataIsLoading={suppliesInventoryBillsIsLoading}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getSuppliesInventoryBillsParams = (
  filter: InventoryFilter,
  table: TableState<KhovtXuatNhapTonControllerFind200DataItem>,
): KhovtXuatNhapTonControllerFindParams => {
  const where = getSuppliesInventoryBillsCountParams(filter);
  const { page, sizePerPage } = table;

  return {
    searchParams: {
      numberOffset: (page - 1) * sizePerPage,
      numberLimit: sizePerPage,
      ...where,
    },
  };
};

const getSuppliesInventoryBillsCountParams = (filter: InventoryFilter) => {
  const { startDate, endDate, suppliesStore, suppliesGroup, suppliesCode } = filter;

  return {
    maVt: suppliesCode ? suppliesCode : undefined,
    maNhom: suppliesGroup && suppliesGroup !== '-1' ? suppliesGroup : undefined,
    maKho: suppliesStore && suppliesStore !== '-1' ? suppliesStore : undefined,
    fromDate: startDate ? startDate.format(DateFormat.DATE_ONLY) : undefined,
    toDate: endDate ? endDate.format(DateFormat.DATE_ONLY) : undefined,
  };
};

export default SuppliesStoreInventoryList;
