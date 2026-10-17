import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ControllerPermission } from 'main/apis/drc/models';
import { AuthenticationUtil } from 'main/utils';

type AuthState = {
  userId: number;
  username: string | null;
  dsKhoVtPermission: number[] | null;
  dsKhoTpPermission: string[] | null;
  controllerPermissions: ControllerPermission[];
};

// State
const initialState: AuthState = {
  userId: AuthenticationUtil.getUserId() ? Number(AuthenticationUtil.getUserId()) : -1,
  username: null,
  dsKhoVtPermission: null,
  dsKhoTpPermission: null,
  controllerPermissions: [],
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authReset() {
      AuthenticationUtil.clearAuthToken();
      AuthenticationUtil.clearUserId();
      return initialState;
    },
    setAuth(auth: AuthState, action: PayloadAction<AuthState>) {
      AuthenticationUtil.setUserId(action.payload.userId);
      return action.payload;
    },
  },
});

// Action creators
export const { authReset, setAuth } = authSlice.actions;

export default authSlice;
