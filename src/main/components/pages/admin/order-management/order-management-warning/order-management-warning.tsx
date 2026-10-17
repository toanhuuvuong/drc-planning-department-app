import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { map } from 'lodash';
import { useQldhTransDonHangControllerSearchCanhBao } from 'main/apis/drc/endpoints/qldh-trans-don-hang-controller/qldh-trans-don-hang-controller';
import BasicTemplate from 'main/components/templates/basic-template';
import { queryClient } from 'main/configs/react-query';
import { DateFormat, Page } from 'main/constants';
import { TrangThaiDonHang } from 'main/constants/enums/order-management';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Container, Row } from 'reactstrap';
import ProductStoreInventoryWarningTable from './order-management-warning-table/order-management-warning-table';

const convertOrderStatus = (status: string) => {
  switch (status) {
    case '-1':
      return 'Tất cả';
    case TrangThaiDonHang.TAM_DUNG:
      return 'Tạm dừng';
    case TrangThaiDonHang.DANG_TIEN_HANH:
      return 'Đang tiến hành';
    case TrangThaiDonHang.HOAN_THANH:
      return 'Hoàn Thành';
    default:
      return 'Chưa xác định';
  }
};

function OrderManagementWarning() {
  // React Effect
  useEffect(() => {
    // Clear cache
    queryClient.invalidateQueries({ queryKey: ['OrderManagementWarnings'] });
  }, []);

  // React Query
  const { data: OrderManagementWarnings, isLoading: OrderManagementWarningsIsLoading } =
    useQldhTransDonHangControllerSearchCanhBao({});

  // const handleExportExcelClick = useCallback(async () => {
  //   // worksheet.columns = [
  //   //   { header: 'Mã Đơn Hàng', key: 'donHangId', width: 15 },
  //   //   { header: 'Tên Khách Hàng', key: 'tenKH', width: 20 },
  //   //   { header: 'Ngày Đặt Hàng', key: 'ngayDatHang', width: 15 },
  //   //   { header: 'Ngày Giao Thực Tế', key: 'ngayGiaoThucTe', width: 20 },
  //   //   { header: 'Số Lượng', key: 'soLuong', width: 10 },
  //   //   { header: 'Trạng Thái', key: 'trangThai', width: 15 },
  //   // ];
  //   const filteredData = OrderManagementWarnings?.map((item: any) => ({
  //     donHangId: item.donHangId,
  //     tenKH: item.tenKH,
  //     ngayDatHang: moment(item.ngayDatHang).format(DateFormat.DATE_ONLY_VN) || '',
  //     ngayGiaoThucTe: moment(item.ngayGiaoThucTe).format(DateFormat.DATE_ONLY_VN) || '',
  //     soLuong: item.soLuong,
  //     trangThai: item.trangThai,
  //   }));
  //   exportToExcel(filteredData, 'CanhBaoDonHang.xlsx');
  // }, [OrderManagementWarnings]);

  const handleExportExcelClick = useCallback(async () => {
    // Prepare the data for export
    const filteredData = OrderManagementWarnings?.map((item: any) => ({
      donHangId: item.donHangId,
      tenKH: item.tenKH,
      ngayDatHang: moment(item.ngayDatHang).format(DateFormat.DATE_ONLY_VN) || '',
      ngayGiaoThucTe: moment(item.ngayGiaoThucTe).format(DateFormat.DATE_ONLY_VN) || '',
      soLuong: item.soLuong,
      trangThai: convertOrderStatus(item.trangThai),
    }));

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CanhBaoDonHang');

    // Define columns for the header
    worksheet.columns = [
      { header: 'Mã Đơn Hàng', key: 'donHangId', width: 15 },
      { header: 'Tên Khách Hàng', key: 'tenKH', width: 20 },
      { header: 'Ngày Đặt Hàng', key: 'ngayDatHang', width: 15 },
      { header: 'Ngày Giao Thực Tế', key: 'ngayGiaoThucTe', width: 20 },
      { header: 'Số Lượng', key: 'soLuong', width: 10 },
      { header: 'Trạng Thái', key: 'trangThai', width: 15 },
    ];

    // Add data to the worksheet
    worksheet.addRows(filteredData as any);

    // Auto-adjust column widths based on the content
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const length = cell.value ? String(cell.value).length : 0;
        if (length > maxLength) {
          maxLength = length;
        }
      });
      column.width = maxLength + 2;
    });

    // Export the workbook as a Buffer and trigger download
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, 'CanhBaoDonHang.xlsx');
    });
  }, [OrderManagementWarnings]);

  const convertOrderManagementWarnings = (data?: any[]) => {
    return map(data, (item) => ({
      ...item,
      trangThai: convertOrderStatus(item.trangThai),
    }));
  };

  return (
    <BasicTemplate
      pageCategory={Page.ORDER_MANAGEMENT_WARNING.CATEGORY}
      pageTitle={Page.ORDER_MANAGEMENT_WARNING.TITLE}
      pageName={Page.ORDER_MANAGEMENT_WARNING.NAME}
      isLoading={OrderManagementWarningsIsLoading}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <div className="d-flex justify-content-end mb-4 pb-1">
              <Button color="primary" onClick={handleExportExcelClick}>
                Xuất file excel
              </Button>
            </div>
            <ProductStoreInventoryWarningTable
              data={convertOrderManagementWarnings(OrderManagementWarnings)}
              dataIsLoading={OrderManagementWarningsIsLoading}
            />
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

export default OrderManagementWarning;
