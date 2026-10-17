import {
  useKhovtTransPhieuXuatControllerCancelById,
  useKhovtTransPhieuXuatControllerFindById,
  useKhovtTransPhieuXuatControllerUpdateById,
} from 'main/apis/drc/endpoints/khovt-trans-phieu-xuat-controller/khovt-trans-phieu-xuat-controller';
import {
  KhovtTransPhieuXuatControllerFindDetail200DataItem,
  KhovtTransPhieuXuatWithRelations,
} from 'main/apis/drc/models';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { ExportStatus, FieldName } from 'main/constants/enums';
import { useCallback, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Container, Row } from 'reactstrap';
import CancelExportBillModal from './sub-components/cancel-export-bill-modal';
import ExportBillModal from './sub-components/export-bill-modal';
import SuppliesStoreExportDetailInfo from './sub-components/supplies-store-export-detail-info';
import SuppliesStoreExportDetailTable from './sub-components/supplies-store-export-detail-table/supplies-store-export-detail-table';
import tableConfig from './table-config';

function SuppliesStoreExportDetail() {
  // React Router
  const { id: suppliesExportBillId } = useParams();
  const navigate = useNavigate();

  // React State
  const [isOpenCancelModal, setOpenCancelModal] = useState(false);
  const [isOpenExportModal, setOpenExportModal] = useState(false);

  // React Query hooks
  const {
    data: suppliesExportBill,
    isLoading: suppliesExportBillIsLoading,
    refetch: suppliesExportBillRefetch,
  } = useKhovtTransPhieuXuatControllerFindById(Number(suppliesExportBillId), {
    query: {
      enabled: !!suppliesExportBillId,
    },
  });

  const { isPending: canceledSuppliesExportBillIsPending, mutateAsync: canceledSuppliesExportBillMutateAsync } =
    useKhovtTransPhieuXuatControllerCancelById();

  const { isPending: updatedSuppliesExportBillIsPending, mutateAsync: updatedSuppliesExportBillMutateAsync } =
    useKhovtTransPhieuXuatControllerUpdateById();

  // React function
  const toggleCancelModal = useCallback(() => setOpenCancelModal((isOpenCancelModal) => !isOpenCancelModal), []);

  const toggleExportModal = useCallback(() => setOpenExportModal((isOpenExportModal) => !isOpenExportModal), []);

  const handleCancelModalConfirmClick = useCallback(() => {
    // Close modal
    toggleCancelModal();

    // Update export status to Canceled
    canceledSuppliesExportBillMutateAsync({ id: Number(suppliesExportBillId) })
      .then((_) => {
        // Refresh
        suppliesExportBillRefetch();
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [canceledSuppliesExportBillMutateAsync, suppliesExportBillId, suppliesExportBillRefetch, toggleCancelModal]);

  const handleExportConfirmClick = useCallback(() => {
    // Close modal
    toggleExportModal();

    // Update bill with Exported status
    updatedSuppliesExportBillMutateAsync({
      id: Number(suppliesExportBillId),
      data: {
        status: ExportStatus.Exported.id,
        details: [],
      },
    })
      .then((_) => {
        // Refresh
        suppliesExportBillRefetch();
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [suppliesExportBillId, suppliesExportBillRefetch, toggleExportModal, updatedSuppliesExportBillMutateAsync]);

  return (
    <BasicTemplate
      pageCategory={Page.SUPPLIES_STORE_EXPORT_DETAIL.CATEGORY}
      pageTitle={Page.SUPPLIES_STORE_EXPORT_DETAIL.TITLE}
      pageName={Page.SUPPLIES_STORE_EXPORT_DETAIL.NAME}
      parentPage={{
        name: Page.SUPPLIES_STORE_EXPORT_LIST.NAME,
        path: Page.SUPPLIES_STORE_EXPORT_LIST.PATH,
      }}
      isLoading={
        suppliesExportBillIsLoading || canceledSuppliesExportBillIsPending || updatedSuppliesExportBillIsPending
      }>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader>
                <h3 className="mb-0 text-center">KHO VẬT TƯ - PHIẾU XUẤT #{suppliesExportBillId}</h3>
              </CardHeader>
              <CardBody>
                {suppliesExportBill && (
                  <>
                    <SuppliesStoreExportDetailInfo suppliesExportBill={suppliesExportBill} />
                    <SuppliesStoreExportDetailTable supplies={suppliesExportBill.details} />
                    <CancelExportBillModal
                      suppliesExportBillId={suppliesExportBillId}
                      isOpen={isOpenCancelModal}
                      toggle={toggleCancelModal}
                      handleConfirmClick={handleCancelModalConfirmClick}
                    />
                    <ExportBillModal
                      isOpen={isOpenExportModal}
                      toggle={toggleExportModal}
                      handleConfirmClick={handleExportConfirmClick}
                    />
                  </>
                )}
              </CardBody>
              <CardFooter>
                <div className="d-flex justify-content-between pb-1">
                  <Button color="secondary" onClick={() => navigate(Page.SUPPLIES_STORE_EXPORT_LIST.PATH)}>
                    Quay lại
                  </Button>
                  <div>
                    <EditPermissionAction>
                      <Button
                        disabled={suppliesExportBill?.status === ExportStatus.Canceled.id}
                        color="danger"
                        onClick={toggleCancelModal}>
                        Hủy phiếu xuất
                      </Button>
                    </EditPermissionAction>
                    {/*
                    <Button
                      color="primary"
                      onClick={toggleExportModal}
                      disabled={suppliesExportBill?.status !== ExportStatus.Open.id}>
                      Xuất hàng
                    </Button>
                    */}
                  </div>
                  <ToolkitProvider
                    data={getExportSuppliesDetails(suppliesExportBill)}
                    keyField={FieldName.ID}
                    columns={tableConfig.columns}
                    exportCSV={tableConfig.exportCSV}>
                    {(props: any) => (
                      <>
                        {/* <ExportCSVButton color="primary hidden" {...props.csvProps}>
                          Tải phiếu xuất
                        </ExportCSVButton> */}
                        <div className="d-none">
                          <BootstrapTable {...props.baseProps} bootstrap4={true} bordered={false} />
                        </div>
                      </>
                    )}
                  </ToolkitProvider>
                </div>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </BasicTemplate>
  );
}

const getExportSuppliesDetails = (
  suppliesExportBill?: KhovtTransPhieuXuatWithRelations,
): KhovtTransPhieuXuatControllerFindDetail200DataItem[] => {
  if (!suppliesExportBill || !suppliesExportBill.details) {
    return [];
  }

  const { details: exportDetails, ...exportBillInfo } = suppliesExportBill;
  const { khoNhap, khoXuat, ngayXuat, nguoiTaoPhieu, soPhieu, status } = exportBillInfo;

  return exportDetails.map(({ maVt, soLuongThucTe, soLuongYeuCau }) => ({
    khoNhap,
    khoXuat,
    maVt,
    ngayXuat,
    nguoiTaoPhieu,
    soLuongThucTe,
    soLuongYeuCau,
    soPhieu,
    status,
  }));
};

export default SuppliesStoreExportDetail;
