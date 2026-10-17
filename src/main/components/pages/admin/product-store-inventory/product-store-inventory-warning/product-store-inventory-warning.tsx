import { useKhotpXuatNhapTonControllerSearchCanhBao } from 'main/apis/drc/endpoints/khotp-xuat-nhap-ton-controller/khotp-xuat-nhap-ton-controller';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import ProductStoreInventoryWarningTable from './sub-components/product-store-inventory-warning-table/product-store-inventory-warning-table';

function ProductStoreInventoryWarning() {
  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['productInventoryWarnings'] });
  }, []);

  // React Query
  const { data: productInventoryWarnings, isLoading: productInventoryWarningsIsLoading } =
    useKhotpXuatNhapTonControllerSearchCanhBao({
      query: {
        queryKey: ['productInventoryWarnings'],
      },
    });

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_INVENTORY_WARNING.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_INVENTORY_WARNING.TITLE}
      pageName={Page.PRODUCT_STORE_INVENTORY_WARNING.NAME}
      isLoading={productInventoryWarningsIsLoading}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <ProductStoreInventoryWarningTable
              data={productInventoryWarnings}
              dataIsLoading={productInventoryWarningsIsLoading}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

export default ProductStoreInventoryWarning;
