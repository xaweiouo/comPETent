import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { setRole } from "./userAuthSlice";
import { createAsyncMessage } from "./messageSlice";
import { supabase } from "../lib/supabaseClient";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    id: null,
    user: null,
    role:null,
    isAuthenticated: false,
    isAuthLoading: true, // 預設為 true，代表正在確認身分
  },
  reducers: {
    setUserId:(state,action)=>{
      state.id=action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      // !!「雙重否定 (Double Negation)」。將任何資料類型「強制轉換」為布林值
      // action.payload 可能有兩種情況：
      // 登入成功時：payload 是一個包含使用者資訊的 Object。
      // 登出或未登入時：payload 是 null。
      // 為了讓 isAuthenticated 保持乾淨的 true 或 false，而不是存入整個物件

      state.isAuthLoading = false; // 收到資料了，結束讀取狀態
    },
    setRole: (state, action) => {
      state.role = action.payload[0].role;
    },
    updateUserInfo: (state, action) => {
     
        // 將新的資料（如 nickname, name）合併進原本的 user 物件
        state.user = { ...state.user, ...action.payload };
      
    },
    setLogout: (state) => {
      state.id = null;
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isAuthLoading = false; // 確定沒登入，也結束讀取狀態
    },
  },
});

// 建立非同步 Thunk
export const fetchUserPermissions = createAsyncThunk(
  "auth/fetchUserPermissions",
  async (payload, { dispatch }) => {
    try {
      // 1. 用 Email 抓取 ID
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", payload.email)
        .single();

      if (userError || !userData) throw new Error("找不到使用者資料");

      // 2. 用 ID 抓取 Roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.id);

      if (rolesError) throw rolesError;


      dispatch(setUserId(userData.id))
      dispatch(setUser(payload))
      dispatch(setRole(rolesData))

    } catch (error) {
      // return rejectWithValue(error.message);
      dispatch(createAsyncMessage(error))
    }
  }
);

export const { setUserId,setUser, setLogout,setRole,updateUserInfo } = authSlice.actions;
export default authSlice.reducer;