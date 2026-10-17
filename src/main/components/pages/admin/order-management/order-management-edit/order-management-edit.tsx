import { Formik } from 'formik';
import {
  useQldhTransDonHangControllerFindById,
  useQldhTransDonHangControllerUpdateById,
  useQldhTransDonHangControllerUpdateTrangThaiDonHang,
} from 'main/apis/drc/endpoints/qldh-trans-don-hang-controller/qldh-trans-don-hang-controller';
import { QldhTransDonHangExcludingDonHangIdTrangThaiWithRelations } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ToastMessage, ValidationMessage } from 'main/constants';
import useProductExportCustomerUnitOptions from 'main/hooks/useProductExportCustomerUnitOptions';
import useProductOrderManagementOptions from 'main/hooks/useProductOrderManagementOptions';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  loadOrderManagementData,
  QldhTransDonHangItemExcludingIdWithRelationsIds,
  selectOrderManagementInfo,
  selectOrdersDetails,
} from 'main/redux/modules/order-management/order-management-edit-slice';
import { DateUtil } from 'main/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Form, Row } from 'reactstrap';
import * as Yup from 'yup';
import OrderManagementEditInfo from './sub-components/order-management-edit-info';
import OrderManagementEditTable from './sub-components/order-management-table/order-management-edit-table';
import SaveConfirmModal from './sub-components/save-confirm-modal';

function OrderManagementEdit() {
  // React Router
  const navigate = useNavigate();

  const { id: orderManagementId } = useParams();
  const dispatch = useAppDispatch();
  const ordersDetails = useAppSelector(selectOrdersDetails);
  const orderManagementInfo = useAppSelector(selectOrderManagementInfo);
  const orderManagementInfoDetails = useAppSelector(selectOrdersDetails);

  const { mutateAsync: updatedStatusOrderManagementMutateAsync } =
    useQldhTransDonHangControllerUpdateTrangThaiDonHang();

  const { productExportCustomersUnitOptions, productExportCustomer } = useProductExportCustomerUnitOptions(false);
  // const { productDataOptions: xuatKhoOptions } = useproductDataOptions(true);
  const { productDataOptions, IsLoadingProductData } = useProductOrderManagementOptions(false);

  const { data: orderManagementDetails, isLoading: orderManagementLoading } = useQldhTransDonHangControllerFindById(
    Number(orderManagementId),
  );
  const { isPending: updatedOrderManagementPending, mutateAsync: updatedOrderManagementMutateAsync } =
    useQldhTransDonHangControllerUpdateById();

  const [isOpenSaveModal, setOpenSaveModal] = useState(false);
  const toggleSaveModal = useCallback(() => setOpenSaveModal((isOpenSaveModal) => !isOpenSaveModal), []);

  const isValidSuppliesDetails = useMemo(() => {
    if (!ordersDetails || ordersDetails.length === 0) {
      return false;
    }

    for (const detail of ordersDetails) {
      const hasMaSanPham = detail.maSanPham?.trim() !== '';
      const validSoLuong = detail.soLuong && detail.soLuong > 0;

      if (
        hasMaSanPham &&
        !validSoLuong
        /*|| !orderCellQuantityValidator(detail.soLuong, detail.soLuongGiuHang, detail.tonKho)().valid*/
      ) {
        return false;
      }
    }
    return true;
  }, [ordersDetails]);

  // React function

  const handleSaveConfirmClick = useCallback(
    (info: QldhTransDonHangExcludingDonHangIdTrangThaiWithRelations) => {
      toggleSaveModal();

      updatedOrderManagementMutateAsync({
        id: Number(orderManagementId),
        data: {
          id: info.id,
          maKH: info.maKH,
          ngayDatHang: String(DateUtil.toDateISOString(info.ngayDatHang)),
          ngayGiaoDuKien: info.ngayGiaoDuKien,
          ngayGiaoThucTe: info.ngayGiaoThucTe,
          nguoiTao: info.nguoiTao,
          nguoiYeuCau: info.nguoiYeuCau,
          ghiChu: info.ghiChu,
          donHangItems: normalizeOrderManagementDetails(orderManagementInfoDetails),
        },
      })
        .then(() => {
          toast.success(ToastMessage.UPDATE_SUCCESS);
          navigate(Page.ORDER_MANAGEMENT_LIST.PATH);
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [navigate, orderManagementId, orderManagementInfoDetails, toggleSaveModal, updatedOrderManagementMutateAsync],
  );

  // click Pause And Resume Order
  const handlePauseAndResumeOrder = useCallback(
    async (status: string) => {
      await updatedStatusOrderManagementMutateAsync({
        id: Number(orderManagementId),
        data: {
          trangThai: status,
        },
      });
    },
    [orderManagementId, updatedStatusOrderManagementMutateAsync],
  );

  useEffect(() => {
    if (productDataOptions && productDataOptions.length > 0 && !orderManagementLoading && orderManagementDetails) {
      dispatch(loadOrderManagementData(orderManagementDetails));
    }
  }, [orderManagementLoading, orderManagementDetails, dispatch, productDataOptions, IsLoadingProductData]);

  const infoValidationSchema = Yup.object().shape({
    maKH: Yup.string().required(ValidationMessage.REQUIRED),
    ngayDatHang: Yup.string().required(ValidationMessage.REQUIRED),
    nguoiTao: Yup.string().required(ValidationMessage.REQUIRED),
    nguoiYeuCau: Yup.string().required(ValidationMessage.REQUIRED),
    maKhoXuat: Yup.string().required(ValidationMessage.REQUIRED),
    trangThai: Yup.string().required(ValidationMessage.REQUIRED),
  });

  return (
    <BasicTemplate
      pageCategory={Page.ORDER_MANAGEMENT_EDIT.CATEGORY}
      pageTitle={Page.ORDER_MANAGEMENT_EDIT.TITLE}
      pageName={Page.ORDER_MANAGEMENT_EDIT.NAME}
      parentPage={{
        name: Page.ORDER_MANAGEMENT_LIST.NAME,
        path: Page.ORDER_MANAGEMENT_LIST.PATH,
      }}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Formik
              initialValues={orderManagementInfo}
              enableReinitialize={true}
              validationSchema={orderManagementLoading && infoValidationSchema}
              onSubmit={toggleSaveModal}>
              {(formikProps) => (
                <Form
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (formikProps.isValid && isValidSuppliesDetails) {
                        toggleSaveModal();
                      } else {
                        toast.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
                      }
                    }
                  }}>
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0 text-center">CẬP NHẬT ĐƠN HÀNG #{orderManagementDetails?.donHangId}</h3>
                    </CardHeader>
                    <CardBody>
                      {!orderManagementLoading && orderManagementDetails && (
                        <OrderManagementEditInfo
                          formikProps={formikProps}
                          productExportCustomersUnitOptions={productExportCustomersUnitOptions}
                          productExportCustomer={productExportCustomer}
                          handlePauseAndResumeOrder={handlePauseAndResumeOrder}
                        />
                      )}
                      <OrderManagementEditTable
                        productDataOptions={productDataOptions}
                        IsLoadingProductData={IsLoadingProductData}
                        orderManagementInfoDetails={orderManagementInfoDetails}
                      />

                      <SaveConfirmModal
                        isOpen={isOpenSaveModal}
                        toggle={toggleSaveModal}
                        handleConfirmClick={() => handleSaveConfirmClick(formikProps.values)}
                      />
                    </CardBody>
                    <CardFooter>
                      <div className="d-flex justify-content-end pb-1">
                        <div>
                          <EditPermissionAction>
                            <Button
                              type="button"
                              color="primary"
                              onClick={toggleSaveModal}
                              disabled={
                                (orderManagementInfo &&
                                  Object.keys(orderManagementInfo).length === 0 &&
                                  !formikProps.dirty) ||
                                !formikProps.isValid ||
                                !isValidSuppliesDetails ||
                                updatedOrderManagementPending
                              }>
                              Lưu
                            </Button>
                          </EditPermissionAction>
                          <Button color="secondary" onClick={() => navigate(Page.ORDER_MANAGEMENT_LIST.PATH)}>
                            Quay lại
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Form>
              )}
            </Formik>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export const normalizeOrderManagementDetails = (ordersDetails: QldhTransDonHangItemExcludingIdWithRelationsIds[]) => {
  const list: QldhTransDonHangItemExcludingIdWithRelationsIds[] = [];
  for (const orderManagementDetail of ordersDetails) {
    list.push({
      ghiChu: orderManagementDetail.ghiChu,
      id: Number(orderManagementDetail.id),
      maSanPham: orderManagementDetail.maSanPham,
      maKhoXuat: (orderManagementDetail as any).maKho || orderManagementDetail.maKhoXuat,
      soLuong: Number(orderManagementDetail.soLuong),
      yeuCauDongGoi: orderManagementDetail.yeuCauDongGoi,
      soLuongGiuHang: Number(orderManagementDetail.soLuongGiuHang ?? 0),
    });
  }
  return list;
};

export default OrderManagementEdit;
