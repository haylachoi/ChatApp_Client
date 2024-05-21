import {
  authService,
  getToken,
  setToken,
  tokenStatus,
} from '@/services/authService';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { BASE_REST_URL, CONNECTION_MAX_ATTEMPT } from './constant';

export const httpClient = axios.create({
  baseURL: BASE_REST_URL,
});

httpClient.interceptors.request.use(
  async (config: any) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${getToken()?.accessToken}`,
    };
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    // lấy request gốc
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status !== 401 || tokenStatus.remainAttempt < 1) {
      return Promise.reject(error);
    }
    // nếu là mã 401 và vẫn còn số lần thử

    const token = getToken();
    // nếu chưa có token thì redirect tới trang login
    if (!token) {
      return Promise.reject(error);
    }

    if (!tokenStatus.isFetching) {
      tokenStatus.isFetching = true;
      tokenStatus.action = TrySetRefreshToken();
      const isSuccess = await tokenStatus.action;
      
      tokenStatus.isFetching = false;
      // nếu thành công
      if (isSuccess) {
        tokenStatus.remainAttempt = CONNECTION_MAX_ATTEMPT;
        return httpClient(originalRequest);
      }
      console.error(
        `Cố gắng lấy thông tin đăng nhập thất bại sau ${CONNECTION_MAX_ATTEMPT} lần thử`,
      );
      return Promise.reject(error);
    } else {
      // đợi refreshing trước đó hoàn thành
      const result = await tokenStatus.action;
      if (result) {
        return httpClient(originalRequest);
      }
      tokenStatus.remainAttempt = CONNECTION_MAX_ATTEMPT;
      return Promise.reject(error);
    }
  },
);

const TrySetRefreshToken = async () => {
  let isSuccess = false;
  // Nếu ko thành công và vẫn còn số lần thử thì thử tiếp
  while (!isSuccess && tokenStatus.remainAttempt > 0) {
    const token = await getRefreshToken();
    if (token) {
      setToken(token);
      return true;
    }
    await delay(1000 * (CONNECTION_MAX_ATTEMPT - tokenStatus.remainAttempt));
    tokenStatus.remainAttempt--;
  }
  return isSuccess;
};

const getRefreshToken = async () => {
  try { 
    const token = await authService.refreshToken();   
    return token;
  } catch (error) {
   
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
