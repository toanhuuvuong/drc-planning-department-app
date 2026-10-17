import { Formik } from 'formik';
import { Select2Box } from 'main/components/molecules/selectbox';
import { FieldName } from 'main/constants/enums';
import { useProductGroupOptions } from 'main/hooks';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import { ProductFilter } from 'main/redux/modules/product-store-import/product-store-import-add-slice';
import {
  clickSearchProduct,
  selectProductFilter,
} from 'main/redux/modules/product-store-import/product-store-import-edit-slice';
import { ChangeEvent, useCallback } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

function AddProductModalFilter() {
  // Redux
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectProductFilter);

  // React State
  const { productGroupOptions } = useProductGroupOptions(true);

  // React Function
  const handleSearchClick = useCallback(
    (newFilter: ProductFilter) => {
      dispatch(clickSearchProduct(newFilter));
    },
    [dispatch],
  );

  return (
    <Formik
      initialValues={filter}
      enableReinitialize
      onSubmit={() => {
        // do nothing
      }}>
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Nhóm sản phẩm
                </Label>
                <Col md="9">
                  <Select2Box
                    className="form-control"
                    options={{
                      placeholder: 'Chọn nhóm sản phẩm',
                    }}
                    value={values.productGroup}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue(FieldName.PRODUCT_GROUP, e.target.value)
                    }
                    data={productGroupOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Mã sản phẩm
                </Label>
                <Col md="9">
                  <Input
                    className="form-control"
                    placeholder="Nhập mã sản phẩm"
                    name={FieldName.PRODUCT_CODE}
                    value={values.productCode}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Tên sản phẩm
                </Label>
                <Col md="9">
                  <Input
                    className="form-control"
                    placeholder="Nhập tên sản phẩm"
                    name={FieldName.PRODUCT_NAME}
                    value={values.productName}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Tên gợi nhớ
                </Label>
                <Col md="9">
                  <Input
                    className="form-control"
                    placeholder="Nhập tên gợi nhớ"
                    name={FieldName.PRODUCT_SUGGESTIVE_NAME}
                    value={values.productSuggestiveName}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button color="primary" onClick={() => handleSearchClick(values)}>
              Lọc dữ liệu
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AddProductModalFilter;
