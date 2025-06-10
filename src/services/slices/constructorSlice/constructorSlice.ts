import { orderBurgerApi } from '../../../utils/burger-api';
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export type TConsturctorState = {
  isLoading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isOrderInProgress: boolean;
  currentOrder: TOrder | null;
  errorMessage: string | null;
};

export const initialState: TConsturctorState = {
  isLoading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  isOrderInProgress: false,
  currentOrder: null,
  errorMessage: null
};

export const orderBurger = createAsyncThunk(
  'user/order',
  async (ingredientsIds: string[]) => {
    const response = await orderBurgerApi(ingredientsIds);
    return response;
  }
);

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: nanoid()
          }
        };
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item: TConstructorIngredient) => item.id !== action.payload
        );
    },
    moveIngredientUp(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index > 0 && index < state.constructorItems.ingredients.length) {
        const ingredients = state.constructorItems.ingredients;
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      }
    },
    moveIngredientDown(state, action: PayloadAction<number>) {
      const index = action.payload;
      const ingredients = state.constructorItems.ingredients;
      if (index >= 0 && index < ingredients.length - 1) {
        [ingredients[index], ingredients[index + 1]] = [
          ingredients[index + 1],
          ingredients[index]
        ];
      }
    },
    setRequest(state, action: PayloadAction<boolean>) {
      state.isOrderInProgress = action.payload;
    },
    resetModal(state) {
      state.currentOrder = null;
    }
  },
  selectors: {
    getConstructorState: (state) => state
  },
  extraReducers(builder) {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.isLoading = true;
        state.isOrderInProgress = true;
        state.errorMessage = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.isOrderInProgress = false;
        state.errorMessage = action.error.message || 'Error placing order';
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isOrderInProgress = false;
        state.errorMessage = null;
        state.currentOrder = action.payload.order;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setRequest,
  resetModal
} = constructorSlice.actions;

export const getConstructorState = (state: { builder: TConsturctorState }) =>
  state.builder;

export default constructorSlice.reducer;
