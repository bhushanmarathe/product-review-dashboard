import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../app/features/products/productSlice";
import analyticsReducer from "../app/features/analytics/analyticsSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    analytics: analyticsReducer,
  },
});
