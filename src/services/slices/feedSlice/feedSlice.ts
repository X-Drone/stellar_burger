import { getFeedsApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TFeedState = {
  orderList: TOrder[];
  totalOrders: number;
  todayOrderCount: number;
  isLoading: boolean;
  errorMessage: string | null;
};

export const initialState: TFeedState = {
  orderList: [],
  totalOrders: 0,
  todayOrderCount: 0,
  isLoading: false,
  errorMessage: null
};

export const getFeeds = createAsyncThunk('feeds/all', getFeedsApi);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message as string;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.orderList = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.todayOrderCount = action.payload.totalToday;
      });
  }
});

export const { getFeedState } = feedSlice.selectors;
export default feedSlice.reducer;
