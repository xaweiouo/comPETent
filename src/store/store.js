import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../slices/authSlice';
import adminAuthReducer from '../slices/adminAuthSlice';
import messageReducer from '../slices/messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth:adminAuthReducer,
    message:messageReducer
  },
  // 建議：Supabase 的 User 物件有時包含非序列化資料，可關閉檢查以避免警告
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});