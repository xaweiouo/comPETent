import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  // 建議：Supabase 的 User 物件有時包含非序列化資料，可關閉檢查以避免警告
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});