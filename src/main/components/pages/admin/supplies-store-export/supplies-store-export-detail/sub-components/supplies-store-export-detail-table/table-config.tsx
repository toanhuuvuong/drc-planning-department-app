import { KhovtTransPhieuXuatDetailWithRelations } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';

const columns = [
  {
    dataField: FieldName.MA_VT,
    text: 'Mã vật tư',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.TEN_VT,
    text: 'Tên vật tư',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.SO_LUONG_YEU_CAU,
    text: 'Số lượng yêu cầu',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.SO_LUONG_THUC_TE,
    text: 'Số lượng thực xuất',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.TON_KHO,
    text: 'Tồn kho hiện tại',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.TON_KHO_DU_KIEN,
    text: 'Tồn kho dự kiến',
    formatter: (_: string, row: KhovtTransPhieuXuatDetailWithRelations) => {
      if (!row.tonKho || !row.soLuongThucTe) {
        return '';
      }
      return `${row.tonKho - row.soLuongThucTe}`;
    },
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.MA_LO,
    text: 'Mã số lô',
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.NGUON_GOC,
    text: 'Nguồn gốc',
    ...generateColumnStyle(undefined, true),
  },
  /*
  {
    dataField: FieldName.NGAY_SX,
    text: 'Ngày sản xuất',
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.HAN_SU_DUNG,
    text: 'Hạn sử dụng',
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
    ...generateColumnStyle(undefined, true),
  },
  {
    dataField: FieldName.NGAY_HET_HAN_LK,
    text: 'Thời hạn lưu kho',
    formatter: cellDateFormatter(DateFormat.DATE_ONLY_VN),
    ...generateColumnStyle(undefined, true),
  },
  */
];

const tableConfig = { columns };

export default tableConfig;
