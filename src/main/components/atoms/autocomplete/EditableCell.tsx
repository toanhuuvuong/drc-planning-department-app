import { SuppliesFilter, SuppliesFilterOptions } from 'main/hooks/useSuppliesOptions';
import React from 'react';
import AutocompleteCell from './AutocompleteCell';

export type onChangeType = SuppliesFilter & {
  soLuong?: number;
  tonKho?: number;
  soLo?: number;
  nguonGoc?: number;
  idNhap?: number;
};

interface EditableCellProps {
  value: SuppliesFilter | null;
  options: SuppliesFilterOptions;
  onChange: (newValue: onChangeType | null) => void;
  getOptionLabel: (option: SuppliesFilter) => string;
  placeholder?: string; // Add placeholder prop if needed
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  options,
  onChange,
  getOptionLabel,
  placeholder, // Receive placeholder
}) => {
  // Removed internal state [inputValue, setInputValue]
  // Removed inputRef and useEffect

  return (
    <AutocompleteCell
      options={options}
      value={value} // Pass value directly
      onChange={onChange} // Pass onChange directly
      getOptionLabel={getOptionLabel}
      placeholder={placeholder} // Pass placeholder
      // inputRef is likely not needed here unless specific focus management is required
    />
  );
};

export default EditableCell;
