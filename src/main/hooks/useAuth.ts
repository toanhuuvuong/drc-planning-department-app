import { useAuthenticationControllerLogin } from 'main/apis/drc/endpoints/authentication-controller/authentication-controller';
import { Credentials } from 'main/apis/drc/models';
import { useAppDispatch, useAppSelector } from 'main/redux/hooks';
import { authReset, setAuth } from 'main/redux/modules/auth/auth-slice';
import { AuthenticationUtil } from 'main/utils';
import { useState } from 'react';

type Props = {
  onSuccess?: () => void;
  onError?: (errorMessage?: string) => void;
};

const useAuth = (props?: Props) => {
  const [authenticated, setAuthenticated] = useState(!!AuthenticationUtil.getAuthToken());
  const loginMutation = useAuthenticationControllerLogin();
  const authUser = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const login = (credential: Credentials) => {
    loginMutation.mutate(
      { data: credential },
      {
        onSuccess: (data) => {
          if (data.token) {
            AuthenticationUtil.setAuthToken(data.token);
            const dsKhoVtPermission = data.dsKhoVtPermission?.split(',')?.map((maKho) => +maKho) ?? null;
            const dsKhoTpPermission = data.dsKhoTpPermission?.split(',') ?? null;
            dispatch(
              setAuth({
                userId: data.userId,
                username: data.username,
                controllerPermissions: data.controllerPermissions,
                dsKhoVtPermission,
                dsKhoTpPermission,
              }),
            );
            setAuthenticated(true);

            if (props?.onSuccess) {
              props.onSuccess();
            }
          } else if (props?.onError) {
            props.onError('Đăng nhập thất bại: Thông tin đăng nhập chưa hợp lệ.');
          }
        },
        onError: (error) => {
          // @ts-ignore
          const errorMessage = error?.response?.data?.error?.message || error.message;
          if (props?.onError) {
            props.onError(errorMessage);
          }
        },
      },
    );
  };

  const logout = () => {
    dispatch(authReset());
    setAuthenticated(false);
  };

  return {
    login,
    logout,
    authenticated,
    currentUser: {
      username: authUser.username,
      userId: authUser.userId,
      controllerPermissions: authUser.controllerPermissions,
      dsKhoTpPermission: authUser.dsKhoTpPermission,
      dsKhoVtPermission: authUser.dsKhoVtPermission,
    },
  };
};

export default useAuth;
