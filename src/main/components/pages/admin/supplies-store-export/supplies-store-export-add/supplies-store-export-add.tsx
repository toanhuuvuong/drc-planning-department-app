import { Formik } from 'formik';
import { useKhovtTransPhieuXuatControllerCreate } from 'main/apis/drc/endpoints/khovt-trans-phieu-xuat-controller/khovt-trans-phieu-xuat-controller';
import { KhovtTransPhieuXuatDetailWithRelations } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ValidationMessage } from 'main/constants';
import { ExportStatus } from 'main/constants/enums';
import { useAuth } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  resetSuppliesStoreExportAddState,
  selectSuppliesDetails,
} from 'main/redux/modules/supplies-store-export/supplies-store-export-add-slice';
import { DateUtil } from 'main/utils';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import SaveExportBillModal from './sub-components/save-export-bill-modal';
import SuppliesStoreExportAddInfo, { SuppliesStoreExportInfo } from './sub-components/supplies-store-export-add-info';
import SuppliesStoreExportAddTable from './sub-components/supplies-store-export-add-table/supplies-store-export-add-table';

const infoValidationSchema = Yup.object().shape({
  //soPhieu: Yup.string().required(ValidationMessage.REQUIRED),
  khoXuat: Yup.string().required(ValidationMessage.REQUIRED),
  khoNhap: Yup.string().required(ValidationMessage.REQUIRED),
  nguoiTaoPhieu: Yup.string().required(ValidationMessage.REQUIRED),
  ngayXuat: Yup.string().required(ValidationMessage.REQUIRED),
});

function SuppliesStoreExportAdd() {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const suppliesStoreExportDetails = useAppSelector(selectSuppliesDetails);
  const { currentUser } = useAuth();

  const [isOpenSaveModal, setOpenSaveModal] = useState(false);

  const isValidSuppliesDetails = useMemo(() => {
    for (const detail of suppliesStoreExportDetails) {
      const hasMaVt = detail.maVt?.trim() !== '';
      const hasSoLuongThucTe = detail.soLuongThucTe != null && detail.soLuongThucTe !== 0;

      if (hasMaVt && !hasSoLuongThucTe) {
        return false;
      }
    }
    return true;
  }, [suppliesStoreExportDetails]);

  // React Query
  const { isPending: createdSuppliesExportBillIsPending, mutateAsync: createdSuppliesExportBillMutateAsync } =
    useKhovtTransPhieuXuatControllerCreate();

  // React Effect
  useEffect(() => {
    dispatch(resetSuppliesStoreExportAddState());
  }, [dispatch]);

  const toggleSaveModal = useCallback(() => setOpenSaveModal((isOpenSaveModal) => !isOpenSaveModal), []);

  const filterValidSuppliesDetails = useCallback((details: typeof suppliesStoreExportDetails) => {
    return details.filter((detail) => {
      if (detail.maVt && detail.soLuongThucTe) {
        return true;
      }
      return false;
    });
  }, []);

  const handleSaveConfirmClick = useCallback(
    (info: SuppliesStoreExportInfo) => {
      // Close modal
      toggleSaveModal();

      const validDetails = filterValidSuppliesDetails(suppliesStoreExportDetails);

      // Create new bill
      createdSuppliesExportBillMutateAsync({
        data: {
          ...info,
          ngayXuat: DateUtil.toDateISOString(info.ngayXuat),
          details: normalizeSuppliesDetails(validDetails),
        },
      })
        .then((newSuppliesExportBill) => {
          navigate(Page.SUPPLIES_STORE_EXPORT_DETAIL.PATH.replace(':id', String(newSuppliesExportBill.id)));
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [
      createdSuppliesExportBillMutateAsync,
      navigate,
      suppliesStoreExportDetails,
      toggleSaveModal,
      filterValidSuppliesDetails,
    ],
  );

  const infoInitialValues: SuppliesStoreExportInfo = {
    ghiChu: '',
    khoNhap: '',
    ngayXuat: DateUtil.toDateISOString(moment()),
    khoXuat: '',
    lyDoXuat: 'Xuất cho sản xuất',
    nguoiTaoPhieu: currentUser.username?.toUpperCase(),
    //soPhieu: '',
    status: ExportStatus.Open.id,
    thongTinCanhBao: '',
  };

  return (
    <BasicTemplate
      pageCategory={Page.SUPPLIES_STORE_EXPORT_ADD.CATEGORY}
      pageTitle={Page.SUPPLIES_STORE_EXPORT_ADD.TITLE}
      pageName={Page.SUPPLIES_STORE_EXPORT_ADD.NAME}
      parentPage={{
        name: Page.SUPPLIES_STORE_EXPORT_LIST.NAME,
        path: Page.SUPPLIES_STORE_EXPORT_LIST.PATH,
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
                <form
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
                      <h3 className="mb-0 text-center">KHO VẬT TƯ - TẠO PHIẾU XUẤT</h3>
                    </CardHeader>
                    <CardBody>
                      <SuppliesStoreExportAddInfo formikProps={formikProps} />
                      <SuppliesStoreExportAddTable formikProps={formikProps} />
                      <SaveExportBillModal
                        isOpen={isOpenSaveModal}
                        toggle={toggleSaveModal}
                        handleConfirmClick={() => handleSaveConfirmClick(formikProps.values)} // Xác nhận trong modal sẽ submit form
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
                                !isValidSuppliesDetails ||
                                createdSuppliesExportBillIsPending
                              }>
                              Lưu
                            </Button>
                          </EditPermissionAction>
                          <Button color="secondary" onClick={() => navigate(Page.SUPPLIES_STORE_EXPORT_LIST.PATH)}>
                            Quay lại
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </form>
              )}
            </Formik>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export const normalizeSuppliesDetails = (suppliesDetails: KhovtTransPhieuXuatDetailWithRelations[]) => {
  const list: KhovtTransPhieuXuatDetailWithRelations[] = [];
  for (const suppliesDetail of suppliesDetails) {
    list.push({
      idNhap: suppliesDetail.idNhap,
      maLo: suppliesDetail.maLo,
      maVt: suppliesDetail.maVt,
      tenVt: suppliesDetail.tenVt,
      nguonGoc: suppliesDetail.nguonGoc,
      tonKho: suppliesDetail.tonKho,
      soLuongThucTe: Number(suppliesDetail.soLuongThucTe),
      soLuongYeuCau: Number(suppliesDetail.soLuongYeuCau),
      ngayXuat: DateUtil.toDateISOString(suppliesDetail.ngayXuat),
    });
  }
  return list;
};

export default SuppliesStoreExportAdd;
