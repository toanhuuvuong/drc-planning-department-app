import { FieldName } from 'main/constants/enums';

export const AuthenticationUtil = {
  getAuthToken() {
    return localStorage.getItem(FieldName.AUTH_TOKEN_KEY);
  },

  setAuthToken(token: string) {
    return localStorage.setItem(FieldName.AUTH_TOKEN_KEY, token);
  },

  clearAuthToken() {
    return localStorage.removeItem(FieldName.AUTH_TOKEN_KEY);
  },

  getUserId() {
    return localStorage.getItem(FieldName.USER_ID);
  },

  setUserId(userId: number) {
    return localStorage.setItem(FieldName.USER_ID, userId.toString());
  },

  clearUserId() {
    return localStorage.removeItem(FieldName.USER_ID);
  },
};
