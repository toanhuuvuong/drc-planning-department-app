import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { useQldhTransDonHangControllerSearchThongKe } from 'main/apis/drc/endpoints/qldh-trans-don-hang-controller/qldh-trans-don-hang-controller';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { Page } from 'main/constants';
import { useCallback, useEffect, useMemo } from 'react';
import { Button, Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import OrderAnalyticsTable from './order-analytics-table/order-analytics-table';

function OrderAnalytics() {
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['OrderManagementWarnings'] });
  }, []);

  const { data: orderManagementWarnings, isLoading: isOrderManagementWarningsLoading } =
    useQldhTransDonHangControllerSearchThongKe({});

  const formattedData = useMemo(
    () =>
      orderManagementWarnings?.map((item, index) => ({
        ...item,
        stt: index + 1,
        maQc: item.maSanPham,
        tongTonKho: item.tonKho,
        soLuongTongDatHang: item.soLuong,
        soLuongGiuHang: item.soLuongGiuHang,
        tonDuKien: item?.tonKho || 0 - (item?.soLuongGiuHang || 0), // giả định tồn dự kiến
        soLuongSanXuatThem: item.soLuongSanXuatThem,
        noiDia: item.soLuongNoiDia,
        quocTe: item.soLuongNuocNgoai,
        donHangCount: item.soLuongDonHangItem,
        nppCount: item.soLuongNpp,
      })) || [],
    [orderManagementWarnings],
  );

  const handleExportExcelClick = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ThongKeDonHang');

    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 10 },
      { header: 'MÃ QC', key: 'maQc', width: 15 },
      { header: 'Tổng Tồn Kho', key: 'tongTonKho', width: 15 },
      { header: 'Số lượng Tổng Đặt Hàng', key: 'soLuongTongDatHang', width: 20 },
      { header: 'Số lượng giữ hàng', key: 'soLuongGiuHang', width: 20 },
      { header: 'Tồn Dự Kiến', key: 'tonDuKien', width: 15 },
      { header: 'Số Lượng SX thêm', key: 'soLuongSanXuatThem', width: 20 },
      { header: 'Nội địa', key: 'noiDia', width: 10 },
      { header: 'Quốc tế', key: 'quocTe', width: 10 },
      { header: 'Có bao nhiêu đơn hàng', key: 'donHangCount', width: 20 },
      { header: 'Có bao nhiêu NPP', key: 'nppCount', width: 20 },
    ];

    worksheet.addRows(formattedData);

    worksheet.columns.forEach((column) => {
      const maxLength = column.values?.reduce((acc, val) => Math.max(acc as any, val?.toString().length || 0), 10);
      column.width = ((maxLength as any) + 2) as any;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ThongKeDonHang.xlsx');
  }, [formattedData]);

  return (
    <BasicTemplate
      pageCategory={Page.ORDER_MANAGEMENT_ANALYTICS.CATEGORY}
      pageTitle={Page.ORDER_MANAGEMENT_ANALYTICS.TITLE}
      pageName={Page.ORDER_MANAGEMENT_ANALYTICS.NAME}
      isLoading={isOrderManagementWarningsLoading}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <div className="d-flex justify-content-end mb-4 pb-1">
              <Button color="primary" onClick={handleExportExcelClick}>
                Xuất file excel
              </Button>
            </div>
            <OrderAnalyticsTable data={formattedData} dataIsLoading={isOrderManagementWarningsLoading} />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

export default OrderAnalytics;
