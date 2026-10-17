import { FieldName } from 'main/constants/enums';
import { generateColumnStyle } from 'main/utils';
import { SizePerPageRendererOptions } from 'react-bootstrap-table-next';

const columns = [
  {
    dataField: FieldName.TEN_NHOM,
    text: 'Nhóm',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.MA_VT,
    text: 'Mã vật tư',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TEN_VT,
    text: 'Tên vật tư',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.DVT,
    text: 'Đơn vị tính',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.KHO_NHAP_XUAT,
    text: 'Kho Nhập/Xuất',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TON_KHO_DAU_KY,
    text: 'Tồn đầu kỳ',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.SO_LUONG_NHAP_FROM_TO,
    text: 'Tổng thực nhập',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.SO_LUONG_XUAT_FROM_TO,
    text: 'Tổng thực xuất',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TON_KHO_CUOI_KY,
    text: 'Tồn cuối kỳ',
    ...generateColumnStyle(),
  },
  {
    dataField: FieldName.TON_KHO,
    text: 'Tổng tồn kho',
    ...generateColumnStyle(),
  },
];

const pagination = {
  page: 1,
  alwaysShowAllBtns: true,
  showTotal: true,
  withFirstAndLast: true,
  sizePerPageRenderer: ({ onSizePerPageChange }: SizePerPageRendererOptions) => (
    <div className="dataTables_length" id="datatable-basic_length">
      <label>
        Hiển thị&nbsp;
        {
          <select
            name="datatable-basic_length"
            aria-controls="datatable-basic"
            className="form-control form-control-sm"
            onChange={(e) => onSizePerPageChange(Number(e.target.value))}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        }
        &nbsp;mục.
      </label>
    </div>
  ),
  paginationTotalRenderer: (from: number, to: number, size: number) => (
    <span className="react-bootstrap-table-pagination-total">
      &nbsp;Hiển thị hàng {from} đến {to} trên {size}
    </span>
  ),
};

const tableConfig = {
  columns,
  pagination,
};

export default tableConfig;
