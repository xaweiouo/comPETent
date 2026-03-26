import { supabase } from "../lib/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router";
// import { setAdminLogout } from "../slices/adminAuthSlice";
// import { useEffect } from "react";
import { setLogout } from "../slices/authSlice";

function AdminLayout() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/admin/adminlogin');
  //   }
  // }, [isAuthenticated, navigate]);

  // 處理登出
  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(setLogout());
    navigate('/admin/adminlogin', { replace: true });
  };

  // 如果未登入，導向後台登入頁
  if (!isAuthenticated) {
    navigate('/admin/adminlogin');
  }

  return (
    <>
      <div className="min-vh-100 bg-light">
        {/* 後台專屬 Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <span className="navbar-brand">comPETent | 我能寵 - 後台</span>
            <div className="d-flex">
              <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                登出
              </button>
            </div>
          </div>
        </nav>

        {/* 後台各頁面內容會渲染在這裡 */}
        <div className="container mt-4">
          <Outlet />
        </div>
      </div>
    </>
  )
};
export default AdminLayout;