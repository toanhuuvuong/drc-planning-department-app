import { Formik } from 'formik';
import { useQldhTransDonHangControllerCreate } from 'main/apis/drc/endpoints/qldh-trans-don-hang-controller/qldh-trans-don-hang-controller';
import { NewQldhTransDonHang, QldhTransDonHangItemWithRelations } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ValidationMessage } from 'main/constants';
import { useAuth } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  QldhTransDonHangItemExcludingIdWithRelationsIds,
  resetSuppliesStoreImportAddState,
  selectOrdersDetails,
} from 'main/redux/modules/order-management/order-management-add-slice';
import { DateUtil } from 'main/utils';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import OrderManagementAddInfo from './sub-components/order-management-add-info';
import OrderManagementAddTable from './sub-components/order-management-table/order-management-add-table';
import SaveConfirmModal from './sub-components/save-confirm-modal';

const infoValidationSchema = Yup.object().shape({
  maKH: Yup.string().required(ValidationMessage.REQUIRED),
  ngayDatHang: Yup.string().required(ValidationMessage.REQUIRED),
  nguoiTao: Yup.string().required(ValidationMessage.REQUIRED),
  nguoiYeuCau: Yup.string().required(ValidationMessage.REQUIRED),
  ngayGiaoDuKien: Yup.string().required(ValidationMessage.REQUIRED),
  ngayGiaoThucTe: Yup.string().required(ValidationMessage.REQUIRED),
  khuVucKh: Yup.string().required(ValidationMessage.REQUIRED),
});

function OrderManagementAdd() {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const ordersDetails = useAppSelector(selectOrdersDetails);
  const { currentUser } = useAuth();

  const infoInitialValues: NewQldhTransDonHang = {
    ghiChu: '',
    maKH: '',
    nguoiTao: currentUser.username?.toUpperCase() ?? '',
    nguoiYeuCau: currentUser.username?.toUpperCase() ?? '',
    ngayGiaoDuKien: '',
    ngayGiaoThucTe: '',
    ngayDatHang: DateUtil.toDateISOString(moment()) ?? '',
  };

  // React State
  const [isOpenSaveModal, setOpenSaveModal] = useState(false);

  const isValidOrderDetails = useMemo(() => {
    if (!ordersDetails || ordersDetails.length === 0) {
      return true;
    }
    return ordersDetails?.some(
      (detail: any) => detail.maSanPham !== '' && detail.soLuong > 0,
      // && orderCellQuantityValidator(detail.soLuong, detail.soLuongGiuHang, detail.tonKho)().valid,
    );
  }, [ordersDetails]);

  // React Query
  const { isPending: createdSuppliesImportBillIsPending, mutateAsync: createdOrdersManagementMutateAsync } =
    useQldhTransDonHangControllerCreate();

  // React Effect
  useEffect(() => {
    dispatch(resetSuppliesStoreImportAddState());
  }, [dispatch]);

  // React function
  const toggleSaveModal = useCallback(() => setOpenSaveModal((isOpenSaveModal) => !isOpenSaveModal), []);

  const filterValidOrdersDetails = useCallback((details: QldhTransDonHangItemWithRelations[]) => {
    return details.filter((detail) => {
      if (detail.maSanPham && detail.soLuong) {
        return true;
      }
      return false;
    });
  }, []);

  const handleSaveConfirmClick = useCallback(
    (donHangInfo: NewQldhTransDonHang) => {
      // Close modal
      toggleSaveModal();
      const ordersDetailsRemovedId = ordersDetails.map((obj) => {
        const { id, ...rest } = obj;
        return rest;
      });

      const validDetails = filterValidOrdersDetails(ordersDetailsRemovedId);

      // Create new bill
      createdOrdersManagementMutateAsync({
        data: {
          maKH: donHangInfo.maKH,
          ngayDatHang: String(DateUtil.toDateISOString(donHangInfo.ngayDatHang)),
          nguoiTao: donHangInfo.nguoiTao,
          nguoiYeuCau: donHangInfo.nguoiYeuCau,
          ngayGiaoDuKien: donHangInfo.ngayGiaoDuKien,
          ngayGiaoThucTe: donHangInfo.ngayGiaoThucTe,
          ghiChu: donHangInfo.ghiChu,
          donHangItems: normalizeOrderManagementDetails(validDetails),
        },
      })
        .then((newSuppliesImportBill) => {
          navigate(Page.ORDER_MANAGEMENT_DETAIL.PATH.replace(':id', String(newSuppliesImportBill.id)));
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [createdOrdersManagementMutateAsync, filterValidOrdersDetails, navigate, ordersDetails, toggleSaveModal],
  );

  return (
    <BasicTemplate
      pageCategory={Page.ORDER_MANAGEMENT_ADD.CATEGORY}
      pageTitle={Page.ORDER_MANAGEMENT_ADD.TITLE}
      pageName={Page.ORDER_MANAGEMENT_ADD.NAME}
      parentPage={{
        name: Page.ORDER_MANAGEMENT_LIST.NAME,
        path: Page.ORDER_MANAGEMENT_LIST.PATH,
      }}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Formik
              initialValues={infoInitialValues}
              enableReinitialize={true} // Cần để lấy thông tin User từ API
              validationSchema={infoValidationSchema}
              onSubmit={toggleSaveModal}>
              {(formikProps) => (
                <Form
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (formikProps.isValid && isValidOrderDetails) {
                        toggleSaveModal();
                      } else {
                        toast.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
                      }
                    }
                  }}>
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0 text-center">TẠO ĐƠN HÀNG</h3>
                    </CardHeader>
                    <CardBody>
                      <OrderManagementAddInfo formikProps={formikProps as any} />
                      <OrderManagementAddTable formikProps={formikProps as any} />
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
                                !formikProps.dirty ||
                                !formikProps.isValid ||
                                !isValidOrderDetails ||
                                createdSuppliesImportBillIsPending
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
  const list: QldhTransDonHangItemWithRelations[] = [];
  for (const orderManagementDetail of ordersDetails) {
    list.push({
      soLuong: Number(orderManagementDetail.soLuong) || 0,
      sanPham: orderManagementDetail.sanPham,
      maSanPham: orderManagementDetail.maSanPham,
      maKhoXuat: orderManagementDetail.maKho,
      yeuCauDongGoi: orderManagementDetail.yeuCauDongGoi,
      ghiChu: orderManagementDetail.ghiChu,
      soLuongGiuHang: Number(orderManagementDetail.soLuongGiuHang) || 0,
    });
  }
  return list;
};

export default OrderManagementAdd;
