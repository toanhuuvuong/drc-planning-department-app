import React from 'react';
import { Input } from 'reactstrap';
import { validateOnlyNumber } from '../utils';

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  isValidate = false,
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    const { value } = e.target;
    if (!isValidate) {
      setValue(value);
    }
    if (validateOnlyNumber(value)) {
      setValue(value);
    }
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <Input value={value} onChange={onChange} onBlur={onBlur} />;
};

export default EditableCell;
