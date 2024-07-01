import { Formik } from 'formik';
import { useKhovtMasterKhoControllerFind } from 'main/apis/drc/endpoints/khovt-master-kho-controller/khovt-master-kho-controller';
import { KhovtMasterVtWithRelations } from 'main/apis/drc/models';
import BasicTemplate from 'main/components/templates/basic-template/basic-template';
import { Page } from 'main/constants';
import { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import ReactDatetime from 'react-datetime';
import { Link, useNavigate } from 'react-router-dom';
import Select2 from 'react-select2-wrapper';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import AddSuppliesModal from './add-supplies-modal';
import { tableCellEdit, tableColumns } from './configs';
import SaveExportBillModal from './save-export-bill-modal';
import './supplies-store-export-add.scss';

export let suppliesExportBillVatTus: any[] = [
  {
    maVatTu: 'VT001',
    tenVatTu: 'Vật tư 001',
    maSoLo: 'L001',
    nguonGoc: 'NSX A',
    soLuongYeuCau: 5,
    soLuongThucXuat: 3,
    tonKhoHienTai: 4450,
    tonKhoDuKien: 4447,
    ngaySanXuat: '2024-07-07',
    hanSuDung: '2027-07-07',
  },
  {
    maVatTu: 'VT002',
    tenVatTu: 'Vật tư 002',
    maSoLo: 'L001',
    nguonGoc: 'NSX A',
    soLuongYeuCau: 9,
    soLuongThucXuat: 5,
    tonKhoHienTai: 789,
    tonKhoDuKien: 784,
    ngaySanXuat: '2024-01-07',
    hanSuDung: '2026-01-07',
  },
  {
    maVatTu: 'VT003',
    tenVatTu: 'Vật tư 003',
    maSoLo: 'L002',
    nguonGoc: 'NSX B',
    soLuongYeuCau: 555,
    soLuongThucXuat: 500,
    tonKhoHienTai: 6000,
    tonKhoDuKien: 5500,
    ngaySanXuat: '2024-07-02',
    hanSuDung: '2024-12-02',
  },
  {
    maVatTu: 'VT004',
    tenVatTu: 'Vật tư 004',
    maSoLo: 'L003',
    nguonGoc: 'NSX C',
    soLuongYeuCau: 53,
    soLuongThucXuat: 30,
    tonKhoHienTai: 4450,
    tonKhoDuKien: 4420,
    ngaySanXuat: '2024-01-07',
    hanSuDung: '2024-01-31',
  },
];

function SuppliesStoreExportAdd() {
  const navigate = useNavigate();

  // React State
  const [isOpenSaveModal, setOpenSaveModal] = useState(false);
  const [isOpenAddSuppliesModal, setOpenAddSuppliesModal] = useState(false);

  // React Query hooks
  const { data: storeExports } = useKhovtMasterKhoControllerFind();
  const { data: storeImports } = useKhovtMasterKhoControllerFind();

  // React function
  const toggleSaveModal = () => setOpenSaveModal(!isOpenSaveModal);

  const toggleAddSuppliesModal = () => setOpenAddSuppliesModal(!isOpenAddSuppliesModal);

  const handleDeleteRow = (rowId: string) => {
    const newData = suppliesExportBillVatTus.filter((row) => row.maVatTu !== rowId);
    const index = suppliesExportBillVatTus.findIndex((row) => row.maVatTu === rowId);
    if (index > -1) {
      suppliesExportBillVatTus.splice(index, 1); // 2nd parameter means remove one item only
    }
  };

  const handleSaveConfirmClick = () => {
    toggleSaveModal();
  };

  const handleAddSuppliesConfirmClick = (selectedSupplies: KhovtMasterVtWithRelations[]) => {
    suppliesExportBillVatTus.push(selectedSupplies);
    toggleAddSuppliesModal();
  };

  return (
    <BasicTemplate pageTitle={Page.SUPPLIES_STORE_EXPORT_ADD.TITLE} pageName={Page.SUPPLIES_STORE_EXPORT_ADD.NAME}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0 text-center">SỐ PHIẾU XUẤT</h3>
              </CardHeader>
              <CardBody>
                <div className="px-4 pb-1">
                  <Formik
                    initialValues={{
                      exportBillNo: '',
                      exportBillStatus: '',
                      exportStore: '',
                      importStore: '',
                      billCreatedBy: '',
                      exportDate: undefined,
                      exportReason: '',
                      warningInfo: '',
                      billNote: '',
                    }}
                    enableReinitialize={true}
                    validationSchema={Yup.object().shape({
                      exportBillNo: Yup.string().required('Trường này là bắt buộc'),
                      exportStore: Yup.string().required('Trường này là bắt buộc'),
                      importStore: Yup.string().required('Trường này là bắt buộc'),
                      billCreatedBy: Yup.string().required('Trường này là bắt buộc'),
                      exportDate: Yup.string().required('Trường này là bắt buộc'),
                    })}
                    onSubmit={() => {}}>
                    {({ values, errors, dirty, isValid, handleChange, setFieldValue }) => (
                      <Form>
                        <Row>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Số phiếu xuất&nbsp;
                                <i className="fa fa-asterisk fa-sm text-danger" />
                              </Label>
                              <Col md="9">
                                <Input
                                  type="text"
                                  name="exportBillNo"
                                  placeholder="Nhập số phiếu xuất"
                                  value={values.exportBillNo}
                                  invalid={!!errors.exportBillNo}
                                  onChange={handleChange}
                                />
                                {errors.exportBillNo && <FormText color="danger">{errors.exportBillNo}</FormText>}
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Trạng thái
                              </Label>
                              <Col md="9">
                                <Select2
                                  className="form-control"
                                  options={{
                                    placeholder: 'Chọn trạng thái',
                                  }}
                                  name="exportBillStatus"
                                  value={values.exportBillStatus}
                                  data={[
                                    { id: 'new', text: 'Tạo mới' },
                                    { id: 'exported', text: 'Đã xuất hàng' },
                                    { id: 'canceled', text: 'Đã hủy' },
                                  ]}
                                  onChange={handleChange}
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Kho xuất&nbsp;
                                <i className="fa fa-asterisk fa-sm text-danger" />
                              </Label>
                              <Col md="9">
                                <Select2
                                  className="form-control"
                                  options={{
                                    placeholder: 'Chọn kho xuất',
                                  }}
                                  name="exportStore"
                                  value={values.exportStore}
                                  data={[
                                    ...(storeExports?.map((store) => ({ id: store.id, text: store.tenKho })) || []),
                                  ]}
                                  invalid={!!errors.exportStore}
                                  onChange={handleChange}
                                />
                                {errors.exportStore && <FormText color="danger">{errors.exportStore}</FormText>}
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Kho nhập&nbsp;
                                <i className="fa fa-asterisk fa-sm text-danger" />
                              </Label>
                              <Col md="9">
                                <Select2
                                  className="form-control"
                                  options={{
                                    placeholder: 'Chọn kho nhập',
                                  }}
                                  name="importStore"
                                  value={values.importStore}
                                  data={[
                                    ...(storeImports?.map((store) => ({ id: store.id, text: store.tenKho })) || []),
                                  ]}
                                  invalid={!!errors.importStore}
                                  onChange={handleChange}
                                />
                                {errors.importStore && <FormText color="danger">{errors.importStore}</FormText>}
                              </Col>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Người tạo phiếu&nbsp;
                                <i className="fa fa-asterisk fa-sm text-danger" />
                              </Label>
                              <Col md="9">
                                <Input
                                  type="text"
                                  name="billCreatedBy"
                                  value={values.billCreatedBy}
                                  invalid={!!errors.billCreatedBy}
                                  onChange={handleChange}
                                />
                                {errors.billCreatedBy && <FormText color="danger">{errors.billCreatedBy}</FormText>}
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Ngày xuất kho&nbsp;
                                <i className="fa fa-asterisk fa-sm text-danger" />
                              </Label>
                              <Col md="9">
                                <ReactDatetime
                                  inputProps={{ placeholder: 'Chọn ngày', name: 'exportDate' }}
                                  value={values.exportDate}
                                  timeFormat={false}
                                  //invalid={!!errors.exportDate}
                                  onChange={handleChange}
                                />
                                {errors.exportDate && <FormText color="danger">{errors.exportDate}</FormText>}
                              </Col>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <FormGroup className="row">
                              <Label className="form-control-label col-md-3 col-lg-1_5">Lý do xuất</Label>
                              <div className="col-md-9 col-lg-10_5">
                                <Input
                                  type="textarea"
                                  name="exportReason"
                                  value={values.exportReason}
                                  onChange={handleChange}
                                />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <FormGroup className="row">
                              <Label className="form-control-label col-md-3 col-lg-1_5">Thông tin cảnh báo</Label>
                              <div className="col-md-9 col-lg-10_5">
                                <Input
                                  type="textarea"
                                  name="warningInfo"
                                  value={values.warningInfo}
                                  onChange={handleChange}
                                />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <FormGroup className="row">
                              <Label className="form-control-label col-md-3 col-lg-1_5">Ghi chú</Label>
                              <div className="col-md-9 col-lg-10_5">
                                <Input
                                  type="textarea"
                                  name="billNote"
                                  value={values.billNote}
                                  onChange={handleChange}
                                />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </div>
                <ToolkitProvider
                  data={suppliesExportBillVatTus}
                  keyField="maVatTu"
                  columns={[
                    ...tableColumns,
                    {
                      dataField: 'action',
                      isDummyField: true,
                      text: 'Thao tác',
                      formatter: (_: any, row: (typeof suppliesExportBillVatTus)[0]) => {
                        return (
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteRow(row.maVatTu);
                            }}>
                            Xóa
                          </Link>
                        );
                      },
                    },
                  ]}>
                  {(props: any) => (
                    <>
                      <div className="d-flex justify-content-end px-4 pb-1">
                        <Button className="btn-neutral" onClick={toggleAddSuppliesModal}>
                          Thêm vật tư
                        </Button>
                      </div>
                      <div className="table-responsive py-4 mb-4">
                        <BootstrapTable
                          {...props.baseProps}
                          bootstrap4={true}
                          bordered={false}
                          cellEdit={tableCellEdit}
                          noDataIndication="Chưa có vật tư nào"
                        />
                      </div>
                      <div className="d-flex justify-content-between px-4 pb-1">
                        <Button className="btn-dark" onClick={() => navigate(Page.SUPPLIES_STORE_EXPORT_LIST.PATH)}>
                          Thoát
                        </Button>
                        <div>
                          <Button color="primary" onClick={toggleSaveModal}>
                            Lưu
                          </Button>
                          <Button color="primary">Xuất hàng</Button>
                        </div>
                      </div>
                    </>
                  )}
                </ToolkitProvider>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      <SaveExportBillModal
        isOpen={isOpenSaveModal}
        toggle={toggleSaveModal}
        handleConfirmClick={handleSaveConfirmClick}
      />
      <AddSuppliesModal
        isOpen={isOpenAddSuppliesModal}
        toggle={toggleAddSuppliesModal}
        handleConfirmClick={handleAddSuppliesConfirmClick}
      />
    </BasicTemplate>
  );
}

export default SuppliesStoreExportAdd;
