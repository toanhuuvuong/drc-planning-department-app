import { useKhotpTransPhieuNhapControllerFindById } from 'main/apis/drc/endpoints/khotp-trans-phieu-nhap-controller/khotp-trans-phieu-nhap-controller';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import ProductStoreImportDetailInfo from './sub-components/product-store-import-detail-info';
import ProductStoreImportDetailTable from './sub-components/product-store-import-detail-table/product-store-import-detail-table';

function ProductStoreImportDetail() {
  // React Router
  const { id: productImportBillId } = useParams();
  const navigate = useNavigate();

  // React Query hooks
  const { data: productImportBill, isLoading: productImportBillIsLoading } = useKhotpTransPhieuNhapControllerFindById(
    Number(productImportBillId),
    {
      query: {
        enabled: !!productImportBillId,
      },
    },
  );

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_IMPORT_DETAIL.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_IMPORT_DETAIL.TITLE}
      pageName={Page.PRODUCT_STORE_IMPORT_DETAIL.NAME}
      parentPage={{
        name: Page.PRODUCT_STORE_IMPORT_LIST.NAME,
        path: Page.PRODUCT_STORE_IMPORT_LIST.PATH,
      }}
      isLoading={productImportBillIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0 text-center">KHO SẢN PHẨM - PHIẾU NHẬP #{productImportBillId}</h3>
              </CardHeader>
              <CardBody>
                {productImportBill && (
                  <>
                    <ProductStoreImportDetailInfo productImportBill={productImportBill} />
                    <ProductStoreImportDetailTable product={productImportBill.details} />
                  </>
                )}
              </CardBody>
              <CardFooter>
                <div className="d-flex justify-content-end pb-1">
                  <div>
                    <EditPermissionAction>
                      <Button
                        color="primary"
                        onClick={() =>
                          navigate(Page.PRODUCT_STORE_IMPORT_EDIT.PATH.replace(':id', String(productImportBillId)))
                        }>
                        Sửa
                      </Button>
                    </EditPermissionAction>
                    <Button color="secondary" onClick={() => navigate(Page.PRODUCT_STORE_IMPORT_LIST.PATH)}>
                      Quay lại
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export default ProductStoreImportDetail;
