import { DmTransDinhMucCompareItem } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import { FieldName } from 'main/constants/enums';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import tableConfig from './table-config';

type Props = {
  isLeft?: boolean;
  data?: DmTransDinhMucCompareItem[];
  dataIsLoading: boolean;
};

function RequirementsStandardSetCompareTable({ isLeft, data, dataIsLoading }: Props) {
  return (
    <ToolkitProvider
      data={data || []}
      keyField={`${FieldName.MA_THANH_PHAM}_${FieldName.MA_ITEM}`}
      exportCSV={tableConfig.exportCSV}
      columns={tableConfig.getColumns(isLeft)}>
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

export default RequirementsStandardSetCompareTable;
