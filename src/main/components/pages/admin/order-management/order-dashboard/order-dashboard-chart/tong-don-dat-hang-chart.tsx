import { DonHangChartTongDonDatHang } from 'main/apis/drc/models';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { getTongDonHangChartData, chartOptions } from './chart-data';

interface TongDonDatHangChartProps {
  donDatHangChartData: DonHangChartTongDonDatHang[] | undefined;
}

function TongDonDatHangChart({ donDatHangChartData }: TongDonDatHangChartProps) {
  return (
    <Card>
      <CardHeader>
        <h6 className="surtitle">Biểu đồ</h6>
        <h5 className="h3 mb-0">Tổng đơn sản phẩm đặt hàng</h5>
      </CardHeader>
      <CardBody>
        <div className="chart">
          <Bar
            data={getTongDonHangChartData(donDatHangChartData)}
            options={chartOptions}
            id="chart-bars"
            // @ts-ignore
            className="chart-canvas"
          />
        </div>
      </CardBody>
    </Card>
  );
}

export default TongDonDatHangChart;
