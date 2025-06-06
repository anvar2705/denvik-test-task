import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import graphReducer from "./slices/graphSlice";
import { listenerMiddleware } from "./ls-middleware/listenerMiddleware";
import { loadState } from "./ls-middleware/lsStorage";

const rootReducer = combineReducers({
  graph: graphReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(listenerMiddleware.middleware),
  preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
