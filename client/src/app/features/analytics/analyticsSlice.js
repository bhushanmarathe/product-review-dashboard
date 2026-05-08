import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const [cat, top, discount, avg] = await Promise.all([
        api.get("/analytics/products-per-category"),
        api.get("/analytics/top-reviewed-products"),
        api.get("/analytics/discount-distribution"),
        api.get("/analytics/category-average-rating"),
      ]);

      return {
        productsPerCategory: cat.data,
        topReviewedProducts: top.data,
        discountDistribution: discount.data,
        categoryAvgRating: avg.data,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch analytics",
      );
    }
  },
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    productsPerCategory: [],
    topReviewedProducts: [],
    discountDistribution: [],
    categoryAvgRating: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch analytics";
      });
  },
});

export default analyticsSlice.reducer;
