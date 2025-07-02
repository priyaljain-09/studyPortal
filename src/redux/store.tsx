import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./slice/application";


export const store = configureStore({
  reducer: {
    applicationData: applicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;