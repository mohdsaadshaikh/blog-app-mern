import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { Authentication } from "../slices/authentication.js";
import { apis } from "../apis/baseApi.js";

export const store = configureStore({
  reducer: {
    [Authentication.name]: Authentication.reducer,
    [apis.reducerPath]: apis.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(apis.middleware),
});
setupListeners(store.dispatch);
