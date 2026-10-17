import { Formik } from 'formik';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { useAuth } from 'main/hooks';
import { DateUtil } from 'main/utils';
import moment from 'moment';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import ProductStoreExportAddInfo from './sub-components/product-store-export-add-info';
import ProductStoreExportAddTable from './sub-components/product-store-export-add-table/product-store-export-add-table';
import SaveExportBillModal from './sub-components/save-export-bill-modal';
import { ProductStoreExportInfo, useProductStoreExportAdd } from './use-product-store-export-add';

const infoValidationSchema = Yup.object().shape({
  soChungTu: Yup.string().required('Trường này là bắt buộc'),
  ngayXuat: Yup.string().required('Trường này là bắt buộc'),
  nguoiXuatHang: Yup.string().required('Trường này là bắt buộc'),
  // ngayChungTu: Yup.string().required('Trường này là bắt buộc'),
  // maKh: Yup.string().required('Trường này là bắt buộc'),
  // maKhoNhap: Yup.string().required('Trường này là bắt buộc'),

  maKhoXuat: Yup.string()
    .required('Trường này là bắt buộc')
    .test('is-not-same-as-maKhoNhap', 'Kho xuất không được trùng với kho nhập', function (value) {
      const { maKhoNhap } = this.parent;
      return value !== maKhoNhap;
    }),

  maKhoNhap: Yup.string().when('isChecked', {
    is: true,
    then: () =>
      Yup.string()
        .required('Trường này là bắt buộc')
        .test('is-not-same-as-maKhoXuat', 'Kho nhập không được trùng với kho xuất', function (value) {
          const { maKhoXuat } = this.parent;
          return value !== maKhoXuat;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  maKh: Yup.string().when('isChecked', {
    is: false,
    then: () => Yup.string().required('Trường này là bắt buộc'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

function ProductStoreExportAdd() {
  const { currentUser } = useAuth();
  const infoInitialValues: ProductStoreExportInfo = {
    soXe: '',
    soChungTu: '',
    nguoiXuatHang: currentUser.username?.toUpperCase(),
    nguoiVanChuyen: '',
    ngayXuat: DateUtil.toDateISOString(moment()),
    // ngayChungTu: '',
    maSoThueKh: '',
    maPhieu: '',
    maKhoXuat: '',
    maKhoNhap: '',
    maKh: '',
    loaiPhieu: '',
    hinhThucThanhToan: '',
    dtKh: '',
    diaChiKh: '',
    isChecked: false,
  };

  const {
    handleAddProductToTable,
    handleClosedCompletePopup,
    handleSaveConfirmClick,
    isOpenSaveCompleteModal,
    isValidProductDetails,
    productExportAddStoreDetails,
    setLoaiPhieu,
    toggleSaveCompleteModal,
    updateNewDataArray,
  } = useProductStoreExportAdd();

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_EXPORT_ADD.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_EXPORT_ADD.TITLE}
      pageName={Page.PRODUCT_STORE_EXPORT_ADD.NAME}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Formik
              initialValues={infoInitialValues}
              validationSchema={infoValidationSchema}
              enableReinitialize={true} // Cần để lấy thông tin User từ API
              onSubmit={() => {
                // do nothing
              }}>
              {(formikProps) => (
                <Card>
                  <CardHeader>
                    <h3 className="mb-0 text-center">KHO SẢN PHẨM - TẠO PHIẾU XUẤT</h3>
                  </CardHeader>
                  <CardBody>
                    <ProductStoreExportAddInfo formikProps={formikProps} setLoaiPhieu={setLoaiPhieu} />
                    <ProductStoreExportAddTable
                      productList={productExportAddStoreDetails}
                      handleAddProductToTable={handleAddProductToTable}
                      updateNewDataArray={updateNewDataArray}
                      maKhoXuat={formikProps.values.maKhoXuat || ''}
                    />
                    <SaveExportBillModal
                      isOpen={isOpenSaveCompleteModal}
                      toggle={toggleSaveCompleteModal}
                      handleClosedCompletePopup={() => handleClosedCompletePopup()}
                    />
                  </CardBody>
                  <CardFooter>
                    <div className="d-flex justify-content-end px-4 pb-1">
                      <Button
                        color="primary"
                        onClick={() => handleSaveConfirmClick(formikProps.values)}
                        disabled={
                          !formikProps.dirty ||
                          !formikProps.isValid ||
                          !isValidProductDetails ||
                          productExportAddStoreDetails?.length < 1
                        }>
                        Xác Nhận
                      </Button>
                      <Button color="secondary" onClick={() => handleClosedCompletePopup()}>
                        Quay lại
                      </Button>
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

export default ProductStoreExportAdd;
