import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';

type OrderCardProps = {
  title: string;
  count: number;
  iconClass: string;
  iconBgClass?: string;
  link: string;
  onClick: () => void;
};

function OverviewCard({ title, count, iconClass, iconBgClass = '', link, onClick }: Readonly<OrderCardProps>) {
  return (
    <Card className="card-stats border border-info" style={{ minHeight: '150px' }}>
      <CardBody>
        <Row>
          <div className="col">
            <CardTitle tag="h3" className="text-uppercase text-muted mb-0">
              {title}
            </CardTitle>
            <span className="h2 font-weight-bold mb-0">{count}</span>
          </div>
          <Col className="col-auto">
            <div className={`icon icon-shape ${iconBgClass} text-white rounded-circle shadow`}>
              <i className={iconClass} />
            </div>
          </Col>
        </Row>
        <div className="mt-3 mb-0 text-sm">
          <Link className="primary px-2" onClick={onClick} to={link}>
            Xem chi tiết
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

export default OverviewCard;
