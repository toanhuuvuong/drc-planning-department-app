import { useKhotpTransPhieuNhapControllerFindDetail } from 'main/apis/drc/endpoints/khotp-trans-phieu-nhap-controller/khotp-trans-phieu-nhap-controller';
import { KhotpTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  ProductImportFilter,
  resetProductStoreImportListState,
  selectProductImportFilter,
  selectProductImportTable,
  selectProductImportTriggerFlag,
} from 'main/redux/modules/product-store-import/product-store-import-list-slice';
import { TableState } from 'main/types';
import { DateUtil } from 'main/utils';
import { useCallback, useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import ProductStoreImportFilter from './sub-components/product-store-import-filter';
import ProductStoreImportTable from './sub-components/product-store-import-table/product-store-import-table';

function ProductStoreImportList() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectProductImportFilter);
  const table = useAppSelector(selectProductImportTable);
  const triggerFlag = useAppSelector(selectProductImportTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['productImportBills'] });

    // Reset state
    dispatch(resetProductStoreImportListState());
  }, [dispatch]);

  // React Query
  const {
    data: productImportBills,
    isLoading: productImportBillsIsLoading,
    refetch: productImportBillsRefetch,
  } = useKhotpTransPhieuNhapControllerFindDetail(getProductImportBillsParams(filter, table), {
    query: {
      queryKey: ['productImportBills', filter, table, triggerFlag],
    },
  });

  const handleRefreshTable = useCallback(() => {
    productImportBillsRefetch();
  }, [productImportBillsRefetch]);

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_IMPORT_LIST.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_IMPORT_LIST.TITLE}
      pageName={Page.PRODUCT_STORE_IMPORT_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <ProductStoreImportFilter />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ProductStoreImportTable
              data={productImportBills}
              dataIsLoading={productImportBillsIsLoading}
              handleRefreshTable={handleRefreshTable}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getProductImportBillsParams = (
  filter: ProductImportFilter,
  table: TableState<KhotpTransPhieuNhapControllerFindDetail200DataItem>,
) => {
  const where = getProductImportBillsCountParams(filter).where;
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

const getProductImportBillsCountParams = (filter: ProductImportFilter) => {
  const { startDate, endDate, importStore, origin, searchField, searchKey, importStatus } = filter;

  // Build search like
  let searchPredicate = {};
  if (searchField) {
    if (searchField === FieldName.MA_SAN_PHAM) {
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
      maKhoXuat: origin && origin !== '-1' ? origin : undefined,
      maKhoNhap: importStore && importStore !== '-1' ? importStore : undefined,
      ngayNhap:
        startDate && endDate
          ? { gte: DateUtil.toISOString(startDate.startOf('day')), lte: DateUtil.toISOString(endDate.endOf('day')) }
          : undefined,
      status: importStatus && importStatus !== '-1' ? importStatus : undefined,
      ...searchPredicate,
    },
  };
};

export default ProductStoreImportList;
