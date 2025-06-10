import ingredientReducer, {
    initialState,
    getIngredients,
  } from './ingredientSlice';
  import type { TIngredient } from '@utils-types';
  
  describe('ingredientSlice reducer', () => {
    it('should return the initial state on first run', () => {
      const nextState = ingredientReducer(undefined, { type: '' });
      expect(nextState).toEqual(initialState);
    });
  
    describe('getIngredients thunks', () => {
      it('handles getIngredients.pending', () => {
        const action = { type: getIngredients.pending.type };
        const nextState = ingredientReducer(initialState, action);
        expect(nextState.isLoading).toBe(true);
        expect(nextState.errorMessage).toBeNull();
      });
  
      it('handles getIngredients.rejected', () => {
        const errorMessage = 'Не удалось загрузить ингредиенты';
        const action = {
          type: getIngredients.rejected.type,
          error: { message: errorMessage },
        };
        const prevState = { ...initialState, isLoading: true };
        const nextState = ingredientReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.errorMessage).toBe(errorMessage);
      });
  
      it('handles getIngredients.fulfilled', () => {
        const fakeIngredients: TIngredient[] = [
            {
                _id: '1',
                name: 'Булочка',
                type: 'bun',
                proteins: 10,
                fat: 5,
                carbohydrates: 20,
                calories: 200,
                price: 30,
                image: 'https://example.com/bun.png',
                image_mobile: 'https://example.com/bun-mobile.png',
                image_large: 'https://example.com/bun-large.png',
                __v: 0,
            },
            {
                _id: '2',
                name: 'Котлета',
                type: 'main',
                proteins: 15,
                fat: 10,
                carbohydrates: 5,
                calories: 150,
                price: 50,
                image: 'https://example.com/meat.png',
                image_mobile: 'https://example.com/meat-mobile.png',
                image_large: 'https://example.com/meat-large.png',
                __v: 0,
            },
        ] as unknown as TIngredient[];
        const action = {
          type: getIngredients.fulfilled.type,
          payload: fakeIngredients,
        };
        const prevState = { ...initialState, isLoading: true };
        const nextState = ingredientReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.ingredientList).toEqual(fakeIngredients);
      });
    });
  });
  