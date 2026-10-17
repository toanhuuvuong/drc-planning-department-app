import { ControllerPermission } from 'main/apis/drc/models';
import Role from 'main/constants/enums/role';
import { menuPermissions } from 'main/constants/menu-permission';
import { useLocation } from 'react-router-dom';
import { useAuth } from './index';

export type PermissionActions = {
  view: boolean;
  edit: boolean;
};

export function usePermissionAction(): boolean {
  const { currentUser } = useAuth();
  const location = useLocation();
  return getPermissionsByPath(location.pathname, currentUser.controllerPermissions).edit;
}

export function getPermissionsByPath(path: string, controllerPermissions: ControllerPermission[]): PermissionActions {
  const menuPermission = menuPermissions.find((menu) => path.startsWith(menu.path));
  if (!menuPermission) {
    // Not show menu UI if this menu permission has not configured yet
    return { view: false, edit: false };
  }

  // Mapping with the role permission of the user returned from the BE server
  const controllerPermission = controllerPermissions?.find(
    (permission) => permission.controller === menuPermission.controller,
  );
  return {
    view: controllerPermission?.permission === Role.VIEW || controllerPermission?.permission === Role.EDIT,
    edit: controllerPermission?.permission === Role.EDIT,
  };
}
