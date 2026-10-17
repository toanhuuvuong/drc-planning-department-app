import { FPermissionWithControllerSchema } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import Role from 'main/constants/enums/role';
import React from 'react';
import { Input } from 'reactstrap';
import styled from 'styled-components';

const InputWithCursorPointer = styled(Input)`
  cursor: pointer;
`;

const columns = (
  handleCheckboxChange: Function,
  handleSelectAll: Function,
  isSelectAllViewChecked: boolean,
  isSelectAllEditChecked: boolean,
  isEditPermission: boolean,
) => {
  return [
    {
      dataField: 'index',
      text: 'STT',
      style: { width: '5%' },
      formatter: (_cell: string, _row: FPermissionWithControllerSchema, rowIndex: number) => {
        return rowIndex + 1;
      },
    },
    {
      dataField: FieldName.CONTROLLER_NAME,
      text: 'Tên Chức Năng',
      style: { width: '40%' },
    },
    {
      dataField: FieldName.ROLE + Role.VIEW,
      text: 'Xem',
      headerFormatter: () => (
        <div>
          <div className="mr-2 mb-2">Xem</div>
          <InputWithCursorPointer
            type="checkbox"
            checked={isSelectAllViewChecked}
            disabled={!isEditPermission}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll('view', e.target.checked)}
          />
          <div className="mt-2 pt-1 text-blue">Tất cả</div>
        </div>
      ),
      formatter: (cell: string, row: FPermissionWithControllerSchema) => {
        const isView = row.role === 'VIEW' || row.role === 'EDIT';
        return (
          <InputWithCursorPointer
            type="checkbox"
            checked={isView}
            disabled={!isEditPermission}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleCheckboxChange(row.controllerId, 'view', e.target.checked)
            }
          />
        );
      },
      style: { width: '10%' },
    },
    {
      dataField: FieldName.ROLE + Role.EDIT,
      text: 'Chỉnh sửa/Xóa',
      headerFormatter: () => (
        <div>
          <div className="mr-2 mb-2">Chỉnh sửa/Xóa</div>
          <InputWithCursorPointer
            type="checkbox"
            checked={isSelectAllEditChecked}
            disabled={!isEditPermission}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll('edit', e.target.checked)}
          />
          <div className="mt-2 pt-1 text-blue">Tất cả</div>
        </div>
      ),
      formatter: (cell: string, row: FPermissionWithControllerSchema) => {
        const isEdit = row.role === 'EDIT';
        return (
          <InputWithCursorPointer
            type="checkbox"
            checked={isEdit}
            disabled={!isEditPermission}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleCheckboxChange(row.controllerId, 'edit', e.target.checked)
            }
          />
        );
      },
      style: { width: '10%' },
    },
  ];
};

export const tableConfig = {
  columns,
};

export default tableConfig;
