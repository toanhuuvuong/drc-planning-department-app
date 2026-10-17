import { KhovtTransPhieuXuatControllerFindDetail200DataItem } from 'main/apis/drc/models';
import { DateFormat } from 'main/constants';
import { ExportStatus, FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';
import moment from 'moment';

const columns = [
  {
    dataField: FieldName.ID,
    hidden: true,
    csvExport: false,
  },
  {
    dataField: FieldName.SO_PHIEU,
    text: 'Số phiếu xuất',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.MA_VT,
    text: 'Mã vật tư',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.KHO_XUAT,
    text: 'Kho xuất',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.KHO_NHAP,
    text: 'Kho nhập',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.SO_LUONG_YEU_CAU,
    text: 'Số lượng yêu cầu',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.SO_LUONG_THUC_TE,
    text: 'Số lượng thực xuất',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGUOI_TAO_PHIEU,
    text: 'Người tạo phiếu',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.NGAY_XUAT,
    text: 'Ngày xuất kho',
    csvFormatter: (cell: string, _: KhovtTransPhieuXuatControllerFindDetail200DataItem) => {
      if (!cell) {
        return null;
      }
      return moment(cell).format(DateFormat.DATE_ONLY_VN);
    },
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.STATUS,
    text: 'Trạng thái',
    csvFormatter: (cell: string, _: KhovtTransPhieuXuatControllerFindDetail200DataItem) => {
      if (!cell) {
        return null;
      }
      return ExportStatus[cell as keyof typeof ExportStatus]?.text;
    },
    ...generateColumnStyle(),
  },
];

const exportCSV = {
  fileName: `Phiếu_xuất.csv`,
  exportAll: true,
  charset: 'utf-8',
};

const tableConfig = {
  columns,
  exportCSV,
};

export default tableConfig;
