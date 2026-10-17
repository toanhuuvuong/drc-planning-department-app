import axios from 'axios';
import page from 'main/constants/page';
import { AuthenticationUtil } from 'main/utils';
import { toast } from 'react-toastify';
import Endpoint from './endpoints';

export const drcAxios = axios.create({
  baseURL: Endpoint.DrcApiBaseUrl,
  timeout: 10 * 60 * 1000, // 10 minutes
});

drcAxios.interceptors.request.use(
  (config) => {
    const token = AuthenticationUtil.getAuthToken();
    if (token) {
      // @ts-ignore
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error as Error);
  },
);

drcAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config.url === '/users/login') {
      return Promise.reject(error as Error);
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = page.LOGIN.PATH;
          break;
        case 403:
          window.location.href = page.ACCESS_DENIED.PATH;
          break;
        case 500:
          toast.error('Hệ thống đã có lỗi xảy ra!');
          break;
        default:
          break;
      }
    }

    return Promise.reject(error);
  },
);
