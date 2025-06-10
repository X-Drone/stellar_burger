import orderReducer, {
    initialState,
    getOrderByNumber,
  } from './orderSlice';
  import type { TOrder } from '@utils-types';
  
  describe('orderSlice reducer', () => {
    it('should return the initial state on first run', () => {
      const nextState = orderReducer(undefined, { type: '' });
      expect(nextState).toEqual(initialState);
    });
  
    describe('getOrderByNumber thunks', () => {
      it('handles getOrderByNumber.pending', () => {
        const action = { type: getOrderByNumber.pending.type };
        const nextState = orderReducer(initialState, action);
        expect(nextState.isLoading).toBe(true);
        expect(nextState.errorMessage).toBeNull();
      });
  
      it('handles getOrderByNumber.rejected', () => {
        const errorMessage = 'Заказ не найден';
        const action = {
          type: getOrderByNumber.rejected.type,
          error: { message: errorMessage },
        };
        const prevState = { ...initialState, isLoading: true };
        const nextState = orderReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.errorMessage).toBe(errorMessage);
      });
  
      it('handles getOrderByNumber.fulfilled', () => {
        const fakeOrder: TOrder = {
          number: 42,
          status: 'done',
        } as TOrder;
        const payload = { orders: [fakeOrder] };
        const action = {
          type: getOrderByNumber.fulfilled.type,
          payload,
        };
        const prevState = { ...initialState, isLoading: true, currentOrder: null };
        const nextState = orderReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.currentOrder).toEqual(fakeOrder);
      });
    });
  });
  