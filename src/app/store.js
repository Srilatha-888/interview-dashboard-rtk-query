import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import questionsReducer from '../features/questions/questionsSlice';
import { questionsApi } from '../features/questions/questionsApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    [questionsApi.reducerPath]: questionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(questionsApi.middleware),
});

setupListeners(store.dispatch);
