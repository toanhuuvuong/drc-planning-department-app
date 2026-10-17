import { CircularProgress, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { find } from 'lodash';
import { useKhotpXuatNhapTonControllerFind } from 'main/apis/drc/endpoints/khotp-xuat-nhap-ton-controller/khotp-xuat-nhap-ton-controller';
import { QldhTransDonHangItemWithRelations } from 'main/apis/drc/models';
import AutocompleteCell from 'main/components/atoms/autocomplete/AutocompleteCell';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { FieldName } from 'main/constants/enums';
import useProductOrderManagementOptions from 'main/hooks/useProductOrderManagementOptions';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  deleteOrdersDetails,
  QldhTransDonHangItemExcludingIdWithRelationsIds,
  selectOrdersDetails,
  updateOrdersDetails,
} from 'main/redux/modules/order-management/order-management-add-slice';
import { muiCellQuantityValidator } from 'main/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, Input } from 'reactstrap';

export type OrderManagementMaSanPhamType = QldhTransDonHangItemWithRelations & {
  id?: number;
  dvt?: string;
  luuKho?: number;
  tonKho?: number;
  tonKhoDuKien?: number;
  thoiHanLuuKho?: number;
  soLuongGiuHang?: number;
  maKho?: string;
};

type Props = {
  // productDataOptions?: SelectOption[];
  orderManagementInfoDetails?: QldhTransDonHangItemExcludingIdWithRelationsIds[];
};

const useTableConfig = ({ orderManagementInfoDetails }: Props) => {
  const dispatch = useAppDispatch();
  const ordersDetails = useAppSelector(selectOrdersDetails);
  const { productDataOptions, productStoreOptions } = useProductOrderManagementOptions(false);

  const [deletingRows, setDeletingRows] = useState<number[]>([]);

  const handleDeleteSuppliesDetails = async (id: number) => {
    if (deletingRows.includes(id)) {
      return;
    }

    setDeletingRows((prev) => [...prev, id]);
    try {
      await dispatch(deleteOrdersDetails(id));
    } catch (error) {
    } finally {
      setDeletingRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const { data: orderManagementDetailsData, isLoading: IsLoadingProductData } = useKhotpXuatNhapTonControllerFind({});

  const findTonKhoData = (maSanPhamData: string | undefined, maKhoData: string | undefined) => {
    if (maSanPhamData && maKhoData) {
      return (
        find(orderManagementDetailsData?.data, (item) => item?.maSanPham === maSanPhamData && item?.maKho === maKhoData)
          ?.tonKho || 0
      );
    }
    return 0;
  };

  const updateOrdersDetailsSanPham = (params: any, newValue: OrderManagementMaSanPhamType) => {
    const maKho = ordersDetails.find((order) => order.id === params.id)?.maKho;

    const tonKhoData = findTonKhoData(newValue.maSanPham, maKho);

    dispatch(
      updateOrdersDetails({
        id: params.row?.id,
        changes: {
          maSanPham: newValue.maSanPham,
          maKho: maKho,
          tonKho: Number(tonKhoData),
          tonKhoDuKien: params?.row.soLuong
            ? Number(newValue.tonKho) - Number(params?.row.soLuong)
            : Number(newValue.tonKho),
          ghiChu: newValue.ghiChu,
          dvt: newValue.dvt,
        },
      }),
    );
  };

  const valueFromDetail = (value: any): string => {
    const option = productDataOptions?.find((option) => option.id === value);

    return value ? `${option?.id} - ${option?.text}` : '';
  };

  const valueFromDetailStore = (value: any): string => {
    const option = productStoreOptions?.find((option) => option.id === value);

    return value ? `${option?.id} - ${option?.text}` : '';
  };

  const updateOrdersDetailsKhoXuat = (params: any, newValue: OrderManagementMaSanPhamType) => {
    const maSanPham = ordersDetails.find((order) => order.id === params.id)?.maSanPham;

    const tonKhoData = findTonKhoData(maSanPham, newValue.maKho);

    dispatch(
      updateOrdersDetails({
        id: params.row?.id,
        changes: {
          maKho: newValue.maKho,
          tonKho: Number(tonKhoData),
        },
      }),
    );
  };

  const columns: GridColDef[] = [
    {
      field: FieldName.STT,
      headerName: 'STT',
      editable: false,
      sortable: false,
      flex: 50,
      cellClassName: 'disable-gray',
      renderCell: (params: any) => {
        const index = orderManagementInfoDetails?.findIndex((row) => row?.id === params?.id);
        return index !== -1 ? Number(index) + 1 : '';
      },
    },
    {
      field: FieldName.MA_KHO_XUAT,
      headerName: 'Kho Xuất',
      width: 300,
      renderCell: (params) =>
        params &&
        params.value &&
        productStoreOptions &&
        productStoreOptions?.length > 0 && (
          <AutocompleteCell
            value={params.value}
            options={productStoreOptions as any}
            placeholder={valueFromDetailStore(params.value)}
            getOptionLabel={(option: any) => {
              if (typeof option === 'object' && option !== null && 'id' in option && 'text' in option) {
                return `${option.id} - ${option.text}`;
              }
              return valueFromDetailStore(option);
            }}
            onChange={(newValue) => {
              if (newValue) {
                updateOrdersDetailsKhoXuat(params, newValue as unknown as OrderManagementMaSanPhamType);
              }
            }}
          />
        ),
    },
    {
      field: FieldName.MA_SAN_PHAM,
      headerName: 'Mã sản phẩm',
      width: 300,
      renderCell: (params) =>
        params &&
        params.value &&
        productDataOptions &&
        productDataOptions?.length > 0 && (
          <AutocompleteCell
            value={params.value}
            options={productDataOptions as any}
            placeholder={valueFromDetail(params.value)}
            getOptionLabel={(option: any) => {
              if (typeof option === 'object' && option !== null && 'id' in option && 'text' in option) {
                return `${option.id} - ${option.text}`;
              }
              return valueFromDetail(option);
            }}
            onChange={(newValue) => {
              if (newValue) {
                updateOrdersDetailsSanPham(params, newValue as unknown as OrderManagementMaSanPhamType);
              }
            }}
          />
        ),
    },
    {
      sortable: false,
      field: FieldName.DVT,
      headerName: 'ĐVT',
      cellClassName: 'disable-gray',
      width: 50,
      editable: false,
    },
    {
      sortable: false,
      field: FieldName.SO_LUONG,
      headerName: 'Số lượng',
      width: 100,
      editable: true,
      renderCell: (params) => {
        const active = (params.row.maKho || params.row.maKhoXuat) && params.row.maSanPham;
        const { valid, message } = muiCellQuantityValidator(true)(
          params.value,
          //orderCellQuantityValidator(params.value, params.row.soLuongGiuHang, params.row.tonKho),
        );
        const cellInput = (
          <FormGroup>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              value={params.value || ''}
              disabled={!active}
              className={!active ? 'disable-gray' : ''}
              invalid={active && !valid}
              onChange={(e) => {
                const value = e.target.value;
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: Number(value),
                });
              }}
            />
          </FormGroup>
        );

        if (active && !valid) {
          return (
            <Tooltip title={message} arrow>
              <>{cellInput}</>
            </Tooltip>
          );
        }

        return cellInput;
      },
    },
    {
      field: FieldName.TON_KHO,
      headerName: 'Tồn kho hiện tại',
      width: 150,
      editable: true,
      sortable: false,
      cellClassName: 'disable-gray',
      renderCell: (params) => (
        <FormGroup>
          <Input
            type="number"
            disabled
            className="disable-gray"
            value={params.value || ''}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
          />
        </FormGroup>
      ),
    },
    {
      sortable: false,
      field: 'soLuongGiuHang',
      headerName: 'Số lượng giữ hàng',
      width: 150,
      editable: true,
      renderCell: (params) => {
        const active = (params.row.maKho || params.row.maKhoXuat) && params.row.maSanPham;
        const { valid, message } = muiCellQuantityValidator(false)(
          params.value,
          //orderCellQuantityValidator(params.row.soLuong, params.value, params.row.tonKho),
        );
        const cellInput = (
          <FormGroup>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={params.value}
              disabled={!active}
              className={!active ? 'disable-gray' : ''}
              invalid={active && !valid}
              onChange={(e) => {
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: Number(e.target.value),
                });
              }}
            />
          </FormGroup>
        );

        if (active && !valid) {
          return (
            <Tooltip title={message} arrow>
              <>{cellInput}</>
            </Tooltip>
          );
        }

        return cellInput;
      },
    },
    {
      editable: false,
      cellClassName: 'disable-gray',
      field: FieldName.TON_KHO_DU_KIEN,
      headerName: 'Tồn kho dự kiến',
      width: 150,
      renderCell: (params) => (
        <FormGroup>
          <Input
            type="number"
            value={params.value || ''}
            disabled
            className="disable-gray"
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
          />
        </FormGroup>
      ),
    },
    // {
    //   field: FieldName.NGAY_GIAO_DU_KIEN,
    //   headerName: 'Ngày giao hàng dự kiến',
    //   width: 200,
    //   renderCell: (params) => {
    //     const active = (params.row.maKho || params.row.maKhoXuat) && params.row.maSanPham;
    //     return (
    //       <LocalizationProvider dateAdapter={AdapterMoment}>
    //         <DatePicker
    //           // value={params.value ? moment(params.value, DateFormat.DATE_ONLY_VN) : null}
    //           value={params.value ? moment.utc(params.value) : null}
    //           format={DateFormat.DATE_ONLY_VN}
    //           onChange={(newDate) => {
    //             // const serializedDate = newDate ? moment(newDate).format(DateFormat.DATE_ONLY_VN) : null;
    //             dispatch(
    //               updateOrdersDetails({
    //                 id: params.row?.id,
    //                 changes: {
    //                   ngayGiaoDuKien: newDate as any,
    //                 },
    //               }),
    //             );
    //           }}
    //           onAccept={(newDate) => {
    //             // const serializedDate = newDate ? moment(newDate).format(DateFormat.DATE_ONLY_VN) : null;
    //             dispatch(
    //               updateOrdersDetails({
    //                 id: params.row?.id,
    //                 changes: {
    //                   ngayGiaoDuKien: newDate as any,
    //                 },
    //               }),
    //             );
    //           }}
    //           disabled={!active}
    //           className={'custom-datepicker' + (!active ? ' disable-gray' : '')}
    //           reduceAnimations
    //           slotProps={{ inputAdornment: { hidden: true } }}
    //         />
    //       </LocalizationProvider>
    //     );
    //   },
    // },
    // {
    //   sortable: false,
    //   field: FieldName.NGAY_GIAO_THUC_TE,
    //   headerName: 'Ngày giao hàng thực tế',
    //   width: 200,
    //   renderCell: (params) => {
    //     const active = (params.row.maKho || params.row.maKhoXuat) && params.row.maSanPham;
    //     return (
    //       <LocalizationProvider dateAdapter={AdapterMoment}>
    //         <DatePicker
    //           value={params.value ? moment.utc(params.value) : null}
    //           // value={params.value ? moment(params.value, DateFormat.DATE_ONLY_VN) : null}
    //           format={DateFormat.DATE_ONLY_VN}
    //           onChange={(newDate) => {
    //             // const serializedDate = newDate ? moment(newDate).format(DateFormat.DATE_ONLY_VN) : null;
    //             dispatch(
    //               updateOrdersDetails({
    //                 id: params.row?.id,
    //                 changes: {
    //                   ngayGiaoThucTe: newDate as any,
    //                   // ngayGiaoThucTe: serializedDate,
    //                 },
    //               }),
    //             );
    //           }}
    //           onAccept={(newDate: any) => {
    //             // const serializedDate = newDate ? moment(newDate).format(DateFormat.DATE_ONLY_VN) : null;
    //             dispatch(
    //               updateOrdersDetails({
    //                 id: params.row?.id,
    //                 changes: {
    //                   ngayGiaoThucTe: newDate as any,
    //                 },
    //               }),
    //             );
    //           }}
    //           disabled={!active}
    //           className={'custom-datepicker' + (!active ? ' disable-gray' : '')}
    //           reduceAnimations
    //           slotProps={{ inputAdornment: { hidden: true } }}
    //         />
    //       </LocalizationProvider>
    //     );
    //   },
    //   ...generateColumnStyle(),
    // },
    {
      sortable: false,
      field: FieldName.YEU_CAU_DONG_GOI,
      headerName: 'Yêu cầu đóng gói',
      width: 150,
      editable: true,
      type: 'string',
      renderCell: (params) => {
        const active = (params.row.maKho || params.row.maKhoXuat) && params.row.maSanPham;
        return (
          <FormGroup>
            <Input
              type="text"
              value={params.value || ''}
              disabled={!active}
              className={!active ? 'disable-gray' : ''}
              onChange={(e) => {
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        );
      },
    },

    {
      sortable: false,
      field: FieldName.GHI_CHU,
      headerName: 'Ghi chú',
      width: 200,
      editable: true,
      type: 'string',
      renderCell: (params) => {
        const active = (params.row.maKho || params.row.maKhoXuat) && params.row.maSanPham;
        return (
          <FormGroup>
            <Input
              type="text"
              value={params.value || ''}
              disabled={!active}
              className={!active ? 'disable-gray' : ''}
              onChange={(e) => {
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        );
      },
    },
    {
      sortable: false,
      field: 'actions',
      headerName: '⋮⋮⋮',
      headerAlign: 'center',
      width: 50,
      align: 'center',
      renderCell: (params) => {
        const isDeleting = deletingRows.includes(params?.row?.id);
        return (
          <EditPermissionAction>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                if (!isDeleting) {
                  handleDeleteSuppliesDetails(params?.row?.id);
                }
              }}
              style={{ pointerEvents: isDeleting ? 'none' : 'auto', opacity: isDeleting ? 0.5 : 1 }}>
              {isDeleting ? <CircularProgress size={10} /> : <i className="fa-solid fa-trash" title="Xóa" />}
            </Link>
          </EditPermissionAction>
        );
      },
    },
  ];

  return { columns, IsLoadingProductData };
};

export default useTableConfig;
