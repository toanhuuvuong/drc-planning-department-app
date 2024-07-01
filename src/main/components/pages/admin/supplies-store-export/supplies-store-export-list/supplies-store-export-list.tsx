import { useKhovtTransPhieuXuatControllerFind } from 'main/apis/drc/endpoints/khovt-trans-phieu-xuat-controller/khovt-trans-phieu-xuat-controller';
import BasicTemplate from 'main/components/templates/basic-template/basic-template';
import { Page } from 'main/constants';
import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import SuppliesStoreExportFilter, {
  ExportFilter,
} from './sub-components/supplies-store-export-filter/supplies-store-export-filter';
import SuppliesStoreExportTable, {
  ExportTable,
} from './sub-components/supplies-store-export-table/supplies-store-export-table';

function SuppliesStoreExportList() {
  // React State
  const [filter, setFilter] = useState<ExportFilter | null>(null);
  const [table, setTable] = useState<ExportTable>({
    page: 0,
    sizePerPage: 10,
  });

  // React Query
  const { data: suppliesExportBills, isLoading: suppliesExportBillsIsLoading } = useKhovtTransPhieuXuatControllerFind(
    {
      filter: filter
        ? {
            //offset: 0,
            //limit: 100,
            //skip: 0,
            //order: 'string',
            where: {
              khoNhap: filter.importStore && filter.importStore !== '-1' ? filter.importStore : undefined,
              khoXuat: filter.exportStore && filter.exportStore !== '-1' ? filter.exportStore : undefined,
              ngayXuat: { min: filter.startDate, max: filter.endDate },
              soPhieu: filter.exportBillNo && filter.exportBillNo !== '-1' ? filter.exportBillNo : undefined,
              status: filter.exportStatus && filter.exportStatus !== '-1' ? filter.exportStatus : undefined,
            },
          }
        : undefined,
    },
    {
      query: {
        enabled: filter !== null,
      },
    },
  );

  useEffect(() => {
    if (suppliesExportBillsIsLoading) {
      // Reset filter when search done
      setFilter(null);
    }
  }, [suppliesExportBillsIsLoading]);

  // React Function
  const handleSearchClick = (filterValues: ExportFilter) => {
    setFilter(filterValues);
  };

  const handleTableChange = (fieldName: string, value: any) => {
    const name = fieldName as keyof typeof table;
    setTable({ ...table, [name]: value });
  };

  return (
    <BasicTemplate pageTitle={Page.SUPPLIES_STORE_EXPORT_LIST.TITLE} pageName={Page.SUPPLIES_STORE_EXPORT_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3>TỔNG HỢP XUẤT VẬT TƯ</h3>
              </CardHeader>
              <CardBody>
                <SuppliesStoreExportFilter handleSearchClick={handleSearchClick} />
                <hr />
                <SuppliesStoreExportTable
                  data={[...(suppliesExportBills || [])]}
                  dataIsLoading={suppliesExportBillsIsLoading}
                  tableState={table}
                  handleTableStateChange={handleTableChange}
                />
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export default SuppliesStoreExportList;
