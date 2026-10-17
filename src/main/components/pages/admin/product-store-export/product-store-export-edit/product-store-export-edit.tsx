import { Formik } from 'formik';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import ProductStoreExportEditInfo from './sub-components/product-store-export-edit-info';
import ProductStoreExportEditTable from './sub-components/product-store-export-edit-table/product-store-export-edit-table';
import SaveExportBillModal from './sub-components/save-export-bill-modal';
import { useProductStoreExportEdit } from './use-product-store-export-edit';
import { ProductStoreExportInfo } from '../product-store-export-add/use-product-store-export-add';

const infoInitialValues: ProductStoreExportInfo = {
  soXe: '',
  soChungTu: '',
  nguoiXuatHang: '',
  nguoiVanChuyen: '',
  ngayXuat: '',
  maSoThueKh: '',
  maPhieu: '',
  maKhoXuat: '',
  maKhoNhap: '',
  maKh: '',
  loaiPhieu: '',
  hinhThucThanhToan: '',
  dtKh: '',
  diaChiKh: '',
};

const infoValidationSchema = Yup.object().shape({
  maKhoXuat: Yup.string().required('Trường này là bắt buộc'),
  soChungTu: Yup.string().required('Trường này là bắt buộc'),
  ngayXuat: Yup.string().required('Trường này là bắt buộc'),
  nguoiXuatHang: Yup.string().required('Trường này là bắt buộc'),
  // maKh: Yup.string().required('Trường này là bắt buộc'),
  // maKhoNhap: Yup.string().required('Trường này là bắt buộc'),

  maKhoNhap: Yup.string().when('isChecked', {
    is: true,
    then: () => Yup.string().required('Trường này là bắt buộc'),
    otherwise: (schema) => schema.notRequired(),
  }),
  maKh: Yup.string().when('isChecked', {
    is: false,
    then: () => Yup.string().required('Trường này là bắt buộc'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

function ProductStoreExportEdit() {
  const {
    handleAddProductToTable,
    handleClosedCompletePopup,
    handleSaveConfirmClick,
    isOpenSaveCompleteModal,
    isValidProductDetails,
    productExportEditInfo,
    productExportEditStoreDetails,
    // setLoaiPhieu,
    toggleSaveCompleteModal,
    updateNewDataArray,
    setIsChecked,
    isChecked,
  } = useProductStoreExportEdit();

  return (
    <BasicTemplate
      pageCategory={Page.PRODUCT_STORE_EXPORT_DETAIL.CATEGORY}
      pageTitle={Page.PRODUCT_STORE_EXPORT_DETAIL.TITLE}
      pageName={Page.PRODUCT_STORE_EXPORT_DETAIL.NAME}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Formik
              initialValues={productExportEditInfo || infoInitialValues}
              validationSchema={infoValidationSchema}
              enableReinitialize
              onSubmit={() => {
                // do nothing
              }}>
              {(formikProps) => {
                const { values, isValid, dirty } = formikProps;
                return (
                  <Card>
                    <CardHeader>
                      <h3 className="mb-0 text-center">KHO SẢN PHẨM - SỬA PHIẾU XUẤT</h3>
                    </CardHeader>
                    <CardBody>
                      <ProductStoreExportEditInfo
                        formikProps={formikProps}
                        setIsChecked={setIsChecked}
                        isChecked={isChecked}
                      />
                      <ProductStoreExportEditTable
                        productList={productExportEditStoreDetails as any}
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
                      <div className="d-flex justify-content-between px-4 pb-1">
                        <div className="" onClick={() => handleClosedCompletePopup()}></div>
                        <div>
                          <Button
                            color="primary"
                            onClick={() => handleSaveConfirmClick(values)}
                            disabled={
                              !dirty || !isValid || !isValidProductDetails || productExportEditStoreDetails?.length < 1
                            }>
                            Xác Nhận
                          </Button>
                          <Button className="btn-secondary" onClick={() => handleClosedCompletePopup()}>
                            Quay lại
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              }}
            </Formik>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

export default ProductStoreExportEdit;
