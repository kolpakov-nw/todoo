import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  changePassword as changePasswordApi,
  getMe,
  login,
  refreshToken as refreshTokenApi,
  register,
  type LoginData,
  type RegisterData,
  type User
} from '../api/auth';
import type { RootState } from './store';
import { tokenStorage } from '../save/tokenStorage';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string } } };

    return apiError.response?.data?.message || 'Ошибка сервера';
  }

  return 'Ошибка сервера';
};

const initialState: AuthState = {
  user: null,
  token: tokenStorage.getAccessToken(),
  refreshToken: tokenStorage.getRefreshToken(),
  status: 'idle',
  error: null
};

export const registerUser = createAsyncThunk<
  User | null,
  RegisterData,
  { rejectValue: string }
>('auth/registerUser', async (data, { rejectWithValue }) => {
  try {
    const response = await register(data);
    tokenStorage.saveTokens(response.accessToken, response.refreshToken);

    return null;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk<
  User | null,
  LoginData,
  { rejectValue: string }
>('auth/loginUser', async (data, { rejectWithValue }) => {
  try {
    const response = await login(data);
    tokenStorage.saveTokens(response.accessToken, response.refreshToken);

    return null;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    return await getMe();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const changePassword = createAsyncThunk<
  void,
  ChangePasswordPayload,
  { rejectValue: string }
>('auth/changePassword', async (data, { rejectWithValue }) => {
  try {
    await changePasswordApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const refreshAccessToken = createAsyncThunk<
  string,
  void,
  { rejectValue: string; state: RootState }
>('auth/refreshAccessToken', async (_, { getState, rejectWithValue }) => {
  try {
    const currentRefreshToken =
      getState().auth.refreshToken || tokenStorage.getRefreshToken();

    if (!currentRefreshToken) {
      return rejectWithValue('Нужно войти в систему');
    }

    const response = await refreshTokenApi(currentRefreshToken);
    tokenStorage.saveTokens(response.accessToken, response.refreshToken);

    return response.accessToken;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;
      tokenStorage.clearTokens();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
        state.token = tokenStorage.getAccessToken();
        state.refreshToken = tokenStorage.getRefreshToken();
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
        state.token = tokenStorage.getAccessToken();
        state.refreshToken = tokenStorage.getRefreshToken();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Ошибка входа';
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Не удалось загрузить профиль';
      })
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Не удалось сменить пароль';
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.refreshToken = tokenStorage.getRefreshToken();
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload || 'Сессия закончилась';
        tokenStorage.clearTokens();
      });
  }
});

export const { logoutUser } = authSlice.actions;

export const selectAuthUser = (state: RootState): User | null => state.auth.user;
export const selectAuthToken = (state: RootState): string | null => state.auth.token;
export const selectAuthStatus = (state: RootState): AuthState['status'] => state.auth.status;
export const selectAuthError = (state: RootState): string | null => state.auth.error;

export default authSlice.reducer;
