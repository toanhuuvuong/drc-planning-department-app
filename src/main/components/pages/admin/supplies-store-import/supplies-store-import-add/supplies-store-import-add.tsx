import { Formik } from 'formik';
import { useKhovtTransPhieuNhapControllerCreate } from 'main/apis/drc/endpoints/khovt-trans-phieu-nhap-controller/khovt-trans-phieu-nhap-controller';
import { KhovtTransPhieunhapDetailWithRelations } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ValidationMessage } from 'main/constants';
import { ImportStatus, ImportType } from 'main/constants/enums';
import { useAuth } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  resetSuppliesStoreImportAddState,
  // selectNextMaSoLo,
  selectSuppliesDetails,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-add-slice';
import { DateUtil } from 'main/utils';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import SaveImportBillModal from './sub-components/save-import-bill-modal';
import SuppliesStoreImportAddInfo, { SuppliesStoreImportInfo } from './sub-components/supplies-store-import-add-info';
import SuppliesStoreImportAddTable from './sub-components/supplies-store-import-add-table/supplies-store-import-add-table';

const infoValidationSchema = Yup.object().shape({
  typeNhap: Yup.string().required(ValidationMessage.REQUIRED),
  maKho: Yup.string().required(ValidationMessage.REQUIRED),
  donViNhap: Yup.string().required(ValidationMessage.REQUIRED),
  nguoiNhap: Yup.string().required(ValidationMessage.REQUIRED),
  viTriLuuKho: Yup.string().required(ValidationMessage.REQUIRED),
  ngayNhap: Yup.string().required(ValidationMessage.REQUIRED),
  // soHoaDon: Yup.string().required(ValidationMessage.REQUIRED),
});

function SuppliesStoreImportAdd() {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const suppliesDetails = useAppSelector(selectSuppliesDetails);
  // const nextMaSoLo = useAppSelector(selectNextMaSoLo);  // KAN-376: V/v Loại bỏ đánh mã số lô tự động kho vật tư
  const { currentUser } = useAuth();

  // React State
  const [isOpenSaveModal, setOpenSaveModal] = useState(false);
  //const [isOpenSaveCompleteModal, setOpenSaveCompleteModal] = useState(false);
  //const [isOpenViewPdfKH22BillModal, setOpenViewPdfKH22BillModal] = useState(false);
  //const [newSuppliesImportBill, setNewSuppliesImportBill] = useState<KhovtTransPhieuNhapWithRelations>();
  const isValidSuppliesDetails = useMemo(() => {
    if (!suppliesDetails || suppliesDetails.length === 0) {
      return false;
    }

    for (const detail of suppliesDetails) {
      const hasMaVt = detail.maVt?.trim() !== '';
      const hasSoLuongThucTe = detail.soLuong != null && detail.soLuong !== 0;

      if (hasMaVt && !hasSoLuongThucTe) {
        return false;
      }
    }
    return true;

    // for (const suppliesDetail of suppliesDetails) {
    //   if (
    //     !suppliesDetail.maVt ||
    //     // !suppliesDetail.ngaySx ||
    //     // !suppliesDetail.ngayHetHan ||
    //     !suppliesDetail.soLuong ||
    //     suppliesDetail.soLuong < 1
    //   ) {
    //     return false;
    //   }
    // }
    // return true;
  }, [suppliesDetails]);

  // React Query
  const { isPending: createdSuppliesImportBillIsPending, mutateAsync: createdSuppliesImportBillMutateAsync } =
    useKhovtTransPhieuNhapControllerCreate();

  // React Effect
  useEffect(() => {
    dispatch(resetSuppliesStoreImportAddState());
  }, [dispatch]);

  // React function
  const toggleSaveModal = useCallback(() => setOpenSaveModal((isOpenSaveModal) => !isOpenSaveModal), []);

  /*
  const toggleSaveCompleteModal = useCallback(
    () => setOpenSaveCompleteModal((isOpenSaveCompleteModal) => !isOpenSaveCompleteModal),
    [],
  );

  const toggleViewPdfKH22BillModal = useCallback(
    () => setOpenViewPdfKH22BillModal((isOpenViewPdfKH22BillModal) => !isOpenViewPdfKH22BillModal),
    [],
  );
  */

  const filterValidSuppliesDetails = useCallback((details: KhovtTransPhieunhapDetailWithRelations[]) => {
    return details.filter((detail) => {
      if (detail.maVt && detail.soLuong) {
        return true;
      }
      return false;
    });
  }, []);

  const handleSaveConfirmClick = useCallback(
    (suppliesStoreImportInfo: SuppliesStoreImportInfo) => {
      // Close modal
      toggleSaveModal();
      const suppliesDetailsRemovedId = suppliesDetails.map((obj) => {
        const { id, ...rest } = obj;
        return rest;
      });

      const validDetails = filterValidSuppliesDetails(suppliesDetailsRemovedId);

      // Create new bill
      createdSuppliesImportBillMutateAsync({
        data: {
          ...suppliesStoreImportInfo,
          ngayNhap: DateUtil.toDateISOString(suppliesStoreImportInfo.ngayNhap),
          ngayHoaDon: DateUtil.toDateISOString(suppliesStoreImportInfo.ngayHoaDon),
          details: normalizeSuppliesDetails(validDetails, suppliesStoreImportInfo),
        },
      })
        .then((newSuppliesImportBill) => {
          navigate(Page.SUPPLIES_STORE_IMPORT_DETAIL.PATH.replace(':id', String(newSuppliesImportBill.id)));

          /*
          setNewSuppliesImportBill(newSuppliesImportBill);

          // Open save complete model
          toggleSaveCompleteModal();
          */
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [createdSuppliesImportBillMutateAsync, filterValidSuppliesDetails, navigate, suppliesDetails, toggleSaveModal],
  );

  /*
  const handleSaveCompleteViewKH22BillClick = useCallback(() => {
    // Open KH22 modal
    toggleViewPdfKH22BillModal();
  }, [toggleViewPdfKH22BillModal]);

  const handleSaveCompleteEditBillClick = useCallback(() => {
    // Close modal
    toggleSaveCompleteModal();

    // Redirect to Edit
    navigate(Page.SUPPLIES_STORE_IMPORT_EDIT.PATH.replace(':id', String(newSuppliesImportBill?.id)));
  }, [navigate, newSuppliesImportBill, toggleSaveCompleteModal]);
  */

  const infoInitialValues: SuppliesStoreImportInfo = {
    typeNhap: ImportType.EXTERNAL,
    maKho: '',
    donViNhap: '',
    nguoiNhap: currentUser.username?.toUpperCase(),
    //soPhieuNhap: '',
    xeVanChuyen: '',
    soHoaDon: '',
    viTriLuuKho: '',
    ngayNhap: DateUtil.toDateISOString(moment()),
  };

  return (
    <BasicTemplate
      pageCategory={Page.SUPPLIES_STORE_IMPORT_ADD.CATEGORY}
      pageTitle={Page.SUPPLIES_STORE_IMPORT_ADD.TITLE}
      pageName={Page.SUPPLIES_STORE_IMPORT_ADD.NAME}
      parentPage={{
        name: Page.SUPPLIES_STORE_IMPORT_LIST.NAME,
        path: Page.SUPPLIES_STORE_IMPORT_LIST.PATH,
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
                <div
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
                      <h3 className="mb-0 text-center">KHO VẬT TƯ - TẠO PHIẾU NHẬP</h3>
                    </CardHeader>
                    <CardBody>
                      <SuppliesStoreImportAddInfo formikProps={formikProps} />
                      <SuppliesStoreImportAddTable />
                      <SaveImportBillModal
                        isOpen={isOpenSaveModal}
                        toggle={toggleSaveModal}
                        handleConfirmClick={() => handleSaveConfirmClick(formikProps.values)}
                      />
                      {/*
                    <SaveCompleteImportBillModal
                      isOpen={isOpenSaveCompleteModal}
                      toggle={toggleSaveCompleteModal}
                      handleViewKH22BillClick={handleSaveCompleteViewKH22BillClick}
                      handleEditBillClick={handleSaveCompleteEditBillClick}
                    />
                    <ViewPdfKH22ImportBillModal
                      isOpen={isOpenViewPdfKH22BillModal}
                      toggle={toggleViewPdfKH22BillModal}
                      newSuppliesImportBill={newSuppliesImportBill}
                    />
                    */}
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
                                createdSuppliesImportBillIsPending
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
                </div>
              )}
            </Formik>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export const normalizeSuppliesDetails = (
  suppliesDetails: KhovtTransPhieunhapDetailWithRelations[],
  suppliesStoreImportInfo: SuppliesStoreImportInfo,
  isEdit?: boolean,
) => {
  const list: KhovtTransPhieunhapDetailWithRelations[] = [];
  for (const suppliesDetail of suppliesDetails) {
    const normalizedDetail: KhovtTransPhieunhapDetailWithRelations = {
      ngaySx: DateUtil.toDateISOString(suppliesDetail.ngaySx, !isEdit),
      ngayHetHan: DateUtil.toDateISOString(suppliesDetail.ngayHetHan, !isEdit),
      // ngayThiNghiem: DateUtil.toDateISOString(suppliesDetail.ngayThiNghiem, !isEdit),
      ngayHetHanLK: DateUtil.toDateISOString(suppliesDetail.ngayHetHanLK, !isEdit),
      ngayNhap: DateUtil.toDateISOString(suppliesStoreImportInfo.ngayNhap),
      soLuong: Number(suppliesDetail.soLuong),
      status: ImportStatus.Wait.id,
      dvt: suppliesDetail.dvt,
      ghiChu: suppliesDetail.ghiChu,
      ghiChu2: suppliesDetail.ghiChu2,
      ghiChu3: suppliesDetail.ghiChu3,
      maVt: suppliesDetail.maVt,
      tenVt: suppliesDetail.tenVt,
      soLo: suppliesDetail.soLo?.toUpperCase(),
    };

    if (isEdit && suppliesDetail.id) {
      normalizedDetail.id = suppliesDetail.id;
    }

    list.push(normalizedDetail);
  }
  return list;
};

export default SuppliesStoreImportAdd;
