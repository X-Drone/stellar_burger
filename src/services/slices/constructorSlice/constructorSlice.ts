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
  burgerComponents: {
    selectedBun: TConstructorIngredient | null;
    selectedIngredients: TConstructorIngredient[];
  };
  isOrderInProgress: boolean;
  currentOrder: TOrder | null;
  errorMessage: string | null;
};

export const initialState: TConsturctorState = {
  isLoading: false,
  burgerComponents: {
    selectedBun: null,
    selectedIngredients: []
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
          state.burgerComponents.selectedBun = action.payload;
        } else {
          state.burgerComponents.selectedIngredients.push(action.payload);
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
      state.burgerComponents.selectedIngredients =
        state.burgerComponents.selectedIngredients.filter(
          (item: TConstructorIngredient) => item.id !== action.payload
        );
    },
    moveIngredientUp(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index > 0 && index < state.burgerComponents.selectedIngredients.length) {
        const ingredients = state.burgerComponents.selectedIngredients;
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      }
    },
    moveIngredientDown(state, action: PayloadAction<number>) {
      const index = action.payload;
      const ingredients = state.burgerComponents.selectedIngredients;
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
        state.burgerComponents = {
          selectedBun: null,
          selectedIngredients: []
        };
      });
  },
  selectors: {
    getConstructorState(state) {
      return state;
    }
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

export const { getConstructorState } = constructorSlice.selectors;

export default constructorSlice.reducer;
