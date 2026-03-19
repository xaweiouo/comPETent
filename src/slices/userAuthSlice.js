import { createSlice } from "@reduxjs/toolkit";

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState: {
    user: null,
    role: null,
    isLoading: true
  },
  reducers: {
    authListener: (state, action) => {
      state.user = action.payload;
      state.isLoading = false
    },
    setRole: (state, action) => {
      state.role = action.payload[0].role;
    },
    setLogout: (state) => {
      state.user = null,
      state.role = null
    }

  }
})

export const { authListener, setRole, setLogout } = userAuthSlice.actions;
export default userAuthSlice.reducer;