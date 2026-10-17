import { useQldhTransDonHangControllerFindById } from 'main/apis/drc/endpoints/qldh-trans-don-hang-controller/qldh-trans-don-hang-controller';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import OrderManagementDetailInfo from './sub-components/order-management-detail-info';
import SuppliesStoreImportDetailTable from './sub-components/order-management-detail-table/order-management-detail-table';

function OrderManagementDetail() {
  // React Router
  const { id: orderManagementId } = useParams();
  const navigate = useNavigate();

  // React Query hooks
  const { data: orderManagementDetails, isLoading: suppliesImportBillIsLoading } =
    useQldhTransDonHangControllerFindById(Number(orderManagementId), {
      // filter: {
      //   include: [
      //     { relation: 'khachHang' },
      //     { relation: 'khoXuat' },
      //     {
      //       relation: 'donHangItems',
      //       scope: {
      //         include: [{ relation: 'sanPham' }],
      //       },
      //     },
      //   ],
      // },
    });

  return (
    <BasicTemplate
      pageCategory={Page.ORDER_MANAGEMENT_DETAIL.CATEGORY}
      pageTitle={Page.ORDER_MANAGEMENT_DETAIL.TITLE}
      pageName={Page.ORDER_MANAGEMENT_DETAIL.NAME}
      parentPage={{
        name: Page.ORDER_MANAGEMENT_LIST.NAME,
        path: Page.ORDER_MANAGEMENT_LIST.PATH,
      }}
      isLoading={suppliesImportBillIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0 text-center">ĐƠN HÀNG #{orderManagementDetails?.donHangId}</h3>
              </CardHeader>
              <CardBody>
                {orderManagementDetails && (
                  <>
                    <OrderManagementDetailInfo orderManagementDetails={orderManagementDetails} />
                    <SuppliesStoreImportDetailTable supplies={orderManagementDetails.donHangItems} />
                  </>
                )}
              </CardBody>
              <CardFooter>
                <div className="d-flex justify-content-end pb-1">
                  <EditPermissionAction>
                    <Button
                      color="primary"
                      onClick={() =>
                        navigate(Page.ORDER_MANAGEMENT_EDIT.PATH.replace(':id', String(orderManagementId)))
                      }>
                      Sửa
                    </Button>
                  </EditPermissionAction>
                  <Button color="secondary" onClick={() => navigate(Page.ORDER_MANAGEMENT_LIST.PATH)}>
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

export default OrderManagementDetail;
