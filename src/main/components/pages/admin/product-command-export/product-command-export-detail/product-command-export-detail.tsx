import { useKhotpTransLenhXuatControllerFindById } from 'main/apis/drc/endpoints/khotp-trans-lenh-xuat-controller/khotp-trans-lenh-xuat-controller';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import ProductCommandExportDetailInfo from './sub-components/product-command-export-detail-info';
import ProductCommandExportDetailTable from './sub-components/product-command-export-detail-table/product-command-export-detail-table';

function ProductCommandExportDetail() {
  // React Router
  const { id: productCommandExportBillId } = useParams();
  const navigate = useNavigate();

  // React Query hooks
  const { data: productCommandExportBill, isLoading: productCommandExportBillIsLoading } =
    useKhotpTransLenhXuatControllerFindById(Number(productCommandExportBillId), undefined, {
      query: {
        enabled: !!productCommandExportBillId,
      },
    });

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_COMMAND_EXPORT_DETAIL.CATEGORY}
      pageTitle={Page.PRODUCT_COMMAND_EXPORT_DETAIL.TITLE}
      pageName={Page.PRODUCT_COMMAND_EXPORT_DETAIL.NAME}
      parentPage={{
        name: Page.PRODUCT_COMMAND_EXPORT_LIST.NAME,
        path: Page.PRODUCT_COMMAND_EXPORT_LIST.PATH,
      }}
      isLoading={productCommandExportBillIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0 text-center">LỆNH XUẤT KHO #{productCommandExportBillId}</h3>
              </CardHeader>
              <CardBody>
                {productCommandExportBill && (
                  <>
                    <ProductCommandExportDetailInfo productCommandExportBill={productCommandExportBill} />
                    <ProductCommandExportDetailTable productCommandExportDetails={productCommandExportBill.details} />
                  </>
                )}
              </CardBody>
              <CardFooter>
                <div className="d-flex justify-content-end pb-1">
                  <div>
                    <Button
                      color="primary"
                      onClick={() =>
                        navigate(
                          Page.PRODUCT_COMMAND_EXPORT_EDIT.PATH.replace(':id', String(productCommandExportBillId)),
                        )
                      }>
                      Sửa
                    </Button>
                    <Button color="secondary" onClick={() => navigate(Page.PRODUCT_COMMAND_EXPORT_LIST.PATH)}>
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

export default ProductCommandExportDetail;
