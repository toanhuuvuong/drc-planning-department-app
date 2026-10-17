import { useKhotpXuatNhapTonControllerFind } from 'main/apis/drc/endpoints/khotp-xuat-nhap-ton-controller/khotp-xuat-nhap-ton-controller';
import { KhotpXuatNhapTonControllerFind200DataItem, KhotpXuatNhapTonControllerFindParams } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { DateFormat, Page } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  InventoryFilter,
  resetProductStoreInventoryListState,
  selectInventoryFilter,
  selectInventoryTableExcludeSelectedRows,
  selectInventoryTriggerFlag,
} from 'main/redux/modules/product-store-inventory/product-store-inventory-list-slice';
import { TableState } from 'main/types';
import { useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import ProductStoreInventoryFilter from './sub-components/product-store-inventory-filter';
import ProductStoreInventoryTable from './sub-components/product-store-inventory-table/product-store-inventory-table';

function ProductStoreInventoryList() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectInventoryFilter);
  const table = useAppSelector(selectInventoryTableExcludeSelectedRows);
  const triggerFlag = useAppSelector(selectInventoryTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['productInventoryBills'] });

    // Reset state
    dispatch(resetProductStoreInventoryListState());
  }, [dispatch]);

  // React Query
  const { data: productInventoryBills, isLoading: productInventoryBillsIsLoading } = useKhotpXuatNhapTonControllerFind(
    getProductInventoryBillsParams(filter, table),
    {
      query: {
        queryKey: ['productInventoryBills', filter, table, triggerFlag],
      },
    },
  );

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_INVENTORY_LIST.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_INVENTORY_LIST.TITLE}
      pageName={Page.PRODUCT_STORE_INVENTORY_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <ProductStoreInventoryFilter />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ProductStoreInventoryTable data={productInventoryBills} dataIsLoading={productInventoryBillsIsLoading} />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getProductInventoryBillsParams = (
  filter: InventoryFilter,
  table: TableState<KhotpXuatNhapTonControllerFind200DataItem>,
): KhotpXuatNhapTonControllerFindParams => {
  const where = getProductInventoryBillsCountParams(filter);
  const { page, sizePerPage } = table;

  return {
    searchParams: {
      numberOffset: (page - 1) * sizePerPage,
      numberLimit: sizePerPage,
      ...where,
    },
  };
};

const getProductInventoryBillsCountParams = (filter: InventoryFilter) => {
  const { startDate, endDate, productStore, productGroup, productCode } = filter;

  return {
    maSanPham: productCode ? productCode : undefined,
    maNhom: productGroup && productGroup !== '-1' ? productGroup : undefined,
    maKho: productStore && productStore !== '-1' ? productStore : undefined,
    fromDate: startDate ? startDate.format(DateFormat.DATE_ONLY) : undefined,
    toDate: endDate ? endDate.format(DateFormat.DATE_ONLY) : undefined,
  };
};

export default ProductStoreInventoryList;
