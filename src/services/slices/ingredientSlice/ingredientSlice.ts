import { getIngredientsApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TIngredientState = {
  ingredientList: TIngredient[];
  isLoading: boolean;
  errorMessage: string | null;
};

export const initialState: TIngredientState = {
  ingredientList: [],
  isLoading: false,
  errorMessage: null
};

export const getIngredients = createAsyncThunk('ingredient/get', async () => {
  const response = await getIngredientsApi();
  return response;
});

const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  selectors: {
    getIngredientState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || 'Error fetching ingredients';
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.ingredientList = action.payload;
      });
  }
});

export const { getIngredientState } = ingredientSlice.selectors;
export default ingredientSlice.reducer;
