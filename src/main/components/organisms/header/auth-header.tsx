import { Col, Container, Row } from 'reactstrap';

type Props = {
  title: string;
  lead: string;
};

function AuthHeader({ title, lead }: Props) {
  return (
    <div className="header bg-gradient-info py-7 py-lg-8 pt-lg-9">
      <Container>
        <div className="header-body text-center mb-7">
          <Row className="justify-content-center">
            <Col className="px-5" lg="6" md="8" xl="5">
              {title ? <h1 className="text-white">{title}</h1> : null}
              {lead ? <p className="text-lead text-white">{lead}</p> : null}
            </Col>
          </Row>
        </div>
      </Container>
      <div className="separator separator-bottom separator-skew zindex-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0">
          <polygon className="fill-default" points="2560 0 2560 100 0 100" />
        </svg>
      </div>
    </div>
  );
}

export default AuthHeader;
