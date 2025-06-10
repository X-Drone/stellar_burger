import { getOrderByNumberApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderState = {
  orderList: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  orderResponse: null;
  errorMessage: string | null;
};

export const initialState: TOrderState = {
  orderList: [],
  currentOrder: null,
  isLoading: false,
  orderResponse: null,
  errorMessage: null
};

export const getOrderByNumber = createAsyncThunk(
  'order/byNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getOrderState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.errorMessage = null;
        state.isLoading = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.errorMessage = action.error.message as string;
        state.isLoading = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.errorMessage = null;
        state.isLoading = false;
        state.currentOrder = action.payload.orders[0];
      });
  }
});

export const { getOrderState } = orderSlice.selectors;
export default orderSlice.reducer;
