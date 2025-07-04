import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./slice/application";
import dashboardReducer from "./slice/dashboard"

export const store = configureStore({
  reducer: {
    applicationData: applicationReducer,
    dashboardData: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;