import {
  useKhotpTransLenhNhapControllerCount,
  useKhotpTransLenhNhapControllerFind,
} from 'main/apis/drc/endpoints/khotp-trans-lenh-nhap-controller/khotp-trans-lenh-nhap-controller';
import { KhotpTransLenhNhap } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  ProductExcelFilter,
  resetProductStoreExcelListState,
  selectProductExcelFilter,
  selectProductStoreExcelTable,
  selectProductStoreExcelTriggerFlag,
} from 'main/redux/modules/product-store-excel/product-store-excel-list-slice';
import { TableState } from 'main/types';
import { DateUtil } from 'main/utils';
import { useCallback, useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import ProductStoreExcelFilter from './sub-components/product-store-excel-filter';
import ProductStoreExcelTable from './sub-components/product-store-excel-table/product-store-excel-table';

function ProductStoreExcelList() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectProductExcelFilter);
  const table = useAppSelector(selectProductStoreExcelTable);
  const triggerFlag = useAppSelector(selectProductStoreExcelTriggerFlag);

  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['productStoreExcels'] });

    // Reset state
    dispatch(resetProductStoreExcelListState());
  }, [dispatch]);

  // React Query
  const {
    data: productStoreExcels,
    isLoading: productStoreExcelsIsLoading,
    refetch: productStoreExcelsRefetch,
  } = useKhotpTransLenhNhapControllerFind(getProductStoreExcelsParams(filter, table), {
    query: {
      queryKey: ['productStoreExcels', filter, table, triggerFlag],
    },
  });

  const {
    data: productStoreExcelsCount,
    isLoading: productStoreExcelsCountIsLoading,
    refetch: productStoreExcelsCountRefetch,
  } = useKhotpTransLenhNhapControllerCount(getProductStoreExcelsCountParams(filter), {
    query: {
      queryKey: ['productStoreExcelsCount', filter, triggerFlag],
    },
  });

  // React Function
  const handleRefreshTable = useCallback(() => {
    productStoreExcelsRefetch();
    productStoreExcelsCountRefetch();
  }, [productStoreExcelsCountRefetch, productStoreExcelsRefetch]);

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_EXCEL_LIST.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_EXCEL_LIST.TITLE}
      pageName={Page.PRODUCT_STORE_EXCEL_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <ProductStoreExcelFilter />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ProductStoreExcelTable
              data={productStoreExcels}
              dataIsLoading={productStoreExcelsIsLoading}
              dataCount={productStoreExcelsCount?.count}
              dataCountIsLoading={productStoreExcelsCountIsLoading}
              handleRefreshTable={handleRefreshTable}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

const getProductStoreExcelsParams = (filter: ProductExcelFilter, table: TableState<KhotpTransLenhNhap>) => {
  const where = getProductStoreExcelsCountParams(filter).where;
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

const getProductStoreExcelsCountParams = (filter: ProductExcelFilter) => {
  const { startDate, endDate, productStoreExcelCode, productExcelTemplateType, status } = filter;

  return {
    where: {
      ngayNhap:
        startDate && endDate
          ? { gte: DateUtil.toISOString(startDate.startOf('day')), lte: DateUtil.toISOString(endDate.endOf('day')) }
          : undefined,
      soChungTu: { like: productStoreExcelCode ? `%${productStoreExcelCode}%` : undefined },
      loaiLenhNhap:
        productExcelTemplateType && productExcelTemplateType !== '-1' ? productExcelTemplateType : undefined,
      status: status && status !== '-1' ? status : undefined,
    },
  };
};

export default ProductStoreExcelList;
