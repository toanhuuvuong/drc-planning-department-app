import { TextField, Autocomplete, Checkbox, ListItemText } from '@mui/material';
import { SelectOption } from 'main/types/select-option';
import React from 'react';

interface AutoCompleteMultiSelectProps {
  optionData: SelectOption[];
  value: Array<string | number> | null;
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  css?: React.CSSProperties;
  renderOption?: (option: SelectOption) => string;
}

export default function AutoCompleteMultiSelect({
  label,
  placeholder,
  optionData,
  value,
  onChange: handleChange,
  readOnly = false,
  css,
  renderOption = (option) => `${option.id} - ${option.text}`,
}: Readonly<
  AutoCompleteMultiSelectProps & {
    onChange: (newValue: typeof value) => void;
  }
>) {
  const selectedOptions = optionData.filter((option) => value?.includes(option.id));

  return (
    <Autocomplete
      multiple
      sx={css}
      disableCloseOnSelect
      options={optionData}
      getOptionLabel={renderOption}
      value={selectedOptions}
      readOnly={readOnly}
      onChange={(event, newValues) => {
        handleChange(newValues.map((option) => option.id));
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox checked={selected} />
          <ListItemText primary={renderOption(option)} />
        </li>
      )}
      renderInput={(params) => <TextField {...params} variant="outlined" label={label} placeholder={placeholder} />}
    />
  );
}
