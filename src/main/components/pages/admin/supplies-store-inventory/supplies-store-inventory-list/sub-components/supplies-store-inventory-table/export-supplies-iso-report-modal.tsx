import saveAs from 'file-saver';
import { Formik } from 'formik';
import { khovtTransPhieuNhapControllerFindDetail } from 'main/apis/drc/endpoints/khovt-trans-phieu-nhap-controller/khovt-trans-phieu-nhap-controller';
import { khovtTransPhieuXuatControllerFindDetail } from 'main/apis/drc/endpoints/khovt-trans-phieu-xuat-controller/khovt-trans-phieu-xuat-controller';
import {
  khovtXuatNhapTonControllerFind,
  khovtXuatNhapTonControllerFindDetailByLoHang,
  khovtXuatNhapTonControllerFindDetailBySoPhieu,
} from 'main/apis/drc/endpoints/khovt-xuat-nhap-ton-controller/khovt-xuat-nhap-ton-controller';
import {
  KhovtTransPhieuNhapControllerFindDetailParams,
  KhovtTransPhieuXuatControllerFindDetailParams,
  KhovtXuatNhapTonControllerFindDetailByLoHangParams,
  KhovtXuatNhapTonControllerFindDetailBySoPhieuParams,
  KhovtXuatNhapTonControllerFindParams,
} from 'main/apis/drc/models';
import { DatePicker } from 'main/components/atoms/date';
import { TransparentSpinner } from 'main/components/atoms/spiner';
import { Select2Box } from 'main/components/molecules/selectbox';
import { DateFormat, ValidationMessage } from 'main/constants';
import { FieldName, SuppliesISOReportTemplateType } from 'main/constants/enums';
import {
  useSuppliesISOReportTemplateTypeOptions,
  useSuppliesStoreOptions,
  useSuppliesUnitAndOriginOptions,
} from 'main/hooks';
import { DateUtil } from 'main/utils';
import {
  SuppliesStoreExportExcelWriter,
  SuppliesStoreImportDetailExcelWriter,
  SuppliesStoreImportExcelWriter,
  SuppliesStoreInventoryDetailByLoHangExcelWriter,
  SuppliesStoreInventoryDetailBySoPhieuExcelWriter,
  SuppliesStoreInventoryExcelWriter,
} from 'main/utils/excel-writer';
import moment, { Moment } from 'moment';
import { ChangeEvent, useCallback, useState } from 'react';
import { Form } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Col, FormGroup, FormText, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';

export type ExportSuppliesISOReportFilter = {
  suppliesISOReportTemplateType?: string;
  startDate?: Moment;
  endDate?: Moment;
  suppliesStore: string;
  importStore: string;
};

const initialFilter: ExportSuppliesISOReportFilter = {
  suppliesISOReportTemplateType: undefined,
  startDate: undefined,
  endDate: undefined,
  suppliesStore: '-1',
  importStore: '-1',
};

const filterValidationSchema = Yup.object().shape({
  suppliesISOReportTemplateType: Yup.string().required(ValidationMessage.REQUIRED),
  suppliesStore: Yup.string().when(['suppliesISOReportTemplateType'], ([suppliesISOReportTemplateType], schema) => {
    return suppliesISOReportTemplateType === SuppliesISOReportTemplateType.nxt.id
      ? schema.required(ValidationMessage.REQUIRED)
      : schema.notRequired();
  }),
  importStore: Yup.string().when(['suppliesISOReportTemplateType'], ([suppliesISOReportTemplateType], schema) => {
    return suppliesISOReportTemplateType === SuppliesISOReportTemplateType['kh-03'].id
      ? schema.required(ValidationMessage.REQUIRED)
      : schema.notRequired();
  }),
});

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

function ExportSuppliesISOReportModal({ isOpen, toggle }: Props) {
  // React State
  const suppliesISOReportTemplateTypeOptions = useSuppliesISOReportTemplateTypeOptions();
  const { suppliesStoreOptions } = useSuppliesStoreOptions(false);
  const { suppliesUnitAndOriginOptions } = useSuppliesUnitAndOriginOptions(false);
  const [isExporting, setIsExporting] = useState(false);

  // React Function
  const handleDateChange = useCallback(
    (
      fieldName: string,
      setFieldValue: (fieldName: string, value: any) => any,
      value?: string | Moment,
      startDate?: Moment,
      endDate?: Moment,
    ) => {
      if (!value) {
        setFieldValue(fieldName, undefined);
        return;
      }

      const currentDate = moment(value);
      if (
        (fieldName === FieldName.START_DATE && endDate && endDate.toDate() < currentDate.toDate()) ||
        (fieldName === FieldName.END_DATE && startDate && startDate.toDate() > currentDate.toDate())
      ) {
        setFieldValue(FieldName.START_DATE, currentDate);
        setFieldValue(FieldName.END_DATE, currentDate);
      } else {
        setFieldValue(fieldName, currentDate);
      }
    },
    [],
  );

  const handleConfirmClick = useCallback(
    async (filterValues: ExportSuppliesISOReportFilter) => {
      setIsExporting(true);

      const { suppliesISOReportTemplateType } = filterValues;
      try {
        // Create report file
        let excelBuffer = null;
        let excelFileName = 'Báo-cáo-ISO-VT';
        if (suppliesISOReportTemplateType === SuppliesISOReportTemplateType.nxt.id) {
          // 1. BẢNG TỔNG HỢP NHẬP XUẤT TỒN VẬT TƯ, NGUYÊN VẬT LIỆU
          const inventoryData = await khovtXuatNhapTonControllerFind(getSuppliesInventoryReportParams(filterValues));
          excelBuffer = await new SuppliesStoreInventoryExcelWriter().writeData(
            `${process.env.PUBLIC_URL}/assets/templates/supplies-inventory-report-template_1.xlsx`,
            {
              filter: filterValues,
              content: {
                inventoryItems: inventoryData?.data || [],
              },
            },
          );
          excelFileName = `${excelFileName}_Bảng-tổng-hợp-XNT`;
        } else if (suppliesISOReportTemplateType === SuppliesISOReportTemplateType['nxt-lo'].id) {
          // 2. BẢNG TỔNG HỢP NXT THEO LÔ HÀNG
          const inventoryDetailByLoHangData = await khovtXuatNhapTonControllerFindDetailByLoHang(
            getSuppliesInventoryDetailByLoHangReportParams(filterValues),
          );
          excelBuffer = await new SuppliesStoreInventoryDetailByLoHangExcelWriter().writeData(
            `${process.env.PUBLIC_URL}/assets/templates/supplies-inventory-report-template_2.xlsx`,
            {
              filter: filterValues,
              content: {
                inventoryDetailByLoHangItems: inventoryDetailByLoHangData?.data || [],
              },
            },
          );
          excelFileName = `${excelFileName}_Bảng-TH-chi-tiết-theo-lô`;
        } else if (suppliesISOReportTemplateType === SuppliesISOReportTemplateType['the-kho'].id) {
          // 3. THẺ KHO
          const inventoryDetailBySoPhieuData = await khovtXuatNhapTonControllerFindDetailBySoPhieu(
            getSuppliesInventoryDetailBySoPhieuReportParams(filterValues),
          );
          excelBuffer = await new SuppliesStoreInventoryDetailBySoPhieuExcelWriter().writeData(
            `${process.env.PUBLIC_URL}/assets/templates/supplies-inventory-report-template_3.xlsx`,
            {
              filter: filterValues,
              content: {
                inventoryDetailBySoPhieuItems: inventoryDetailBySoPhieuData?.data || [],
              },
            },
          );
          excelFileName = `${excelFileName}_Thẻ-kho`;
        } else if (suppliesISOReportTemplateType === SuppliesISOReportTemplateType['kh-03'].id) {
          // 4. PHIẾU XUẤT VẬT TƯ, NGUYÊN LIỆU HẰNG NGÀY
          const exportData = await khovtTransPhieuXuatControllerFindDetail(getSuppliesExportReportParams(filterValues));
          excelBuffer = await new SuppliesStoreExportExcelWriter().writeData(
            `${process.env.PUBLIC_URL}/assets/templates/supplies-inventory-report-template_4.xlsx`,
            {
              filter: filterValues,
              content: {
                exportItems: exportData.data || [],
              },
            },
          );
          excelFileName = `${excelFileName}_KH.03`;
        } else if (suppliesISOReportTemplateType === SuppliesISOReportTemplateType['kh-22'].id) {
          // 5. PHIẾU BÁO NHẬP KHO
          const importData = await khovtTransPhieuNhapControllerFindDetail(getSuppliesImportReportParams(filterValues));
          excelBuffer = await new SuppliesStoreImportExcelWriter().writeData(
            `${process.env.PUBLIC_URL}/assets/templates/supplies-inventory-report-template_5.xlsx`,
            {
              filter: filterValues,
              content: {
                importItems: importData.data || [],
              },
            },
          );
          excelFileName = `${excelFileName}_KH.22`;
        } else if (suppliesISOReportTemplateType === SuppliesISOReportTemplateType['kh-10'].id) {
          // 6. GIẤY BÁO VẬT TƯ NHẬP VỀ
          const importData = await khovtTransPhieuNhapControllerFindDetail(getSuppliesImportReportParams(filterValues));
          excelBuffer = await new SuppliesStoreImportDetailExcelWriter().writeData(
            `${process.env.PUBLIC_URL}/assets/templates/supplies-inventory-report-template_6.xlsx`,
            {
              filter: filterValues,
              content: {
                importItems: importData.data || [],
              },
            },
          );
          excelFileName = `${excelFileName}_KH.10`;
        }

        // Auto download
        if (excelBuffer) {
          saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `${excelFileName}.xlsx`);
        }
      } catch (e: any) {
        toast.error(e?.response?.data?.error?.message || e.message);
      }

      setIsExporting(false);
      toggle();
    },
    [toggle],
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade={false} size="lg">
      <Formik
        initialValues={initialFilter}
        validationSchema={filterValidationSchema}
        onSubmit={() => {
          // do nothing
        }}>
        {({ values, dirty, isValid, errors, setFieldValue }) => (
          <>
            <ModalHeader toggle={toggle}>EXPORT BÁO CÁO VẬT TƯ</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={12} lg={12}>
                    <FormGroup className="row">
                      <Label className="form-control-label" md="2">
                        Template
                      </Label>
                      <Col md="10">
                        <Select2Box
                          className="form-control"
                          options={{ placeholder: 'Chọn template' }}
                          value={values.suppliesISOReportTemplateType}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setFieldValue(FieldName.SUPPLIES_ISO_REPORT_TEMPLATE_TYPE, e.target.value)
                          }
                          data={suppliesISOReportTemplateTypeOptions}
                          invalid={!!errors.suppliesISOReportTemplateType}
                        />
                        {errors.suppliesISOReportTemplateType && (
                          <FormText color="danger">{errors.suppliesISOReportTemplateType}</FormText>
                        )}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                {values.suppliesISOReportTemplateType && (
                  <Row>
                    <Col md={12} lg={6}>
                      <FormGroup className="row">
                        <Label className="form-control-label" md="4">
                          Từ ngày
                        </Label>
                        <Col md="8">
                          <DatePicker
                            inputProps={{ placeholder: 'Chọn ngày' }}
                            hasCorrelationFromTo
                            value={values.startDate}
                            startDate={values.startDate}
                            endDate={values.endDate}
                            onChange={(value) =>
                              handleDateChange(
                                FieldName.START_DATE,
                                setFieldValue,
                                value,
                                values.startDate,
                                values.endDate,
                              )
                            }
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col md={12} lg={6}>
                      <FormGroup className="row">
                        <Label className="form-control-label" md="4">
                          Đến ngày
                        </Label>
                        <Col md="8">
                          <DatePicker
                            inputProps={{ placeholder: 'Chọn ngày' }}
                            hasCorrelationFromTo
                            value={values.endDate}
                            startDate={values.startDate}
                            endDate={values.endDate}
                            onChange={(value) =>
                              handleDateChange(
                                FieldName.END_DATE,
                                setFieldValue,
                                value,
                                values.startDate,
                                values.endDate,
                              )
                            }
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                )}
                {values.suppliesISOReportTemplateType === SuppliesISOReportTemplateType.nxt.id && (
                  <Row>
                    <Col md={12} lg={6}>
                      <FormGroup className="row">
                        <Label className="form-control-label" md="4">
                          Kho nhập xuất
                        </Label>
                        <Col md="8">
                          <Select2Box
                            className="form-control"
                            options={{ placeholder: 'Chọn kho' }}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                              setFieldValue(FieldName.SUPPLIES_STORE, e.target.value)
                            }
                            value={values.suppliesStore}
                            data={suppliesStoreOptions}
                            invalid={!!errors.suppliesStore}
                          />
                          {errors.suppliesStore && <FormText color="danger">{errors.suppliesStore}</FormText>}
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                )}
                {values.suppliesISOReportTemplateType === SuppliesISOReportTemplateType['kh-03'].id && (
                  <Row>
                    <Col md={12} lg={6}>
                      <FormGroup className="row">
                        <Label className="form-control-label" md="4">
                          Đơn vị nhận
                        </Label>
                        <Col md="8">
                          <Select2Box
                            className="form-control"
                            options={{ placeholder: 'Chọn đơn vị' }}
                            value={values.importStore}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                              setFieldValue(FieldName.IMPORT_STORE, e.target.value)
                            }
                            invalid={!!errors.importStore}
                            data={suppliesUnitAndOriginOptions}
                          />
                          {errors.importStore && <FormText color="danger">{errors.importStore}</FormText>}
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                )}
              </Form>
              {isExporting && <TransparentSpinner />}
            </ModalBody>
            <ModalFooter className="justify-content-end">
              <Button
                color="primary"
                onClick={async () => await handleConfirmClick(values)}
                disabled={!dirty || !isValid}>
                Xác nhận export
              </Button>
              <Button color="secondary" onClick={toggle}>
                Hủy
              </Button>
            </ModalFooter>
          </>
        )}
      </Formik>
    </Modal>
  );
}

const getSuppliesInventoryReportParams = (
  filter: ExportSuppliesISOReportFilter,
): KhovtXuatNhapTonControllerFindParams => {
  const where = getSuppliesInventoryReportCountParams(filter);

  return {
    searchParams: {
      ...where,
    },
  };
};

const getSuppliesInventoryReportCountParams = (filter: ExportSuppliesISOReportFilter) => {
  const { startDate, endDate, suppliesStore } = filter;

  return {
    maKho: suppliesStore && suppliesStore !== '-1' ? suppliesStore : undefined,
    fromDate: startDate ? startDate.format(DateFormat.DATE_ONLY) : undefined,
    toDate: endDate ? endDate.format(DateFormat.DATE_ONLY) : undefined,
  };
};

const getSuppliesInventoryDetailByLoHangReportParams = (
  filter: ExportSuppliesISOReportFilter,
): KhovtXuatNhapTonControllerFindDetailByLoHangParams => {
  const where = getSuppliesInventoryDetailByLoHangReportCountParams(filter);

  return {
    searchParams: {
      ...where,
    },
  };
};

const getSuppliesInventoryDetailByLoHangReportCountParams = (filter: ExportSuppliesISOReportFilter) => {
  const { startDate, endDate } = filter;

  return {
    fromDate: startDate ? startDate.format(DateFormat.DATE_ONLY) : undefined,
    toDate: endDate ? endDate.format(DateFormat.DATE_ONLY) : undefined,
  };
};

const getSuppliesInventoryDetailBySoPhieuReportParams = (
  filter: ExportSuppliesISOReportFilter,
): KhovtXuatNhapTonControllerFindDetailBySoPhieuParams => {
  const where = getSuppliesInventoryDetailBySoPhieuReportCountParams(filter);

  return {
    searchParams: {
      ...where,
    },
  };
};

const getSuppliesInventoryDetailBySoPhieuReportCountParams = (filter: ExportSuppliesISOReportFilter) => {
  const { startDate, endDate, suppliesStore } = filter;

  return {
    maKho: suppliesStore && suppliesStore !== '-1' ? suppliesStore : undefined,
    fromDate: startDate ? startDate.format(DateFormat.DATE_ONLY) : undefined,
    toDate: endDate ? endDate.format(DateFormat.DATE_ONLY) : undefined,
  };
};

const getSuppliesExportReportParams = (
  filter: ExportSuppliesISOReportFilter,
): KhovtTransPhieuXuatControllerFindDetailParams => {
  const where = getSuppliesExportReportCountParams(filter).where;

  return {
    filter: {
      order: 'ngayXuat ASC',
      where,
    },
  };
};

const getSuppliesExportReportCountParams = (filter: ExportSuppliesISOReportFilter) => {
  const { startDate, endDate, importStore } = filter;

  return {
    where: {
      khoNhap: importStore && importStore !== '-1' ? importStore : undefined,
      ngayXuat:
        startDate && endDate
          ? { gte: DateUtil.toISOString(startDate.startOf('day')), lte: DateUtil.toISOString(endDate.endOf('day')) }
          : undefined,
    },
  };
};

const getSuppliesImportReportParams = (
  filter: ExportSuppliesISOReportFilter,
): KhovtTransPhieuNhapControllerFindDetailParams => {
  const where = getSuppliesImportReportCountParams(filter).where;

  return {
    filter: {
      order: 'ngayNhap ASC',
      where,
    },
  };
};

const getSuppliesImportReportCountParams = (filter: ExportSuppliesISOReportFilter) => {
  const { startDate, endDate } = filter;

  return {
    where: {
      ngayNhap:
        startDate && endDate
          ? { gte: DateUtil.toISOString(startDate.startOf('day')), lte: DateUtil.toISOString(endDate.endOf('day')) }
          : undefined,
    },
  };
};

export default ExportSuppliesISOReportModal;
