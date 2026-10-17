import {
  useFUserControllerCount,
  useFUserControllerCreate,
  useFUserControllerDeleteById,
  useFUserControllerFind,
  useFUserControllerUpdateById,
} from 'main/apis/drc/endpoints/fuser-controller/fuser-controller';
import {
  UserPartialExcludingIdUsername,
  UserExcludingId,
  UserExcludingPassword,
  UserFilter1,
} from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import DeleteModal from 'main/components/organisms/modal/delete-modal';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import useDepartmentStoreOptions from 'main/hooks/useDepartmentStoreOptions';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import useTitleStoreOptions from 'main/hooks/useTitleStoreOptions';
import React, { useCallback, useMemo, useState } from 'react';
import BootstrapTable, { TableChangeState, TableChangeType } from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Container } from 'reactstrap';
import tableConfig from './table-config';
import UserModal from './users-management-add-edit';
import UsersManagementFilter, { UsersManagementFilter as FilterType } from './users-management-filter';

const UsersManagementList: React.FC = () => {
  const permissionAction = usePermissionAction();
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserExcludingPassword | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);

  // Filter state
  const [filterValues, setFilterValues] = useState<FilterType>({
    usernameSearch: '',
    titleId: '-1',
  });

  const { departmentStoreOptions: departmentOptions, isSuccess: departmentDataSuccess } =
    useDepartmentStoreOptions(true);
  const { titleStoreOptions: titleOptions, isSuccess: titleDataSuccess } = useTitleStoreOptions(true);

  const searchFilter: UserFilter1 = useMemo(
    () => ({
      fields: {
        id: true,
        username: true,
        departmentId: true,
        titleId: true,
      },
      where: {
        ...(filterValues.titleId && filterValues.titleId !== '-1' ? { titleId: filterValues.titleId } : {}),
        ...(filterValues.usernameSearch?.trim().length
          ? { username: { like: `%${filterValues.usernameSearch}%` } }
          : {}),
      },
      limit: sizePerPage,
      skip: (page - 1) * sizePerPage,
    }),
    [page, sizePerPage, filterValues],
  );

  const {
    data: userData,
    refetch: refetchUser,
    isLoading,
  } = useFUserControllerFind(
    { filter: searchFilter },
    {
      query: {
        enabled: departmentDataSuccess && titleDataSuccess,
        staleTime: 0,
      },
    },
  );
  const { data: countItems, refetch: refetchCount } = useFUserControllerCount({
    where: searchFilter.where,
  });
  const { mutateAsync: deleteUserAsync } = useFUserControllerDeleteById();
  const { mutateAsync: updateUserAsync, isPending: isUpdatePending } = useFUserControllerUpdateById();
  const { mutateAsync: createUserAsync, isPending: isAddPending } = useFUserControllerCreate();

  const toggleDeleteModal = useCallback(() => setOpenDeleteUserModal(!openDeleteUserModal), [openDeleteUserModal]);

  const showDeleteUserModal = useCallback(
    (user: UserExcludingPassword) => {
      setSelectedUser(user);
      toggleDeleteModal();
    },
    [toggleDeleteModal],
  );

  const showEditUserModal = useCallback((user: UserExcludingPassword) => {
    setSelectedUser(user);
    setOpenUserModal(true);
  }, []);

  const showAddUserModal = useCallback(() => {
    setSelectedUser(undefined);
    setOpenUserModal(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedUser?.id) {
      deleteUserAsync({ id: selectedUser.id })
        .then(() => {
          setPage(1);
          refetchUser();
          refetchCount();
          toggleDeleteModal();
          toast.success(
            <div>
              <b>Thành công</b> <br /> Xóa thành công Người dùng: {selectedUser.username}
            </div>,
          );
        })
        .catch((error) => {
          toast.error(
            <div>
              <b>Thất bại</b> <br /> Có lỗi xảy ra khi xóa Người dùng. <br />
              {error?.response?.data?.error?.message || error.message}
            </div>,
          );
        });
    }
  }, [deleteUserAsync, refetchCount, refetchUser, selectedUser?.id, selectedUser?.username, toggleDeleteModal]);

  const handleUpdateUser = useCallback(
    (id: number, updatedUser: UserPartialExcludingIdUsername) => {
      if (id === null || id === undefined || id !== selectedUser?.id) {
        return toast.error('<b>Thất bại</b> <br> Dữ liệu cập nhật Người dùng không hợp lệ');
      }

      updateUserAsync({ id, data: updatedUser })
        .then(() => {
          refetchUser();
          toast.success(
            <div>
              <b>Thành công</b> <br /> Đã cập nhật thông tin Người dùng: {selectedUser.username}
            </div>,
          );
          if (updatedUser.password) {
            toast.success('Mật khẩu đã được tạo mới thành công.');
          }
          setOpenUserModal(false);
        })
        .catch(() => {
          toast.error(
            <div>
              <b>Thất bại </b> <br /> Đã có lỗi xảy ra, cập nhật thông tin Người dùng thất bại.
            </div>,
          );
        });
    },
    [refetchUser, selectedUser, updateUserAsync],
  );

  const handleAddNewUser = useCallback(
    (newUser: UserExcludingId) => {
      createUserAsync({ data: newUser })
        .then(() => {
          toast.success(
            <div>
              <b>Thành công</b> <br />
              Tạo mới Người dùng thành công.
            </div>,
          );
          refetchUser();
          refetchCount();
          setOpenUserModal(false);
        })
        .catch((error) => {
          toast.error(
            <div>
              <b>Thất bại</b> <br />
              {error?.response?.data?.error?.message || error.message}
            </div>,
          );
        });
    },
    [createUserAsync, refetchCount, refetchUser, setOpenUserModal],
  );

  const handleFilterChange = useCallback(
    (newFilter: FilterType) => {
      setFilterValues(newFilter);
      setPage(1);
      refetchUser();
      refetchCount();
    },
    [refetchUser, refetchCount],
  );

  const handleResetFilter = useCallback(() => {
    setFilterValues({
      usernameSearch: '',
      titleId: '-1',
    });
    setPage(1);
    refetchUser();
    refetchCount();
  }, [refetchUser, refetchCount]);

  const handleTableChange = useCallback((type: TableChangeType, newState: TableChangeState<UserExcludingPassword>) => {
    setPage(newState.page);
    setSizePerPage(newState.sizePerPage);
  }, []);

  return (
    <>
      <BasicTemplate
        pageCategory={Page.USER_MANAGEMENT.CATEGORY}
        pageTitle={Page.USER_MANAGEMENT.TITLE}
        pageName={Page.USER_MANAGEMENT.NAME}>
        <Container className="mt--6" fluid>
          <Card>
            <CardBody className="mt-2">
              <UsersManagementFilter
                initialFilter={filterValues}
                onFilterChange={handleFilterChange}
                onResetFilter={handleResetFilter}
                titleOptions={titleOptions}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <ToolkitProvider
                keyField="id"
                data={userData ?? []}
                columns={tableConfig.columns(
                  departmentOptions,
                  titleOptions,
                  showEditUserModal,
                  showDeleteUserModal,
                  permissionAction,
                )}
                search>
                {(props: any) => (
                  <>
                    <div className="d-flex justify-content-end mb-4 pb-1">
                      <EditPermissionAction>
                        <Button color="primary" onClick={showAddUserModal}>
                          Thêm mới
                        </Button>
                      </EditPermissionAction>
                    </div>
                    <div className="table-responsive">
                      <BootstrapTable
                        {...props.baseProps}
                        bootstrap4={true}
                        pagination={tableConfig.pagination(page, sizePerPage, countItems?.count ?? 0)}
                        remote
                        onTableChange={handleTableChange}
                        bordered={false}
                        noDataIndication={() => (
                          <div className="text-center">
                            {isLoading ? <BasicSpinner /> : 'Không có kết quả nào được tìm thấy'}
                          </div>
                        )}
                      />
                    </div>
                  </>
                )}
              </ToolkitProvider>
              {selectedUser && (
                <DeleteModal
                  messageItem={`Người dùng: ${selectedUser.username}`}
                  modal={openDeleteUserModal}
                  toggle={toggleDeleteModal}
                  handleDelete={handleDelete}
                />
              )}
            </CardBody>
          </Card>
        </Container>
      </BasicTemplate>
      <UserModal
        isOpen={openUserModal}
        toggle={() => setOpenUserModal(!openUserModal)}
        handleAdd={handleAddNewUser}
        handleEdit={handleUpdateUser}
        departmentOptions={departmentOptions.map((option) =>
          option.id === '-1' ? { ...option, text: 'Không lựa chọn' } : option,
        )}
        titleOptions={titleOptions.map((option) =>
          option.id === '-1' ? { ...option, text: 'Không lựa chọn' } : option,
        )}
        selectedUser={selectedUser}
        isAddPending={isAddPending}
        isUpdatePending={isUpdatePending}
      />
    </>
  );
};

export default UsersManagementList;
