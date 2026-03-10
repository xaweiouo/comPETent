// import viteLogo from '/vite.svg'
// import { useState } from 'react'
import { supabase } from "./lib/supabaseClient";


import { RouterProvider } from "react-router";
import { router } from "./router";
import { useDispatch } from "react-redux";
// import { store } from "./store/store";
import { useEffect } from "react";
import { clearUser, setUser } from "./slices/authSlice";


function App() {
  const dispatch = useDispatch();

  //   同步 Supabase 與 Redux
  // 這是最重要的一步！當使用者重新整理頁面時，Redux 會重置，我們必須監聽 Supabase 的 Auth 狀態來還原資料。
  useEffect(() => {
    // 1. 初始化檢查：檢查本地 Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) dispatch(setUser(session.user));
    });

    // 2. 監聽狀態變動：如登入、登出、密碼更改
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setUser(session.user));
      } else {
        dispatch(clearUser());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (

    <RouterProvider router={router} />

  )
}

export default App
