import { useKhovtXuatNhapTonControllerSearchCanhBao } from 'main/apis/drc/endpoints/khovt-xuat-nhap-ton-controller/khovt-xuat-nhap-ton-controller';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { useEffect } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import SuppliesStoreInventoryTable from './sub-components/supplies-store-inventory-warning-table/supplies-store-inventory-warning-table';

function SuppliesStoreInventoryWarning() {
  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['suppliesInventoryWarnings'] });
  }, []);

  // React Query
  const { data: suppliesInventoryWarnings, isLoading: suppliesInventoryWarningsIsLoading } =
    useKhovtXuatNhapTonControllerSearchCanhBao({
      query: {
        queryKey: ['suppliesInventoryWarnings'],
      },
    });

  return (
    <BasicTemplate
      pageCategory={Page.SUPPLIES_STORE_INVENTORY_WARNING.CATEGORY}
      pageTitle={Page.SUPPLIES_STORE_INVENTORY_WARNING.TITLE}
      pageName={Page.SUPPLIES_STORE_INVENTORY_WARNING.NAME}
      isLoading={suppliesInventoryWarningsIsLoading}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <SuppliesStoreInventoryTable
              data={suppliesInventoryWarnings}
              dataIsLoading={suppliesInventoryWarningsIsLoading}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

export default SuppliesStoreInventoryWarning;
