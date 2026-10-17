import { useFPermissionControllerUpdateAll } from 'main/apis/drc/endpoints/fpermission-controller/fpermission-controller';
import {
  useFTitleControllerCreate,
  useFTitleControllerFindWithPermissionsById,
  useFTitleControllerUpdateById,
} from 'main/apis/drc/endpoints/ftitle-controller/ftitle-controller';
import {
  FPermission,
  FPermissionWithControllerSchema,
  FTitlePartial,
  FTitleWithPermissionWithControllerNameSchema,
  NewFTitle,
} from 'main/apis/drc/models';
import { BasicSpinner } from 'main/components/atoms/spiner';
import EditPermissionAction from 'main/components/molecules/permission-action/EditPermissionAction';
import { Select2Box } from 'main/components/molecules/selectbox';
import BasicTemplate from 'main/components/templates/basic-template';
import { Page } from 'main/constants';
import { ALL_KHO_PERMISSION_VALUE } from 'main/constants/common-constants';
import { FieldName } from 'main/constants/enums';
import Role from 'main/constants/enums/role';
import { usePermissionAction } from 'main/hooks/usePermissionAction';
import useTitleStoreOptions from 'main/hooks/useTitleStoreOptions';
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Col, Container, Label, Row } from 'reactstrap';
import tableConfig from './table-config';
import TitleModal from './tittle-add-edit-modal';

const getKhoPermissionMessage = (
  titlePermissionData: FTitleWithPermissionWithControllerNameSchema | undefined,
): React.JSX.Element => {
  if (!titlePermissionData) {
    return <></>;
  }

  const getKhoPermissionMessage = (permission: string | null, loaiKho: 'kho Vật tư' | 'kho Sản phẩm') => {
    if (permission && permission.length > 0) {
      if (permission.split(',')[0] === ALL_KHO_PERMISSION_VALUE) {
        return fullKhoPermissionMessage(loaiKho);
      }
      return (
        <>
          Số lượng {loaiKho} được phép thao tác:{' '}
          <span className="text-red font-weight-bold">{permission.split(',').filter(Boolean).length}</span>
        </>
      );
    }
    return noKhoPermissionMessage(loaiKho);
  };

  return (
    <>
      <small className="font-italic">
        {getKhoPermissionMessage(titlePermissionData.dsKhoVtPermission, 'kho Vật tư')}
      </small>
      <br />
      <small className="font-italic">
        {getKhoPermissionMessage(titlePermissionData.dsKhoTpPermission, 'kho Sản phẩm')}
      </small>
    </>
  );
};

const fullKhoPermissionMessage = (loaiKho: 'kho Vật tư' | 'kho Sản phẩm') => (
  <>
    Được quyền thao tác trên <span className="text-red">tất cả</span> {loaiKho}
  </>
);

const noKhoPermissionMessage = (loaiKho: 'kho Vật tư' | 'kho Sản phẩm') => (
  <>
    <span className="text-red">Không có quyền </span>thao tác trên bất kỳ {loaiKho} nào
  </>
);

export default function TitlePermissionManagement() {
  const [selectedTitleId, setSelectedTitleId] = useState<string | undefined>(undefined);
  const [openTitleModal, setOpenTitleModal] = useState<boolean>(false);
  const [isTitleModalCreatedMode, setIsTitleModalCreatedMode] = useState<boolean>(true);
  const [permissionSettingData, setPermissionSettingData] = useState<FPermissionWithControllerSchema[]>([]);

  const {
    data: titleWithPermissionData,
    refetch: refetchPermission,
    isLoading,
  } = useFTitleControllerFindWithPermissionsById(Number(selectedTitleId));
  const { mutateAsync: updateControllerPermissionAsync, isPending: isUpdating } = useFPermissionControllerUpdateAll();
  const { mutateAsync: updateTitleAsync, isPending: isUpdatePending } = useFTitleControllerUpdateById();
  const { mutateAsync: createTitleAsync, isPending: isAddPending } = useFTitleControllerCreate();

  const { titleStoreOptions: titleOptions, refetch: refetchListTitle } = useTitleStoreOptions();

  const isEditPermission = usePermissionAction();

  useEffect(() => {
    if (titleWithPermissionData?.controllerPermissions) {
      setPermissionSettingData(titleWithPermissionData.controllerPermissions);
    }
  }, [titleWithPermissionData]);

  const handleCheckboxChange = useCallback((id: number, clickType: 'view' | 'edit', checked: boolean) => {
    setPermissionSettingData((prevData) =>
      prevData.map((item) => {
        if (item.controllerId !== id) {
          return item;
        }

        let newRole: Role | null = null;

        if (clickType === 'view') {
          if (checked) {
            newRole = Role.VIEW;
            /* If View checkbox is being unchecked, Edit checkbox will be unchecked also.
             ==> No set new role for case: uncheck View checkbox (Use newRole as null) */
          }
        } else if (checked) {
          newRole = Role.EDIT;
        } else {
          /* Role.EDIT requires Role.VIEW enabled.
          So, uncheck Edit checkbox -> uncheck View checkbox also*/
          newRole = item.role === Role.VIEW ? Role.VIEW : null;
        }

        return {
          ...item,
          role: newRole,
        };
      }),
    );
  }, []);

  const handleSelectAll = useCallback((permissionType: 'view' | 'edit', selectAll: boolean) => {
    setPermissionSettingData((prevData) =>
      prevData.map((item) => {
        let newRole: Role | null = null;

        if (permissionType === 'view') {
          newRole = selectAll ? Role.VIEW : null;
        } else if (permissionType === 'edit') {
          const roleViewOrNull = item.role === Role.VIEW ? Role.VIEW : null;
          newRole = selectAll ? Role.EDIT : roleViewOrNull;
        }

        return {
          ...item,
          role: newRole,
        };
      }),
    );
  }, []);

  const isSelectAllViewChecked = useMemo(() => {
    return permissionSettingData.every((item) => item.role === Role.VIEW || item.role === Role.EDIT);
  }, [permissionSettingData]);

  const isSelectAllEditChecked = useMemo(() => {
    return permissionSettingData.every((item) => item.role === Role.EDIT);
  }, [permissionSettingData]);

  const columns = useMemo(
    () =>
      tableConfig.columns(
        handleCheckboxChange,
        handleSelectAll,
        isSelectAllViewChecked,
        isSelectAllEditChecked,
        isEditPermission,
      ),
    [handleCheckboxChange, handleSelectAll, isSelectAllViewChecked, isSelectAllEditChecked, isEditPermission],
  );

  const handleUpdatePermissions = useCallback(() => {
    const permissionEntities: FPermission[] = permissionSettingData.map((permission) => {
      return {
        id: permission.id,
        titleId: permission.titleId,
        controllerId: permission.controllerId,
        role: permission.role,
      };
    });
    updateControllerPermissionAsync({ data: permissionEntities })
      .then(() => {
        toast.success(
          <div>
            <b>Thành công</b> <br />
            Đã cập nhật phân quyền chức năng cho Chức danh.
          </div>,
        );
        refetchPermission();
      })
      .catch((error) => {
        toast.error(
          <div>
            <b>Thất bại</b> <br />
            {error?.response?.data?.error?.message || error.message}
          </div>,
        );
        refetchPermission();
      });
  }, [permissionSettingData, refetchPermission, updateControllerPermissionAsync]);

  const handleUpdateTitle = useCallback(
    (id: number, toBeUpdatedTitle: FTitlePartial) => {
      if (id === null || id === undefined || id !== Number(selectedTitleId) || toBeUpdatedTitle.name?.trim() === '') {
        return toast.error(
          <div>
            <b>Thất bại</b> <br /> Dữ liệu cập nhật Chức danh không hợp lệ
          </div>,
        );
      }
      if (toBeUpdatedTitle && toBeUpdatedTitle.name === titleWithPermissionData?.name) {
        toBeUpdatedTitle.name = undefined; // Not update title name
      }
      updateTitleAsync({ id, data: toBeUpdatedTitle })
        .then(() => {
          toast.success(
            <div>
              <b>Thành công</b> <br /> Đã cập nhật thông tin Chức danh: {toBeUpdatedTitle.name}
            </div>,
          );
          refetchListTitle();
          refetchPermission();
          setOpenTitleModal(false);
        })
        .catch((error) => {
          toast.error(
            <div>
              <b>Thất bại </b>
              <br /> {error?.response?.data?.error?.message || error.message}
            </div>,
          );
        });
    },
    [refetchListTitle, refetchPermission, selectedTitleId, titleWithPermissionData?.name, updateTitleAsync],
  );

  const handleAddNewTitle = useCallback(
    (newTitle: NewFTitle) => {
      createTitleAsync({ data: newTitle })
        .then(() => {
          toast.success(
            <div>
              <b>Thành công</b> <br />
              Tạo mới thành công Chức danh <b>{newTitle.name}</b>.
            </div>,
          );
          refetchListTitle();
          refetchPermission();
          setOpenTitleModal(false);
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
    [createTitleAsync, refetchPermission, refetchListTitle],
  );

  return (
    <>
      <BasicTemplate
        pageCategory={Page.TITLE_MANAGEMENT.CATEGORY}
        pageTitle={Page.TITLE_MANAGEMENT.TITLE}
        pageName={Page.TITLE_MANAGEMENT.NAME}>
        <Container className="mt--6" fluid>
          <Card>
            <CardBody>
              <Row>
                <Col>
                  <Label for="itemSelect">Chức danh</Label>
                  <Select2Box
                    className="form-control"
                    options={{ placeholder: 'Chọn Chức danh để hiển thị' }}
                    value={selectedTitleId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedTitleId(e.target.value)}
                    data={titleOptions}
                  />
                </Col>
              </Row>
              <Row className="justify-content-end mt-5">
                <Col className="d-flex justify-content-end">
                  <EditPermissionAction>
                    <Button
                      color="primary"
                      onClick={() => {
                        setIsTitleModalCreatedMode(false);
                        setOpenTitleModal(true);
                      }}
                      disabled={!selectedTitleId}>
                      Cập nhật
                    </Button>
                  </EditPermissionAction>
                </Col>
                <Col md={2} className="d-flex justify-content-end">
                  <EditPermissionAction>
                    <Button
                      color="primary"
                      onClick={() => {
                        setIsTitleModalCreatedMode(true);
                        setOpenTitleModal(true);
                      }}>
                      Thêm mới
                    </Button>
                  </EditPermissionAction>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Row className="mx-2 mt-5">
                <Col>
                  <h4 className=""> Phân quyền theo Kho</h4>
                  {getKhoPermissionMessage(titleWithPermissionData)}
                </Col>
                <Col md={3} className="align-content-center">
                  <Button
                    color="primary"
                    onClick={() => {
                      setIsTitleModalCreatedMode(false);
                      setOpenTitleModal(true);
                    }}
                    disabled={!selectedTitleId}>
                    Chi tiết phân quyền kho
                  </Button>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <Card>
                    <Row className="mx-2 mt-4">
                      <Col>
                        <h4 className=""> Phân quyền theo Chức năng</h4>
                        <small className="font-italic">Thay đổi quyền hạn theo chức năng ở bảng bên dưới</small>
                      </Col>
                      <EditPermissionAction>
                        <Col md={3} className="align-content-center">
                          <Button
                            color="primary"
                            onClick={handleUpdatePermissions}
                            disabled={isUpdating || !selectedTitleId}>
                            {!isUpdating ? 'Lưu bảng phân quyền' : 'Đang lưu'}
                          </Button>
                        </Col>
                      </EditPermissionAction>
                    </Row>
                    <ToolkitProvider disabled data={permissionSettingData} keyField="controllerName" columns={columns}>
                      {(props: any) => (
                        <>
                          <div className="d-flex justify-content-end mb-4 pb-1"></div>
                          <div className="table-responsive">
                            <BootstrapTable
                              {...props.baseProps}
                              bootstrap4={true}
                              keyField={FieldName.CONTROLLER_NAME}
                              remote
                              hover
                              disabled
                              bordered={false}
                              noDataIndication={() => (
                                <div className="text-center">
                                  {isLoading ? (
                                    <BasicSpinner />
                                  ) : (
                                    'Chưa chọn chức danh hoặc không có dữ liệu chức năng cho chức danh đã chọn'
                                  )}
                                </div>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </ToolkitProvider>
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </BasicTemplate>
      {openTitleModal && (
        <TitleModal
          isOpen={openTitleModal}
          selectedTitle={isTitleModalCreatedMode ? undefined : titleWithPermissionData}
          handleEdit={handleUpdateTitle}
          handleAdd={handleAddNewTitle}
          isUpdatePending={isUpdatePending}
          isAddPending={isAddPending}
          toggle={() => setOpenTitleModal(!openTitleModal)}
          isEditPermission={isEditPermission}
        />
      )}
    </>
  );
}
