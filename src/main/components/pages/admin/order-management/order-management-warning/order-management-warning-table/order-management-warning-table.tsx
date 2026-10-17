import { QldhTransDonHangControllerSearchCanhBao200Item } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Page } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import { generateColumnStyle } from 'main/utils';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import tableConfig from './table-config';

type Props = {
  data?: QldhTransDonHangControllerSearchCanhBao200Item[];
  dataIsLoading: boolean;
};

function ProductStoreInventoryWarningTable({ data, dataIsLoading }: Props) {
  const permissionAction = usePermissionAction();

  return (
    <ToolkitProvider
      data={data || []}
      keyField={`${FieldName.SO_PHIEU_NHAP}_${FieldName.MA_SAN_PHAM}_${FieldName.SO_LO}`}
      columns={[
        ...tableConfig.columns,
        {
          dataField: FieldName.ACTION,
          isDummyField: true,
          text: 'Thao tác',
          hidden: !permissionAction,
          ...generateColumnStyle(),
          formatter: (_: any, row: QldhTransDonHangControllerSearchCanhBao200Item) => {
            return (
              <div className="d-flex">
                <EditPermissionAction>
                  <Link className="px-2" to={Page.ORDER_MANAGEMENT_EDIT.PATH.replace(':id', String(row.donHangId))}>
                    <i className="fa-solid fa-pen-to-square" title="Sửa" />
                  </Link>
                </EditPermissionAction>
              </div>
            );
          },
        },
      ]}>
      {(props: any) => (
        <>
          <div className="table-responsive">
            <BootstrapTable
              {...props.baseProps}
              remote
              bootstrap4
              bordered={false}
              noDataIndication={() => (
                <div className="text-center">
                  {dataIsLoading ? <BasicSpinner /> : 'Không có kết quả nào được tìm thấy'}
                </div>
              )}
            />
          </div>
        </>
      )}
    </ToolkitProvider>
  );
}

export default ProductStoreInventoryWarningTable;
