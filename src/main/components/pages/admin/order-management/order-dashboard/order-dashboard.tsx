import Chart from 'chart.js';
import {
  useQldhTransDonHangControllerCountDonHangDashboard,
  useQldhTransDonHangControllerGetChartTongDonDatHangTheoKho,
} from 'main/apis/drc/endpoints/qldh-trans-don-hang-controller/qldh-trans-don-hang-controller';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { parseDefaultOptions } from 'main/constants/chart-constant';
import { useAppDispatch } from 'main/redux/hooks';
import { clickSearchImport, ImportFilter } from 'main/redux/modules/order-management/order-management-list-slice';
import moment from 'moment';
import React, { useCallback } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import TongDonDatHangChart from './order-dashboard-chart/tong-don-dat-hang-chart';
import { OrderDashboardOverview } from './order-dashboard-overview';

function OrderDashboard() {
  const { data: orderManagementCount } = useQldhTransDonHangControllerCountDonHangDashboard({});
  const { data: tongDonDatHangChartData } = useQldhTransDonHangControllerGetChartTongDonDatHangTheoKho();

  const dispatch = useAppDispatch();

  const getDateRangeForUpcomingOrders = () => {
    const startDate = moment();
    const endDate = moment().add(30, 'days');
    return { startDate, endDate };
  };

  const handleSearchClick = useCallback(
    (newFilter: ImportFilter) => {
      const { startDate, endDate } = getDateRangeForUpcomingOrders();

      const searchSanPham = {
        startDate: newFilter?.searchKey ? startDate : undefined,
        endDate: newFilter?.searchKey ? endDate : undefined,
        importStatus: newFilter?.importStatus,
        // enableTongDonSearchMode: newFilter?.enableTongDonSearchMode || undefined,
      };

      dispatch(clickSearchImport(searchSanPham as any));
    },
    [dispatch],
  );

  if (window.Chart) {
    parseDefaultOptions(Chart);
  }

  return (
    <BasicTemplate
      pageCategory={Page.ORDER_DASHBOARD.CATEGORY}
      pageTitle={Page.ORDER_DASHBOARD.TITLE}
      pageName={Page.ORDER_DASHBOARD.NAME}>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody className="mt-2">
            <Row>
              <OrderDashboardOverview
                orderManagementCount={orderManagementCount}
                handleSearchClick={handleSearchClick}
              />
            </Row>
            <Row>
              <Col xl={12}>
                <TongDonDatHangChart donDatHangChartData={tongDonDatHangChartData} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </BasicTemplate>
  );
}

export default OrderDashboard;
