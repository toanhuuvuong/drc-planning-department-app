import { Formik } from 'formik';
import {
  useKhovtTransPhieuNhapControllerFindById,
  useKhovtTransPhieuNhapControllerUpdateById,
} from 'main/apis/drc/endpoints/khovt-trans-phieu-nhap-controller/khovt-trans-phieu-nhap-controller';
import { KhovtTransPhieunhapDetailWithRelations } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ValidationMessage } from 'main/constants';
import { ImportStatus } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  loadSuppliesImportBill,
  resetSuppliesStoreImportEditState,
  selectSuppliesStoreImportDetails,
  selectSuppliesStoreImportInfo,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-edit-slice';
import { DateUtil } from 'main/utils';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import SaveImportBillModal from './sub-components/save-import-bill-modal';
import SuppliesStoreImportEditInfo from './sub-components/supplies-store-import-edit-info';
import SuppliesStoreImportEditTable from './sub-components/supplies-store-import-edit-table/supplies-store-import-edit-table';
import { SuppliesStoreImportInfo } from '../supplies-store-import-add/sub-components/supplies-store-import-add-info';

const infoValidationSchema = Yup.object().shape({
  typeNhap: Yup.string().required(ValidationMessage.REQUIRED),
  maKho: Yup.string().required(ValidationMessage.REQUIRED),
  donViNhap: Yup.string().required(ValidationMessage.REQUIRED),
  nguoiNhap: Yup.string().required(ValidationMessage.REQUIRED),
  viTriLuuKho: Yup.string().required(ValidationMessage.REQUIRED),
  ngayNhap: Yup.string().required(ValidationMessage.REQUIRED),
  // soHoaDon: Yup.string().required(ValidationMessage.REQUIRED),
});

function SuppliesStoreImportEdit() {
  // React Router
  const { id: suppliesImportBillId } = useParams();
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const suppliesStoreImportInfo = useAppSelector(selectSuppliesStoreImportInfo);
  const suppliesStoreImportDetails = useAppSelector(selectSuppliesStoreImportDetails);

  // React State
  const [isOpenSaveModal, setOpenSaveModal] = useState(false);
  const isValidSuppliesDetails = useMemo(() => {
    if (!suppliesStoreImportDetails || suppliesStoreImportDetails.length === 0) {
      return false;
    }
    for (const suppliesStoreImportDetail of suppliesStoreImportDetails) {
      if (!suppliesStoreImportDetail.soLuong || suppliesStoreImportDetail.soLuong < 1) {
        return false;
      }
    }
    return true;
  }, [suppliesStoreImportDetails]);

  // React Query
  const { data: suppliesImportBill, isLoading: suppliesImportBillIsLoading } = useKhovtTransPhieuNhapControllerFindById(
    Number(suppliesImportBillId),
    {
      query: {
        enabled: !!suppliesImportBillId,
      },
    },
  );

  const { isPending: updatedSuppliesImportBillIsPending, mutateAsync: updatedSuppliesImportBillMutateAsync } =
    useKhovtTransPhieuNhapControllerUpdateById();

  // React Effect
  useEffect(() => {
    dispatch(resetSuppliesStoreImportEditState());
  }, [dispatch]);

  useEffect(() => {
    if (!suppliesImportBillIsLoading && suppliesImportBill) {
      dispatch(loadSuppliesImportBill(suppliesImportBill));
    }
  }, [suppliesImportBillIsLoading, suppliesImportBill, dispatch]);

  // React function
  const toggleSaveModal = () => setOpenSaveModal(!isOpenSaveModal);

  const handleSaveConfirmClick = async (info: SuppliesStoreImportInfo) => {
    // Close modal
    toggleSaveModal();

    const details = normalizeSuppliesDetails(suppliesStoreImportDetails, info);
    const data = {
      ...info,
      ngayNhap: DateUtil.toDateISOString(info.ngayNhap),
      ngayHoaDon: DateUtil.toDateISOString(info.ngayHoaDon),
      details: details,
    };

    updatedSuppliesImportBillMutateAsync({
      id: Number(suppliesImportBillId),
      data: data,
    })
      .then((updatedSuppliesImportBill) => {
        navigate(Page.SUPPLIES_STORE_IMPORT_DETAIL.PATH.replace(':id', String(updatedSuppliesImportBill.id)));
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  };

  return (
    <BasicTemplate
      pageCategory={Page.SUPPLIES_STORE_IMPORT_EDIT.CATEGORY}
      pageTitle={Page.SUPPLIES_STORE_IMPORT_EDIT.TITLE}
      pageName={Page.SUPPLIES_STORE_IMPORT_EDIT.NAME}
      parentPage={{
        name: Page.SUPPLIES_STORE_IMPORT_LIST.NAME,
        path: Page.SUPPLIES_STORE_IMPORT_LIST.PATH,
      }}
      isLoading={suppliesImportBillIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            {suppliesImportBill && (
              <Formik
                initialValues={suppliesStoreImportInfo}
                enableReinitialize
                validationSchema={infoValidationSchema}
                onSubmit={() => {
                  // do nothing
                }}>
                {(formikProps) => (
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0 text-center">KHO VẬT TƯ - SỬA PHIẾU NHẬP #{suppliesImportBillId}</h3>
                    </CardHeader>
                    <CardBody>
                      <SuppliesStoreImportEditInfo formikProps={formikProps} />
                      <SuppliesStoreImportEditTable />
                      <SaveImportBillModal
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
                              color="primary"
                              onClick={toggleSaveModal}
                              disabled={
                                !formikProps.isValid || !isValidSuppliesDetails || updatedSuppliesImportBillIsPending
                              }>
                              Lưu
                            </Button>
                          </EditPermissionAction>
                          <Button color="secondary" onClick={() => navigate(Page.SUPPLIES_STORE_IMPORT_LIST.PATH)}>
                            Quay lại
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                )}
              </Formik>
            )}
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export const normalizeSuppliesDetails = (
  suppliesDetails: KhovtTransPhieunhapDetailWithRelations[],
  suppliesStoreImportInfo: SuppliesStoreImportInfo,
) => {
  const list: KhovtTransPhieunhapDetailWithRelations[] = [];
  for (const suppliesDetail of suppliesDetails) {
    const normalizedDetail: KhovtTransPhieunhapDetailWithRelations = {
      ngaySx: DateUtil.toDateISOString(suppliesDetail.ngaySx),
      ngayHetHan: DateUtil.toDateISOString(suppliesDetail.ngayHetHan),
      // ngayThiNghiem: DateUtil.toDateISOString(suppliesDetail.ngayThiNghiem, !isEdit),
      ngayHetHanLK: DateUtil.toDateISOString(suppliesDetail.ngayHetHanLK, false),
      ngayNhap: DateUtil.toDateISOString(suppliesStoreImportInfo.ngayNhap),
      soLuong: Number(suppliesDetail.soLuong),
      status: ImportStatus.Wait.id,
      dvt: suppliesDetail.dvt,
      ghiChu: suppliesDetail.ghiChu,
      ghiChu2: suppliesDetail.ghiChu2,
      ghiChu3: suppliesDetail.ghiChu3,
      maVt: suppliesDetail.maVt,
      tenVt: suppliesDetail.tenVt,
      id: suppliesDetail.id,
      soLo: suppliesDetail.soLo,
    };

    list.push(normalizedDetail);
  }
  return list;
};

export default SuppliesStoreImportEdit;
