import { useKhovtTransPhieuNhapControllerFindDetail } from 'main/apis/drc/endpoints/khovt-trans-phieu-nhap-controller/khovt-trans-phieu-nhap-controller';
import { KhovtTransPhieuNhapControllerFindDetail200DataItem } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  ImportFilter,
  resetSuppliesStoreImportListState,
  selectImportFilter,
  selectImportTable,
  selectImportTriggerFlag,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-list-slice';
import { TableState } from 'main/types';
import { DateUtil } from 'main/utils';
import { useCallback, useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import SuppliesStoreImportFilter from './sub-components/supplies-store-import-filter';
import SuppliesStoreImportTable from './sub-components/supplies-store-import-table/supplies-store-import-table';

function SuppliesStoreImportList() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectImportFilter);
  const table = useAppSelector(selectImportTable);
  const triggerFlag = useAppSelector(selectImportTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['suppliesImportBills'] });

    // Reset state
    dispatch(resetSuppliesStoreImportListState());
  }, [dispatch]);

  // React Query
  const {
    data: suppliesImportBills,
    isLoading: suppliesImportBillsIsLoading,
    refetch: suppliesImportBillsRefetch,
  } = useKhovtTransPhieuNhapControllerFindDetail(getSuppliesImportBillsParams(filter, table), {
    query: {
      queryKey: ['suppliesImportBills', filter, table, triggerFlag],
    },
  });

  // React Function
  const handleRefreshTable = useCallback(() => {
    suppliesImportBillsRefetch();
  }, [suppliesImportBillsRefetch]);

  return (
    <BasicTemplate
      pageCategory={Page.SUPPLIES_STORE_IMPORT_LIST.CATEGORY}
      pageTitle={Page.SUPPLIES_STORE_IMPORT_LIST.TITLE}
      pageName={Page.SUPPLIES_STORE_IMPORT_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <SuppliesStoreImportFilter />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <SuppliesStoreImportTable
              data={suppliesImportBills}
              dataIsLoading={suppliesImportBillsIsLoading}
              handleRefreshTable={handleRefreshTable}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getSuppliesImportBillsParams = (
  filter: ImportFilter,
  table: TableState<KhovtTransPhieuNhapControllerFindDetail200DataItem>,
) => {
  const where = getSuppliesImportBillsCountParams(filter).where;
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

const getSuppliesImportBillsCountParams = (filter: ImportFilter) => {
  const { startDate, endDate, importStore, origin, searchField, searchKey, importStatus } = filter;

  // Build search like
  let searchPredicate = {};
  if (searchField) {
    if (searchField !== FieldName.TEN_VT) {
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
      donViNhap: origin && origin !== '-1' ? origin : undefined,
      maKho: importStore && importStore !== '-1' ? importStore : undefined,
      ngayNhap:
        startDate && endDate
          ? { gte: DateUtil.toISOString(startDate.startOf('day')), lte: DateUtil.toISOString(endDate.endOf('day')) }
          : undefined,
      status: importStatus && importStatus !== '-1' ? importStatus : undefined,
      ...searchPredicate,
    },
  };
};

export default SuppliesStoreImportList;
