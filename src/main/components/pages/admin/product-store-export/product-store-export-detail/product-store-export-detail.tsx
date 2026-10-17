import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import ProductStoreExportDetailInfo from './sub-components/product-store-export-detail-info';
import ProductStoreExportDetailTable from './sub-components/product-store-export-detail-table/product-store-export-detail-table';
import { useProductStoreExportDetail } from './use-product-store-export-detail';
import CancelExportBillModal from '../product-store-export-list/sub-components/cancel-export-bill-modal';

function ProductStoreExportDetail() {
  const {
    navigate,
    productExportBillId,
    productExportBill,
    productExportBillIsLoading,
    updatedProductExportBillIsPending,
    isOpenCancelModal,
    // handleProductTableChange,
    toggleCancelModal,
    handleCancelModalConfirmClick,
  } = useProductStoreExportDetail();

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_EXPORT_DETAIL.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_EXPORT_DETAIL.TITLE}
      pageName={Page.PRODUCT_STORE_EXPORT_DETAIL.NAME}
      isLoading={productExportBillIsLoading || updatedProductExportBillIsPending}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0 text-center">KHO SẢN PHẨM - PHIẾU XUẤT</h3>
              </CardHeader>
              <CardBody>
                {productExportBill && (
                  <>
                    <ProductStoreExportDetailInfo productExportBill={productExportBill} />
                    {productExportBill?.details && (
                      <ProductStoreExportDetailTable productList={productExportBill.details} />
                    )}

                    <CancelExportBillModal
                      productExportBillId={productExportBillId}
                      isOpen={isOpenCancelModal}
                      toggle={toggleCancelModal}
                      handleConfirmClick={handleCancelModalConfirmClick}
                    />
                  </>
                )}
              </CardBody>
              <CardFooter>
                <div className="d-flex justify-content-end px-4 pb-1">
                  <Button className="btn-secondary" onClick={() => navigate(Page.PRODUCT_STORE_EXPORT_LIST.PATH)}>
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

export default ProductStoreExportDetail;
