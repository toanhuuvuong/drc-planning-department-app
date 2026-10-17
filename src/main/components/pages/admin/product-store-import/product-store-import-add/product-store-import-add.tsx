import { Formik } from 'formik';
import { useKhotpTransPhieuNhapControllerCreate } from 'main/apis/drc/endpoints/khotp-trans-phieu-nhap-controller/khotp-trans-phieu-nhap-controller';
import { KhotpTransPhieuNhapDetailWithRelations } from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ValidationMessage } from 'main/constants';
import { ProductImportType } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  resetProductStoreImportAddState,
  selectProductDetails,
} from 'main/redux/modules/product-store-import/product-store-import-add-slice';
import { DateUtil } from 'main/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import ProductStoreImportAddInfo, { ProductStoreImportInfo } from './sub-components/product-store-import-add-info';
import ProductStoreImportAddTable from './sub-components/product-store-import-add-table/product-store-import-add-table';
import SaveImportBillModal from './sub-components/save-import-bill-modal';

const infoInitialValues: ProductStoreImportInfo = {
  loaiPhieu: ProductImportType.EXTERNAL,
  maKhoXuat: '',
  maKhoNhap: '',
  ngayNhap: '',
  nguoiNhanHang: '',
  soChungTu: '',
  soXe: '',
  loaiXe: '',
  viTri: '',
};

const infoValidationSchema = Yup.object().shape({
  loaiPhieu: Yup.string().required(ValidationMessage.REQUIRED),
  maKhoXuat: Yup.string().required(ValidationMessage.REQUIRED),
  maKhoNhap: Yup.string().required(ValidationMessage.REQUIRED),
  soChungTu: Yup.string().required(ValidationMessage.REQUIRED),
  ngayNhap: Yup.string().required(ValidationMessage.REQUIRED),
  nguoiNhanHang: Yup.string().required(ValidationMessage.REQUIRED),
  viTri: Yup.string().required(ValidationMessage.REQUIRED),
});

function ProductStoreImportAdd() {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const productDetails = useAppSelector(selectProductDetails);

  // React State
  const [isOpenSaveModal, setOpenSaveModal] = useState(false);
  //const [isOpenSaveCompleteModal, setOpenSaveCompleteModal] = useState(false);
  //const [newProductImportBill, setNewProductImportBill] = useState<KhotpTransPhieuNhap>();
  const isValidProductDetails = useMemo(() => {
    if (!productDetails || productDetails.length === 0) {
      return false;
    }
    for (const productDetail of productDetails) {
      if (!productDetail.soLuong || productDetail.soLuong < 1) {
        return false;
      }
    }
    return true;
  }, [productDetails]);

  // React Query
  const { isPending: createdProductImportBillIsPending, mutateAsync: createdProductImportBillMutateAsync } =
    useKhotpTransPhieuNhapControllerCreate();

  // React Effect
  useEffect(() => {
    dispatch(resetProductStoreImportAddState());
  }, [dispatch]);

  // React function
  const toggleSaveModal = useCallback(() => setOpenSaveModal((isOpenSaveModal) => !isOpenSaveModal), []);

  /*
  const toggleSaveCompleteModal = useCallback(
    () => setOpenSaveCompleteModal((isOpenSaveCompleteModal) => !isOpenSaveCompleteModal),
    [],
  );
  */

  const handleSaveConfirmClick = useCallback(
    (productStoreImportInfo: ProductStoreImportInfo) => {
      // Close modal
      toggleSaveModal();

      // Create new bill
      createdProductImportBillMutateAsync({
        data: {
          ...productStoreImportInfo,
          ngayNhap: DateUtil.toDateISOString(productStoreImportInfo.ngayNhap),
          details: normalizeProductDetails(productDetails, productStoreImportInfo),
        },
      })
        .then((newProductImportBill) => {
          navigate(Page.PRODUCT_STORE_IMPORT_DETAIL.PATH.replace(':id', String(newProductImportBill?.id)));

          /*
          setNewProductImportBill(newProductImportBill);

          // Open save complete model
          toggleSaveCompleteModal();
          */
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [createdProductImportBillMutateAsync, navigate, productDetails, toggleSaveModal],
  );

  /*
  const handleSaveCompleteViewBillClick = useCallback(() => {
    // Close modal
    toggleSaveCompleteModal();

    // Redirect to View
    navigate(Page.PRODUCT_STORE_IMPORT_DETAIL.PATH.replace(':id', String(newProductImportBill?.id)));
  }, [navigate, newProductImportBill?.id, toggleSaveCompleteModal]);

  const handleSaveCompleteEditBillClick = useCallback(() => {
    // Close modal
    toggleSaveCompleteModal();

    // Redirect to Edit
    navigate(Page.PRODUCT_STORE_IMPORT_EDIT.PATH.replace(':id', String(newProductImportBill?.id)));
  }, [navigate, newProductImportBill, toggleSaveCompleteModal]);
  */

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_IMPORT_ADD.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_IMPORT_ADD.TITLE}
      pageName={Page.PRODUCT_STORE_IMPORT_ADD.NAME}
      parentPage={{
        name: Page.PRODUCT_STORE_IMPORT_LIST.NAME,
        path: Page.PRODUCT_STORE_IMPORT_LIST.PATH,
      }}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Formik
              initialValues={infoInitialValues}
              validationSchema={infoValidationSchema}
              onSubmit={() => {
                // do nothing
              }}>
              {(formikProps) => (
                <Card>
                  <CardHeader>
                    <h3 className="mb-0 text-center">KHO SẢN PHẨM - TẠO PHIẾU NHẬP</h3>
                  </CardHeader>
                  <CardBody>
                    <ProductStoreImportAddInfo formikProps={formikProps} />
                    <ProductStoreImportAddTable productStoreImportInfo={formikProps.values} />
                    <SaveImportBillModal
                      isOpen={isOpenSaveModal}
                      toggle={toggleSaveModal}
                      handleConfirmClick={() => handleSaveConfirmClick(formikProps.values)}
                    />
                    {/*
                    <SaveCompleteImportBillModal
                      isOpen={isOpenSaveCompleteModal}
                      toggle={toggleSaveCompleteModal}
                      handleViewBillClick={handleSaveCompleteViewBillClick}
                      handleEditBillClick={handleSaveCompleteEditBillClick}
                    />
                    */}
                  </CardBody>
                  <CardFooter>
                    <div className="d-flex justify-content-end pb-1">
                      <div>
                        <EditPermissionAction>
                          <Button
                            color="primary"
                            onClick={toggleSaveModal}
                            disabled={
                              !formikProps.dirty ||
                              !formikProps.isValid ||
                              !isValidProductDetails ||
                              createdProductImportBillIsPending
                            }>
                            Lưu
                          </Button>
                        </EditPermissionAction>
                        <Button color="secondary" onClick={() => navigate(Page.PRODUCT_STORE_IMPORT_LIST.PATH)}>
                          Quay lại
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </Formik>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export const normalizeProductDetails = (
  productDetails: KhotpTransPhieuNhapDetailWithRelations[],
  productStoreImportInfo: ProductStoreImportInfo,
) => {
  const list: KhotpTransPhieuNhapDetailWithRelations[] = [];
  for (const productDetail of productDetails) {
    list.push({
      ...productDetail,
      soLuong: Number(productDetail.soLuong),
      thoiHanLuuKho: DateUtil.toDateISOString(productDetail.thoiHanLuuKho),
      ngayNhap: DateUtil.toDateISOString(productStoreImportInfo.ngayNhap),
    });
  }
  return list;
};

export default ProductStoreImportAdd;
