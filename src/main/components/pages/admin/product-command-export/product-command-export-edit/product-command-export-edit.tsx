import { Formik } from 'formik';
import {
  useKhotpTransLenhXuatControllerFindById,
  useKhotpTransLenhXuatControllerUpdateById,
} from 'main/apis/drc/endpoints/khotp-trans-lenh-xuat-controller/khotp-trans-lenh-xuat-controller';
import { KhotpTransLenhXuatDetailWithRelations } from 'main/apis/drc/models';
import { TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page, ValidationMessage } from 'main/constants';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  loadProductCommandExportBill,
  resetProductCommandExportEditState,
  selectProductCommandExportDetails,
  selectProductCommandExportInfo,
} from 'main/redux/modules/product-command-export/product-command-export-edit-slice';
import { DateUtil } from 'main/utils';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import ProductCommandExportEditInfo, {
  ProductCommandExportInfo,
} from './sub-components/product-command-export-edit-info';
import ProductCommandExportEditTable from './sub-components/product-command-export-edit-table/product-command-export-edit-table';
import SaveCommandExportModal from './sub-components/save-command-export-modal';

const infoValidationSchema = Yup.object().shape({
  maKhoXuat: Yup.string().required(ValidationMessage.REQUIRED),
  soChungTu: Yup.string().required(ValidationMessage.REQUIRED),
  ngayXuat: Yup.string().required(ValidationMessage.REQUIRED),
  maKh: Yup.string().required(ValidationMessage.REQUIRED),
});

function ProductCommandExportEdit() {
  // React Router
  const { id: productCommandExportBillId } = useParams();
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const productCommandExportInfo = useAppSelector(selectProductCommandExportInfo);
  const productCommandExportDetails = useAppSelector(selectProductCommandExportDetails);

  // React State
  const [isOpenSaveModal, setOpenSaveModal] = useState(false);

  // React Query
  const { data: productCommandExportBill, isLoading: productCommandExportBillIsLoading } =
    useKhotpTransLenhXuatControllerFindById(Number(productCommandExportBillId), undefined, {
      query: {
        enabled: !!productCommandExportBillId,
      },
    });

  const {
    isPending: updatedProductCommandExportBillIsPending,
    mutateAsync: updatedProductCommandExportBillMutateAsync,
  } = useKhotpTransLenhXuatControllerUpdateById();

  // React Effect
  useEffect(() => {
    dispatch(resetProductCommandExportEditState());
  }, [dispatch]);

  useEffect(() => {
    if (!productCommandExportBillIsLoading && productCommandExportBill) {
      dispatch(loadProductCommandExportBill(productCommandExportBill));
    }
  }, [productCommandExportBillIsLoading, productCommandExportBill, dispatch]);

  // React function
  const toggleSaveModal = () => setOpenSaveModal(!isOpenSaveModal);

  const handleSaveConfirmClick = async (info: ProductCommandExportInfo) => {
    // Close modal
    toggleSaveModal();

    // Create new bill
    updatedProductCommandExportBillMutateAsync({
      id: Number(productCommandExportBillId),
      data: {
        ...info,
        ngayXuat: DateUtil.toDateISOString(info.ngayXuat),
        details: normalizeProductDetails(productCommandExportDetails),
      },
    })
      .then((_) => {
        navigate(Page.PRODUCT_COMMAND_EXPORT_DETAIL.PATH.replace(':id', String(productCommandExportBillId)));
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  };

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_COMMAND_EXPORT_EDIT.CATEGORY}
      pageTitle={Page.PRODUCT_COMMAND_EXPORT_EDIT.TITLE}
      pageName={Page.PRODUCT_COMMAND_EXPORT_EDIT.NAME}
      parentPage={{
        name: Page.PRODUCT_COMMAND_EXPORT_LIST.NAME,
        path: Page.PRODUCT_COMMAND_EXPORT_LIST.PATH,
      }}
      isLoading={productCommandExportBillIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            {productCommandExportBill && (
              <Formik
                initialValues={productCommandExportInfo}
                enableReinitialize
                validationSchema={infoValidationSchema}
                onSubmit={() => {
                  // do nothing
                }}>
                {(formikProps) => (
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0 text-center">SỬA LỆNH XUẤT KHO #{productCommandExportBillId}</h3>
                    </CardHeader>
                    <CardBody>
                      <ProductCommandExportEditInfo formikProps={formikProps} />
                      <ProductCommandExportEditTable />
                      <SaveCommandExportModal
                        isOpen={isOpenSaveModal}
                        toggle={toggleSaveModal}
                        handleConfirmClick={() => handleSaveConfirmClick(formikProps.values)}
                      />
                      {updatedProductCommandExportBillIsPending && <TransparentSpinner />}
                    </CardBody>
                    <CardFooter>
                      <div className="d-flex justify-content-end pb-1">
                        <div>
                          <EditPermissionAction>
                            <Button
                              color="primary"
                              onClick={toggleSaveModal}
                              disabled={!formikProps.isValid || updatedProductCommandExportBillIsPending}>
                              Lưu
                            </Button>
                          </EditPermissionAction>
                          <Button color="secondary" onClick={() => navigate(Page.PRODUCT_COMMAND_EXPORT_LIST.PATH)}>
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

const normalizeProductDetails = (productDetails: KhotpTransLenhXuatDetailWithRelations[]) => {
  const list: KhotpTransLenhXuatDetailWithRelations[] = [];
  for (const productDetail of productDetails) {
    list.push({
      ...productDetail,
      thucXuat: Number(productDetail.thucXuat),
    });
  }
  return list;
};

export default ProductCommandExportEdit;
