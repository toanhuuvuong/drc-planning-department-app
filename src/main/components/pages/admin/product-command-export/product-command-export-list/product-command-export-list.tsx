import {
  useKhotpTransLenhXuatControllerCount,
  useKhotpTransLenhXuatControllerFind,
} from 'main/apis/drc/endpoints/khotp-trans-lenh-xuat-controller/khotp-trans-lenh-xuat-controller';
import { KhotpTransLenhXuat } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  ProductCommandFilter,
  resetProductCommandExportListState,
  selectProductCommandExportTable,
  selectProductCommandExportTriggerFlag,
  selectProductCommandFilter,
} from 'main/redux/modules/product-command-export/product-command-export-list-slice';
import { TableState } from 'main/types';
import { DateUtil } from 'main/utils';
import { useCallback, useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import ProductCommandExportFilter from './sub-components/product-command-export-filter';
import ProductCommandExportTable from './sub-components/product-command-export-table/product-command-export-table';

function ProductCommandExportList() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectProductCommandFilter);
  const table = useAppSelector(selectProductCommandExportTable);
  const triggerFlag = useAppSelector(selectProductCommandExportTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['productCommandExportBills'] });

    // Reset state
    dispatch(resetProductCommandExportListState());
  }, [dispatch]);

  // React Query
  const {
    data: productCommandExportBills,
    isLoading: productCommandExportBillsIsLoading,
    refetch: productCommandExportBillsRefetch,
  } = useKhotpTransLenhXuatControllerFind(getProductCommandExportBillsParams(filter, table), {
    query: {
      queryKey: ['productCommandExportBills', filter, table, triggerFlag],
    },
  });

  const { data: productCommandExportBillsCount, isLoading: productCommandExportBillsCountIsLoading } =
    useKhotpTransLenhXuatControllerCount(getProductCommandExportBillsCountParams(filter), {
      query: {
        queryKey: ['productCommandExportBillsCount', filter, triggerFlag],
      },
    });

  const handleRefreshTable = useCallback(() => {
    productCommandExportBillsRefetch();
  }, [productCommandExportBillsRefetch]);

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_COMMAND_EXPORT_LIST.CATEGORY}
      pageTitle={Page.PRODUCT_COMMAND_EXPORT_LIST.TITLE}
      pageName={Page.PRODUCT_COMMAND_EXPORT_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <ProductCommandExportFilter />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ProductCommandExportTable
              data={productCommandExportBills}
              dataIsLoading={productCommandExportBillsIsLoading}
              dataCount={productCommandExportBillsCount?.count}
              dataCountIsLoading={productCommandExportBillsCountIsLoading}
              handleRefreshTable={handleRefreshTable}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getProductCommandExportBillsParams = (filter: ProductCommandFilter, table: TableState<KhotpTransLenhXuat>) => {
  const where = getProductCommandExportBillsCountParams(filter).where;
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

const getProductCommandExportBillsCountParams = (filter: ProductCommandFilter) => {
  const { startDate, endDate, exportStore, exportBillNo } = filter;

  return {
    where: {
      maKhoXuat: exportStore && exportStore !== '-1' ? exportStore : undefined,
      ngayXuat:
        startDate && endDate
          ? { gte: DateUtil.toISOString(startDate.startOf('day')), lte: DateUtil.toISOString(endDate.endOf('day')) }
          : undefined,
      soChungTu: { like: exportBillNo ? `%${exportBillNo}%` : undefined },
    },
  };
};

export default ProductCommandExportList;
