import { useKhovtTransPhieuNhapControllerFindById } from 'main/apis/drc/endpoints/khovt-trans-phieu-nhap-controller/khovt-trans-phieu-nhap-controller';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import SuppliesStoreImportDetailInfo from './sub-components/supplies-store-import-detail-info';
import SuppliesStoreImportDetailTable from './sub-components/supplies-store-import-detail-table/supplies-store-import-detail-table';

function SuppliesStoreImportDetail() {
  // React Router
  const { id: suppliesImportBillId } = useParams();
  const navigate = useNavigate();

  // React Query hooks
  const { data: suppliesImportBill, isLoading: suppliesImportBillIsLoading } = useKhovtTransPhieuNhapControllerFindById(
    Number(suppliesImportBillId),
    {
      query: {
        enabled: !!suppliesImportBillId,
      },
    },
  );

  return (
    <BasicTemplate
      pageCategory={Page.SUPPLIES_STORE_IMPORT_DETAIL.CATEGORY}
      pageTitle={Page.SUPPLIES_STORE_IMPORT_DETAIL.TITLE}
      pageName={Page.SUPPLIES_STORE_IMPORT_DETAIL.NAME}
      parentPage={{
        name: Page.SUPPLIES_STORE_IMPORT_LIST.NAME,
        path: Page.SUPPLIES_STORE_IMPORT_LIST.PATH,
      }}
      isLoading={suppliesImportBillIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0 text-center">KHO VẬT TƯ - PHIẾU NHẬP #{suppliesImportBillId}</h3>
              </CardHeader>
              <CardBody>
                {suppliesImportBill && (
                  <>
                    <SuppliesStoreImportDetailInfo suppliesImportBill={suppliesImportBill} />
                    <SuppliesStoreImportDetailTable supplies={suppliesImportBill.details} />
                  </>
                )}
              </CardBody>
              <CardFooter>
                <div className="d-flex justify-content-end pb-1">
                  <EditPermissionAction>
                    <Button
                      color="primary"
                      onClick={() =>
                        navigate(Page.SUPPLIES_STORE_IMPORT_EDIT.PATH.replace(':id', String(suppliesImportBillId)))
                      }>
                      Sửa
                    </Button>
                  </EditPermissionAction>
                  <Button color="secondary" onClick={() => navigate(Page.SUPPLIES_STORE_IMPORT_LIST.PATH)}>
                    Quay lại
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export default SuppliesStoreImportDetail;
