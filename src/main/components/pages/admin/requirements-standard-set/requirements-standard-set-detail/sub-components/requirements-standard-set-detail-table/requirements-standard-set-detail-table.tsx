import { DmMasterBoDinhMucControllerFindDetailItems200, DmTransDinhMucItemWithRelations } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectRequirementsStandardItemTable,
  updateRequirementsStandardItemTable,
} from 'main/redux/modules/requirements-standard-set/requirements-standard-set-detail-slice';
import { useCallback } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import tableConfig from './table-config';

type Props = {
  data?: DmMasterBoDinhMucControllerFindDetailItems200;
  dataIsLoading: boolean;
  handleRefreshTable: () => void;
};

function RequirementsStandardSetDetailTable({
  data: { data, count: dataCount } = { data: [], count: 0 },
  dataIsLoading,
  handleRefreshTable,
}: Props) {
  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage, sortField, sortOrder } = useAppSelector(selectRequirementsStandardItemTable);

  // React Function
  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<DmTransDinhMucItemWithRelations>) => {
      const { page, sizePerPage, sortField, sortOrder } = newState;

      dispatch(
        updateRequirementsStandardItemTable({
          page,
          sizePerPage,
          sortField,
          sortOrder,
        }),
      );
    },
    [dispatch],
  );

  return (
    <>
      <ToolkitProvider data={data || []} keyField={FieldName.ID} columns={tableConfig.columns}>
        {(props: any) => (
          <>
            <div className="table-responsive">
              <BootstrapTable
                {...props.baseProps}
                remote
                bootstrap4
                bordered={false}
                pagination={paginationFactory({
                  ...tableConfig.pagination,
                  page: page,
                  sizePerPage: sizePerPage,
                  totalSize: dataCount,
                })}
                sort={
                  sortField
                    ? {
                        dataField: sortField,
                        order: sortOrder,
                      }
                    : {}
                }
                onTableChange={handleTableChange}
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
    </>
  );
}

export default RequirementsStandardSetDetailTable;
