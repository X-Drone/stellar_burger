import userReducer, {
    initialState,
    registerUser,
    loginUser,
    getUser,
    updateUser,
    logoutUser,
    getOrdersAll,
    clearUserData,
    clearError,
  } from './userSlice';
  import type { TUser, TOrder } from '@utils-types';
  
  describe('userSlice reducer', () => {
    it('should return the initial state on first run', () => {
      const nextState = userReducer(undefined, { type: '' });
      expect(nextState).toEqual(initialState);
    });

    describe('registerUser thunks', () => {
      it('handles registerUser.pending', () => {
        const action = { type: registerUser.pending.type };
        const nextState = userReducer(initialState, action);
        expect(nextState.isLoading).toBe(true);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.isAuthenticationChecked).toBe(true);
        expect(nextState.isUserAuthenticated).toBe(false);
      });
  
      it('handles registerUser.rejected', () => {
        const errorMessage = 'Регистрация не прошла';
        const action = {
          type: registerUser.rejected.type,
          error: { message: errorMessage },
        };
        const prevState = {
          ...initialState,
          isLoading: true,
          isAuthenticationChecked: true,
        };
        const nextState = userReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.errorMessage).toBe(errorMessage);
        expect(nextState.isAuthenticationChecked).toBe(false);
      });
  
      it('handles registerUser.fulfilled', () => {
        const fakeUser: TUser = {
          name: 'John Doe',
          email: 'john@example.com',
          // остальные поля по типу TUser
        } as TUser;
        const action = {
          type: registerUser.fulfilled.type,
          payload: { user: fakeUser },
        };
        const prevState = {
          ...initialState,
          isLoading: true,
        };
        const nextState = userReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.apiResponse).toEqual(fakeUser);
        expect(nextState.currentUser).toEqual(fakeUser);
        expect(nextState.isAuthenticationChecked).toBe(false);
        expect(nextState.isUserAuthenticated).toBe(true);
      });
    });

    describe('loginUser thunks', () => {
      it('handles loginUser.pending', () => {
        const action = { type: loginUser.pending.type };
        const nextState = userReducer(initialState, action);
        expect(nextState.isLoginInProgress).toBe(true);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.isAuthenticationChecked).toBe(true);
        expect(nextState.isUserAuthenticated).toBe(false);
      });
  
      it('handles loginUser.rejected', () => {
        const errorMessage = 'Неверные данные';
        const action = {
          type: loginUser.rejected.type,
          error: { message: errorMessage },
        };
        const prevState = {
          ...initialState,
          isLoginInProgress: true,
          isAuthenticationChecked: true,
        };
        const nextState = userReducer(prevState, action);
        expect(nextState.isLoginInProgress).toBe(false);
        expect(nextState.isAuthenticationChecked).toBe(false);
        expect(nextState.errorMessage).toBe(errorMessage);
      });
  
      it('handles loginUser.fulfilled', () => {
        const fakeUser: TUser = {
          name: 'Alice',
          email: 'alice@example.com',
        } as TUser;
        const action = {
          type: loginUser.fulfilled.type,
          payload: { user: fakeUser },
        };
        const prevState = {
          ...initialState,
          isLoginInProgress: true,
          isAuthenticationChecked: true,
        };
        const nextState = userReducer(prevState, action);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.isLoginInProgress).toBe(false);
        expect(nextState.isAuthenticationChecked).toBe(false);
        expect(nextState.isUserAuthenticated).toBe(true);
        expect(nextState.currentUser).toEqual(fakeUser);
      });
    });

    describe('getUser thunks', () => {
      it('handles getUser.pending', () => {
        const action = { type: getUser.pending.type };
        const nextState = userReducer(initialState, action);
        expect(nextState.isUserAuthenticated).toBe(true);
        expect(nextState.isAuthenticationChecked).toBe(true);
        expect(nextState.isLoginInProgress).toBe(true);
      });
  
      it('handles getUser.rejected', () => {
        const action = { type: getUser.rejected.type };
        const prevState = {
          ...initialState,
          isUserAuthenticated: true,
          isAuthenticationChecked: true,
          isLoginInProgress: true,
        };
        const nextState = userReducer(prevState, action);
        expect(nextState.isUserAuthenticated).toBe(false);
        expect(nextState.isAuthenticationChecked).toBe(false);
        expect(nextState.isLoginInProgress).toBe(false);
      });
  
      it('handles getUser.fulfilled', () => {
        const fakeUser: TUser = {
          name: 'Bob',
          email: 'bob@example.com',
        } as TUser;
        const action = {
          type: getUser.fulfilled.type,
          payload: { user: fakeUser },
        };
        const prevState = {
          ...initialState,
          isUserAuthenticated: true,
          isLoginInProgress: true,
          isAuthenticationChecked: true,
        };
        const nextState = userReducer(prevState, action);
        expect(nextState.isUserAuthenticated).toBe(true);
        expect(nextState.isLoginInProgress).toBe(false);
        expect(nextState.currentUser).toEqual(fakeUser);
        expect(nextState.isAuthenticationChecked).toBe(false);
      });
    });

    describe('updateUser thunks', () => {
      it('handles updateUser.pending', () => {
        const action = { type: updateUser.pending.type };
        const nextState = userReducer(initialState, action);
        expect(nextState.isLoading).toBe(true);
        expect(nextState.errorMessage).toBeNull();
      });
  
      it('handles updateUser.rejected', () => {
        const errorMessage = 'Ошибка обновления';
        const action = {
          type: updateUser.rejected.type,
          error: { message: errorMessage },
        };
        const prevState = { ...initialState, isLoading: true };
        const nextState = userReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.errorMessage).toBe(errorMessage);
      });
  
      it('handles updateUser.fulfilled', () => {
        const fakeUser: TUser = {
          name: 'Charlie',
          email: 'charlie@example.com',
        } as TUser;
        const action = {
          type: updateUser.fulfilled.type,
          payload: { user: fakeUser },
        };
        const prevState = { ...initialState, isLoading: true };
        const nextState = userReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.apiResponse).toEqual(fakeUser);
      });
    });

    describe('logoutUser thunks', () => {
      it('handles logoutUser.pending', () => {
        const action = { type: logoutUser.pending.type };
        const nextState = userReducer(initialState, action);
        expect(nextState.isUserAuthenticated).toBe(true);
        expect(nextState.isAuthenticationChecked).toBe(true);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.isLoading).toBe(true);
      });
  
      it('handles logoutUser.rejected', () => {
        const errorMessage = 'Сервер недоступен';
        const action = {
          type: logoutUser.rejected.type,
          error: { message: errorMessage },
        };
        const prevState = {
          ...initialState,
          isUserAuthenticated: true,
          isAuthenticationChecked: true,
          isLoading: true,
        };
        const nextState = userReducer(prevState, action);
        expect(nextState.isUserAuthenticated).toBe(true);
        expect(nextState.isAuthenticationChecked).toBe(false);
        expect(nextState.errorMessage).toBe(errorMessage);
        expect(nextState.isLoading).toBe(false);
      });
  
      it('handles logoutUser.fulfilled', () => {
        const action = { type: logoutUser.fulfilled.type };
        const prevState = {
          ...initialState,
          isUserAuthenticated: true,
          isAuthenticationChecked: true,
          isLoading: true,
          currentUser: { name: 'Temp', email: 'temp@example.com' } as TUser,
        };
        const nextState = userReducer(prevState, action);
        expect(nextState.isUserAuthenticated).toBe(false);
        expect(nextState.isAuthenticationChecked).toBe(false);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.isLoading).toBe(false);
        expect(nextState.currentUser).toBeNull();
      });
    });

    describe('getOrdersAll thunks', () => {
      it('handles getOrdersAll.pending', () => {
        const action = { type: getOrdersAll.pending.type };
        const nextState = userReducer(initialState, action);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.isLoading).toBe(true);
      });
  
      it('handles getOrdersAll.rejected', () => {
        const errorMessage = 'Не удалось загрузить заказы';
        const action = {
          type: getOrdersAll.rejected.type,
          error: { message: errorMessage },
        };
        const prevState = { ...initialState, isLoading: true };
        const nextState = userReducer(prevState, action);
        expect(nextState.errorMessage).toBe(errorMessage);
        expect(nextState.isLoading).toBe(false);
      });
  
      it('handles getOrdersAll.fulfilled', () => {
        const fakeOrders: TOrder[] = [
          { number: 1, status: 'done' } as TOrder,
          { number: 2, status: 'pending' } as TOrder,
        ];
        const action = {
          type: getOrdersAll.fulfilled.type,
          payload: fakeOrders,
        };
        const prevState = { ...initialState, isLoading: true };
        const nextState = userReducer(prevState, action);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.isLoading).toBe(false);
        expect(nextState.userOrderHistory).toEqual(fakeOrders);
      });
    });

    describe('regular reducers', () => {
      it('handles clearUserData', () => {
        const prevState = {
          ...initialState,
          currentUser: { name: 'Some', email: 'some@example.com' } as TUser,
        };
        const nextState = userReducer(prevState, clearUserData());
        expect(nextState.currentUser).toBeNull();
      });
  
      it('handles clearError', () => {
        const prevState = {
          ...initialState,
          errorMessage: 'Какая-то ошибка',
        };
        const nextState = userReducer(prevState, clearError());
        expect(nextState.errorMessage).toBeNull();
      });
    });
  });
  