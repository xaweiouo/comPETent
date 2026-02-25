import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      // !!「雙重否定 (Double Negation)」。將任何資料類型「強制轉換」為布林值
      // action.payload 可能有兩種情況：
      // 登入成功時：payload 是一個包含使用者資訊的 Object。
      // 登出或未登入時：payload 是 null。
      // 為了讓 isAuthenticated 保持乾淨的 true 或 false，而不是存入整個物件
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;