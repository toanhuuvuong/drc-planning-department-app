import { useEffect, useState } from 'react';
import { Input } from 'reactstrap';

const SelectableCell = ({ value: initialValue, row: { index }, column: { id }, updateMyData, options = [] }) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input type="select" value={value} onChange={onChange} onBlur={onBlur} style={{ padding: '.375rem .2rem' }}>
      {options.map((item) => (
        <option key={item?.value} value={item?.value}>
          {item?.label}
        </option>
      ))}
    </Input>
  );
};

export default SelectableCell;
