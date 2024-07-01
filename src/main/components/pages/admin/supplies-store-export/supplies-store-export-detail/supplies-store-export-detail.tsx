import { useKhovtMasterKhoControllerFind } from 'main/apis/drc/endpoints/khovt-master-kho-controller/khovt-master-kho-controller';
import { useKhovtTransPhieuXuatControllerFindById } from 'main/apis/drc/endpoints/khovt-trans-phieu-xuat-controller/khovt-trans-phieu-xuat-controller';
import BasicTemplate from 'main/components/templates/basic-template/basic-template';
import { Page } from 'main/constants';
import moment from 'moment';
import { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import ReactDatetime from 'react-datetime';
import { useNavigate, useParams } from 'react-router-dom';
import Select2 from 'react-select2-wrapper';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import CancelExportBillModal from './cancel-export-bill-modal';
import { tableColumns, tableExportCSV } from './configs';
import './supplies-store-export-detail.scss';

const { ExportCSVButton } = CSVExport;

export const suppliesExportBillVatTus = [
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

function SuppliesStoreExportDetail() {
  const { id: suppliesExportBillId } = useParams();
  const navigate = useNavigate();

  // React State
  const [isOpenCancelModal, setOpenCancelModal] = useState(false);

  // React Query hooks
  const { data: storeExports } = useKhovtMasterKhoControllerFind();
  const { data: storeImports } = useKhovtMasterKhoControllerFind();
  const { data: suppliesExportBill, isLoading: suppliesExportBillIsLoading } = useKhovtTransPhieuXuatControllerFindById(
    Number(suppliesExportBillId),
    undefined,
    {
      query: {
        enabled: !!suppliesExportBillId,
      },
    },
  );

  // React function
  const toggleCancelModal = () => setOpenCancelModal(!isOpenCancelModal);

  const handleCancelConfirmClick = () => {
    toggleCancelModal();
  };

  return (
    <BasicTemplate
      pageTitle={Page.SUPPLIES_STORE_EXPORT_DETAIL.TITLE}
      pageName={Page.SUPPLIES_STORE_EXPORT_DETAIL.NAME}
      isLoading={suppliesExportBillIsLoading}>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0 text-center">SỐ PHIẾU XUẤT</h3>
              </CardHeader>
              <CardBody>
                {suppliesExportBill && (
                  <>
                    <div className="px-4 pb-1">
                      <Form>
                        <Row>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Số phiếu xuất
                              </Label>
                              <Col md="9">
                                <Input type="text" value={suppliesExportBill.soPhieu || ''} disabled />
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
                                  value={suppliesExportBill.status}
                                  data={[
                                    { id: '-1', text: 'Tất cả' },
                                    { id: 'new', text: 'Tạo mới' },
                                    { id: 'exported', text: 'Đã xuất hàng' },
                                    { id: 'canceled', text: 'Đã hủy' },
                                  ]}
                                  disabled={true}
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Kho xuất
                              </Label>
                              <Col md="9">
                                <Select2
                                  className="form-control"
                                  value={suppliesExportBill.khoNhap}
                                  data={[
                                    { id: '-1', text: 'Tất cả' },
                                    ...(storeExports?.map((store) => ({ id: store.id, text: store.tenKho })) || []),
                                  ]}
                                  disabled={true}
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Kho nhập
                              </Label>
                              <Col md="9">
                                <Select2
                                  className="form-control"
                                  value={suppliesExportBill.khoXuat}
                                  data={[
                                    { id: '-1', text: 'Tất cả' },
                                    ...(storeImports?.map((store) => ({ id: store.id, text: store.tenKho })) || []),
                                  ]}
                                  disabled={true}
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Người tạo phiếu
                              </Label>
                              <Col md="9">
                                <Input type="text" value={suppliesExportBill.nguoiTaoPhieu || ''} disabled />
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col md={12} lg={6}>
                            <FormGroup className="row">
                              <Label className="form-control-label" md="3">
                                Ngày xuất kho
                              </Label>
                              <Col md="9">
                                <ReactDatetime
                                  inputProps={{ disabled: true }}
                                  value={moment(suppliesExportBill.ngayXuat)}
                                  timeFormat={false}
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <FormGroup className="row">
                              <Label className="form-control-label col-md-3 col-lg-1_5">Lý do xuất</Label>
                              <div className="col-md-9 col-lg-10_5">
                                <Input type="textarea" value={suppliesExportBill.diDoXuat || ''} disabled />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <FormGroup className="row">
                              <Label className="form-control-label col-md-3 col-lg-1_5">Thông tin cảnh báo</Label>
                              <div className="col-md-9 col-lg-10_5">
                                <Input type="textarea" value={suppliesExportBill.thongTinCanhBao || ''} disabled />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <FormGroup className="row">
                              <Label className="form-control-label col-md-3 col-lg-1_5">Ghi chú</Label>
                              <div className="col-md-9 col-lg-10_5">
                                <Input type="textarea" value={suppliesExportBill.ghiChu || ''} disabled />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                    <ToolkitProvider
                      data={suppliesExportBillVatTus}
                      keyField="maVatTu"
                      columns={tableColumns}
                      exportCSV={tableExportCSV}>
                      {(props: any) => (
                        <>
                          <div className="table-responsive py-4 mb-4">
                            <BootstrapTable
                              {...props.baseProps}
                              bootstrap4={true}
                              bordered={false}
                              noDataIndication="Không có kết quả nào được tìm thấy"
                            />
                          </div>
                          <div className="d-flex justify-content-between px-4 pb-1">
                            <Button className="btn-dark" onClick={() => navigate(Page.SUPPLIES_STORE_EXPORT_LIST.PATH)}>
                              Thoát
                            </Button>
                            <Button color="danger" onClick={toggleCancelModal}>
                              Hủy phiếu xuất
                            </Button>
                            <ExportCSVButton className="btn-neutral" {...props.csvProps}>
                              Tải phiếu xuất
                            </ExportCSVButton>
                          </div>
                        </>
                      )}
                    </ToolkitProvider>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      <CancelExportBillModal
        suppliesExportBillId={suppliesExportBillId}
        isOpen={isOpenCancelModal}
        toggle={toggleCancelModal}
        handleConfirmClick={handleCancelConfirmClick}
      />
    </BasicTemplate>
  );
}

export default SuppliesStoreExportDetail;
