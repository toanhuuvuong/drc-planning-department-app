import Chart from 'chart.js';
import type { DonHangChartTongDonDatHang } from 'main/apis/drc/models';
import { ChartData } from 'react-chartjs-2';

export function getTongDonHangChartData(
  donDatHangChartData: DonHangChartTongDonDatHang[] | undefined,
): ChartData<Chart.ChartData> {
  if (donDatHangChartData === undefined) {
    return { labels: [], datasets: [{ data: [] }] };
  }

  const listMaKho = donDatHangChartData.map((data) => data.maKho);
  const listSoLuong = donDatHangChartData.map((data) => data.tongSanPhamDatHang);

  return {
    labels: listMaKho,
    datasets: [
      {
        label: 'Số lượng đặt hàng',
        data: listSoLuong,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
        maxBarThickness: 40, // max chiều rộng của bar
      },
    ],
  };
}

export const chartOptions: Chart.ChartOptions = {
  scales: {
    gridLines: {
      display: false,
    },
    yAxes: [
      {
        ticks: {
          stepSize: 5, // Cách nhau mỗi 5 đơn vị
          callback: function (value: number) {
            return value % 5 === 0 ? value : ''; // Chỉ hiển thị giá trị chia hết cho 5
          },
        },
      },
    ],
  },
};
