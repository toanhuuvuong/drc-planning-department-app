import { KhovtMasterVtWithRelations, KhovtTransPhieunhapDetailWithRelations } from 'main/apis/drc/models';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  deleteSuppliesDetail,
  insertNewSupplies,
  selectSuppliesStoreImportDetails,
  updateSuppliesDetail,
} from 'main/redux/modules/supplies-store-import/supplies-store-import-edit-slice';
import { generateColumnStyle } from 'main/utils';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import AddSuppliesModal from './add-supplies-modal/add-supplies-modal';
import tableConfig from './table-config';

function SuppliesStoreImportEditTable() {
  // Redux
  const dispatch = useAppDispatch();
  const suppliesStoreImportDetails = useAppSelector(selectSuppliesStoreImportDetails);

  // React State
  const [isOpenAddSuppliesModal, setOpenAddSuppliesModal] = useState(false);

  // React function
  const toggleAddSuppliesModal = useCallback(
    () => setOpenAddSuppliesModal((isOpenAddSuppliesModal) => !isOpenAddSuppliesModal),
    [],
  );

  const handleAddSuppliesModalConfirmClick = useCallback(
    (selectedSuppliesRows?: KhovtMasterVtWithRelations[]) => {
      // Update state
      dispatch(insertNewSupplies(selectedSuppliesRows));

      // Close modal
      toggleAddSuppliesModal();
    },
    [dispatch, toggleAddSuppliesModal],
  );

  const handleDeleteSuppliesDetails = useCallback(
    (maVt: string) => {
      dispatch(deleteSuppliesDetail(maVt));
    },
    [dispatch],
  );

  const handleTableChange = useCallback(
    (type: TableChangeType, newState: TableChangeState<KhovtTransPhieunhapDetailWithRelations>) => {
      if (type === 'cellEdit') {
        const {
          cellEdit: { dataField, newValue, rowId },
        } = newState;
        dispatch(updateSuppliesDetail(rowId, dataField, newValue));
      }
    },
    [dispatch],
  );

  return (
    <>
      <ToolkitProvider
        data={suppliesStoreImportDetails}
        keyField={FieldName.MA_VT}
        columns={[
          ...tableConfig.columns,
          {
            dataField: FieldName.ACTION,
            isDummyField: true,
            text: 'Thao tác',
            editable: false,
            headerStyle: generateColumnStyle().headerStyle,
            formatter: (_: any, row: KhovtTransPhieunhapDetailWithRelations) => {
              return (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteSuppliesDetails(row?.maVt);
                  }}>
                  <i className="fa-solid fa-trash" title="Xóa" />
                </Link>
              );
            },
          },
        ]}>
        {(props: any) => (
          <>
            <div className="d-flex justify-content-end pb-4">
              <Button color="primary" onClick={toggleAddSuppliesModal}>
                Thêm vật tư
              </Button>
            </div>
            <div className="table-responsive">
              <BootstrapTable
                {...props.baseProps}
                remote
                bootstrap4={true}
                bordered={false}
                cellEdit={cellEditFactory(tableConfig.cellEdit)}
                onTableChange={handleTableChange}
                noDataIndication={() => <div className="text-center">Chưa có vật tư nào</div>}
              />
            </div>
            <p className="text-sm mt-2">
              <em>&#40;Nhấn 2 lần vào ô bạn muốn chỉnh sửa&#41;</em>
            </p>
          </>
        )}
      </ToolkitProvider>
      <AddSuppliesModal
        isOpen={isOpenAddSuppliesModal}
        toggle={toggleAddSuppliesModal}
        handleConfirmClick={handleAddSuppliesModalConfirmClick}
      />
    </>
  );
}

export default SuppliesStoreImportEditTable;
