import {
  useQdhdsdMasterTaiLieuControllerCreate,
  useQdhdsdMasterTaiLieuControllerDeleteById,
  useQdhdsdMasterTaiLieuControllerUpdateById,
  useQdhdsdMasterTaiLieuControllerUpload,
} from 'main/apis/drc/endpoints/qdhdsd-master-tai-lieu-controller/qdhdsd-master-tai-lieu-controller';
import { QdhdsdMasterTaiLieu } from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { ToastMessage } from 'main/constants';
import { FieldName } from 'main/constants/enums';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import {
  selectDocumentTable,
  updateDocumentTable,
} from 'main/redux/modules/terms-and-conditions/terms-and-conditions-list-slice';
import { DateUtil, generateColumnStyle } from 'main/utils';
import { useCallback, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import AddEditDocumentModal from './add-edit-document-modal';
import DeleteDocumentModal from './delete-document-modal';
import tableConfig from './table-config';
import ViewDocumentModal from './view-document-modal';

type Props = {
  data?: QdhdsdMasterTaiLieu[];
  dataIsLoading: boolean;
  dataCount?: number;
  dataCountIsLoading: boolean;
  handleRefreshTable: () => void;
};

function TermsAndConditionsTable({ data, dataIsLoading, dataCount, dataCountIsLoading, handleRefreshTable }: Props) {
  const permissionAction = usePermissionAction();
  // Redux
  const dispatch = useAppDispatch();
  const { page, sizePerPage, sortField, sortOrder } = useAppSelector(selectDocumentTable);

  // React State/Ref
  const [isOpenViewModal, setOpenViewModal] = useState(false);
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [isOpenAddEditModal, setOpenAddEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<QdhdsdMasterTaiLieu>();

  // React Query
  const { mutateAsync: deletedDocumentMutateAsync } = useQdhdsdMasterTaiLieuControllerDeleteById();
  const { mutateAsync: updatedDocumentMutateAsync } = useQdhdsdMasterTaiLieuControllerUpdateById();
  const { mutateAsync: createdDocumentMutateAsync } = useQdhdsdMasterTaiLieuControllerCreate();
  const { mutateAsync: uploadedDocumentMutateAsync } = useQdhdsdMasterTaiLieuControllerUpload();

  // React Function
  const handleTableChange = useCallback(
    (_: TableChangeType, newState: TableChangeState<QdhdsdMasterTaiLieu>) => {
      const { page, sizePerPage, sortField, sortOrder } = newState;

      dispatch(
        updateDocumentTable({
          page,
          sizePerPage,
          sortField,
          sortOrder,
        }),
      );
    },
    [dispatch],
  );

  const toggleViewModal = useCallback(() => setOpenViewModal((isOpenViewModal) => !isOpenViewModal), []);

  const toggleDeleteModal = useCallback(() => setOpenDeleteModal((isOpenDeleteModal) => !isOpenDeleteModal), []);

  const toggleAddEditModal = useCallback(() => setOpenAddEditModal((isOpenAddEditModal) => !isOpenAddEditModal), []);

  const handleViewActionClick = useCallback(
    (row: QdhdsdMasterTaiLieu) => {
      setSelectedRow(row);
      toggleViewModal();
    },
    [toggleViewModal],
  );

  const handleDeleteActionClick = useCallback(
    (row: QdhdsdMasterTaiLieu) => {
      setSelectedRow(row);
      toggleDeleteModal();
    },
    [toggleDeleteModal],
  );

  const handleEditActionClick = useCallback(
    (row: QdhdsdMasterTaiLieu) => {
      setSelectedRow(row);
      toggleAddEditModal();
    },
    [toggleAddEditModal],
  );

  const handleAddButtonClick = useCallback(() => {
    setSelectedRow(undefined);
    toggleAddEditModal();
  }, [toggleAddEditModal]);

  const handleDeleteModalConfirmClick = useCallback(() => {
    // Close modal
    toggleDeleteModal();

    // Delete document
    deletedDocumentMutateAsync({ id: Number(selectedRow?.id) })
      .then((_) => {
        // Refresh table data
        handleRefreshTable();
        toast.success(ToastMessage.CANCEL_SUCCESS);
      })
      .catch((e) => {
        toast.error(e?.response?.data?.error?.message || e.message);
      });
  }, [deletedDocumentMutateAsync, handleRefreshTable, selectedRow?.id, toggleDeleteModal]);

  const handleAddEditModalConfirmClick = useCallback(
    (values: QdhdsdMasterTaiLieu & { fileTaiLieu?: File }) => {
      // Close modal
      toggleAddEditModal();

      const { id, fileTaiLieu, ...data } = values;
      if (id) {
        // Edit document
        updatedDocumentMutateAsync({
          id: Number(id),
          data: {
            ...data,
            ngayBanHanh: DateUtil.toDateISOString(data.ngayBanHanh),
          },
        })
          .then((_) => {
            // Refresh table data
            handleRefreshTable();
            toast.success(ToastMessage.UPDATE_SUCCESS);
          })
          .catch((e) => {
            toast.error(e?.response?.data?.error?.message || e.message);
          });
      } else {
        // Upload document
        uploadedDocumentMutateAsync({
          data: { file: fileTaiLieu },
        })
          .then(({ filePath }) => {
            // Add document
            createdDocumentMutateAsync({
              data: { ...data, urlTaiLieu: filePath, ngayBanHanh: DateUtil.toDateISOString(data.ngayBanHanh) },
            })
              .then((_) => {
                // Refresh table data
                handleRefreshTable();
                toast.success(ToastMessage.CREATE_SUCCESS);
              })
              .catch((e) => {
                toast.error(e?.response?.data?.error?.message || e.message);
              });
          })
          .catch((e) => {
            toast.error(e?.response?.data?.error?.message || e.message);
          });
      }
    },
    [
      createdDocumentMutateAsync,
      handleRefreshTable,
      toggleAddEditModal,
      updatedDocumentMutateAsync,
      uploadedDocumentMutateAsync,
    ],
  );

  return (
    <ToolkitProvider
      data={data || []}
      keyField={FieldName.ID}
      columns={[
        tableConfig.columns[0],
        {
          dataField: FieldName.TEN_TAI_LIEU,
          text: 'Tên tài liệu',
          sort: true,
          ...generateColumnStyle(),
          formatter: (cell: string, row: QdhdsdMasterTaiLieu) => {
            return (
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewActionClick(row);
                }}>
                {cell}
              </Link>
            );
          },
        },
        ...tableConfig.columns.slice(1),
        {
          dataField: FieldName.ACTION,
          isDummyField: true,
          text: 'Thao tác',
          ...generateColumnStyle(),
          hidden: !permissionAction,
          formatter: (_: any, row: QdhdsdMasterTaiLieu) => {
            return (
              <EditPermissionAction>
                <Link
                  className="px-2"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditActionClick(row);
                  }}>
                  <i className="fa-solid fa-pen-to-square" title="Sửa" />
                </Link>
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
            );
          },
        },
      ]}>
      {(props: any) => (
        <>
          <div className="d-flex justify-content-end mb-4 pb-1">
            <EditPermissionAction>
              <Button color="primary" onClick={handleAddButtonClick}>
                Thêm mới
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
          <ViewDocumentModal document={selectedRow} isOpen={isOpenViewModal} toggle={toggleViewModal} />
          <DeleteDocumentModal
            document={selectedRow}
            isOpen={isOpenDeleteModal}
            toggle={toggleDeleteModal}
            handleConfirmClick={handleDeleteModalConfirmClick}
          />
          <AddEditDocumentModal
            document={selectedRow}
            isOpen={isOpenAddEditModal}
            toggle={toggleAddEditModal}
            handleConfirmClick={handleAddEditModalConfirmClick}
          />
        </>
      )}
    </ToolkitProvider>
  );
}

export default TermsAndConditionsTable;
