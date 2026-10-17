import { CircularProgress, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
// import { DatePicker } from '@mui/x-date-pickers';
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormikProps } from 'formik';
import { find } from 'lodash';
import { useKhotpXuatNhapTonControllerFind } from 'main/apis/drc/endpoints/khotp-xuat-nhap-ton-controller/khotp-xuat-nhap-ton-controller';
import { QldhTransDonHangItemWithRelations } from 'main/apis/drc/models';
import AutocompleteCell from 'main/components/atoms/autocomplete/AutocompleteCell';
import { FieldName } from 'main/constants/enums';
import useProductOrderManagementOptions from 'main/hooks/useProductOrderManagementOptions';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  deleteOrdersDetails,
  selectOrdersDetails,
  updateOrdersDetails,
} from 'main/redux/modules/order-management/order-management-add-slice';
import { muiCellQuantityValidator } from 'main/utils';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, Input } from 'reactstrap';
import { OrderManagementInfo } from '../order-management-add-info';

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
  formikProps: FormikProps<OrderManagementInfo>;
};

const useTableConfig = ({ formikProps: { values, errors, handleChange, setFieldValue, setValues } }: Props) => {
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

  const { data: orderManagementDetailsData, isLoading: IsLoadingProductData } = useKhotpXuatNhapTonControllerFind(
    {
      // searchParams: {
      //   maSanPham: values?.maSanPham,
      //   maKho: values?.maKho,
      // },
    },
    // { query: { enabled: values.maSanPham && values.maSanPham ? true : false } },
  );

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

  useEffect(() => {
    if (!IsLoadingProductData && orderManagementDetailsData?.data) {
      const tonKhoData = orderManagementDetailsData.data.find(
        (item) => item.maSanPham === values.maSanPham && item.maKho === values.maKho,
      );
      if (tonKhoData) {
        // Set tonKho to the value from the fetched data
        setFieldValue('tonKho', tonKhoData.tonKho);
      }
    }
  }, [IsLoadingProductData, orderManagementDetailsData, values.maSanPham, values.maKho, setFieldValue]);

  const columns: GridColDef[] = [
    {
      field: FieldName.STT,
      headerName: 'STT',
      editable: false,
      sortable: false,
      width: 50,
      cellClassName: 'disable-gray',
      renderCell: (params: any) => {
        const index = ordersDetails.findIndex((row) => row?.id === params?.id);
        return index !== -1 ? index + 1 : '';
      },
    },
    {
      field: FieldName.MA_KHO,
      headerName: 'Kho Xuất',
      width: 300,
      renderCell: (params) =>
        productStoreOptions?.length > 0 && (
          <AutocompleteCell
            value={params.value}
            options={productStoreOptions as any}
            getOptionLabel={(option) => (option ? `${option.id} - ${option.text}` : '')}
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
        productDataOptions?.length > 0 && (
          <AutocompleteCell
            value={params.value}
            options={productDataOptions as any}
            getOptionLabel={(option) => (option ? `${option.id} - ${option.text}` : '')}
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
        const active = Boolean(params.row.maKho && params.row.maSanPham);
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
      sortable: false,
      field: 'soLuongGiuHang',
      headerName: 'Số lượng giữ hàng',
      width: 150,
      editable: true,
      renderCell: (params) => {
        const active = Boolean(params.row.maKho && params.row.maSanPham);
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
    {
      sortable: false,
      field: FieldName.YEU_CAU_DONG_GOI,
      headerName: 'Yêu cầu đóng gói',
      width: 150,
      editable: true,
      type: 'string',
      renderCell: (params) => {
        const active = Boolean(params.row.maKho && params.row.maSanPham);
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
        const active = Boolean(params.row.maKho && params.row.maSanPham);
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
      width: 50,
      align: 'center',
      renderCell: (params) => {
        const isDeleting = deletingRows.includes(params?.row?.id);
        return (
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
        );
      },
    },
  ];

  return { columns, IsLoadingProductData };
};

/*export const orderCellQuantityValidator =
  (soLuongCell?: string | number, soLuongGiuHangCell?: string | number, tonKhoCell?: string | number) => () => {
    const soLuong = soLuongCell ? Number(soLuongCell) : 0;
    const soLuongGiuHang = soLuongGiuHangCell ? Number(soLuongGiuHangCell) : 0;
    const tonKho = tonKhoCell ? Number(tonKhoCell) : 0;

    if (tonKho < soLuong + soLuongGiuHang) {
      return {
        valid: false,
        message: ValidationMessage.INVALID_SO_LUONG_DON_HANG,
      };
    }

    return { valid: true, message: '' };
  };*/

export default useTableConfig;
