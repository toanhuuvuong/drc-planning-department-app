import {
  useKhotpTransLenhNhapControllerCreateImportBill,
  useKhotpTransLenhNhapControllerFindById,
} from 'main/apis/drc/endpoints/khotp-trans-lenh-nhap-controller/khotp-trans-lenh-nhap-controller';
import { TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { ProductExcelStatus } from 'main/constants/enums';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import CreateProductStoreImportModal from './sub-components/create-product-store-import-modal';
import ProductStoreExcelDetailInfo from './sub-components/product-store-excel-detail-info';
import ProductStoreExcelDetailTable from './sub-components/product-store-excel-detail-table/product-store-excel-detail-table';

function ProductStoreExcelDetail() {
  // React Router
  const { id: productStoreExcelId } = useParams();
  const navigate = useNavigate();

  // React State
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);

  // React Query
  const { data: productStoreExcel, isLoading: productStoreExcelIsLoading } = useKhotpTransLenhNhapControllerFindById(
    Number(productStoreExcelId),
    undefined,
    {
      query: {
        enabled: !!productStoreExcelId,
      },
    },
  );

  const { isPending: createdImportBillIsPending, mutateAsync: createdImportBillMutateAsync } =
    useKhotpTransLenhNhapControllerCreateImportBill();

  // React function
  const toggleCreateModal = () => setOpenCreateModal(!isOpenCreateModal);

  const handleCreateConfirmClick = async () => {
    // Close modal
    toggleCreateModal();

    // Create new bill
    createdImportBillMutateAsync({ id: Number(productStoreExcelId) })
      .then((_) => {
        window.location.reload();
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  };

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_EXCEL_DETAIL.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_EXCEL_DETAIL.TITLE}
      pageName={Page.PRODUCT_STORE_EXCEL_DETAIL.NAME}
      parentPage={{
        name: Page.PRODUCT_STORE_EXCEL_LIST.NAME,
        path: Page.PRODUCT_STORE_EXCEL_LIST.PATH,
      }}
      isLoading={productStoreExcelIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0 text-center">CHI TIẾT LỆNH NHẬP #{productStoreExcelId}</h3>
              </CardHeader>
              <CardBody>
                {productStoreExcel && (
                  <>
                    <ProductStoreExcelDetailInfo productStoreExcel={productStoreExcel} />
                    <ProductStoreExcelDetailTable productStoreExcelDetails={productStoreExcel.details} />
                    <CreateProductStoreImportModal
                      isOpen={isOpenCreateModal}
                      toggle={toggleCreateModal}
                      handleConfirmClick={() => handleCreateConfirmClick()}
                    />
                    {createdImportBillIsPending && <TransparentSpinner />}
                  </>
                )}
              </CardBody>
              <CardFooter>
                <div className="d-flex justify-content-end pb-1">
                  <div>
                    <EditPermissionAction>
                      <Button
                        color="primary"
                        onClick={toggleCreateModal}
                        disabled={productStoreExcel && productStoreExcel.status === ProductExcelStatus.complete.id}>
                        Tạo phiếu nhập
                      </Button>
                      <Button
                        color="primary"
                        onClick={() =>
                          navigate(Page.PRODUCT_STORE_EXCEL_EDIT.PATH.replace(':id', String(productStoreExcelId)))
                        }
                        disabled={productStoreExcel && productStoreExcel.status === ProductExcelStatus.complete.id}>
                        Sửa
                      </Button>
                    </EditPermissionAction>
                    <Button color="secondary" onClick={() => navigate(Page.PRODUCT_STORE_EXCEL_LIST.PATH)}>
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

export default ProductStoreExcelDetail;
