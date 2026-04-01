// import viteLogo from '/vite.svg'
// import { useState } from 'react'
import { supabase } from "./lib/supabaseClient";

import { RouterProvider } from "react-router";
import { router } from "./router";
import { useDispatch } from "react-redux";
// import { store } from "./store/store";
import { useEffect } from "react";
import { setLogout, fetchUserPermissions } from "./slices/authSlice";
import MessageToast from "./components/MessageToast";
// import ScrollToTop from "./components/ScrollToTop";


function App() {
  const dispatch = useDispatch();

  //   同步 Supabase 與 Redux
  // 這是最重要的一步！當使用者重新整理頁面時，Redux 會重置，我們必須監聽 Supabase 的 Auth 狀態來還原資料。
  useEffect(() => {
    // 1. 初始化檢查：檢查本地 Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) dispatch(fetchUserPermissions(session.user));
    });

    // 2. 監聽狀態變動：如登入、登出、密碼更改
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        
        dispatch(fetchUserPermissions(session.user));
        
      } else {
        dispatch(setLogout());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <>
      {/* <ScrollToTop /> */}
      <MessageToast />
      <RouterProvider router={router} />
    </>

  )
}

export default App
