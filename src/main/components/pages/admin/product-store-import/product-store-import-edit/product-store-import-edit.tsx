import { Formik } from 'formik';
import {
  useKhotpTransPhieuNhapControllerFindById,
  useKhotpTransPhieuNhapControllerUpdateById,
} from 'main/apis/drc/endpoints/khotp-trans-phieu-nhap-controller/khotp-trans-phieu-nhap-controller';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ValidationMessage } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  loadProductImportBill,
  resetProductStoreImportEditState,
  selectProductStoreImportDetails,
  selectProductStoreImportInfo,
} from 'main/redux/modules/product-store-import/product-store-import-edit-slice';
import { DateUtil } from 'main/utils';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import ProductStoreImportEditInfo from './sub-components/product-store-import-edit-info';
import ProductStoreImportEditTable from './sub-components/product-store-import-edit-table/product-store-import-edit-table';
import SaveImportBillModal from './sub-components/save-import-bill-modal';
import { normalizeProductDetails } from '../product-store-import-add/product-store-import-add';
import { ProductStoreImportInfo } from '../product-store-import-add/sub-components/product-store-import-add-info';

const infoValidationSchema = Yup.object().shape({
  loaiPhieu: Yup.string().required(ValidationMessage.REQUIRED),
  maKhoXuat: Yup.string().required(ValidationMessage.REQUIRED),
  maKhoNhap: Yup.string().required(ValidationMessage.REQUIRED),
  maPhieu: Yup.string().required(ValidationMessage.REQUIRED),
  ngayNhap: Yup.string().required(ValidationMessage.REQUIRED),
  nguoiNhanHang: Yup.string().required(ValidationMessage.REQUIRED),
  viTri: Yup.string().required(ValidationMessage.REQUIRED),
});

function ProductStoreImportEdit() {
  // React Router
  const { id: productImportBillId } = useParams();
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const productStoreImportInfo = useAppSelector(selectProductStoreImportInfo);
  const productStoreImportDetails = useAppSelector(selectProductStoreImportDetails);
  const isValidProductDetails = useMemo(() => {
    if (!productStoreImportDetails || productStoreImportDetails.length === 0) {
      return false;
    }
    for (const productStoreImportDetail of productStoreImportDetails) {
      if (!productStoreImportDetail.soLuong || productStoreImportDetail.soLuong < 1) {
        return false;
      }
    }
    return true;
  }, [productStoreImportDetails]);

  // React State
  const [isOpenSaveModal, setOpenSaveModal] = useState(false);

  // React Query
  const { data: productImportBill, isLoading: productImportBillIsLoading } = useKhotpTransPhieuNhapControllerFindById(
    Number(productImportBillId),
    {
      query: {
        enabled: !!productImportBillId,
      },
    },
  );

  const { isPending: updatedProductImportBillIsPending, mutateAsync: updatedProductImportBillMutateAsync } =
    useKhotpTransPhieuNhapControllerUpdateById();

  // React Effect
  useEffect(() => {
    dispatch(resetProductStoreImportEditState());
  }, [dispatch]);

  useEffect(() => {
    if (!productImportBillIsLoading && productImportBill) {
      dispatch(loadProductImportBill(productImportBill));
    }
  }, [productImportBillIsLoading, productImportBill, dispatch]);

  // React function
  const toggleSaveModal = () => setOpenSaveModal(!isOpenSaveModal);

  const handleSaveConfirmClick = async (info: ProductStoreImportInfo) => {
    // Close modal
    toggleSaveModal();

    // Create new bill
    updatedProductImportBillMutateAsync({
      id: Number(productImportBillId),
      data: {
        ...info,
        ngayNhap: DateUtil.toDateISOString(info.ngayNhap),
        details: normalizeProductDetails(productStoreImportDetails, info),
      },
    })
      .then((_) => {
        navigate(Page.PRODUCT_STORE_IMPORT_DETAIL.PATH.replace(':id', String(productImportBillId)));
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  };

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_IMPORT_EDIT.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_IMPORT_EDIT.TITLE}
      pageName={Page.PRODUCT_STORE_IMPORT_EDIT.NAME}
      parentPage={{
        name: Page.PRODUCT_STORE_IMPORT_LIST.NAME,
        path: Page.PRODUCT_STORE_IMPORT_LIST.PATH,
      }}
      isLoading={productImportBillIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            {productImportBill && (
              <Formik
                initialValues={productStoreImportInfo}
                enableReinitialize
                validationSchema={infoValidationSchema}
                onSubmit={() => {
                  // do nothing
                }}>
                {(formikProps) => (
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0 text-center">KHO SẢN PHẨM - SỬA PHIẾU NHẬP #{productImportBillId}</h3>
                    </CardHeader>
                    <CardBody>
                      <ProductStoreImportEditInfo formikProps={formikProps} />
                      <ProductStoreImportEditTable productStoreImportInfo={formikProps.values} />
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
                                !formikProps.isValid || !isValidProductDetails || updatedProductImportBillIsPending
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
            )}
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export default ProductStoreImportEdit;
