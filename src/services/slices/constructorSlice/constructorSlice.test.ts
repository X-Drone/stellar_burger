import constructorReducer, {
    initialState,
    addIngredient,
    removeIngredient,
    moveIngredientUp,
    moveIngredientDown,
    setRequest,
    resetModal,
    orderBurger,
  } from './constructorSlice';
  import type {
    TConstructorIngredient,
    TIngredient,
    TOrder,
  } from '@utils-types';
  
  jest.mock('@reduxjs/toolkit', () => {
    const original = jest.requireActual('@reduxjs/toolkit');
    return {
      ...original,
      nanoid: () => 'test-id',
    };
  });
  
  describe('constructorSlice reducer', () => {
    it('should return the initial state on first run', () => {
      const nextState = constructorReducer(undefined, { type: '' });
      expect(nextState).toEqual(initialState);
    });
  
    describe('synchronous reducers', () => {
      it('handles addIngredient for bun', () => {
        const fakeIngredient: TIngredient = {
          _id: 'ing-1',
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
        } as TIngredient;
  
        const action = addIngredient(fakeIngredient);
        const nextState = constructorReducer(initialState, action);
  
        expect(nextState.constructorItems.bun).toEqual({
          ...fakeIngredient,
          id: 'test-id',
        } as TConstructorIngredient);
        expect(nextState.constructorItems.ingredients).toHaveLength(0);
      });
  
      it('handles addIngredient for non-bun ingredient', () => {
        const fakeIngredient: TIngredient = {
          _id: 'ing-2',
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
        } as TIngredient;
  
        const action = addIngredient(fakeIngredient);
        const nextState = constructorReducer(initialState, action);
  
        expect(nextState.constructorItems.bun).toBeNull();
        expect(nextState.constructorItems.ingredients).toHaveLength(1);
        expect(nextState.constructorItems.ingredients[0]).toEqual({
          ...fakeIngredient,
          id: 'test-id',
        } as TConstructorIngredient);
      });
  
      it('handles removeIngredient', () => {
        const existingState = {
          ...initialState,
          constructorItems: {
            bun: null,
            ingredients: [
              { id: 'id-1', _id: 'ing-1', name: 'a', type: 'main' } as TConstructorIngredient,
              { id: 'id-2', _id: 'ing-2', name: 'b', type: 'main' } as TConstructorIngredient,
            ],
          },
        };
        const action = removeIngredient('id-1');
        const nextState = constructorReducer(existingState, action);
        expect(nextState.constructorItems.ingredients).toHaveLength(1);
        expect(nextState.constructorItems.ingredients[0].id).toBe('id-2');
      });
  
      it('handles moveIngredientUp', () => {
        const existingState = {
          ...initialState,
          constructorItems: {
            bun: null,
            ingredients: [
              { id: 'id-1', _id: 'ing-1', name: 'a', type: 'main' } as TConstructorIngredient,
              { id: 'id-2', _id: 'ing-2', name: 'b', type: 'main' } as TConstructorIngredient,
              { id: 'id-3', _id: 'ing-3', name: 'c', type: 'main' } as TConstructorIngredient,
            ],
          },
        };
        const action = moveIngredientUp(2);
        const nextState = constructorReducer(existingState, action);
  
        expect(nextState.constructorItems.ingredients.map(i => i.id)).toEqual([
          'id-1',
          'id-3',
          'id-2',
        ]);
      });
  
      it('ignores moveIngredientUp if index out of range', () => {
        const existingState = {
          ...initialState,
          constructorItems: {
            bun: null,
            ingredients: [
              { id: 'id-1', _id: 'ing-1', name: 'a', type: 'main' } as TConstructorIngredient,
            ],
          },
        };
        const action = moveIngredientUp(0);
        const nextState = constructorReducer(existingState, action);
        expect(nextState).toEqual(existingState);
      });
  
      it('handles moveIngredientDown', () => {
        const existingState = {
          ...initialState,
          constructorItems: {
            bun: null,
            ingredients: [
              { id: 'id-1', _id: 'ing-1', name: 'a', type: 'main' } as TConstructorIngredient,
              { id: 'id-2', _id: 'ing-2', name: 'b', type: 'main' } as TConstructorIngredient,
            ],
          },
        };
        const action = moveIngredientDown(0);
        const nextState = constructorReducer(existingState, action);
  
        expect(nextState.constructorItems.ingredients.map(i => i.id)).toEqual([
          'id-2',
          'id-1',
        ]);
      });
  
      it('ignores moveIngredientDown if index out of range', () => {
        const existingState = {
          ...initialState,
          constructorItems: {
            bun: null,
            ingredients: [
              { id: 'id-1', _id: 'ing-1', name: 'a', type: 'main' } as TConstructorIngredient,
            ],
          },
        };
        const action = moveIngredientDown(0);
        const nextState = constructorReducer(existingState, action);
        expect(nextState).toEqual(existingState);
      });
  
      it('handles setRequest', () => {
        const action = setRequest(true);
        const nextState = constructorReducer(initialState, action);
        expect(nextState.isOrderInProgress).toBe(true);
  
        const actionFalse = setRequest(false);
        const finalState = constructorReducer(nextState, actionFalse);
        expect(finalState.isOrderInProgress).toBe(false);
      });
  
      it('handles resetModal', () => {
        const existingState = {
          ...initialState,
          currentOrder: { number: 99, status: 'done' } as TOrder,
        };
        const action = resetModal();
        const nextState = constructorReducer(existingState, action);
        expect(nextState.currentOrder).toBeNull();
      });
    });
  
    describe('orderBurger thunks', () => {
      it('handles orderBurger.pending', () => {
        const action = { type: orderBurger.pending.type };
        const nextState = constructorReducer(initialState, action);
        expect(nextState.isLoading).toBe(true);
        expect(nextState.isOrderInProgress).toBe(true);
        expect(nextState.errorMessage).toBeNull();
      });
  
      it('handles orderBurger.rejected', () => {
        const errorMessage = 'Ошибка при заказе';
        const action = {
          type: orderBurger.rejected.type,
          error: { message: errorMessage },
        };
        const prevState = {
          ...initialState,
          isLoading: true,
          isOrderInProgress: true,
        };
        const nextState = constructorReducer(prevState, action);
        expect(nextState.isLoading).toBe(false);
        expect(nextState.isOrderInProgress).toBe(false);
        expect(nextState.errorMessage).toBe(errorMessage);
      });
  
      it('handles orderBurger.fulfilled', () => {
        const fakeOrder: TOrder = { number: 123, status: 'created' } as TOrder;
        const payload = { order: fakeOrder };
        const action = {
          type: orderBurger.fulfilled.type,
          payload,
        };
        const prevState: typeof initialState = {
          ...initialState,
          isLoading: true,
          isOrderInProgress: true,
          constructorItems: {
            bun: { id: 'bun-id', _id: 'bun-1', name: 'Булочка', type: 'bun' } as TConstructorIngredient,
            ingredients: [
              { id: 'ing-id', _id: 'ing-1', name: 'Котлета', type: 'main' } as TConstructorIngredient,
            ],
          },
          currentOrder: null,
        };
        const nextState = constructorReducer(prevState, action);
  
        expect(nextState.isLoading).toBe(false);
        expect(nextState.isOrderInProgress).toBe(false);
        expect(nextState.errorMessage).toBeNull();
        expect(nextState.currentOrder).toEqual(fakeOrder);
        expect(nextState.constructorItems).toEqual({
          bun: null,
          ingredients: [],
        });
      });
    });
  });
  