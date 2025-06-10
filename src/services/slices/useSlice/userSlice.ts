import {
  TRegisterData,
  loginUserApi,
  TLoginData,
  getUserApi,
  getOrdersApi,
  logoutApi,
  updateUserApi,
  registerUserApi
} from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../../../utils/cookie';
import { TOrder, TUser } from '@utils-types';

type TUserState = {
  isLoading: boolean;
  errorMessage: string | null;
  apiResponse: TUser | null;
  registrationData: TRegisterData | null;
  currentUser: TUser | null;
  isAuthenticationChecked: boolean;
  isUserAuthenticated: boolean;
  isLoginInProgress: boolean;
  userOrderHistory: TOrder[];
};

export const initialState: TUserState = {
  isLoading: false,
  errorMessage: null,
  apiResponse: null,
  registrationData: null,
  currentUser: null,
  isAuthenticationChecked: false,
  isUserAuthenticated: false,
  isLoginInProgress: false,
  userOrderHistory: []
};

export const registerUser = createAsyncThunk(
  'user/regUser',
  async (payload: TRegisterData) => await registerUserApi(payload)
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData) => {
    const result = await loginUserApi({ email, password });
    if (!result.success) {
      return result;
    }
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result;
  }
);

export const getUser = createAsyncThunk('user/getUser', getUserApi);

export const getOrdersAll = createAsyncThunk('user/ordersUser', getOrdersApi);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (update: Partial<TRegisterData>) => updateUserApi(update)
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.currentUser = null;
    },
    clearError: (state) => {
      state.errorMessage = null;
    }
  },
  selectors: {
    getUserState: (state) => state,
    getError: (state) => state.errorMessage
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.isAuthenticationChecked = true;
        state.isUserAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message ?? null;
        state.isAuthenticationChecked = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.apiResponse = action.payload.user;
        state.currentUser = action.payload.user;
        state.isAuthenticationChecked = false;
        state.isUserAuthenticated = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoginInProgress = true;
        state.errorMessage = null;
        state.isAuthenticationChecked = true;
        state.isUserAuthenticated = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoginInProgress = false;
        state.isAuthenticationChecked = false;
        state.errorMessage = action.error.message ?? null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.errorMessage = null;
        state.isLoginInProgress = false;
        state.isAuthenticationChecked = false;
        state.isUserAuthenticated = true;
        state.currentUser = action.payload.user;
      })

      .addCase(getUser.pending, (state) => {
        state.isUserAuthenticated = true;
        state.isAuthenticationChecked = true;
        state.isLoginInProgress = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isUserAuthenticated = false;
        state.isAuthenticationChecked = false;
        state.isLoginInProgress = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isUserAuthenticated = true;
        state.isLoginInProgress = false;
        state.currentUser = action.payload.user;
        state.isAuthenticationChecked = false;
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message ?? null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.apiResponse = action.payload.user;
      })

      // Выход
      .addCase(logoutUser.pending, (state) => {
        state.isUserAuthenticated = true;
        state.isAuthenticationChecked = true;
        state.errorMessage = null;
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isUserAuthenticated = true;
        state.isAuthenticationChecked = false;
        state.errorMessage = action.error.message ?? null;
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isUserAuthenticated = false;
        state.isAuthenticationChecked = false;
        state.errorMessage = null;
        state.isLoading = false;
        state.currentUser = null;
      })

      // Получение заказов пользователя
      .addCase(getOrdersAll.pending, (state) => {
        state.errorMessage = null;
        state.isLoading = true;
      })
      .addCase(getOrdersAll.rejected, (state, action) => {
        state.errorMessage = action.error.message ?? null;
        state.isLoading = false;
      })
      .addCase(getOrdersAll.fulfilled, (state, action) => {
        state.errorMessage = null;
        state.isLoading = false;
        state.userOrderHistory = action.payload;
      });
  }
});

// Export actions and selectors
export const { clearUserData, clearError } = userSlice.actions;
export const { getUserState, getError } = userSlice.selectors;

// Экспорт редьюсера
export default userSlice.reducer;
