import feedReducer, {
    initialState,
    getFeeds,
  } from './feedSlice';
  import type { TOrder } from '@utils-types';
  
  describe('feedSlice reducer', () => {
    it('should return the initial state on first run', () => {
      const nextState = feedReducer(undefined, { type: '' });
      expect(nextState).toEqual(initialState);
    });
  
    describe('getFeeds thunks', () => {
      it('handles getFeeds.pending', () => {
        const action = { type: getFeeds.pending.type };
        const nextState = feedReducer(initialState, action);
        expect(nextState.isLoading).toBe(true);
        expect(nextState.errorMessage).toBeNull();
      });
  
      it('handles getFeeds.rejected', () => {
        const errorMessage = 'Ошибка загрузки фида';
        const action = {
          type: getFeeds.rejected.type,
          error: { message: errorMessage },
        };
        const prevState = { ...initialState, isLoading: true };
        const nextState = feedReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.errorMessage).toBe(errorMessage);
      });
  
      it('handles getFeeds.fulfilled', () => {
        const fakeOrders: TOrder[] = [
          { number: 101, status: 'done' } as TOrder,
          { number: 102, status: 'pending' } as TOrder,
        ];
        const payload = {
          orders: fakeOrders,
          total: 500,
          totalToday: 20,
        };
        const action = {
          type: getFeeds.fulfilled.type,
          payload,
        };
        const prevState = { ...initialState, isLoading: true };
        const nextState = feedReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.orders).toEqual(fakeOrders);
        expect(nextState.total).toBe(500);
        expect(nextState.totalToday).toBe(20);
      });
    });
  });
  