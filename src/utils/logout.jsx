import { supabase } from "./supabaseClient";
import { clearUser } from "../store/slices/authSlice";
// import { useDispatch, useSelector } from "react-redux";

// const { user, isAuthenticated } = useSelector((state) => state.auth);
// const dispatch = useDispatch();

export const handleLogout = async (dispatch) => {
  await supabase.auth.signOut();
  dispatch(clearUser()); // 清除 Redux 狀態
};