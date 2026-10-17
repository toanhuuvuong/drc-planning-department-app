import { Autocomplete, TextField } from '@mui/material';
import { SuppliesFilter, SuppliesFilterOptions } from 'main/hooks/useSuppliesOptions';
import React from 'react';

export type onChangeType = SuppliesFilter & {
  soLuong?: number;
  tonKho?: number;
  soLo?: number;
  maLo?: string;
  nguonGoc?: number;
  idNhap?: number;
  thoiHanLuuKho?: number | null;
  soLuongThucTe?: number;
  soLuongYeuCau?: number;
  ngayHetHanLK?: string;
};

interface AutocompleteCellProps {
  options: SuppliesFilterOptions;
  value: SuppliesFilter | null;
  onChange: (newValue: onChangeType | null) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  getOptionLabel: (option: any) => string; // Ensure getOptionLabel is always provided
  placeholder?: string;
  // Removed customDisplayHandler
}

const AutocompleteCell: React.FC<AutocompleteCellProps> = ({
  options,
  value,
  onChange,
  inputRef,
  getOptionLabel,
  placeholder,
}) => {
  // Removed useCustomLabelDisplay hook

  return (
    <Autocomplete
      fullWidth // Ensure it takes full cell width
      getOptionKey={(e: any) => e.id}
      options={options}
      value={value} // Pass value directly
      getOptionLabel={getOptionLabel}
      onChange={(_event, newValue) => {
        onChange(newValue); // Simplified callback
      }}
      onKeyDown={(e) => {
        // Prevent grid navigation interference
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
          e.stopPropagation();
        }
      }}
      // Removed style prop, rely on parent/grid styling
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          variant="standard" // Use standard variant for less visual clutter inside cell
          size="small" // Use small size for better fit in grid cells
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            disableUnderline: true, // Remove underline for cleaner look
            style: { paddingTop: 0, paddingBottom: 0 }, // Adjust padding if needed
          }}
          sx={{
            '& .MuiInputBase-root': { height: '100%', boxSizing: 'border-box', alignItems: 'center' }, // Ensure vertical alignment if needed
            '& .MuiInputBase-input': { padding: '0 !important' }, // Adjust padding to match grid cell padding (or set to 0 if cell has no padding)
          }}
        />
      )}
      sx={{ padding: 0, height: '100%', display: 'flex', alignItems: 'center' }} // Ensure Autocomplete itself aligns items centrally
    />
  );
};

// Removed useCustomLabelDisplay hook function

export default AutocompleteCell;
