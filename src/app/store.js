import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import questionsReducer from '../features/questions/questionsSlice';
import { questionsApi } from '../features/questions/questionsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    [questionsApi.reducerPath]: questionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(questionsApi.middleware),
});