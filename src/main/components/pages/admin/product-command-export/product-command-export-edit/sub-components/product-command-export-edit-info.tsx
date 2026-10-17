import { FormikProps } from 'formik';
import { useKhotpMasterKhachHangControllerFindById } from 'main/apis/drc/endpoints/khotp-master-khach-hang-controller/khotp-master-khach-hang-controller';
import { KhotpTransLenhXuatWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useProductStoreAndOriginOptions } from 'main/hooks';
import useProductExportCustomerUnitOptions from 'main/hooks/useProductExportCustomerUnitOptions';
import moment from 'moment';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';

export type ProductCommandExportInfo = Omit<KhotpTransLenhXuatWithRelations, 'id' | 'details'>;

type Props = {
  formikProps: FormikProps<ProductCommandExportInfo>;
};

function ProductCommandExportEditInfo({ formikProps: { values, errors, handleChange, setFieldValue } }: Props) {
  // React State
  const { productStoreAndOriginOptions, productStoresAndOriginsIsLoading } = useProductStoreAndOriginOptions(false);
  const { productExportCustomersUnitOptions, suppliesUnitsAndOriginsIsLoading } =
    useProductExportCustomerUnitOptions(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  // React Query
  const { data: productExportCustomerPortfolio, isLoading: productExportCustomerPortfolioIsLoading } =
    useKhotpMasterKhachHangControllerFindById(selectedCustomer);

  const prevCustomerIdRef = useRef(selectedCustomer);
  const prevDataRef = useRef(productExportCustomerPortfolio);

  // React Effect
  useEffect(() => {
    if (!productExportCustomerPortfolioIsLoading && productExportCustomerPortfolio) {
      // Kiểm tra xem giá trị có thay đổi không
      if (prevCustomerIdRef.current !== selectedCustomer || prevDataRef.current !== productExportCustomerPortfolio) {
        const { diaChiKh } = productExportCustomerPortfolio;

        if (values.diaChiKh !== diaChiKh) {
          setFieldValue(FieldName.DIA_CHI_KH, diaChiKh);
        }
      }

      // Cập nhật ref với giá trị hiện tại
      prevCustomerIdRef.current = selectedCustomer;
      prevDataRef.current = productExportCustomerPortfolio;
    }
  }, [
    selectedCustomer,
    productExportCustomerPortfolioIsLoading,
    productExportCustomerPortfolio,
    setFieldValue,
    values,
  ]);

  if (productStoresAndOriginsIsLoading || suppliesUnitsAndOriginsIsLoading || !values.maKhoXuat) {
    return null;
  }

  return (
    <Form>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Kho xuất&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn kho xuất' }}
                value={values.maKhoXuat}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFieldValue(FieldName.MA_KHO_XUAT, e.target.value)}
                invalid={!!errors.maKhoXuat}
                data={productStoreAndOriginOptions}
              />
              {errors.maKhoXuat && <FormText color="danger">{errors.maKhoXuat}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Số chứng từ&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.SO_CHUNG_TU}
                placeholder="Nhập số chứng từ"
                value={values.soChungTu || ''}
                onChange={handleChange}
                invalid={!!errors.soChungTu}
              />
              {errors.soChungTu && <FormText color="danger">{errors.soChungTu}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Ngày xuất kho&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <DatePicker
                inputProps={{
                  placeholder: 'Chọn ngày',
                  className: `form-control ${!!errors.ngayXuat ? 'is-invalid' : ''}`,
                }}
                value={values.ngayXuat ? moment(values.ngayXuat) : undefined}
                onChange={(e) => setFieldValue(FieldName.NGAY_XUAT, e ? moment(e) : undefined)}
              />
              {errors.ngayXuat && <FormText color="danger">{errors.ngayXuat}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6}>
          <FormGroup className="row">
            <Label className="form-control-label" md="4">
              Khách hàng&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn khách hàng' }}
                value={values.maKh}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setFieldValue(FieldName.MA_KH, e.target.value);
                  setSelectedCustomer(e.target.value);
                }}
                invalid={!!errors.maKh}
                data={productExportCustomersUnitOptions}
              />
              {errors.maKh && <FormText color="danger">{errors.maKh}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <FormGroup className="row">
            <Label className="form-control-label" lg="2" md="4">
              Địa chỉ
            </Label>
            <Col lg="10" md="8">
              <Input
                type="text"
                name={FieldName.DIA_CHI_KH}
                placeholder="Nhập địa chỉ"
                value={values.diaChiKh || ''}
                onChange={handleChange}
                invalid={!!errors.diaChiKh}
              />
              {errors.diaChiKh && <FormText color="danger">{errors.diaChiKh}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <FormGroup className="row">
            <Label className="form-control-label" lg="2" md="4">
              Ghi chú
            </Label>
            <Col lg="10" md="8">
              <Input
                type="textarea"
                name={FieldName.GHI_CHU}
                placeholder="Nhập ghi chú"
                value={values.ghiChu || ''}
                onChange={handleChange}
                invalid={!!errors.ghiChu}
              />
              {errors.ghiChu && <FormText color="danger">{errors.ghiChu}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default ProductCommandExportEditInfo;
