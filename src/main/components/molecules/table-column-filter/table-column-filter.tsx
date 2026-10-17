import { AutoCompleteMultiSelect } from 'main/components/molecules/multi-select';
import { SelectOption } from 'main/types/select-option';
import React, { useState } from 'react';
import { Button, Popover, PopoverBody, PopoverHeader } from 'reactstrap';

type Props = {
  filterOptions: SelectOption[];
  onFilter: Function;
  filterName?: string;
};

function ColumnFilterPopover({ filterOptions, onFilter, filterName = 'Bộ lọc' }: Readonly<Props>) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const togglePopover = () => setPopoverOpen(!popoverOpen);

  const handleFilter = (onFilter: Function) => {
    onFilter(selectedValues);
    setPopoverOpen(false);
  };

  const handleResetFilter = (onFilter: Function) => {
    setSelectedValues([]);
    onFilter([]);
    setPopoverOpen(false);
  };

  return (
    <>
      <Button
        id="filterPopover"
        size={'sm'}
        onClick={togglePopover}
        color={selectedValues.length > 0 ? 'warning' : 'primary'}
        outline>
        <i className="ni ni-align-center mr-1" />
        {filterName}
      </Button>
      <Popover
        isOpen={popoverOpen}
        target="filterPopover"
        toggle={togglePopover}
        color="light"
        style={{ minWidth: 400, backgroundColor: 'white' }}>
        <PopoverHeader>
          <div className="my-2">
            <Button onClick={() => handleFilter(onFilter)} color="primary">
              Thực hiện lọc
            </Button>
            <Button onClick={() => handleResetFilter(onFilter)} color="secondary" className="ml-2">
              Huỷ lọc
            </Button>
          </div>
        </PopoverHeader>
        <PopoverBody>
          <AutoCompleteMultiSelect
            optionData={filterOptions}
            onChange={(selectedIds) => {
              setSelectedValues((selectedIds || []).map(String));
            }}
            value={selectedValues}
            renderOption={(option) => option.text}
            placeholder="Chọn giá trị lọc"
          />
        </PopoverBody>
      </Popover>
    </>
  );
}

export default ColumnFilterPopover;
