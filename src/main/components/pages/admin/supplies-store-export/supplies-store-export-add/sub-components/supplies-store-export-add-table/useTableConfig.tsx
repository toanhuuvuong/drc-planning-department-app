import { CircularProgress } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useKhovtTransPhieuNhapControllerFindDetail } from 'main/apis/drc/endpoints/khovt-trans-phieu-nhap-controller/khovt-trans-phieu-nhap-controller';
import AutocompleteCell, { onChangeType } from 'main/components/atoms/autocomplete/AutocompleteCell';
import { Color } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { SuppliesFilterOptions, SuppliesFilter } from 'main/hooks/useSuppliesExportOptions'; // Assuming SuppliesFilter is exported here
import { useAppDispatch } from 'main/redux/hooks';
import {
  deleteSuppliesDetail,
  updateSuppliesDetail,
  SuppliesDetailExport, // Correct the imported type name (assuming it's SuppliesDetailExport)
} from 'main/redux/modules/supplies-store-export/supplies-store-export-add-slice';
import { generateColumnStyle } from 'main/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, Input } from 'reactstrap'; // Import FormGroup and Input

const useTableConfig = (
  suppliesOptions: SuppliesFilterOptions | undefined,
  suppliesIsLoading: boolean,
  selectedSupplies: SuppliesDetailExport[], // Change type to SuppliesDetailExport[]
  suppliesDetails: SuppliesDetailExport[], // Change type to SuppliesDetailExport[]
) => {
  const dispatch = useAppDispatch();
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

  const columns: GridColDef[] = [
    {
      field: FieldName.STT,
      headerName: 'STT',
      editable: false,
      sortable: false,
      flex: 0.5,
      cellClassName: 'disable-gray',
      renderCell: (params: any) => {
        const index = suppliesDetails.findIndex((row: SuppliesDetailExport) => row.id === params.id); // Use correct type
        return index !== -1 ? index + 1 : '';
      },
      //
    },
    {
      field: FieldName.MA_VT,
      headerName: 'Mã vật tư',
      flex: 3,
      cellClassName: 'editable-cell no-padding',
      renderCell: (params) => {
        // Safely access filter and provide default empty array
        // Assuming the actual options are directly in suppliesOptions if it's an array,
        // or adjust if it's an object like { data: [...] }
        const optionsArray = Array.isArray(suppliesOptions) ? suppliesOptions : [];
        const availableOptions = (optionsArray ?? []).filter(
          (
            option: SuppliesFilter, // Add type to option
          ) =>
            !selectedSupplies.some(
              (selected: SuppliesDetailExport) => selected.maVt === option.maVt && selected.id !== params.row.id, // Use correct type
            ),
        );
        return (
          <AutocompleteCell
            value={
              params.value // Find the full option object based on maVt if needed
                ? (availableOptions.find((opt: SuppliesFilter) => opt.maVt === params.value) ?? null) // Add type to opt
                : null
            }
            options={availableOptions}
            getOptionLabel={(option) =>
              option ? `${option.maVt} - ${option.tenVt} - ${option.soLo} - Tồn: ${option.tonKho}` : ''
            }
            onChange={(newValue) => {
              if (newValue) {
                dispatch(
                  updateSuppliesDetail({
                    id: params.row?.id,
                    changes: {
                      maVt: newValue.maVt,
                      tenVt: newValue.tenVt,
                      dvt: newValue.dvt,
                      soLo: newValue.soLo,
                      maLo: newValue.maLo,
                      tonKho: newValue.tonKho,
                      nguonGoc: newValue.nguonGoc,
                      idNhap: newValue.idNhap,
                      ngayHetHanLK: newValue.ngayHetHanLK,
                    },
                  }),
                );
              } else {
                // Handle clear selection if needed
                dispatch(
                  updateSuppliesDetail({
                    id: params.row?.id,
                    changes: {
                      maVt: null,
                      tenVt: null,
                      dvt: null,
                      soLo: null,
                      maLo: null,
                      tonKho: null,
                      nguonGoc: null,
                      idNhap: null,
                      ngayHetHanLK: null,
                      soLuong: 1, // Reset quantity or handle as needed
                    },
                  }),
                );
              }
            }}
          />
        );
      },
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
      field: FieldName.DVT,
      headerName: 'Đơn vị tính',
      cellClassName: 'disable-gray',
      flex: 1,
      editable: false,
      sortable: false,
    },
    // Tạm ẩn, không cho nhập
    // {
    //   field: FieldName.SO_LUONG_YEU_CAU,
    //   headerName: 'Số lượng yêu cầu',
    //   flex: 1,
    //   editable: true,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <FormGroup>
    //       <Input
    //         type="text"
    //         inputMode="numeric"
    //         pattern="[0-9]*"
    //         value={params.value || ''}
    //         onChange={(e) =>
    //           params.api.setEditCellValue({
    //             id: params.id,
    //             field: params.field,
    //             value: e.target.value,
    //           })
    //         }
    //       />
    //     </FormGroup>
    //   ),
    // },
    {
      field: FieldName.SO_LUONG_THUC_TE,
      headerName: 'Số lượng thực xuất',
      flex: 1,
      editable: true,
      sortable: false,
      cellClassName: (params) => {
        const { tonKho, soLuongThucTe } = params.row;
        return Number(soLuongThucTe) > Number(tonKho) ? 'error-cell' : Color.LIGHT_GRAY;
      },
      renderCell: (params) => (
        <FormGroup>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
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
      field: FieldName.TON_KHO,
      headerName: 'Tồn kho hiện tại',
      flex: 1,
      editable: false,
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
      flex: 1,
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
      field: FieldName.MA_LO,
      headerName: 'Mã số lô',
      cellClassName: 'disable-gray',
      flex: 1,
      editable: false,
      sortable: false,
    },
    {
      field: FieldName.NGUON_GOC,
      headerName: 'Nguồn gốc',
      cellClassName: 'disable-gray',
      flex: 1.5,
      editable: false,
      sortable: false,
    },
    {
      sortable: false,
      field: 'actions',
      headerName: 'Thao Tác',
      flex: 0.5,
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
            {isDeleting ? <CircularProgress size={20} /> : <i className="fa-solid fa-trash" title="Xóa" />}
          </Link>
        );
      },
    },
  ];

  return { columns, suppliesIsLoading }; // Return suppliesIsLoading
};

export default useTableConfig;
