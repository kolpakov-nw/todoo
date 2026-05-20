import apiClient from './apiClient';

export interface User {
  id: number;
  email: string;
  age?: number;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData {
  email: string;
  password: string;
  age?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);

  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');

  return response.data;
};

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await apiClient.post('/auth/change-password', data);
};

export const refreshToken = async (refreshTokenValue: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/refresh', {
    refreshToken: refreshTokenValue
  });

  return response.data;
};
