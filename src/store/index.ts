import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/store/services/baseApi";
import "@/store/services/assignments/assignmentsApi";
import "@/store/services/submissions/submissionsApi";
import "@/store/services/insights/insightsApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

