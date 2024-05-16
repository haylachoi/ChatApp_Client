import { AuthToken, User, UserInfo } from '@/libs/types';
import { CONNECTION_MAX_ATTEMPT, REST_SEGMENT } from '../libs/constant';
import { httpClient } from '@/libs/httpClient';


export const tokenStatus: {
  isFetching: boolean;
  action?: Promise<boolean> ;
  remainAttempt: number;
} = {
  isFetching: false,
  remainAttempt: CONNECTION_MAX_ATTEMPT,
}

const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthToken> => {
  const url = `${REST_SEGMENT.AUTH}/login`;
  const result = await httpClient.post(url, data);
  return result.data as AuthToken;
};

const register = async (formData: FormData): Promise<string> => {
  const url = `${REST_SEGMENT.AUTH}/register`;

  const result = await httpClient.post(url, formData);
  return result.data;
};

const refreshToken = async (): Promise<AuthToken> => {
  const url = `${REST_SEGMENT.AUTH}/refresh`;
  const result = await httpClient.post(url, getToken());
  return result.data as AuthToken;
};


const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()?.accessToken}`,
  };
};

export const authService = {
  register,
  login,
  refreshToken,
  getAuthHeaders,
};

export const setUserInfo = (user: UserInfo) => {
  const str = JSON.stringify(user);
  const code = btoa(str);
  localStorage.setItem('userInfo', code);
};

export const getUserInfo = () => {
  const code = localStorage.getItem('userInfo');
  if (code == null) {
    return null;
  }
  const str = atob(code);
  return JSON.parse(str) as UserInfo;
};

export const clearUserInfo = () => {
  localStorage.removeItem('useInfo');
};
export const setToken = (token: AuthToken) => {
  const str = JSON.stringify(token);
  const code = btoa(str);

  localStorage.setItem('token', code);
};

export const getAccessToken = () => {
  return getToken()?.accessToken;
};
export const getToken = () => {
  const code = localStorage.getItem('token');
  if (code == null) {
    return null;
  }
  const str = atob(code);
  const token = JSON.parse(str) as AuthToken;
  return token;
};

export const clearToken = () => {
  localStorage.removeItem('token');
};
