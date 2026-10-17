import { Formik } from 'formik';
import { Select2Box } from 'main/components/molecules/selectbox';
import { useProductStoreOptions } from 'main/hooks';
import { useAppSelector } from 'main/redux/hooks';
import { selectOrderItemFilter } from 'main/redux/modules/order-management/order-analytics-slice';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

function OrderItemListModalFilter() {
  // Redux
  const filter = useAppSelector(selectOrderItemFilter);

  // React State
  const { productStoreOptions, productStoresIsLoading } = useProductStoreOptions(false);

  if (productStoresIsLoading) {
    return null;
  }

  return (
    <Formik
      initialValues={filter}
      enableReinitialize
      onSubmit={() => {
        // do nothing
      }}>
      {({ values }) => (
        <Form>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="5">
                  Mã sản phẩm
                </Label>
                <Col md="7">
                  <Input type="text" placeholder="Nhập mã sản phẩm" value={values.orderItemProductCode} disabled />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="5">
                  Kho xuất
                </Label>
                <Col md="7">
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn kho xuất' }}
                    value={values.orderItemStoreCode}
                    data={productStoreOptions}
                    disabled={true}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}

export default OrderItemListModalFilter;
