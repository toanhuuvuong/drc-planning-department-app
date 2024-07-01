import { Page } from 'main/constants';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from 'reactstrap';

type Props = {
  pageName: string;
  parentPage?: {
    name: string;
    path: string;
  };
};

function SimpleHeader({ pageName, parentPage }: Props) {
  return (
    <div className="header header-dark bg-info pb-6 content__title content__title--calendar">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6" xs="7">
              <h6 className="fullcalendar-title h2 text-white d-inline-block mb-0">{pageName}</h6>&nbsp;
              <Breadcrumb className="d-none d-md-inline-block ml-lg-4" listClassName="breadcrumb-links breadcrumb-dark">
                <BreadcrumbItem>
                  <Link to={Page.DASHBOARD.PATH}>
                    <i className="fas fa-home" />
                  </Link>
                </BreadcrumbItem>
                {parentPage && (
                  <BreadcrumbItem>
                    <Link to={parentPage.path}>{parentPage.name}</Link>
                  </BreadcrumbItem>
                )}
                <BreadcrumbItem aria-current="page" className="active">
                  {pageName}
                </BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default SimpleHeader;
