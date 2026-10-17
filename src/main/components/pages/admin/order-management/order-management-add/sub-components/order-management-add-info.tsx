import { FormikProps } from 'formik';
import { find } from 'lodash';
import { NewQldhTransDonHang, QldhTransDonHangItemWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import useProductExportCustomerUnitOptions from 'main/hooks/useProductExportCustomerUnitOptions';
import moment from 'moment';
import { ChangeEvent } from 'react';
import { Col, FormGroup, FormText, Input, Label, Row } from 'reactstrap';

export type OrderManagementInfo = NewQldhTransDonHang &
  QldhTransDonHangItemWithRelations & {
    khuVucKh?: string;
    idDonHang?: string;
    maKho?: string;
  };

type Props = {
  formikProps: FormikProps<OrderManagementInfo>;
};

function OrderManagementAddInfo({
  formikProps: { values, errors, handleChange, setFieldValue, setValues },
}: Readonly<Props>) {
  // React State
  const { productExportCustomersUnitOptions, productExportCustomer } = useProductExportCustomerUnitOptions(false);
  // const { productStoreOptions, productStoresIsLoading } = useProductStoreOptions(false);

  // useEffect(() => {
  //   if (productStoreOptions.length > 0 && !values.maKhoXuat && !productStoresIsLoading) {
  //     const defaultMaKho = productStoreOptions[0].id;

  //     setFieldValue('maKhoXuat', String(defaultMaKho));
  //   }
  // }, [productStoreOptions, values.maKhoXuat, setFieldValue, productStoresIsLoading]);

  return (
    <>
      <Row>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Khách hàng&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Select2Box
                className="form-control"
                options={{ placeholder: 'Chọn khách hàng' }}
                value={values.maKH}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const newValue = e.target.value;
                  setValues({
                    ...values,
                    maKH: newValue,
                    khuVucKh: find(productExportCustomer, (item) => item.maKh === newValue)?.khuVucKh || '',
                  });
                }}
                invalid={!!errors.maKH}
                data={productExportCustomersUnitOptions}
              />
              {errors.maKH && <FormText color="danger">{errors.maKH}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Ngày đặt hàng&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <DatePicker
                inputProps={{
                  placeholder: 'Chọn ngày',
                  className: `form-control ${errors.ngayDatHang ? 'is-invalid' : ''}`,
                }}
                // dateFormat={DateFormat.DATE_ONLY_VN}
                value={values.ngayDatHang ? moment(values.ngayDatHang) : undefined}
                onChange={(e) => setFieldValue(FieldName.NGAY_DAT_HANG, e ? moment(e) : undefined)}
              />
              {errors.ngayDatHang && <FormText color="danger">{errors.ngayDatHang}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Vùng&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.KHU_VUC_KH_CREATE}
                disabled
                placeholder="Vùng khách hàng"
                value={values.khuVucKh ?? ''}
                onChange={handleChange}
              />
              {errors.khuVucKh && <FormText color="danger">{errors.khuVucKh}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Người Tạo&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.NGUOI_TAO}
                placeholder="Nhập người tạo phiếu"
                value={values.nguoiTao || ''}
                onChange={handleChange}
                invalid={!!errors.nguoiTao}
              />
              {errors.nguoiTao && <FormText color="danger">{errors.nguoiTao}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Ngày Giao Hàng Dự Kiến&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <DatePicker
                inputProps={{
                  placeholder: 'Chọn ngày',
                  className: `form-control ${errors.ngayGiaoDuKien ? 'is-invalid' : ''}`,
                }}
                // dateFormat={DateFormat.DATE_ONLY_VN}
                value={values.ngayGiaoDuKien ? moment(values.ngayGiaoDuKien) : undefined}
                onChange={(e) => setFieldValue(FieldName.NGAY_GIAO_DU_KIEN, e ? moment(e) : undefined)}
              />
              {errors.ngayGiaoDuKien && <FormText color="danger">{errors.ngayGiaoDuKien}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Người yêu cầu&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.NGUOI_YEU_CAU}
                placeholder="Nhập người yêu cầu"
                value={values.nguoiYeuCau}
                onChange={handleChange}
                invalid={!!errors.nguoiYeuCau}
              />
              {errors.nguoiYeuCau && <FormText color="danger">{errors.nguoiYeuCau}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Ngày Giao Hàng thực tế&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <DatePicker
                inputProps={{
                  placeholder: 'Chọn ngày',
                  className: `form-control ${errors.ngayGiaoThucTe ? 'is-invalid' : ''}`,
                }}
                // dateFormat={DateFormat.DATE_ONLY_VN}
                value={values.ngayGiaoThucTe ? moment(values.ngayGiaoThucTe) : undefined}
                onChange={(e) => setFieldValue(FieldName.NGAY_GIAO_THUC_TE, e ? moment(e) : undefined)}
              />
              {errors.ngayGiaoThucTe && <FormText color="danger">{errors.ngayGiaoThucTe}</FormText>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} lg={5}>
          <FormGroup className="row mb-2">
            <Label className="form-control-label" md="4">
              Ghi chú đơn hàng&nbsp;
              <i className="fa fa-asterisk fa-sm text-danger" />
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.GHI_CHU}
                value={values.ghiChu ?? ''}
                onChange={handleChange}
                invalid={!!errors.ghiChu}
              />
              {errors.ghiChu && <FormText color="danger">{errors.ghiChu}</FormText>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}

export default OrderManagementAddInfo;
