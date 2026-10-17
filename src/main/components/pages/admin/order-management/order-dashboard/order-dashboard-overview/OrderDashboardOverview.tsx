import { Page } from 'main/constants';
import { OrderStatusOptions } from 'main/constants/enums';
import React from 'react';
import { Col } from 'reactstrap';
import OverviewCard from './OverviewCard';

interface OverviewCardListProps {
  orderManagementCount: any;
  handleSearchClick: (newFilter: any) => void;
}

const OrderDashboardOverview: React.FC<OverviewCardListProps> = ({ orderManagementCount, handleSearchClick }) => {
  const overviewCards = [
    {
      title: 'Đơn sắp đến hạn giao hàng',
      count: orderManagementCount?.tongDonSapDenHanGiaoHang,
      iconClass: 'fa fa-clock',
      iconBgClass: 'bg-gradient-warning',
      link: Page.ORDER_MANAGEMENT_WARNING.PATH,
      onClick: () =>
        handleSearchClick({
          searchKey: 'startDate',
          importStore: '',
          origin: '',
          importStatus: '',
        }),
    },
    {
      title: 'Tổng đơn',
      count: orderManagementCount?.tongDonHang,
      iconClass: 'fa fa-list',
      iconBgClass: 'bg-gradient-info',
      link: `${Page.ORDER_MANAGEMENT_LIST.PATH}?enableTongDonSearchMode=true`,
      onClick: () =>
        handleSearchClick({
          importStatus: '',
          importStore: '',
          origin: '',
          enableTongDonSearchMode: true,
        }),
    },
    {
      title: 'Đơn hoàn thành',
      count: orderManagementCount?.tongDonHoanThanhTrongThang,
      iconClass: 'fa fa-check-circle',
      iconBgClass: 'bg-gradient-success',
      link: Page.ORDER_MANAGEMENT_LIST.PATH,
      onClick: () =>
        handleSearchClick({
          importStatus: OrderStatusOptions[2].id,
          importStore: '',
          origin: '',
        }),
    },
    {
      title: 'Đơn đang tiến hành',
      count: orderManagementCount?.tongDonDangTienHanh,
      iconClass: 'fa fa-spinner',
      iconBgClass: 'bg-gradient-primary',
      link: Page.ORDER_MANAGEMENT_LIST.PATH,
      onClick: () =>
        handleSearchClick({
          importStatus: OrderStatusOptions[0].id,
          importStore: '',
          origin: '',
        }),
    },
    {
      title: 'Đơn tạm dừng',
      count: orderManagementCount?.tongDonTamHoan,
      iconClass: 'fa fa-pause-circle',
      iconBgClass: 'bg-gradient-danger',
      link: Page.ORDER_MANAGEMENT_LIST.PATH,
      onClick: () =>
        handleSearchClick({
          importStatus: OrderStatusOptions[1].id,
          importStore: '',
          origin: '',
        }),
    },
  ];

  return (
    <>
      {overviewCards.map((card, index) => (
        <Col md="6" xl="3" key={index} style={{ minHeight: '160px' }}>
          <OverviewCard
            title={card.title}
            count={card.count}
            iconClass={card.iconClass}
            iconBgClass={card.iconBgClass}
            link={card.link}
            onClick={card.onClick}
          />
        </Col>
      ))}
    </>
  );
};

export default OrderDashboardOverview;
