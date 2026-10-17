import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { Card, CardBody, CardHeader, Container, Label, Row } from 'reactstrap';
import CancelExportBillModal from './sub-components/cancel-export-bill-modal';
import ProductStoreExportFilter from './sub-components/product-store-export-filter';
import ProductStoreExportTable from './sub-components/product-store-export-table/product-store-export-table';
import useHandleProductStoreExportList from './use-product-store-export-list';

const ProductStoreExportList = () => {
  const {
    deletedProductExportBillIsPending,
    filter,
    handleCancelBillPopup,
    handleCancelModalConfirmClick,
    handleDateChange,
    handleSearchClick,
    handleTableChange,
    isOpenCancelModal,
    productExportBillId,
    productExportBills,
    productExportBillsCount,
    productExportBillsIsLoading,
    table,
    toggleCancelModal,
  } = useHandleProductStoreExportList();
  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_EXPORT_LIST.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_EXPORT_LIST.TITLE}
      pageName={Page.PRODUCT_STORE_EXPORT_LIST.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <ProductStoreExportFilter
              filter={filter}
              handleSearchClick={handleSearchClick}
              handleDateChange={handleDateChange}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ProductStoreExportTable
              data={productExportBills}
              dataIsLoading={productExportBillsIsLoading}
              deletedLoading={deletedProductExportBillIsPending}
              dataCount={productExportBillsCount}
              tableState={table}
              handleTableStateChange={handleTableChange}
              toggleCancelModal={toggleCancelModal}
            />
          </CardBody>
        </Card>
      </Container>
      <CancelExportBillModal
        productExportBillId={productExportBillId}
        isOpen={isOpenCancelModal}
        toggle={handleCancelBillPopup}
        handleConfirmClick={handleCancelModalConfirmClick}
      />
    </BasicTemplate>
  );
};

export default ProductStoreExportList;
