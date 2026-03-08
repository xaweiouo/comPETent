import { createSlice } from '@reduxjs/toolkit';

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    isAdminAuthenticated: false,
    adminUser: null,
  },
  reducers: {
    setAdminLogin: (state, action) => {
      state.isAdminAuthenticated = true;
      state.adminUser = action.payload; // 存放管理員資訊
    },
    setAdminLogout: (state) => {
      state.isAdminAuthenticated = false;
      state.adminUser = null;
    },
  },
});

export const { setAdminLogin, setAdminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;