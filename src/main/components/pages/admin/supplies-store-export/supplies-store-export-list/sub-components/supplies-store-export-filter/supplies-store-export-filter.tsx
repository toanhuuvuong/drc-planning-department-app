import { Formik } from 'formik';
import { useKhovtMasterKhoControllerFind } from 'main/apis/drc/endpoints/khovt-master-kho-controller/khovt-master-kho-controller';
import moment, { Moment } from 'moment';
import { useMemo } from 'react';
import ReactDatetime from 'react-datetime';
import Select2 from 'react-select2-wrapper';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import DatePickerHelper from './date-picker-helper';

export type ExportFilter = {
  startDate?: Moment;
  endDate?: Moment;
  exportStore: string;
  importStore: string;
  exportBillNo: string;
  exportStatus: string;
};

enum FieldName {
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  EXPORT_STORE = 'exportStore',
  IMPORT_STORE = 'importStore',
  EXPORT_BILL_NO = 'exportBillNo',
  EXPORT_STATUS = 'exportStatus',
}

type Props = {
  handleSearchClick: (filter: ExportFilter) => void;
};

function SuppliesStoreExportFilter({ handleSearchClick }: Props) {
  // React State
  const initialValues: ExportFilter = {
    exportStore: '',
    importStore: '',
    exportBillNo: '',
    exportStatus: '',
  };

  // React Query
  const { data: storeExports } = useKhovtMasterKhoControllerFind();
  const { data: storeImports } = useKhovtMasterKhoControllerFind();

  // React Function
  const handleDateChange = (
    fieldName: string,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => any,
    currentDate: Moment,
    startDate?: Moment,
    endDate?: Moment,
  ) => {
    if (
      (fieldName === FieldName.START_DATE && endDate && endDate.toDate() < currentDate.toDate()) ||
      (fieldName === FieldName.END_DATE && startDate && startDate.toDate() > currentDate.toDate())
    ) {
      setFieldValue(FieldName.START_DATE, currentDate);
      setFieldValue(FieldName.END_DATE, currentDate);
    } else {
      setFieldValue(fieldName, currentDate);
    }
  };

  const exportStoreOptions = useMemo(() => {
    return [
      { id: '-1', text: 'Tất cả' },
      ...(storeExports?.map((store) => ({ id: store.id, text: store.tenKho })) || []),
    ];
  }, [storeExports]);

  const importStoreOptions = useMemo(() => {
    return [
      { id: '-1', text: 'Tất cả' },
      ...(storeImports?.map((store) => ({ id: store.id, text: store.tenKho })) || []),
    ];
  }, [storeImports]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {
        // do nothing
      }}>
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Từ ngày
                </Label>
                <Col md="9">
                  <ReactDatetime
                    inputProps={{ name: FieldName.START_DATE, placeholder: 'Chọn ngày' }}
                    timeFormat={false}
                    value={values.startDate}
                    onChange={(e) =>
                      handleDateChange(FieldName.START_DATE, setFieldValue, moment(e), values.startDate, values.endDate)
                    }
                    renderDay={(props, currentDate, _) =>
                      DatePickerHelper.renderDay(props, currentDate, values.startDate, values.endDate)
                    }
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Đến ngày
                </Label>
                <Col md="9">
                  <ReactDatetime
                    inputProps={{ name: FieldName.END_DATE, placeholder: 'Chọn ngày' }}
                    timeFormat={false}
                    value={values.endDate}
                    onChange={(e) =>
                      handleDateChange(FieldName.END_DATE, setFieldValue, moment(e), values.startDate, values.endDate)
                    }
                    renderDay={(props, currentDate, _) =>
                      DatePickerHelper.renderDay(props, currentDate, values.startDate, values.endDate)
                    }
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Kho xuất
                </Label>
                <Col md="9">
                  <Select2
                    className="form-control"
                    options={{
                      name: FieldName.EXPORT_STORE,
                      placeholder: 'Chọn kho xuất',
                      onChange: handleChange,
                    }}
                    value={values.exportStore}
                    data={exportStoreOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Kho nhập
                </Label>
                <Col md="9">
                  <Select2
                    className="form-control"
                    options={{
                      name: FieldName.IMPORT_STORE,
                      placeholder: 'Chọn kho nhập',
                      onChange: handleChange,
                    }}
                    value={values.importStore}
                    data={importStoreOptions}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Số phiếu xuất
                </Label>
                <Col md="9">
                  <Input
                    type="text"
                    name={FieldName.EXPORT_BILL_NO}
                    placeholder="Nhập số phiếu xuất"
                    value={values.exportBillNo}
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={12} lg={6}>
              <FormGroup className="row">
                <Label className="form-control-label" md="3">
                  Trạng thái
                </Label>
                <Col md="9">
                  <Select2
                    className="form-control"
                    options={{
                      name: FieldName.EXPORT_STATUS,
                      placeholder: 'Chọn trạng thái',
                      onChange: handleChange,
                    }}
                    value={values.exportStatus}
                    data={[
                      { id: '-1', text: 'Tất cả' },
                      { id: 'new', text: 'Tạo mới' },
                      { id: 'exported', text: 'Đã xuất hàng' },
                      { id: 'canceled', text: 'Đã hủy' },
                    ]}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button color="primary" onClick={() => handleSearchClick(values)}>
              Tìm kiếm
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default SuppliesStoreExportFilter;
