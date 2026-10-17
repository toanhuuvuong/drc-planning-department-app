import { FormikProps } from 'formik';
import { find } from 'lodash';
import { KhotpMasterKhachHangWithRelations, QldhTransDonHangWithRelations } from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Select2Box } from 'main/components/molecules/selectbox';
import { ToastMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { TrangThaiDonHang } from 'main/constants/enums/order-management';
import moment from 'moment';
import { ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { Button, Col, FormGroup, FormText, Input, Label, Row } from 'reactstrap';

export type OrderManagementInfo = QldhTransDonHangWithRelations & {
  khuVucKh?: string;
  id?: number;
  maKhoXuat?: string;
};

type Props = {
  formikProps: FormikProps<OrderManagementInfo>;
  productExportCustomer?: KhotpMasterKhachHangWithRelations[];
  productExportCustomersUnitOptions?: any[];
  handlePauseAndResumeOrder: (status: string) => Promise<void>;
};

function OrderManagementEditInfo({
  formikProps: { values, errors, handleChange, setFieldValue, setValues },
  productExportCustomer,
  productExportCustomersUnitOptions,
  handlePauseAndResumeOrder,
}: Readonly<Props>) {
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
                    khuVucKh: find(productExportCustomer, (item) => item.maKh === newValue)?.khuVucKh ?? '',
                  });
                }}
                invalid={errors.maKH ? 'true' : undefined}
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
                // value={values.ngayDatHang}
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
              Vùng
            </Label>
            <Col md="8">
              <Input
                type="text"
                name={FieldName.KHU_VUC_KH}
                placeholder="Vùng khách hàng"
                value={values.khuVucKh ?? ''}
                onChange={handleChange}
                disabled
              />
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
      <EditPermissionAction>
        <div className="d-flex justify-content-end pb-4">
          {values.trangThai === TrangThaiDonHang.DANG_TIEN_HANH && (
            <Button
              color="warning"
              onClick={() => {
                handlePauseAndResumeOrder(TrangThaiDonHang.TAM_DUNG)
                  .then(() => {
                    toast.success(
                      <div>
                        <b>{ToastMessage.UPDATE_SUCCESS}</b> <br /> Trạng thái đơn hàng là Tạm dừng
                      </div>,
                    );
                    setFieldValue('trangThai', TrangThaiDonHang.TAM_DUNG);
                  })
                  .catch((e: any) => {
                    toast.error(e?.response?.data?.error?.message || e.message);
                  });
              }}>
              Tạm dừng đơn đặt hàng
            </Button>
          )}
          {values.trangThai === TrangThaiDonHang.TAM_DUNG && (
            <Button
              color="success"
              onClick={() =>
                handlePauseAndResumeOrder(TrangThaiDonHang.DANG_TIEN_HANH)
                  .then(() => {
                    toast.success(
                      <div>
                        <b>{ToastMessage.UPDATE_SUCCESS}</b> <br />
                        Trạng thái đơn hàng là Đang tiến hành
                      </div>,
                    );
                    setFieldValue('trangThai', TrangThaiDonHang.DANG_TIEN_HANH);
                  })
                  .catch((e: any) => {
                    toast.error(e?.response?.data?.error?.message || e.message);
                  })
              }>
              Tiếp tục đơn đặt hàng
            </Button>
          )}
        </div>
      </EditPermissionAction>
    </>
  );
}

export default OrderManagementEditInfo;
