import { Formik } from 'formik';
import {
  useKhotpTransLenhNhapControllerFindById,
  useKhotpTransLenhNhapControllerUpdateById,
} from 'main/apis/drc/endpoints/khotp-trans-lenh-nhap-controller/khotp-trans-lenh-nhap-controller';
import { KhotpTransLenhNhapDetailWithRelations } from 'main/apis/drc/models';
import { TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ValidationMessage } from 'main/constants';
import { ProductExcelStatus } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  loadProductStoreExcel,
  resetProductStoreExcelEditState,
  selectProductStoreExcelDetails,
  selectProductStoreExcelInfo,
} from 'main/redux/modules/product-store-excel/product-store-excel-edit-slice';
import { DateUtil } from 'main/utils';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import ProductStoreExcelEditInfo, { ProductStoreExcelInfo } from './sub-components/product-store-excel-edit-info';
import ProductStoreExcelEditTable from './sub-components/product-store-excel-edit-table/product-store-excel-edit-table';
import SaveProductStoreExcelModal from './sub-components/save-product-store-excel-modal';

const infoValidationSchema = Yup.object().shape({
  soChungTu: Yup.string().required(ValidationMessage.REQUIRED),
  ngayNhap: Yup.string().required(ValidationMessage.REQUIRED),
});

function ProductStoreExcelEdit() {
  // React Router
  const { id: productStoreExcelId } = useParams();
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const productStoreExcelInfo = useAppSelector(selectProductStoreExcelInfo);
  const productStoreExcelDetails = useAppSelector(selectProductStoreExcelDetails);

  // React State
  const [isOpenSaveModal, setOpenSaveModal] = useState(false);

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

  const { isPending: updatedProductStoreExcelIsPending, mutateAsync: updatedProductStoreExcelMutateAsync } =
    useKhotpTransLenhNhapControllerUpdateById();

  // React Effect
  useEffect(() => {
    dispatch(resetProductStoreExcelEditState());
  }, [dispatch]);

  useEffect(() => {
    if (!productStoreExcelIsLoading && productStoreExcel) {
      dispatch(loadProductStoreExcel(productStoreExcel));
    }
  }, [productStoreExcelIsLoading, productStoreExcel, dispatch]);

  // React function
  const toggleSaveModal = () => setOpenSaveModal(!isOpenSaveModal);

  const handleSaveConfirmClick = async (info: ProductStoreExcelInfo) => {
    // Close modal
    toggleSaveModal();

    // Create new bill
    updatedProductStoreExcelMutateAsync({
      id: Number(productStoreExcelId),
      data: {
        ...info,
        status: ProductExcelStatus.updating.id,
        ngayNhap: DateUtil.toDateISOString(info.ngayNhap),
        details: normalizeProductDetails(productStoreExcelDetails),
      },
    })
      .then((_) => {
        navigate(Page.PRODUCT_STORE_EXCEL_DETAIL.PATH.replace(':id', String(productStoreExcelId)));
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  };

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_EXCEL_EDIT.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_EXCEL_EDIT.TITLE}
      pageName={Page.PRODUCT_STORE_EXCEL_EDIT.NAME}
      parentPage={{
        name: Page.PRODUCT_STORE_EXCEL_LIST.NAME,
        path: Page.PRODUCT_STORE_EXCEL_LIST.PATH,
      }}
      isLoading={productStoreExcelIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            {productStoreExcel && (
              <Formik
                initialValues={productStoreExcelInfo}
                enableReinitialize
                validationSchema={infoValidationSchema}
                onSubmit={() => {
                  // do nothing
                }}>
                {(formikProps) => (
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0 text-center">SỬA LỆNH NHẬP #{productStoreExcelId}</h3>
                    </CardHeader>
                    <CardBody>
                      <ProductStoreExcelEditInfo formikProps={formikProps} />
                      <ProductStoreExcelEditTable />
                      <SaveProductStoreExcelModal
                        isOpen={isOpenSaveModal}
                        toggle={toggleSaveModal}
                        handleConfirmClick={() => handleSaveConfirmClick(formikProps.values)}
                      />
                      {updatedProductStoreExcelIsPending && <TransparentSpinner />}
                    </CardBody>
                    <CardFooter>
                      <div className="d-flex justify-content-end pb-1">
                        <div>
                          <EditPermissionAction>
                            <Button
                              color="primary"
                              onClick={toggleSaveModal}
                              disabled={
                                !formikProps.isValid ||
                                updatedProductStoreExcelIsPending ||
                                (productStoreExcel && productStoreExcel.status === ProductExcelStatus.complete.id)
                              }>
                              Lưu
                            </Button>
                          </EditPermissionAction>
                          <Button color="secondary" onClick={() => navigate(Page.PRODUCT_STORE_EXCEL_LIST.PATH)}>
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

export const normalizeProductDetails = (productDetails: KhotpTransLenhNhapDetailWithRelations[]) => {
  const list: KhotpTransLenhNhapDetailWithRelations[] = [];
  for (const productDetail of productDetails) {
    list.push({
      ...productDetail,
      soLuong: productDetail.soLuong ? Number(productDetail.soLuong) : undefined,
      ngayNhap: DateUtil.toDateISOString(productDetail.ngayNhap),
    });
  }
  return list;
};

export default ProductStoreExcelEdit;
