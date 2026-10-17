import { CircularProgress } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AutocompleteCell from 'main/components/atoms/autocomplete/AutocompleteCell';
import { DateFormat } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import useSuppliesOptions, { SuppliesFilter } from 'main/hooks/useSuppliesOptions';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  deleteSuppliesDetail,
  selectSuppliesDetails,
  updateSuppliesDetail,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-add-slice';
import { generateColumnStyle } from 'main/utils';
import moment from 'moment';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, Input } from 'reactstrap';

const useTableConfig = () => {
  const dispatch = useAppDispatch();
  const suppliesDetails = useAppSelector(selectSuppliesDetails);
  const { suppliesOptions, suppliesIsLoading } = useSuppliesOptions(false);
  const [deletingRows, setDeletingRows] = useState<number[]>([]);

  const handleDeleteSuppliesDetails = async (id: number) => {
    if (deletingRows.includes(id)) {
      return;
    }

    setDeletingRows((prev) => [...prev, id]);
    try {
      await dispatch(deleteSuppliesDetail(id));
    } catch (error) {
    } finally {
      setDeletingRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const updateSuppliesDetailWithDates = (params: any, newValue: SuppliesFilter | null) => {
    if (!newValue) {
      // Handle case where selection is cleared if necessary
      dispatch(
        updateSuppliesDetail({
          id: params.row?.id,
          changes: {
            maVt: null,
            tenVt: null,
            dvt: null,
            ghiChu: null,
            ngayHetHanLK: null,
          },
        }),
      );
      return;
    }

    const currentDate = moment();
    // Use optional chaining and provide default value if thoiHanLuuKho is null/undefined
    const thoiHanLuuKho = newValue.thoiHanLuuKho ?? 1;

    const ngayHetHanLK = moment(currentDate).add(thoiHanLuuKho, 'month').format(DateFormat.DATE_ONLY_VN);
    dispatch(
      updateSuppliesDetail({
        id: params.row?.id,
        changes: {
          maVt: newValue.maVt,
          tenVt: newValue.tenVt,
          dvt: newValue.dvt,
          ghiChu: newValue.ghiChu,
          ngayHetHanLK,
        },
      }),
    );
  };

  const columns: GridColDef[] = [
    {
      field: FieldName.STT,
      headerName: 'STT',
      headerAlign: 'center', // Center header horizontally
      align: 'center', // Center cell content horizontally
      editable: false,
      sortable: false,
      flex: 0.5,
      cellClassName: 'disable-gray',
      renderCell: (params: any) => {
        const index = suppliesDetails.findIndex((row) => row?.id === params?.id);
        return index !== -1 ? index + 1 : '';
      },
    },
    {
      field: FieldName.MA_VT,
      headerName: 'Mã vật tư',
      flex: 3,
      // Ensure cell content aligns correctly and doesn't overflow
      cellClassName: 'editable-cell no-padding', // Add class for styling
      renderCell: (params) =>
        suppliesOptions?.length > 0 && (
          <AutocompleteCell
            value={
              params.value // Find the full option object based on maVt if needed, or ensure value is the object
                ? (suppliesOptions.find((opt) => opt.maVt === params.value) ?? null)
                : null
            }
            options={suppliesOptions}
            getOptionLabel={(option) => (option ? `${option.maVt} - ${option.tenVt}` : '')}
            // Removed customDisplayHandler
            onChange={(newValue) => {
              // Update with the full object or just the ID/code as needed by the state
              updateSuppliesDetailWithDates(params, newValue);
            }}
          />
        ),
    },
    {
      field: FieldName.TEN_VT,
      headerName: 'Tên vật tư',
      flex: 3,
      editable: true,
      type: 'string',
      renderCell: (params) => (
        <FormGroup>
          <Input
            type="text"
            value={params.value || ''}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      ),
    },
    {
      field: FieldName.SO_LO,
      headerName: 'Mã lô',
      flex: 1,
      editable: true,
      type: 'string',
      cellClassName: 'editable-cell', // Add class for styling
      renderCell: (params) => {
        const maVtValue = params.api.getCellValue(params.id, FieldName.MA_VT);
        // Validation: Invalid if MA_VT exists but SO_LO is empty
        const isInvalid = !!maVtValue && (params.value == null || String(params.value).trim() === '');
        return (
          <FormGroup>
            <Input
              type="text"
              required={!!maVtValue} // Make required visually if MA_VT exists
              value={params.value || ''}
              invalid={isInvalid} // Apply invalid state based on validation
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
      field: FieldName.SO_LUONG,
      headerName: 'Số lượng',
      flex: 1,
      editable: true,
      cellClassName: 'editable-cell', // Add class for styling
      renderCell: (params) => {
        const maVtValue = params.api.getCellValue(params.id, FieldName.MA_VT);
        // Validation: Invalid if MA_VT exists but SO_LUONG is empty, not a number, or <= 0
        const isInvalid =
          !!maVtValue &&
          (params.value == null ||
            String(params.value).trim() === '' ||
            isNaN(Number(params.value)) ||
            Number(params.value) <= 0);
        return (
          <FormGroup>
            <Input
              type="text" // Keep as text to allow intermediate typing, but validate as number
              inputMode="numeric"
              pattern="[0-9]*"
              required={!!maVtValue} // Make required visually if MA_VT exists
              value={params.value || ''}
              invalid={isInvalid} // Apply invalid state based on validation
              onChange={(e) => {
                const value = e.target.value;
                // Allow only numeric input, but store as number
                if (/^\d*$/.test(value)) {
                  params.api.setEditCellValue({
                    id: params.id,
                    field: params.field,
                    // Store as number, handle empty string as null or 0 if appropriate
                    value: value === '' ? null : Number(value),
                  });
                }
              }}
            />
          </FormGroup>
        );
      },
    },
    {
      sortable: false,
      field: FieldName.DVT,
      headerName: 'ĐVT',
      headerAlign: 'center', // Center header horizontally
      align: 'center', // Center cell content horizontally
      cellClassName: 'disable-gray',
      flex: 0.5,
      editable: false,
    },
    {
      field: FieldName.NGAY_SX,
      headerName: 'Ngày sản xuất',
      flex: 1.5,
      cellClassName: 'editable-cell no-padding',
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            // Ensure value parses the string from state correctly
            value={params.value ? moment(params.value, DateFormat.DATE_ONLY_VN) : null}
            format={DateFormat.DATE_ONLY_VN}
            // Remove dispatch from onChange
            // onChange={(newDate) => {
            //   const serializedDate = newDate ? moment(newDate).format(DateFormat.DATE_ONLY_VN) : null;
            //   dispatch(
            //     updateSuppliesDetail({
            //       id: params.row?.id,
            //       changes: {
            //         ngaySx: serializedDate,
            //       },
            //     }),
            //   );
            // }}
            onAccept={(newDate) => {
              // Rely on onAccept
              const serializedDate = newDate ? moment(newDate).format(DateFormat.DATE_ONLY_VN) : null;
              dispatch(
                updateSuppliesDetail({
                  id: params.row?.id,
                  changes: {
                    ngaySx: serializedDate,
                  },
                }),
              );
            }}
            className="custom-datepicker"
            reduceAnimations
            slotProps={{
              textField: {
                size: 'small',
                variant: 'standard',
                InputProps: { disableUnderline: true, readOnly: true },
                sx: {
                  '& .MuiInputBase-input': { padding: '4px 8px !important', cursor: 'pointer' },
                },
              },
              openPickerButton: { size: 'small', sx: { margin: '-4px' } },
            }}
            sx={{ width: '100%', height: '100%' }}
          />
        </LocalizationProvider>
      ),
    },
    {
      sortable: false,
      field: FieldName.NGAY_HET_HAN,
      headerName: 'Hạn sử dụng',
      flex: 1.5,
      cellClassName: 'editable-cell no-padding',
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            // Ensure value parses the string from state correctly
            value={params.value ? moment(params.value, DateFormat.DATE_ONLY_VN) : null}
            format={DateFormat.DATE_ONLY_VN}
            // Remove dispatch from onChange
            // onChange={(newDate) => {
            //   const serializedDate = newDate ? moment(newDate).format(DateFormat.DATE_ONLY_VN) : null;
            //   dispatch(
            //     updateSuppliesDetail({
            //       id: params.row?.id,
            //       changes: {
            //         ngayHetHan: serializedDate,
            //       },
            //     }),
            //   );
            // }}
            onAccept={(newDate: any) => {
              // Rely on onAccept
              const serializedDate = newDate ? moment(newDate).format(DateFormat.DATE_ONLY_VN) : null;
              dispatch(
                updateSuppliesDetail({
                  id: params.row?.id,
                  changes: {
                    ngayHetHan: serializedDate,
                  },
                }),
              );
            }}
            className="custom-datepicker"
            reduceAnimations
            slotProps={{
              textField: {
                size: 'small',
                variant: 'standard',
                InputProps: { disableUnderline: true, readOnly: true },
                sx: {
                  '& .MuiInputBase-input': { padding: '4px 8px !important', cursor: 'pointer' },
                },
              },
              openPickerButton: { size: 'small', sx: { margin: '-4px' } },
            }}
            sx={{ width: '100%', height: '100%' }}
          />
        </LocalizationProvider>
      ),
      ...generateColumnStyle(),
    },
    {
      sortable: false,
      field: FieldName.NGAY_HET_HAN_LK,
      headerName: 'Hạn lưu kho',
      flex: 1.5,
      cellClassName: 'editable-cell no-padding',
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            // Ensure value parses the string from state correctly
            value={params.value ? moment(params.value, DateFormat.DATE_ONLY_VN) : null}
            format={DateFormat.DATE_ONLY_VN}
            // Remove dispatch from onChange
            // onChange={(newDate) => {
            //   dispatch(
            //     updateSuppliesDetail({
            //       id: params.row?.id,
            //       changes: {
            //         ngayHetHanLK: newDate ? moment(newDate).format(DateFormat.DATE_ONLY_VN) : null, // Format here too
            //       },
            //     }),
            //   );
            // }}
            onAccept={(newDate: any) => {
              // Rely on onAccept
              const serializedDate = newDate ? moment(newDate).format(DateFormat.DATE_ONLY_VN) : null; // Format the date
              dispatch(
                updateSuppliesDetail({
                  id: params.row?.id,
                  changes: {
                    ngayHetHanLK: serializedDate, // Use the formatted date
                  },
                }),
              );
            }}
            className="custom-datepicker"
            reduceAnimations
            slotProps={{
              textField: {
                size: 'small',
                variant: 'standard',
                InputProps: { disableUnderline: true, readOnly: true },
                sx: {
                  '& .MuiInputBase-input': { padding: '4px 8px !important', cursor: 'pointer' },
                },
              },
              openPickerButton: { size: 'small', sx: { margin: '-4px' } },
            }}
            sx={{ width: '100%', height: '100%' }}
          />
        </LocalizationProvider>
      ),
    },
    {
      sortable: false,
      field: FieldName.GHI_CHU,
      headerName: 'Ghi chú 1',
      flex: 1,
      editable: true,
      type: 'string',
      cellClassName: 'editable-cell', // Add class for styling
      renderCell: (params) => (
        <FormGroup>
          <Input
            type="text"
            value={params.value || ''}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      ),
    },
    {
      sortable: false,
      field: FieldName.GHI_CHU_2,
      headerName: 'Ghi chú 2',
      flex: 1,
      editable: true,
      type: 'string',
      cellClassName: 'editable-cell', // Add class for styling
      renderCell: (params) => (
        <FormGroup>
          <Input
            type="text"
            value={params.value || ''}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      ),
    },
    {
      sortable: false,
      field: FieldName.GHI_CHU_3,
      headerName: 'Ghi chú 3',
      flex: 1,
      editable: true,
      type: 'string',
      cellClassName: 'editable-cell', // Add class for styling
      renderCell: (params) => (
        <FormGroup>
          <Input
            type="text"
            value={params.value || ''}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      ),
    },
    {
      sortable: false,
      field: 'actions',
      headerName: '⋮⋮⋮',
      headerAlign: 'center',
      flex: 0.1,
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
            {/* Move the conditional rendering inside the Link */}
            {isDeleting ? <CircularProgress size={10} /> : <i className="fa-solid fa-trash" title="Xóa" />}
          </Link> // Correct placement of closing tag
        );
      },
    },
  ];

  return { columns, suppliesIsLoading };
};

export default useTableConfig;
