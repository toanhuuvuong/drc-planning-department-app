import { useKhovtTransPhieuXuatControllerFindDetail } from 'main/apis/drc/endpoints/khovt-trans-phieu-xuat-controller/khovt-trans-phieu-xuat-controller';
import { KhovtTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  ExportFilter,
  resetSuppliesStoreExportListState,
  selectExportFilter,
  selectExportTableExcludeSelectedRows,
  selectExportTriggerFlag,
} from 'main/redux/modules/supplies-store-export/supplies-store-export-list-slice';
import { TableState } from 'main/types';
import { DateUtil } from 'main/utils';
import { useCallback, useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import SuppliesStoreExportFilter from './sub-components/supplies-store-export-filter';
import SuppliesStoreExportTable from './sub-components/supplies-store-export-table/supplies-store-export-table';

function SuppliesStoreExportList() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectExportFilter);
  const table = useAppSelector(selectExportTableExcludeSelectedRows);
  const triggerFlag = useAppSelector(selectExportTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['suppliesExportBills'] });

    // Reset state
    dispatch(resetSuppliesStoreExportListState());
  }, [dispatch]);

  // React Query
  const {
    data: suppliesExportBills,
    isLoading: suppliesExportBillsIsLoading,
    refetch: suppliesExportBillsRefetch,
  } = useKhovtTransPhieuXuatControllerFindDetail(getSuppliesExportBillsParams(filter, table), {
    query: {
      queryKey: ['suppliesExportBills', filter, table, triggerFlag],
    },
  });

  // React Function
  const handleRefreshTable = useCallback(() => {
    suppliesExportBillsRefetch();
  }, [suppliesExportBillsRefetch]);

  return (
    <BasicTemplate
      pageCategory={Page.SUPPLIES_STORE_EXPORT_LIST.CATEGORY}
      pageTitle={Page.SUPPLIES_STORE_EXPORT_LIST.TITLE}
      pageName={Page.SUPPLIES_STORE_EXPORT_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <SuppliesStoreExportFilter />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <SuppliesStoreExportTable
              data={suppliesExportBills}
              dataIsLoading={suppliesExportBillsIsLoading}
              handleRefreshTable={handleRefreshTable}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getSuppliesExportBillsParams = (
  filter: ExportFilter,
  table: TableState<KhovtTransPhieuXuatControllerFindDetail200DataItem>,
) => {
  const where = getSuppliesExportBillsCountParams(filter).where;
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

const getSuppliesExportBillsCountParams = (filter: ExportFilter) => {
  const { startDate, endDate, importStore, exportStore, exportBillNo, exportStatus } = filter;
  return {
    where: {
      khoNhap: importStore && importStore !== '-1' ? importStore : undefined,
      khoXuat: exportStore && exportStore !== '-1' ? exportStore : undefined,
      ngayXuat:
        startDate && endDate
          ? { gte: DateUtil.toISOString(startDate.startOf('day')), lte: DateUtil.toISOString(endDate.endOf('day')) }
          : undefined,
      soPhieu: exportBillNo ? exportBillNo : undefined,
      status: exportStatus && exportStatus !== '-1' ? exportStatus : undefined,
    },
  };
};

export default SuppliesStoreExportList;
