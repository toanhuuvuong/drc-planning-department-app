import {
  useDmMasterBoDinhMucControllerCreate,
  useDmMasterBoDinhMucControllerDeleteById,
} from 'main/apis/drc/endpoints/dm-master-bo-dinh-muc-controller/dm-master-bo-dinh-muc-controller';
import { DmMasterBoDinhMuc, DmMasterBoDinhMucWithRelations, DmTransDinhMucWithRelations } from 'main/apis/drc/models';
import { ExportCSVButton } from 'main/components/atoms/button';
import { BasicSpinner, TransparentSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { DateFormat, Page, ToastMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectRequirementsStandardSetTable,
  updateRequirementsStandardSetTable,
} from 'main/redux/modules/requirements-standard-set/requirements-standard-set-list-slice';
import { DateUtil, generateColumnStyle } from 'main/utils';
import moment from 'moment';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import DeleteRequirementsStandardSetModal from './delete-requirements-standard-set-modal';
import tableConfig from './table-config';
import UploadRequirementsStandardSetModal from './upload-requirements-standard-set-modal';

type Props = {
  data?: DmMasterBoDinhMuc[];
  dataIsLoading: boolean;
  dataCount?: number;
  dataCountIsLoading: boolean;
  handleRefreshTable: () => void;
};

function RequirementsStandardSetTable({
  data,
  dataIsLoading,
  dataCount,
  dataCountIsLoading,
  handleRefreshTable,
}: Props) {
  // React Router
  const navigate = useNavigate();

  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage, sortField, sortOrder } = useAppSelector(selectRequirementsStandardSetTable);

  // React State/Ref
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [isOpenUploadModal, setOpenUploadModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DmMasterBoDinhMuc>();

  // React Query
  const { mutateAsync: deletedRequirementsStandardSetMutateAsync, isPending: deletedRequirementsStandardSetIsPending } =
    useDmMasterBoDinhMucControllerDeleteById();

  const { mutateAsync: createdRequirementsStandardSetMutateAsync, isPending: createdRequirementsStandardSetIsPending } =
    useDmMasterBoDinhMucControllerCreate();

  // React Function
  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<DmMasterBoDinhMuc>) => {
      const { page, sizePerPage, sortField, sortOrder } = newState;

      dispatch(
        updateRequirementsStandardSetTable({
          page,
          sizePerPage,
          sortField,
          sortOrder,
        }),
      );
    },
    [dispatch],
  );

  const toggleDeleteModal = useCallback(() => setOpenDeleteModal((isOpenDeleteModal) => !isOpenDeleteModal), []);

  const toggleUploadModal = useCallback(() => setOpenUploadModal((isOpenUploadModal) => !isOpenUploadModal), []);

  const handleDeleteActionClick = useCallback(
    (row: DmMasterBoDinhMuc) => {
      setSelectedRow(row);
      toggleDeleteModal();
    },
    [toggleDeleteModal],
  );

  const handleDeleteModalConfirmClick = useCallback(() => {
    // Close modal
    toggleDeleteModal();

    // Delete document
    deletedRequirementsStandardSetMutateAsync({ id: Number(selectedRow?.id) })
      .then((_) => {
        // Refresh table data
        handleRefreshTable();
        toast.success(ToastMessage.CANCEL_SUCCESS);
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [deletedRequirementsStandardSetMutateAsync, handleRefreshTable, selectedRow?.id, toggleDeleteModal]);

  const handleUploadModalConfirmClickCallback = useCallback(
    (requirementsStandardSet: DmMasterBoDinhMucWithRelations) => {
      // Close modal
      toggleUploadModal();

      // Create new product store excel
      createdRequirementsStandardSetMutateAsync({
        data: {
          ...requirementsStandardSet,
          ngayCapNhat: DateUtil.toDateISOString(moment()),
          maBoDinhMuc: `DM-Version-${moment().format(DateFormat.DATE_TIME_LONG_VN_NOSPACE)}`,
          dinhMucs: normalizeRequirementsStandards(requirementsStandardSet.dinhMucs),
        },
      })
        .then((newRequirementsStandardSet) => {
          navigate(Page.REQUIREMENTS_STANDARD_SET_DETAIL.PATH.replace(':id', String(newRequirementsStandardSet?.id)));
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error?.message || e.message);
        });
    },
    [createdRequirementsStandardSetMutateAsync, navigate, toggleUploadModal],
  );

  return (
    <ToolkitProvider
      data={data || []}
      keyField={`${FieldName.ID}`}
      exportCSV={tableConfig.exportCSV}
      columns={[
        ...tableConfig.columns,
        {
          dataField: FieldName.ACTION,
          isDummyField: true,
          csvExport: false,
          text: 'Thao tác',
          ...generateColumnStyle(),
          formatter: (_: any, row: DmMasterBoDinhMuc) => {
            return (
              <div className="d-flex">
                <Link className="px-2" to={Page.REQUIREMENTS_STANDARD_SET_DETAIL.PATH.replace(':id', String(row.id))}>
                  <i className="fa-solid fa-eye" title="Xem" />
                </Link>
                <EditPermissionAction>
                  <Link
                    className="px-2"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteActionClick(row);
                    }}>
                    <i className="fa-solid fa-trash" title="Xóa" />
                  </Link>
                </EditPermissionAction>
              </div>
            );
          },
        },
      ]}>
      {(props: any) => (
        <>
          <div className="d-flex justify-content-end mb-4 pb-1">
            <ExportCSVButton color="primary" {...props.csvProps}>
              Tải về
            </ExportCSVButton>
            <EditPermissionAction>
              <Button color="primary" onClick={toggleUploadModal}>
                Import bộ định mức
              </Button>
            </EditPermissionAction>
          </div>
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
                  {dataIsLoading || dataCountIsLoading ? <BasicSpinner /> : 'Không có kết quả nào được tìm thấy'}
                </div>
              )}
            />
          </div>
          <DeleteRequirementsStandardSetModal
            requirementsStandardSet={selectedRow}
            isOpen={isOpenDeleteModal}
            toggle={toggleDeleteModal}
            handleConfirmClick={handleDeleteModalConfirmClick}
          />
          <UploadRequirementsStandardSetModal
            isOpen={isOpenUploadModal}
            toggle={toggleUploadModal}
            handleConfirmClickCallback={handleUploadModalConfirmClickCallback}
          />
          {(createdRequirementsStandardSetIsPending || deletedRequirementsStandardSetIsPending) && (
            <TransparentSpinner />
          )}
        </>
      )}
    </ToolkitProvider>
  );
}

const normalizeRequirementsStandards = (requirementsStandards?: DmTransDinhMucWithRelations[]) => {
  if (!requirementsStandards) {
    return requirementsStandards;
  }
  const list: DmTransDinhMucWithRelations[] = [];
  for (const requirementsStandard of requirementsStandards) {
    list.push({
      ...requirementsStandard,
    });
  }
  return list;
};

export default RequirementsStandardSetTable;
